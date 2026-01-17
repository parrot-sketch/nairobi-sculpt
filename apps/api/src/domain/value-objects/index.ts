/**
 * Domain Value Objects
 * Immutable value objects that represent domain concepts
 */

export type UserId = string & { readonly __brand: 'UserId' };
export type PatientId = string & { readonly __brand: 'PatientId' };
export type DoctorId = string & { readonly __brand: 'DoctorId' };
export type VisitId = string & { readonly __brand: 'VisitId' };
export type AppointmentId = string & { readonly __brand: 'AppointmentId' };
export type ProcedureId = string & { readonly __brand: 'ProcedureId' };
export type MedicalRecordId = string & { readonly __brand: 'MedicalRecordId' };
export type InvoiceId = string & { readonly __brand: 'InvoiceId' };
export type PaymentId = string & { readonly __brand: 'PaymentId' };
export type AuditLogId = string & { readonly __brand: 'AuditLogId' };

/** Money value object with cents precision */
export interface Money {
  amount: number; // in cents
  currency: string; // ISO 4217 code (e.g., 'KES')
}

/** Date range for queries */
export interface DateRange {
  from: Date;
  to: Date;
}

/** RBAC Role */
export enum Role {
  PATIENT = 'PATIENT',
  DOCTOR = 'DOCTOR',
  FRONTDESK = 'FRONTDESK',
  ADMIN = 'ADMIN',
}

/** User Context for authorization */
export interface UserContext {
  id: UserId;
  roles: Role[];
  email: string;
}

/** Visit Status */
export enum VisitStatus {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

/** Invoice Status */
export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  ISSUED = 'ISSUED',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
}

/** Payment Method */
export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  INSURANCE = 'INSURANCE',
  BANK_TRANSFER = 'BANK_TRANSFER',
}

/**
 * Brand creation helpers
 */
export const UserId = {
  create: (id: string): UserId => id as UserId,
};

export const PatientId = {
  create: (id: string): PatientId => id as PatientId,
};

export const DoctorId = {
  create: (id: string): DoctorId => id as DoctorId,
};

export const VisitId = {
  create: (id: string): VisitId => id as VisitId,
};

export const InvoiceId = {
  create: (id: string): InvoiceId => id as InvoiceId,
};
