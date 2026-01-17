/**
 * Prisma-based Visit Repository Implementation
 * Adapts Prisma models to domain Visit aggregate root
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Visit, VisitId, PatientId, DoctorId } from '../../domain';
import { VisitRepository } from '../../domain/ports';
import { VisitStatus } from '@prisma/client';

@Injectable()
export class PrismaVisitRepository implements VisitRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: VisitId): Promise<Visit | null> {
    const prismaVisit = await this.prisma.visit.findUnique({
      where: { id },
      include: {
        procedures: true,
        medicalRecords: true,
      },
    });

    if (!prismaVisit) return null;

    return this.toDomainEntity(prismaVisit);
  }

  async findByPatientId(patientId: PatientId, limit = 10, offset = 0): Promise<Visit[]> {
    const prismaVisits = await this.prisma.visit.findMany({
      where: { patientId },
      include: {
        procedures: true,
        medicalRecords: true,
      },
      take: limit,
      skip: offset,
      orderBy: { visitDate: 'desc' },
    });

    return prismaVisits.map((v) => this.toDomainEntity(v));
  }

  async findByDoctorId(doctorId: DoctorId, limit = 10, offset = 0): Promise<Visit[]> {
    const prismaVisits = await this.prisma.visit.findMany({
      where: { doctorId },
      include: {
        procedures: true,
        medicalRecords: true,
      },
      take: limit,
      skip: offset,
      orderBy: { visitDate: 'desc' },
    });

    return prismaVisits.map((v) => this.toDomainEntity(v));
  }

  async findByStatus(status: string): Promise<Visit[]> {
    const prismaVisits = await this.prisma.visit.findMany({
      where: { status: status as VisitStatus },
      include: {
        procedures: true,
        medicalRecords: true,
      },
    });

    return prismaVisits.map((v) => this.toDomainEntity(v));
  }

  async save(visit: Visit): Promise<Visit> {
    const prismaVisit = await this.prisma.visit.upsert({
      where: { id: visit.id },
      update: {
        status: visit.status as VisitStatus,
        notes: visit.notes,
        visitDate: visit.visitDate,
        diagnosis: visit.notes, // Map notes to diagnosis
        updatedAt: visit.updatedAt,
      },
      create: {
        id: visit.id,
        patientId: visit.patientId,
        doctorId: visit.doctorId,
        appointmentId: visit.appointmentId,
        status: visit.status as VisitStatus,
        visitDate: visit.visitDate,
        notes: visit.notes,
        diagnosis: visit.notes,
        createdAt: visit.createdAt,
        updatedAt: visit.updatedAt,
      },
      include: {
        procedures: true,
        medicalRecords: true,
      },
    });

    return this.toDomainEntity(prismaVisit);
  }

  async delete(id: VisitId): Promise<void> {
    await this.prisma.visit.delete({
      where: { id },
    });
  }

  async findAll(limit = 10, offset = 0): Promise<Visit[]> {
    const prismaVisits = await this.prisma.visit.findMany({
      include: {
        procedures: true,
        medicalRecords: true,
      },
      take: limit,
      skip: offset,
      orderBy: { visitDate: 'desc' },
    });

    return prismaVisits.map((v) => this.toDomainEntity(v));
  }

  private toDomainEntity(prismaVisit: any): Visit {
    const statusMap: Record<string, string> = {
      COMPLETED: 'COMPLETED',
      INCOMPLETE: 'INCOMPLETE',
      CANCELLED: 'CANCELLED',
    };
    
    const status = statusMap[prismaVisit.status] || 'COMPLETED';
    
    return new Visit(
      VisitId.create(prismaVisit.id),
      PatientId.create(prismaVisit.patientId),
      DoctorId.create(prismaVisit.doctorId),
      prismaVisit.appointmentId || '',
      status,
      prismaVisit.visitDate,
      prismaVisit.notes || '',
      (prismaVisit.procedures || []).map((p: any) => ({
        procedureId: p.id,
        name: p.name,
        description: p.description || '',
        cost: { amount: Number(p.baseCost) || 0, currency: 'KES' },
        performedAt: p.updatedAt,
      })),
      (prismaVisit.medicalRecords || []).map((r: any) => ({
        recordId: r.id,
        recordType: r.recordType,
        description: r.title || '',
        recordedAt: r.createdAt,
      })),
      prismaVisit.createdAt,
      prismaVisit.updatedAt,
      null, // completedAt not in schema
    );
  }
}
