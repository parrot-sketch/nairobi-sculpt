/**
 * Repository Ports (Interfaces)
 * Define how domain aggregates are persisted
 * Implementation is in infrastructure layer
 */

import {
  Visit,
  Patient,
  Invoice,
  User,
  Doctor,
  Appointment,
} from '../entities';
import {
  VisitId,
  PatientId,
  DoctorId,
  InvoiceId,
  UserId,
  VisitStatus,
  InvoiceStatus,
  Role,
  UserContext,
} from '../value-objects';

/**
 * User Repository
 */
export interface UserRepository {
  findById(id: UserId): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<User>;
  delete(id: UserId): Promise<void>;
  findByRole(role: Role): Promise<User[]>;
}

/**
 * Patient Repository
 */
export interface PatientRepository {
  findById(id: PatientId): Promise<Patient | null>;
  findByUserId(userId: UserId): Promise<Patient | null>;
  save(patient: Patient): Promise<Patient>;
  delete(id: PatientId): Promise<void>;
  findAll(limit?: number, offset?: number): Promise<Patient[]>;
}

/**
 * Doctor Repository
 */
export interface DoctorRepository {
  findById(id: DoctorId): Promise<Doctor | null>;
  findByUserId(userId: UserId): Promise<Doctor | null>;
  save(doctor: Doctor): Promise<Doctor>;
  delete(id: DoctorId): Promise<void>;
  findAll(limit?: number, offset?: number): Promise<Doctor[]>;
  findBySpecialization(specialization: string): Promise<Doctor[]>;
}

/**
 * Visit Repository
 * Primary aggregate root persistence
 */
export interface VisitRepository {
  findById(id: VisitId): Promise<Visit | null>;
  findByPatientId(patientId: PatientId, limit?: number, offset?: number): Promise<Visit[]>;
  findByDoctorId(doctorId: DoctorId, limit?: number, offset?: number): Promise<Visit[]>;
  findByStatus(status: VisitStatus): Promise<Visit[]>;
  save(visit: Visit): Promise<Visit>;
  delete(id: VisitId): Promise<void>;
  findAll(limit?: number, offset?: number): Promise<Visit[]>;
}

/**
 * Invoice Repository
 * Financial aggregate root persistence
 */
export interface InvoiceRepository {
  findById(id: InvoiceId): Promise<Invoice | null>;
  findByPatientId(patientId: PatientId, limit?: number, offset?: number): Promise<Invoice[]>;
  findByStatus(status: InvoiceStatus): Promise<Invoice[]>;
  save(invoice: Invoice): Promise<Invoice>;
  delete(id: InvoiceId): Promise<void>;
  findAll(limit?: number, offset?: number): Promise<Invoice[]>;
}

/**
 * Appointment Repository
 */
export interface AppointmentRepository {
  findById(id: string): Promise<Appointment | null>;
  findByPatientId(patientId: PatientId, limit?: number, offset?: number): Promise<Appointment[]>;
  findByDoctorId(doctorId: DoctorId, limit?: number, offset?: number): Promise<Appointment[]>;
  save(appointment: Appointment): Promise<Appointment>;
  delete(id: string): Promise<void>;
}

/**
 * Unit of Work pattern for transaction management
 */
export interface UnitOfWork {
  users: UserRepository;
  patients: PatientRepository;
  doctors: DoctorRepository;
  visits: VisitRepository;
  invoices: InvoiceRepository;
  appointments: AppointmentRepository;
  commit(): Promise<void>;
  rollback(): Promise<void>;
}

/**
 * Authorization Service Port
 */
export interface AuthorizationService {
  canAccessPatient(userContext: UserContext, patientId: PatientId): Promise<boolean>;
  canAccessVisit(userContext: UserContext, visitId: VisitId): Promise<boolean>;
  canAccessInvoice(userContext: UserContext, invoiceId: InvoiceId): Promise<boolean>;
  canModifyVisit(userContext: UserContext, visitId: VisitId): Promise<boolean>;
}

/**
 * Audit Log Service Port
 */
export interface AuditLogService {
  logAction(
    userId: UserId,
    action: string,
    entity: string,
    entityId: string,
    details: Record<string, unknown>,
  ): Promise<void>;
}
