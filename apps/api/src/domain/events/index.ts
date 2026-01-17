/**
 * Domain Events
 * Represent significant business events that have occurred
 * These events can trigger side effects and async workflows
 */

import { VisitId, PatientId, DoctorId, InvoiceId, PaymentId, Money, UserId } from '../value-objects';

/**
 * Base event interface
 */
export interface DomainEvent {
  type: string;
  aggregateId: string;
  occurredAt: Date;
  userId?: UserId;
}

/**
 * Emitted when a Visit is completed
 * Triggers invoice generation
 */
export interface VisitCompletedEvent extends DomainEvent {
  type: 'VisitCompleted';
  visitId: VisitId;
  patientId: PatientId;
  doctorId: DoctorId;
  totalCost: Money;
}

/**
 * Emitted when a Payment is recorded against an Invoice
 * Triggers invoice status update
 */
export interface PaymentRecordedEvent extends DomainEvent {
  type: 'PaymentRecorded';
  invoiceId: InvoiceId;
  paymentId: PaymentId;
  amount: Money;
  patientId: PatientId;
}

/**
 * Emitted when a Medical Record is created
 * Triggers audit logging and patient notification
 */
export interface MedicalRecordCreatedEvent extends DomainEvent {
  type: 'MedicalRecordCreated';
  recordId: string;
  visitId: VisitId;
  patientId: PatientId;
  doctorId: DoctorId;
}

/**
 * Emitted when an Invoice is generated
 */
export interface InvoiceGeneratedEvent extends DomainEvent {
  type: 'InvoiceGenerated';
  invoiceId: InvoiceId;
  patientId: PatientId;
  visitId: VisitId;
  totalAmount: Money;
}

/**
 * Emitted when a Procedure is performed
 */
export interface ProcedurePerformedEvent extends DomainEvent {
  type: 'ProcedurePerformed';
  procedureId: string;
  visitId: VisitId;
  patientId: PatientId;
  doctorId: DoctorId;
  cost: Money;
}

/**
 * Event bus port (implemented by infrastructure)
 */
export interface EventBus {
  publish(event: DomainEvent): Promise<void>;
  subscribe(eventType: string, handler: (event: DomainEvent) => Promise<void>): void;
}
