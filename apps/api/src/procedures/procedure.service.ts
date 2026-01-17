import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../audit/audit-log.service';
import {
  CreateProcedureDto,
  UpdateProcedureDto,
  ProcedureStatus,
} from '../common/dtos';

@Injectable()
export class ProcedureService {
  constructor(
    private prisma: PrismaService,
    private auditLog: AuditLogService,
  ) {}

  async create(userId: string, createDto: CreateProcedureDto) {
    // Get doctor entity
    const doctor = await this.prisma.doctor.findUnique({
      where: { userId },
    });

    if (!doctor) {
      throw new BadRequestException('Only doctors can create procedures');
    }

    // Verify visit exists
    const visit = await this.prisma.visit.findUnique({
      where: { id: createDto.visitId },
      include: { patient: true },
    });

    if (!visit) {
      throw new NotFoundException('Visit not found');
    }

    const procedure = await this.prisma.procedure.create({
      data: {
        patientId: visit.patientId,
        doctorId: doctor.id,
        visitId: createDto.visitId,
        name: createDto.name,
        description: createDto.description,
        code: createDto.code,
        status: ProcedureStatus.PLANNED,
        notes: createDto.notes,
      },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
        visit: true,
      },
    });

    await this.auditLog.logAction(
      userId,
      'CREATE_PROCEDURE',
      'Procedure',
      procedure.id,
      `Procedure ${createDto.name} created for patient ${visit.patientId}`,
    );

    return procedure;
  }

  async getProcedure(procedureId: string, userId: string, role: string) {
    const procedure = await this.prisma.procedure.findUnique({
      where: { id: procedureId },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
        visit: true,
      },
    });

    if (!procedure) {
      throw new NotFoundException('Procedure not found');
    }

    // Access control: patient can see own procedures, doctor can see their own, admin can see all
    if (role === 'PATIENT' && procedure.patientId !== userId) {
      throw new ForbiddenException('Cannot access other patients procedures');
    }
    if (role === 'DOCTOR' && procedure.doctorId !== userId) {
      throw new ForbiddenException('Cannot access other doctors procedures');
    }

    return procedure;
  }

  async update(
    procedureId: string,
    userId: string,
    updateDto: UpdateProcedureDto,
  ) {
    const procedure = await this.prisma.procedure.findUnique({
      where: { id: procedureId },
    });

    if (!procedure) {
      throw new NotFoundException('Procedure not found');
    }

    const updated = await this.prisma.procedure.update({
      where: { id: procedureId },
      data: {
        name: updateDto.name || procedure.name,
        description: updateDto.description || procedure.description,
        code: updateDto.code || procedure.code,
        status: updateDto.status || procedure.status,
        notes: updateDto.notes || procedure.notes,
      },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
        visit: true,
      },
    });

    await this.auditLog.logAction(
      userId,
      'UPDATE_PROCEDURE',
      'Procedure',
      procedureId,
      `Procedure updated`,
    );

    return updated;
  }

  async getProceduresByPatient(patientId: string) {
    return await this.prisma.procedure.findMany({
      where: { patientId },
      include: { doctor: { include: { user: true } }, visit: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getProceduresByDoctor(doctorId: string) {
    return await this.prisma.procedure.findMany({
      where: { doctorId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async delete(procedureId: string, userId: string) {
    const procedure = await this.prisma.procedure.findUnique({
      where: { id: procedureId },
    });

    if (!procedure) {
      throw new NotFoundException('Procedure not found');
    }

    await this.prisma.procedure.delete({
      where: { id: procedureId },
    });

    await this.auditLog.logAction(
      userId,
      'DELETE_PROCEDURE',
      'Procedure',
      procedureId,
      `Procedure deleted`,
    );

    return { message: 'Procedure deleted successfully' };
  }
}
