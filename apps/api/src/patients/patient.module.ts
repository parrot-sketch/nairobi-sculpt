import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditModule } from '../audit/audit.module';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';

@Module({
  imports: [PrismaModule, AuditModule],
  providers: [PatientService],
  controllers: [PatientController],
  exports: [PatientService],
})
export class PatientModule {}
