import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { PatientService } from './patient.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import type { AuthRequest } from '../auth/auth.types';
import { UpdatePatientDto } from '../common/dtos';

@Controller('patients')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PatientController {
  constructor(private patientService: PatientService) {}

  @Get('profile')
  @Roles(['PATIENT'])
  async getProfile(@Request() req: AuthRequest) {
    return this.patientService.getProfile(req.user.sub);
  }

  @Put('profile')
  @Roles(['PATIENT'])
  async updateProfile(
    @Request() req: AuthRequest,
    @Body() updateDto: UpdatePatientDto,
  ) {
    return this.patientService.updateProfile(req.user.sub, updateDto);
  }

  @Get('medical-records')
  @Roles(['PATIENT'])
  async getMedicalRecords(@Request() req: AuthRequest) {
    return this.patientService.getMedicalRecords(req.user.sub);
  }

  @Get('appointments')
  @Roles(['PATIENT'])
  async getAppointments(@Request() req: AuthRequest) {
    return this.patientService.getAppointments(req.user.sub);
  }

  @Get('visits')
  @Roles(['PATIENT'])
  async getVisits(@Request() req: AuthRequest) {
    return this.patientService.getVisits(req.user.sub);
  }

  @Get('billing')
  @Roles(['PATIENT'])
  async getBillingHistory(@Request() req: AuthRequest) {
    return this.patientService.getBillingHistory(req.user.sub);
  }

  @Delete(':userId')
  @Roles(['ADMIN'])
  async softDelete(
    @Param('userId') userId: string,
    @Request() req: AuthRequest,
  ) {
    return this.patientService.softDelete(userId, req.user.sub);
  }
}
