import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../audit/audit-log.service';
import { UpdatePatientDto } from '../common/dtos';

@Injectable()
export class PatientService {
  constructor(
    private prisma: PrismaService,
    private auditLog: AuditLogService,
  ) {}

  async getProfile(userId: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { userId },
      include: {
        user: {
          select: { id: true, email: true, name: true, role: true },
        },
      },
    });

    if (!patient) {
      throw new NotFoundException('Patient profile not found');
    }

    return patient;
  }

  async updateProfile(userId: string, updateDto: UpdatePatientDto) {
    const patient = await this.prisma.patient.findUnique({
      where: { userId },
    });

    if (!patient) {
      throw new NotFoundException('Patient profile not found');
    }

    // Update the UserProfile with demographic data
    await this.prisma.userProfile.update({
      where: { userId },
      data: {
        gender: updateDto.gender,
        bloodType: updateDto.bloodType,
        allergies: updateDto.allergies,
        emergencyContactName: updateDto.emergencyContactName,
        emergencyContactPhone: updateDto.emergencyContactPhone,
      },
    });

    const updated = await this.prisma.patient.findUnique({
      where: { userId },
      include: {
        user: {
          select: { id: true, email: true, name: true, role: true },
        },
      },
    });

    await this.auditLog.logAction(
      userId,
      'UPDATE_PROFILE',
      'Patient',
      patient.id,
      'Patient updated their profile',
    );

    return updated;
  }

  async getMedicalRecords(patientId: string) {
    return await this.prisma.medicalRecord.findMany({
      where: { patientId },
      include: { visit: true, doctor: { include: { user: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAppointments(patientId: string) {
    return await this.prisma.appointment.findMany({
      where: { patientId },
      include: { doctor: { include: { user: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getVisits(patientId: string) {
    return await this.prisma.visit.findMany({
      where: { patientId },
      include: {
        doctor: { include: { user: true } },
        procedures: true,
        medicalRecords: true,
      },
      orderBy: { visitDate: 'desc' },
    });
  }

  async getBillingHistory(patientId: string) {
    return await this.prisma.invoice.findMany({
      where: { patientId },
      include: { payments: true, visit: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async softDelete(userId: string, adminId: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { userId },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    const updated = await this.prisma.patient.update({
      where: { userId },
      data: { deletedAt: new Date() },
    });

    await this.auditLog.logAction(
      adminId,
      'DELETE_PATIENT',
      'Patient',
      patient.id,
      'Patient record soft-deleted',
    );

    return updated;
  }
}
