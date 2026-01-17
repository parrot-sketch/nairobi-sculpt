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
import { DoctorService } from './doctor.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import type { AuthRequest } from '../auth/auth.types';
import { UpdateDoctorDto } from '../common/dtos';

@Controller('doctors')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DoctorController {
  constructor(private doctorService: DoctorService) {}

  @Get('profile')
  @Roles(['DOCTOR'])
  async getProfile(@Request() req: AuthRequest) {
    return this.doctorService.getProfile(req.user.sub);
  }

  @Put('profile')
  @Roles(['DOCTOR'])
  async updateProfile(
    @Request() req: AuthRequest,
    @Body() updateDto: UpdateDoctorDto,
  ) {
    return this.doctorService.updateProfile(req.user.sub, updateDto);
  }

  @Get('appointments')
  @Roles(['DOCTOR'])
  async getAppointments(@Request() req: AuthRequest) {
    return this.doctorService.getAppointments(req.user.sub);
  }

  @Get('visits')
  @Roles(['DOCTOR'])
  async getVisits(@Request() req: AuthRequest) {
    return this.doctorService.getVisits(req.user.sub);
  }

  @Get('procedures')
  @Roles(['DOCTOR'])
  async getProcedures(@Request() req: AuthRequest) {
    return this.doctorService.getProcedures(req.user.sub);
  }

  @Get('schedule')
  @Roles(['DOCTOR'])
  async getSchedule(@Request() req: AuthRequest) {
    return this.doctorService.getSchedule(req.user.sub);
  }

  @Delete(':userId')
  @Roles(['ADMIN'])
  async softDelete(
    @Param('userId') userId: string,
    @Request() req: AuthRequest,
  ) {
    return this.doctorService.softDelete(userId, req.user.sub);
  }
}
