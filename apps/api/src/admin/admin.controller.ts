import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminService, DashboardMetrics } from './admin.service';
import { JwtAuthGuard } from '@/auth/guards/jwt.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * GET /api/admin/dashboard/metrics
   * Returns all dashboard KPIs for admin dashboard
   * Requires ADMIN role
   */
  @Get('dashboard/metrics')
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    return this.adminService.getDashboardMetrics();
  }
}
