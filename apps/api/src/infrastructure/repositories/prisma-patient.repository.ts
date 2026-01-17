/**
 * Prisma-based Patient Repository Implementation
 * Adapts Prisma models to domain Patient entity
 * 
 * Note: Patient data is stored in User.name and UserProfile
 * This repository bridges domain entity to Prisma models
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Patient, PatientId, UserId } from '../../domain';
import { PatientRepository } from '../../domain/ports';

@Injectable()
export class PrismaPatientRepository implements PatientRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: PatientId): Promise<Patient | null> {
    const prismaPatient = await this.prisma.patient.findUnique({
      where: { id },
      include: { user: { include: { userProfile: true } } },
    });

    if (!prismaPatient || !prismaPatient.user) return null;

    return this.toDomainEntity(prismaPatient);
  }

  async findByUserId(userId: UserId): Promise<Patient | null> {
    const prismaPatient = await this.prisma.patient.findFirst({
      where: { userId },
      include: { user: { include: { userProfile: true } } },
    });

    if (!prismaPatient || !prismaPatient.user) return null;

    return this.toDomainEntity(prismaPatient);
  }

  async save(patient: Patient): Promise<Patient> {
    // Update User with patient name
    await this.prisma.user.update({
      where: { id: patient.userId },
      data: {
        name: patient.getFullName(),
        updatedAt: new Date(),
      },
    });

    // Update or create patient record
    const prismaPatient = await this.prisma.patient.upsert({
      where: { id: patient.id },
      update: {
        updatedAt: patient.updatedAt,
        deletedAt: patient.deletedAt,
      },
      create: {
        id: patient.id,
        userId: patient.userId,
        createdAt: patient.createdAt,
        updatedAt: patient.updatedAt,
      },
      include: { user: { include: { userProfile: true } } },
    });

    return this.toDomainEntity(prismaPatient);
  }

  async delete(id: PatientId): Promise<void> {
    await this.prisma.patient.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async findAll(limit = 10, offset = 0): Promise<Patient[]> {
    const prismaPatients = await this.prisma.patient.findMany({
      take: limit,
      skip: offset,
      where: { deletedAt: null },
      include: { user: { include: { userProfile: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return prismaPatients.map((p) => this.toDomainEntity(p));
  }

  private toDomainEntity(prismaPatient: any): Patient {
    const [firstName = '', lastName = ''] = (prismaPatient.user.name || '').split(' ');
    const profile = prismaPatient.user.userProfile;

    return new Patient(
      PatientId.create(prismaPatient.id),
      UserId.create(prismaPatient.userId),
      firstName,
      lastName,
      profile?.dateOfBirth || new Date(),
      prismaPatient.user.email,
      profile?.emergencyContactPhone || '',
      '', // address not in schema
      '', // city not in schema
      '', // state not in schema
      '', // zipCode not in schema
      prismaPatient.createdAt,
      prismaPatient.updatedAt,
      prismaPatient.deletedAt,
    );
  }
}
