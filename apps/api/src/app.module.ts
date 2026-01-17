import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuditModule } from './audit/audit.module';
import { PatientModule } from './patients/patient.module';
import { DoctorModule } from './doctors/doctor.module';
import { AppointmentModule } from './appointments/appointment.module';
import { ProcedureModule } from './procedures/procedure.module';
import { MedicalRecordModule } from './medical-records/medical-record.module';
import { InvoiceModule } from './invoices/invoice.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    AuditModule,
    PatientModule,
    DoctorModule,
    AppointmentModule,
    ProcedureModule,
    MedicalRecordModule,
    InvoiceModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
