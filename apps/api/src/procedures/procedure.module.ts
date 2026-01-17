import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditModule } from '../audit/audit.module';
import { ProcedureService } from './procedure.service';
import { ProcedureController } from './procedure.controller';

@Module({
  imports: [PrismaModule, AuditModule],
  providers: [ProcedureService],
  controllers: [ProcedureController],
  exports: [ProcedureService],
})
export class ProcedureModule {}
