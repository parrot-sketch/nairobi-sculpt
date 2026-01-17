import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../audit/audit-log.service';
import {
  CreateInvoiceDto,
  UpdateInvoiceDto,
  InvoiceStatus,
  CreatePaymentDto,
} from '../common/dtos';

@Injectable()
export class InvoiceService {
  constructor(
    private prisma: PrismaService,
    private auditLog: AuditLogService,
  ) {}

  async create(userId: string, createDto: CreateInvoiceDto) {
    const patient = await this.prisma.patient.findUnique({
      where: { id: createDto.patientId },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    // Generate unique invoice number
    const invoiceNumber = `INV-${Date.now()}`;

    const invoice = await this.prisma.invoice.create({
      data: {
        invoiceNumber,
        patientId: createDto.patientId,
        visitId: createDto.visitId,
        description: createDto.description,
        amount:
          typeof createDto.amount === 'string'
            ? parseFloat(createDto.amount)
            : createDto.amount,
        status: InvoiceStatus.DRAFT,
      },
      include: {
        patient: { include: { user: true } },
        payments: true,
      },
    });

    await this.auditLog.logAction(
      userId,
      'CREATE_INVOICE',
      'Invoice',
      invoice.id,
      `Invoice ${invoiceNumber} created for ${createDto.amount}`,
    );

    return invoice;
  }

  async getInvoice(invoiceId: string, userId: string, role: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        patient: { include: { user: true } },
        visit: true,
        payments: true,
      },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    // Access control: patient can see own, doctor/admin can see all
    if (role === 'PATIENT' && invoice.patientId !== userId) {
      throw new ForbiddenException('Cannot access other patients invoices');
    }

    return invoice;
  }

  async getInvoicesByPatient(patientId: string) {
    return await this.prisma.invoice.findMany({
      where: { patientId },
      include: { payments: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(invoiceId: string, userId: string, updateDto: UpdateInvoiceDto) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    const updated = await this.prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        ...updateDto,
        ...(updateDto.status === InvoiceStatus.PAID && { paidAt: new Date() }),
      },
      include: {
        patient: { include: { user: true } },
        payments: true,
      },
    });

    await this.auditLog.logAction(
      userId,
      'UPDATE_INVOICE',
      'Invoice',
      invoiceId,
      `Invoice ${invoice.invoiceNumber} updated`,
    );

    return updated;
  }

  async recordPayment(
    invoiceId: string,
    userId: string,
    paymentDto: CreatePaymentDto,
  ) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { payments: true },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    // Calculate total paid
    const totalPaid =
      invoice.payments.reduce((sum, p) => sum + Number(p.amount), 0) +
      paymentDto.amount;

    // Determine new status
    let newStatus = invoice.status;
    if (totalPaid >= Number(invoice.amount)) {
      newStatus = InvoiceStatus.PAID;
    } else if (totalPaid > 0) {
      newStatus = InvoiceStatus.PARTIALLY_PAID;
    }

    // Wrap in transaction to ensure consistency
    const result = await this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          invoiceId,
          amount: paymentDto.amount,
          method: paymentDto.method,
          transactionId: paymentDto.transactionId,
          notes: paymentDto.notes,
        },
      });

      // Update invoice status
      await tx.invoice.update({
        where: { id: invoiceId },
        data: {
          status: newStatus,
          ...(newStatus === InvoiceStatus.PAID && { paidAt: new Date() }),
        },
      });

      return payment;
    });

    await this.auditLog.logAction(
      userId,
      'RECORD_PAYMENT',
      'Payment',
      result.id,
      `Payment of ${paymentDto.amount} recorded for invoice ${invoice.invoiceNumber}`,
    );

    return result;
  }

  async generateReport(startDate: Date, endDate: Date) {
    const invoices = await this.prisma.invoice.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: { payments: true },
    });

    const totalAmount = invoices.reduce(
      (sum, inv) => sum + Number(inv.amount),
      0,
    );
    const paidAmount = invoices
      .filter((inv) => inv.status === InvoiceStatus.PAID)
      .reduce((sum, inv) => sum + Number(inv.amount), 0);
    const outstandingAmount = totalAmount - paidAmount;

    return {
      period: { startDate, endDate },
      totalInvoices: invoices.length,
      totalAmount,
      paidAmount,
      outstandingAmount,
      invoices,
    };
  }

  async softDelete(invoiceId: string, userId: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    if (invoice.status !== InvoiceStatus.DRAFT) {
      throw new BadRequestException('Can only delete draft invoices');
    }

    const updated = await this.prisma.invoice.update({
      where: { id: invoiceId },
      data: { deletedAt: new Date() },
    });

    await this.auditLog.logAction(
      userId,
      'DELETE_INVOICE',
      'Invoice',
      invoiceId,
      `Invoice soft-deleted`,
    );

    return updated;
  }
}
