/**
 * Authorization Service Adapter
 * Implements authorization checks for domain aggregates
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthorizationService } from '../../domain/ports';
import { UserContext, PatientId, VisitId, InvoiceId, Role } from '../../domain';

@Injectable()
export class PrismaAuthorizationService implements AuthorizationService {
  constructor(private prisma: PrismaService) {}

  async canAccessPatient(userContext: UserContext, patientId: PatientId): Promise<boolean> {
    // ADMIN can access any patient
    if (userContext.roles.includes(Role.ADMIN)) {
      return true;
    }

    // PATIENT can access their own profile
    if (userContext.roles.includes(Role.PATIENT)) {
      const patient = await this.prisma.patient.findUnique({
        where: { id: patientId },
      });
      return patient?.userId === userContext.id;
    }

    // DOCTOR can access patients they've treated
    if (userContext.roles.includes(Role.DOCTOR)) {
      const doctor = await this.prisma.doctor.findFirst({
        where: { userId: userContext.id },
      });

      if (!doctor) return false;

      // Check if doctor has visits with this patient
      const visit = await this.prisma.visit.findFirst({
        where: {
          patientId,
          doctorId: doctor.id,
        },
      });

      return !!visit;
    }

    return false;
  }

  async canAccessVisit(userContext: UserContext, visitId: VisitId): Promise<boolean> {
    const visit = await this.prisma.visit.findUnique({
      where: { id: visitId },
    });

    if (!visit) return false;

    // ADMIN can access any visit
    if (userContext.roles.includes(Role.ADMIN)) {
      return true;
    }

    // PATIENT can access their own visits
    if (userContext.roles.includes(Role.PATIENT)) {
      const patient = await this.prisma.patient.findFirst({
        where: { userId: userContext.id },
      });
      return patient?.id === visit.patientId;
    }

    // DOCTOR can access visits they participated in
    if (userContext.roles.includes(Role.DOCTOR)) {
      const doctor = await this.prisma.doctor.findFirst({
        where: { userId: userContext.id },
      });
      return doctor?.id === visit.doctorId;
    }

    return false;
  }

  async canAccessInvoice(userContext: UserContext, invoiceId: InvoiceId): Promise<boolean> {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
    });

    if (!invoice) return false;

    // ADMIN can access any invoice
    if (userContext.roles.includes(Role.ADMIN)) {
      return true;
    }

    // PATIENT can access their own invoices
    if (userContext.roles.includes(Role.PATIENT)) {
      const patient = await this.prisma.patient.findFirst({
        where: { userId: userContext.id },
      });
      return patient?.id === invoice.patientId;
    }

    // FRONTDESK can access all invoices for billing
    if (userContext.roles.includes(Role.FRONTDESK)) {
      return true;
    }

    return false;
  }

  async canModifyVisit(userContext: UserContext, visitId: VisitId): Promise<boolean> {
    const visit = await this.prisma.visit.findUnique({
      where: { id: visitId },
    });

    if (!visit) return false;

    // ADMIN can modify any visit
    if (userContext.roles.includes(Role.ADMIN)) {
      return true;
    }

    // Only the doctor who performed the visit can complete it
    if (userContext.roles.includes(Role.DOCTOR)) {
      const doctor = await this.prisma.doctor.findFirst({
        where: { userId: userContext.id },
      });
      return doctor?.id === visit.doctorId;
    }

    return false;
  }
}
