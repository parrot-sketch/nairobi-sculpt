import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditModule } from '../audit/audit.module';
import { MedicalRecordService } from './medical-record.service';
import { MedicalRecordController } from './medical-record.controller';

@Module({
  imports: [PrismaModule, AuditModule],
  providers: [MedicalRecordService],
  controllers: [MedicalRecordController],
  exports: [MedicalRecordService],
})
export class MedicalRecordModule {}
