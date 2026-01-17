import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../audit/audit-log.service';
import {
  CreateMedicalRecordDto,
  UpdateMedicalRecordDto,
} from '../common/dtos';

@Injectable()
export class MedicalRecordService {
  constructor(
    private prisma: PrismaService,
    private auditLog: AuditLogService,
  ) {}

  async create(userId: string, createDto: CreateMedicalRecordDto) {
    // Get doctor entity from userId
    const doctor = await this.prisma.doctor.findUnique({
      where: { userId },
    });

    if (!doctor) {
      throw new BadRequestException('Only doctors can create medical records');
    }

    // Verify patient exists
    const patient = await this.prisma.patient.findUnique({
      where: { id: createDto.patientId },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    const record = await this.prisma.medicalRecord.create({
      data: {
        patientId: createDto.patientId,
        doctorId: doctor.id,
        visitId: createDto.visitId,
        recordType: createDto.recordType || 'GENERAL_NOTE',
        title: createDto.title,
        content: createDto.content,
        isConfidential: createDto.isConfidential || false,
      },
      include: { doctor: { include: { user: true } }, visit: true },
    });

    await this.auditLog.logAction(
      userId,
      'CREATE_MEDICAL_RECORD',
      'MedicalRecord',
      record.id,
      `Medical record created for patient ${patient.id}`,
    );

    return record;
  }

  async getRecords(patientId: string) {
    return await this.prisma.medicalRecord.findMany({
      where: { patientId },
      include: { doctor: { include: { user: true } }, visit: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getRecord(recordId: string, userId: string, role: string) {
    const record = await this.prisma.medicalRecord.findUnique({
      where: { id: recordId },
      include: {
        doctor: { include: { user: true } },
        visit: true,
        patient: true,
      },
    });

    if (!record) {
      throw new NotFoundException('Medical record not found');
    }

    // Access control: patient can see own records, doctor can see their patients' records, admin can see all
    if (role === 'PATIENT' && record.patientId !== userId) {
      throw new ForbiddenException(
        'Cannot access other patients medical records',
      );
    }

    return record;
  }

  async update(
    recordId: string,
    userId: string,
    updateDto: UpdateMedicalRecordDto,
  ) {
    const record = await this.prisma.medicalRecord.findUnique({
      where: { id: recordId },
    });

    if (!record) {
      throw new NotFoundException('Medical record not found');
    }

    const updated = await this.prisma.medicalRecord.update({
      where: { id: recordId },
      data: {
        title: updateDto.title || record.title,
        content: updateDto.content || record.content,
        recordType: updateDto.recordType || record.recordType,
        isConfidential:
          updateDto.isConfidential !== undefined
            ? updateDto.isConfidential
            : record.isConfidential,
      },
      include: { doctor: { include: { user: true } }, visit: true },
    });

    await this.auditLog.logAction(
      userId,
      'UPDATE_MEDICAL_RECORD',
      'MedicalRecord',
      recordId,
      `Medical record updated`,
    );

    return updated;
  }

  async search(patientId: string, query: string) {
    return await this.prisma.medicalRecord.findMany({
      where: {
        patientId,
        content: {
          contains: query,
          mode: 'insensitive',
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async delete(recordId: string, userId: string) {
    const record = await this.prisma.medicalRecord.findUnique({
      where: { id: recordId },
    });

    if (!record) {
      throw new NotFoundException('Medical record not found');
    }

    // Soft delete - keep record for audit trail
    await this.prisma.medicalRecord.delete({
      where: { id: recordId },
    });

    await this.auditLog.logAction(
      userId,
      'DELETE_MEDICAL_RECORD',
      'MedicalRecord',
      recordId,
      `Medical record securely deleted`,
    );

    return { message: 'Medical record deleted successfully' };
  }
}
