import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../audit/audit-log.service';
import {
  CreateAppointmentDto,
  UpdateAppointmentStatusDto,
  AppointmentStatus,
  ScheduleAppointmentDto,
} from '../common/dtos';

@Injectable()
export class AppointmentService {
  constructor(
    private prisma: PrismaService,
    private auditLog: AuditLogService,
  ) {}

  async create(userId: string, createDto: CreateAppointmentDto) {
    // Verify patient exists
    const patient = await this.prisma.patient.findUnique({
      where: { userId },
      include: { user: { select: { name: true } } },
    });

    if (!patient) {
      throw new BadRequestException('Only patients can create appointments');
    }

    // Verify doctor exists
    const doctor = await this.prisma.doctor.findUnique({
      where: { id: createDto.doctorId },
      include: { user: { select: { name: true } } },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const appointment = await this.prisma.appointment.create({
      data: {
        patientId: patient.id,
        doctorId: createDto.doctorId,
        status: AppointmentStatus.REQUESTED,
        reason: createDto.reason,
        notes: createDto.notes,
      },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
      },
    });

    await this.auditLog.logAction(
      userId,
      'CREATE_APPOINTMENT',
      'Appointment',
      appointment.id,
      `Patient ${patient.user.name} requested appointment with Dr. ${doctor.user.name}`,
    );

    return appointment;
  }

  async getAppointment(appointmentId: string, userId: string, role: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
        visit: true,
      },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    // Access control: patient can see own, doctor can see own, admin can see all
    if (role === 'PATIENT' && appointment.patientId !== userId) {
      throw new ForbiddenException(
        'Cannot access other patients appointments',
      );
    }
    if (role === 'DOCTOR' && appointment.doctorId !== userId) {
      throw new ForbiddenException(
        'Cannot access appointments for other doctors',
      );
    }

    return appointment;
  }

  async scheduleAppointment(
    appointmentId: string,
    userId: string,
    scheduleDto: ScheduleAppointmentDto,
  ) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.status !== AppointmentStatus.REQUESTED) {
      throw new BadRequestException(
        'Only REQUESTED appointments can be scheduled',
      );
    }

    const updated = await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: AppointmentStatus.SCHEDULED,
        scheduledTime: scheduleDto.scheduledTime,
        notes: scheduleDto.notes || appointment.notes,
      },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
      },
    });

    await this.auditLog.logAction(
      userId,
      'SCHEDULE_APPOINTMENT',
      'Appointment',
      appointmentId,
      `Appointment scheduled for ${scheduleDto.scheduledTime.toISOString()}`,
    );

    return updated;
  }

  async updateStatus(
    appointmentId: string,
    userId: string,
    updateDto: UpdateAppointmentStatusDto,
  ) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    // Validate status transitions
    this.validateStatusTransition(appointment.status, updateDto.status);

    const updated = await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: updateDto.status,
        notes: updateDto.notes || appointment.notes,
      },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
      },
    });

    await this.auditLog.logAction(
      userId,
      'UPDATE_APPOINTMENT_STATUS',
      'Appointment',
      appointmentId,
      `Status changed from ${appointment.status} to ${updateDto.status}`,
    );

    return updated;
  }

  async getAppointmentsByPatient(patientId: string) {
    return await this.prisma.appointment.findMany({
      where: { patientId },
      include: { doctor: { include: { user: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAppointmentsByDoctor(doctorId: string, status?: AppointmentStatus) {
    return await this.prisma.appointment.findMany({
      where: {
        doctorId,
        ...(status && { status }),
      },
      include: { patient: { include: { user: true } } },
      orderBy: { scheduledTime: { sort: 'asc', nulls: 'last' } },
    });
  }

  async cancel(appointmentId: string, userId: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.status === AppointmentStatus.CANCELLED) {
      throw new BadRequestException('Appointment is already cancelled');
    }

    const updated = await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: AppointmentStatus.CANCELLED,
      },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
      },
    });

    await this.auditLog.logAction(
      userId,
      'CANCEL_APPOINTMENT',
      'Appointment',
      appointmentId,
      'Appointment cancelled',
    );

    return updated;
  }

  private validateStatusTransition(
    currentStatus: string,
    newStatus: AppointmentStatus,
  ) {
    const validTransitions: Record<string, AppointmentStatus[]> = {
      [AppointmentStatus.REQUESTED]: [
        AppointmentStatus.SCHEDULED,
        AppointmentStatus.CANCELLED,
      ],
      [AppointmentStatus.SCHEDULED]: [
        AppointmentStatus.CONFIRMED,
        AppointmentStatus.CANCELLED,
        AppointmentStatus.NO_SHOW,
      ],
      [AppointmentStatus.CONFIRMED]: [
        AppointmentStatus.COMPLETED,
        AppointmentStatus.CANCELLED,
        AppointmentStatus.NO_SHOW,
      ],
      [AppointmentStatus.CANCELLED]: [],
      [AppointmentStatus.NO_SHOW]: [],
      [AppointmentStatus.COMPLETED]: [],
    };

    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      throw new BadRequestException(
        `Cannot transition from ${currentStatus} to ${newStatus}`,
      );
    }
  }
}
