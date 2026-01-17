/**
 * Patient Application Service
 * Orchestrates patient-related operations
 * Uses repositories to persist domain objects
 */

import { Patient, PatientId, UserId, UserContext, Role } from '../../domain';
import { PatientRepository, AuthorizationService, AuditLogService } from '../../domain/ports';

export interface CreatePatientInput {
  userId: UserId;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface UpdatePatientInput {
  id: PatientId;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface PatientDTO {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  email: string;
  phoneNumber: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Application service for Patient operations
 * Depends on repositories (ports), not Prisma directly
 */
export class PatientApplicationService {
  constructor(
    private patientRepository: PatientRepository,
    private authorizationService: AuthorizationService,
    private auditLogService: AuditLogService,
  ) {}

  /**
   * Create a new patient
   * Can only be done by ADMIN or self (PATIENT creating own profile)
   */
  async createPatient(
    input: CreatePatientInput,
    userContext: UserContext,
  ): Promise<PatientDTO> {
    // Authorization: Only ADMIN or user creating own profile
    if (!userContext.roles.includes(Role.ADMIN) && userContext.id !== input.userId) {
      throw new Error('Unauthorized to create patient');
    }

    const patient = new Patient(
      PatientId.create(this.generateId()),
      input.userId,
      input.firstName,
      input.lastName,
      input.dateOfBirth,
      input.email,
      input.phoneNumber,
      input.address,
      input.city,
      input.state,
      input.zipCode,
      new Date(),
      new Date(),
    );

    const saved = await this.patientRepository.save(patient);

    // Audit log
    await this.auditLogService.logAction(
      userContext.id,
      'CREATE',
      'Patient',
      saved.id,
      { firstName: saved.firstName, lastName: saved.lastName },
    );

    return this.mapToDTO(saved);
  }

  /**
   * Get patient profile
   * Patient can only access their own profile
   * Doctor can access patients they've treated
   * Admin can access anyone
   */
  async getPatient(id: PatientId, userContext: UserContext): Promise<PatientDTO> {
    const patient = await this.patientRepository.findById(id);
    if (!patient) {
      throw new Error('Patient not found');
    }

    // Authorization
    const canAccess = await this.authorizationService.canAccessPatient(userContext, id);
    if (!canAccess) {
      throw new Error('Unauthorized to access patient');
    }

    return this.mapToDTO(patient);
  }

  /**
   * Update patient profile
   * Patient can only update their own profile
   * Admin can update any profile
   */
  async updatePatient(
    input: UpdatePatientInput,
    userContext: UserContext,
  ): Promise<PatientDTO> {
    const patient = await this.patientRepository.findById(input.id);
    if (!patient) {
      throw new Error('Patient not found');
    }

    // Authorization: Only ADMIN or self
    const canUpdate =
      userContext.roles.includes(Role.ADMIN) || patient.userId === userContext.id;
    if (!canUpdate) {
      throw new Error('Unauthorized to update patient');
    }

    const updated = new Patient(
      patient.id,
      patient.userId,
      input.firstName ?? patient.firstName,
      input.lastName ?? patient.lastName,
      patient.dateOfBirth,
      patient.email,
      input.phoneNumber ?? patient.phoneNumber,
      input.address ?? patient.address,
      input.city ?? patient.city,
      input.state ?? patient.state,
      input.zipCode ?? patient.zipCode,
      patient.createdAt,
      new Date(),
      patient.deletedAt,
    );

    await this.patientRepository.save(updated);

    // Audit log
    await this.auditLogService.logAction(
      userContext.id,
      'UPDATE',
      'Patient',
      updated.id,
      { updatedFields: Object.keys(input).filter(k => input[k as keyof UpdatePatientInput] !== undefined) },
    );

    return this.mapToDTO(updated);
  }

  /**
   * Soft delete patient (HIPAA compliance)
   */
  async deletePatient(id: PatientId, userContext: UserContext): Promise<void> {
    const patient = await this.patientRepository.findById(id);
    if (!patient) {
      throw new Error('Patient not found');
    }

    // Authorization: Only ADMIN
    if (!userContext.roles.includes(Role.ADMIN)) {
      throw new Error('Unauthorized to delete patient');
    }

    const deleted = new Patient(
      patient.id,
      patient.userId,
      patient.firstName,
      patient.lastName,
      patient.dateOfBirth,
      patient.email,
      patient.phoneNumber,
      patient.address,
      patient.city,
      patient.state,
      patient.zipCode,
      patient.createdAt,
      new Date(),
      new Date(), // Set deletedAt
    );

    await this.patientRepository.save(deleted);

    // Audit log
    await this.auditLogService.logAction(userContext.id, 'DELETE', 'Patient', id, {});
  }

  private mapToDTO(patient: Patient): PatientDTO {
    return {
      id: patient.id,
      userId: patient.userId,
      firstName: patient.firstName,
      lastName: patient.lastName,
      dateOfBirth: patient.dateOfBirth,
      email: patient.email,
      phoneNumber: patient.phoneNumber,
      address: patient.address,
      createdAt: patient.createdAt,
      updatedAt: patient.updatedAt,
    };
  }

  private generateId(): string {
    return `patient_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }
}
