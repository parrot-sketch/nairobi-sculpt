import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../audit/audit-log.service';
import { UpdateDoctorDto } from '../common/dtos';
import { AppointmentStatus } from '@prisma/client';

@Injectable()
export class DoctorService {
  constructor(
    private prisma: PrismaService,
    private auditLog: AuditLogService,
  ) {}

  async getProfile(userId: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { userId },
      include: {
        user: {
          select: { id: true, email: true, name: true, role: true },
        },
      },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    return doctor;
  }

  async updateProfile(userId: string, updateDto: UpdateDoctorDto) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { userId },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    // Update UserProfile with clinical details
    const updated = await this.prisma.doctor.update({
      where: { userId },
      data: {
        user: {
          update: {
            userProfile: {
              update: {
                licenseNumber: updateDto.licenseNumber,
                specialization: updateDto.specialization,
                bio: updateDto.bio,
              },
            },
          },
        },
      },
      include: {
        user: {
          select: { id: true, email: true, name: true, role: true },
        },
      },
    });

    await this.auditLog.logAction(
      userId,
      'UPDATE_PROFILE',
      'Doctor',
      doctor.id,
      'Doctor profile updated',
    );

    return updated;
  }

  async getAppointments(doctorId: string, status?: string) {
    // Validate status if provided
    const validStatuses = Object.values(AppointmentStatus);
    if (status && !validStatuses.includes(status as AppointmentStatus)) {
      throw new BadRequestException(`Invalid appointment status: ${status}`);
    }

    return await this.prisma.appointment.findMany({
      where: {
        doctorId,
        ...(status && { status: status as AppointmentStatus }),
      },
      include: { patient: { include: { user: true } } },
      orderBy: { scheduledTime: { sort: 'asc', nulls: 'last' } },
    });
  }

  async getVisits(doctorId: string) {
    return await this.prisma.visit.findMany({
      where: { doctorId },
      include: {
        patient: { include: { user: true } },
        procedures: true,
        medicalRecords: true,
      },
      orderBy: { visitDate: 'desc' },
    });
  }

  async getProcedures(doctorId: string) {
    return await this.prisma.procedure.findMany({
      where: { doctorId },
      include: { patient: { include: { user: true } }, visit: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getSchedule(doctorId: string) {
    return await this.prisma.doctorSchedule.findMany({
      where: { doctorId },
      orderBy: { dayOfWeek: 'asc' },
    });
  }

  async softDelete(userId: string, adminId: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { userId },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const updated = await this.prisma.doctor.update({
      where: { userId },
      data: { deletedAt: new Date() },
    });

    await this.auditLog.logAction(
      adminId,
      'DELETE_DOCTOR',
      'Doctor',
      doctor.id,
      'Admin soft-deleted doctor profile',
    );

    return updated;
  }
}
