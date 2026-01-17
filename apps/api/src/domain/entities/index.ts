/**
 * Domain Entities
 * Pure domain objects representing real-world concepts
 * No NestJS decorators, no Prisma dependencies
 */

import {
  UserId,
  PatientId,
  DoctorId,
  VisitId,
  InvoiceId,
  Role,
  InvoiceStatus,
  Money,
  UserContext,
  PaymentMethod,
} from '../value-objects';

/**
 * User Entity
 * Represents authentication identity and role assignment
 */
export class User {
  constructor(
    readonly id: UserId,
    readonly email: string,
    readonly roles: Role[],
    readonly passwordHash: string,
    readonly isActive: boolean,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}

  hasRole(role: Role): boolean {
    return this.roles.includes(role);
  }

  isPatient(): boolean {
    return this.hasRole(Role.PATIENT);
  }

  isDoctor(): boolean {
    return this.hasRole(Role.DOCTOR);
  }

  isAdmin(): boolean {
    return this.hasRole(Role.ADMIN);
  }

  toContext(): UserContext {
    return {
      id: this.id,
      roles: this.roles,
      email: this.email,
    };
  }
}

/**
 * Patient Entity
 * Represents a patient in the healthcare system
 * Patient cannot mutate clinical data; only read their own records
 */
export class Patient {
  constructor(
    readonly id: PatientId,
    readonly userId: UserId,
    readonly firstName: string,
    readonly lastName: string,
    readonly dateOfBirth: Date,
    readonly email: string,
    readonly phoneNumber: string,
    readonly address: string,
    readonly city: string,
    readonly state: string,
    readonly zipCode: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly deletedAt: Date | null = null,
  ) {}

  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  isDeleted(): boolean {
    return this.deletedAt !== null;
  }
}

/**
 * Doctor Entity
 * Represents a healthcare provider
 */
export class Doctor {
  constructor(
    readonly id: DoctorId,
    readonly userId: UserId,
    readonly firstName: string,
    readonly lastName: string,
    readonly specialization: string,
    readonly licenseNumber: string,
    readonly email: string,
    readonly phoneNumber: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly deletedAt: Date | null = null,
  ) {}

  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  isDeleted(): boolean {
    return this.deletedAt !== null;
  }
}

/**
 * Visit Aggregate Root
 * Central clinical event where care happens
 * Invariants:
 * - A Visit cannot be created without a Patient
 * - A Visit cannot be created without a Doctor
 * - Procedures and MedicalRecords are only valid within a Visit
 * - A completed Visit cannot be modified
 */
export class Visit {
  constructor(
    readonly id: VisitId,
    readonly patientId: PatientId,
    readonly doctorId: DoctorId,
    readonly appointmentId: string,
    readonly status: string, // 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'
    readonly visitDate: Date,
    readonly notes: string,
    readonly procedures: VisitProcedure[],
    readonly medicalRecords: VisitMedicalRecord[],
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly completedAt: Date | null = null,
  ) {}

  /**
   * Check if visit is modifiable
   * Completed visits are immutable for audit compliance
   */
  isModifiable(): boolean {
    return this.status !== 'COMPLETED';
  }

  /**
   * Get total cost of procedures
   */
  getTotalCost(procedures: VisitProcedure[]): Money {
    const totalAmount = procedures.reduce((sum, proc) => sum + proc.cost.amount, 0);
    return { amount: totalAmount, currency: 'KES' };
  }

  /**
   * Verify that procedure belongs to this visit
   */
  hasProcedure(procedureId: string): boolean {
    return this.procedures.some((p) => p.procedureId === procedureId);
  }
}

/**
 * Procedure within a Visit
 */
export interface VisitProcedure {
  procedureId: string;
  name: string;
  description: string;
  cost: Money;
  performedAt: Date;
}

/**
 * Medical Record within a Visit
 */
export interface VisitMedicalRecord {
  recordId: string;
  recordType: string;
  description: string;
  recordedAt: Date;
}

/**
 * Invoice Aggregate Root
 * Represents billing and payment lifecycle
 * Invariants:
 * - An Invoice must have a Patient
 * - Total amount must be positive
 * - Payments cannot exceed total amount
 * - Paid invoices cannot be modified
 */
export class Invoice {
  constructor(
    readonly id: InvoiceId,
    readonly patientId: PatientId,
    readonly visitId: VisitId | null,
    readonly totalAmount: Money,
    readonly paidAmount: Money,
    readonly status: InvoiceStatus,
    readonly dueDate: Date | null,
    readonly notes: string,
    readonly payments: InvoicePayment[],
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}

  /**
   * Calculate remaining balance
   */
  getBalance(): Money {
    return {
      amount: this.totalAmount.amount - this.paidAmount.amount,
      currency: this.totalAmount.currency,
    };
  }

  /**
   * Check if invoice is fully paid
   */
  isPaid(): boolean {
    return this.paidAmount.amount >= this.totalAmount.amount;
  }

  /**
   * Check if invoice is modifiable
   */
  isModifiable(): boolean {
    return this.status !== InvoiceStatus.PAID && this.status !== InvoiceStatus.CANCELLED;
  }

  /**
   * Verify payment can be applied
   */
  canApplyPayment(amount: Money): boolean {
    if (this.isPaid()) return false;
    const newTotal = this.paidAmount.amount + amount.amount;
    return newTotal <= this.totalAmount.amount;
  }
}

/**
 * Payment within an Invoice
 */
export interface InvoicePayment {
  paymentId: string;
  method: PaymentMethod;
  amount: Money;
  recordedAt: Date;
  reference: string;
}

/**
 * Appointment Entity
 * Request for a Visit (scheduling)
 */
export class Appointment {
  constructor(
    readonly id: string,
    readonly patientId: PatientId,
    readonly doctorId: DoctorId,
    readonly appointmentDate: Date,
    readonly reason: string,
    readonly status: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}
}
