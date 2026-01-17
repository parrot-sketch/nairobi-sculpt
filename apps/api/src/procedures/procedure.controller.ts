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
} from '@nestjs/common';
import { ProcedureService } from './procedure.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import type { AuthRequest } from '../auth/auth.types';
import { CreateProcedureDto, UpdateProcedureDto } from '../common/dtos';

@Controller('procedures')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProcedureController {
  constructor(private procedureService: ProcedureService) {}

  @Post()
  @Roles(['DOCTOR', 'ADMIN'])
  async create(
    @Request() req: AuthRequest,
    @Body() createDto: CreateProcedureDto,
  ) {
    return this.procedureService.create(req.user.sub, createDto);
  }

  @Get(':procedureId')
  @Roles(['DOCTOR', 'ADMIN', 'PATIENT'])
  async getProcedure(
    @Param('procedureId') procedureId: string,
    @Request() req: AuthRequest,
  ) {
    return this.procedureService.getProcedure(
      procedureId,
      req.user.sub,
      req.user.role,
    );
  }

  @Put(':procedureId')
  @Roles(['DOCTOR', 'ADMIN'])
  async update(
    @Param('procedureId') procedureId: string,
    @Body() updateDto: UpdateProcedureDto,
    @Request() req: AuthRequest,
  ) {
    return this.procedureService.update(procedureId, req.user.sub, updateDto);
  }

  @Get('patient/:patientId')
  @Roles(['DOCTOR', 'ADMIN'])
  async getProceduresByPatient(@Param('patientId') patientId: string) {
    return this.procedureService.getProceduresByPatient(patientId);
  }

  @Get('doctor/:doctorId')
  @Roles(['DOCTOR', 'ADMIN'])
  async getProceduresByDoctor(@Param('doctorId') doctorId: string) {
    return this.procedureService.getProceduresByDoctor(doctorId);
  }

  @Delete(':procedureId')
  @Roles(['DOCTOR', 'ADMIN'])
  async delete(
    @Param('procedureId') procedureId: string,
    @Request() req: AuthRequest,
  ) {
    return this.procedureService.delete(procedureId, req.user.sub);
  }
}
