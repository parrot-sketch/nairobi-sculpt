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
import { MedicalRecordService } from './medical-record.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import type { AuthRequest } from '../auth/auth.types';
import {
  CreateMedicalRecordDto,
  UpdateMedicalRecordDto,
} from '../common/dtos';

@Controller('medical-records')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MedicalRecordController {
  constructor(private medicalRecordService: MedicalRecordService) {}

  @Post()
  @Roles(['DOCTOR', 'ADMIN'])
  async create(
    @Request() req: AuthRequest,
    @Body() createDto: CreateMedicalRecordDto,
  ) {
    return this.medicalRecordService.create(req.user.sub, createDto);
  }

  @Get('patient/:patientId')
  @Roles(['PATIENT', 'DOCTOR', 'ADMIN'])
  async getRecords(
    @Param('patientId') patientId: string,
    @Request() req: AuthRequest,
  ) {
    // Patients can only access their own medical records
    if (req.user.role === 'PATIENT' && patientId !== req.user.sub) {
      throw new ForbiddenException(
        'Cannot access other patients medical records',
      );
    }
    return this.medicalRecordService.getRecords(patientId);
  }

  @Get(':recordId')
  @Roles(['PATIENT', 'DOCTOR', 'ADMIN'])
  async getRecord(
    @Param('recordId') recordId: string,
    @Request() req: AuthRequest,
  ) {
    return this.medicalRecordService.getRecord(
      recordId,
      req.user.sub,
      req.user.role,
    );
  }

  @Put(':recordId')
  @Roles(['DOCTOR', 'ADMIN'])
  async update(
    @Param('recordId') recordId: string,
    @Body() updateDto: UpdateMedicalRecordDto,
    @Request() req: AuthRequest,
  ) {
    return this.medicalRecordService.update(
      recordId,
      req.user.sub,
      updateDto,
    );
  }

  @Get('search/:patientId')
  @Roles(['DOCTOR', 'ADMIN'])
  async search(@Param('patientId') patientId: string, @Query('q') query: string) {
    return this.medicalRecordService.search(patientId, query);
  }

  @Delete(':recordId')
  @Roles(['ADMIN'])
  async delete(@Param('recordId') recordId: string, @Request() req: any) {
    return this.medicalRecordService.delete(recordId, req.user.sub);
  }
}
