import {
  IsString,
  IsOptional,
  IsDate,
  IsEnum,
  IsNumber,
  IsPositive,
  Max,
} from 'class-validator';
// Import enums from Prisma for use as decorators and re-export
import {
  AppointmentStatus,
  ProcedureStatus,
  InvoiceStatus,
  MedicalRecordType,
  VisitType,
  VisitStatus,
  PaymentMethod,
} from '@prisma/client';

// Re-export enums
export {
  AppointmentStatus,
  ProcedureStatus,
  InvoiceStatus,
  MedicalRecordType,
  VisitType,
  VisitStatus,
  PaymentMethod,
} from '@prisma/client';

// ==================== PATIENT DTOs ====================

export class CreatePatientDto {
  @IsDate()
  @IsOptional()
  dateOfBirth?: Date;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsString()
  @IsOptional()
  bloodType?: string;

  @IsString()
  @IsOptional()
  allergies?: string;

  @IsString()
  @IsOptional()
  emergencyContactName?: string;

  @IsString()
  @IsOptional()
  emergencyContactPhone?: string;
}

export class UpdatePatientDto {
  @IsString()
  @IsOptional()
  gender?: string;

  @IsString()
  @IsOptional()
  bloodType?: string;

  @IsString()
  @IsOptional()
  allergies?: string;

  @IsString()
  @IsOptional()
  emergencyContactName?: string;

  @IsString()
  @IsOptional()
  emergencyContactPhone?: string;
}

// ==================== DOCTOR DTOs ====================

export class CreateDoctorDto {
  @IsString()
  licenseNumber!: string;

  @IsString()
  specialization!: string;

  @IsString()
  @IsOptional()
  bio?: string;
}

export class UpdateDoctorDto {
  @IsString()
  @IsOptional()
  licenseNumber?: string;

  @IsString()
  @IsOptional()
  specialization?: string;

  @IsString()
  @IsOptional()
  bio?: string;
}

// ==================== APPOINTMENT DTOs ====================

export class CreateAppointmentDto {
  @IsString()
  doctorId!: string; // Patient ID comes from auth context

  @IsString()
  @IsOptional()
  reason?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class ScheduleAppointmentDto {
  @IsDate()
  scheduledTime!: Date;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateAppointmentStatusDto {
  @IsEnum(AppointmentStatus)
  status!: AppointmentStatus;

  @IsString()
  @IsOptional()
  notes?: string;
}

// ==================== VISIT DTOs ====================

export class CreateVisitDto {
  @IsString()
  patientId!: string;

  @IsString()
  doctorId!: string;

  @IsEnum(VisitType)
  @IsOptional()
  visitType?: VisitType;

  @IsString()
  @IsOptional()
  reason?: string;

  @IsString()
  @IsOptional()
  diagnosis?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsDate()
  visitDate!: Date;
}

export class UpdateVisitDto {
  @IsString()
  @IsOptional()
  diagnosis?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  bloodPressure?: string;

  @IsNumber()
  @IsOptional()
  heartRate?: number;

  @IsNumber()
  @IsOptional()
  temperature?: number;

  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsEnum(VisitStatus)
  @IsOptional()
  status?: VisitStatus;
}

// ==================== PROCEDURE DTOs ====================

export class CreateProcedureDto {
  @IsString()
  visitId!: string;

  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateProcedureDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsEnum(ProcedureStatus)
  @IsOptional()
  status?: ProcedureStatus;

  @IsString()
  @IsOptional()
  notes?: string;
}

// ==================== MEDICAL RECORD DTOs ====================

export class CreateMedicalRecordDto {
  @IsString()
  patientId!: string;

  @IsString()
  @IsOptional()
  visitId?: string;

  @IsEnum(MedicalRecordType)
  @IsOptional()
  recordType?: MedicalRecordType;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  content!: string;

  @IsOptional()
  isConfidential?: boolean;
}

export class UpdateMedicalRecordDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsEnum(MedicalRecordType)
  @IsOptional()
  recordType?: MedicalRecordType;

  @IsOptional()
  isConfidential?: boolean;
}

// ==================== INVOICE DTOs ====================

export class CreateInvoiceDto {
  @IsString()
  patientId!: string;

  @IsString()
  @IsOptional()
  visitId?: string;

  @IsString()
  description!: string;

  @IsNumber()
  @IsPositive()
  @Max(9999999.99) // Max amount: ~9.9M in primary currency
  amount!: number;
}

export class UpdateInvoiceDto {
  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(InvoiceStatus)
  @IsOptional()
  status?: InvoiceStatus;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsDate()
  @IsOptional()
  dueAt?: Date;
}

// Alias for backwards compatibility
export class UpdateInvoiceStatusDto extends UpdateInvoiceDto {}

// ==================== PAYMENT DTOs ====================

export class CreatePaymentDto {
  @IsString()
  invoiceId!: string;

  @IsNumber()
  @IsPositive()
  @Max(9999999.99) // Max payment: ~9.9M in primary currency
  amount!: number;

  @IsEnum(PaymentMethod)
  method!: PaymentMethod;

  @IsString()
  @IsOptional()
  transactionId?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

// Note: Prisma enums are re-exported at the top of this file
