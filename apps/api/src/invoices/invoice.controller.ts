import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  UseGuards,
  Request,
  Param,
  Query,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import type { AuthRequest } from '../auth/auth.types';
import {
  CreateInvoiceDto,
  UpdateInvoiceDto,
  CreatePaymentDto,
} from '../common/dtos';

@Controller('invoices')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InvoiceController {
  constructor(private invoiceService: InvoiceService) {}

  @Post()
  @Roles(['ADMIN', 'DOCTOR'])
  async create(
    @Request() req: AuthRequest,
    @Body() createDto: CreateInvoiceDto,
  ) {
    return this.invoiceService.create(req.user.sub, createDto);
  }

  @Get(':invoiceId')
  @Roles(['PATIENT', 'DOCTOR', 'ADMIN'])
  async getInvoice(
    @Param('invoiceId') invoiceId: string,
    @Request() req: AuthRequest,
  ) {
    return this.invoiceService.getInvoice(
      invoiceId,
      req.user.sub,
      req.user.role,
    );
  }

  @Get('patient/:patientId')
  @Roles(['PATIENT', 'ADMIN'])
  async getInvoicesByPatient(
    @Param('patientId') patientId: string,
    @Request() req: AuthRequest,
  ) {
    // Patients can only access their own invoices
    if (req.user.role === 'PATIENT' && patientId !== req.user.sub) {
      throw new ForbiddenException('Cannot access other patients invoices');
    }
    return this.invoiceService.getInvoicesByPatient(patientId);
  }

  @Put(':invoiceId')
  @Roles(['ADMIN', 'DOCTOR'])
  async update(
    @Param('invoiceId') invoiceId: string,
    @Body() updateDto: UpdateInvoiceDto,
    @Request() req: AuthRequest,
  ) {
    return this.invoiceService.update(invoiceId, req.user.sub, updateDto);
  }

  @Post(':invoiceId/payments')
  @Roles(['ADMIN', 'DOCTOR', 'PATIENT'])
  async recordPayment(
    @Param('invoiceId') invoiceId: string,
    @Body() paymentDto: CreatePaymentDto,
    @Request() req: AuthRequest,
  ) {
    return this.invoiceService.recordPayment(
      invoiceId,
      req.user.sub,
      paymentDto,
    );
  }

  @Get('report/generate')
  @Roles(['ADMIN'])
  async generateReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    if (!startDate || !endDate) {
      throw new BadRequestException(
        'startDate and endDate query parameters are required',
      );
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException(
        'startDate and endDate must be valid ISO dates',
      );
    }
    return this.invoiceService.generateReport(start, end);
  }

  @Delete(':invoiceId')
  @Roles(['ADMIN'])
  async softDelete(
    @Param('invoiceId') invoiceId: string,
    @Request() req: AuthRequest,
  ) {
    return this.invoiceService.softDelete(invoiceId, req.user.sub);
  }
}
