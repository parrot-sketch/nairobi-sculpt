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
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import type { AuthRequest } from '../auth/auth.types';
import {
  CreateAppointmentDto,
  UpdateAppointmentStatusDto,
} from '../common/dtos';

@Controller('appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentController {
  constructor(private appointmentService: AppointmentService) {}

  @Post()
  @Roles(['PATIENT'])
  async create(
    @Request() req: AuthRequest,
    @Body() createDto: CreateAppointmentDto,
  ) {
    return this.appointmentService.create(req.user.sub, createDto);
  }

  @Get(':appointmentId')
  @Roles(['PATIENT', 'DOCTOR', 'ADMIN'])
  async getAppointment(
    @Param('appointmentId') appointmentId: string,
    @Request() req: AuthRequest,
  ) {
    return this.appointmentService.getAppointment(
      appointmentId,
      req.user.sub,
      req.user.role,
    );
  }

  @Put(':appointmentId/status')
  @Roles(['DOCTOR', 'ADMIN'])
  async updateStatus(
    @Param('appointmentId') appointmentId: string,
    @Body() updateDto: UpdateAppointmentStatusDto,
    @Request() req: AuthRequest,
  ) {
    return this.appointmentService.updateStatus(
      appointmentId,
      req.user.sub,
      updateDto,
    );
  }

  @Get()
  @Roles(['PATIENT', 'DOCTOR', 'ADMIN'])
  async getAppointments(
    @Request() req: AuthRequest,
    @Query('doctorId') doctorId?: string,
  ) {
    if (req.user.role === 'PATIENT') {
      return this.appointmentService.getAppointmentsByPatient(req.user.sub);
    } else if (req.user.role === 'DOCTOR') {
      return this.appointmentService.getAppointmentsByDoctor(req.user.sub);
    } else if (req.user.role === 'ADMIN' && doctorId) {
      return this.appointmentService.getAppointmentsByDoctor(doctorId);
    }
    throw new ForbiddenException(
      'Insufficient permissions to list appointments',
    );
  }

  @Delete(':appointmentId')
  @Roles(['PATIENT', 'DOCTOR', 'ADMIN'])
  async cancel(
    @Param('appointmentId') appointmentId: string,
    @Request() req: AuthRequest,
  ) {
    return this.appointmentService.cancel(appointmentId, req.user.sub);
  }
}
