import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

export interface DashboardMetrics {
  todayRevenue: number;
  monthRevenue: number;
  todayAppointments: number;
  weekAppointments: number;
  newPatientsThisWeek: number;
  outstandingInvoices: number;
}

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get today's revenue (sum of paid invoices)
   */
  async getTodayRevenue(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const result = await this.prisma.payment.aggregate({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
      _sum: {
        amount: true,
      },
    });

    return result._sum.amount ? Number(result._sum.amount) : 0;
  }

  /**
   * Get this month's revenue (sum of paid invoices)
   */
  async getMonthRevenue(): Promise<number> {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayOfNextMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      1,
    );

    const result = await this.prisma.payment.aggregate({
      where: {
        createdAt: {
          gte: firstDayOfMonth,
          lt: firstDayOfNextMonth,
        },
      },
      _sum: {
        amount: true,
      },
    });

    return result._sum.amount ? Number(result._sum.amount) : 0;
  }

  /**
   * Get count of appointments scheduled for today
   */
  async getTodayAppointments(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const count = await this.prisma.appointment.count({
      where: {
        scheduledTime: {
          gte: today,
          lt: tomorrow,
        },
        status: {
          in: ['SCHEDULED', 'CONFIRMED'],
        },
      },
    });

    return count;
  }

  /**
   * Get count of appointments this week (next 7 days)
   */
  async getWeekAppointments(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekFromNow = new Date(today);
    weekFromNow.setDate(weekFromNow.getDate() + 7);

    const count = await this.prisma.appointment.count({
      where: {
        scheduledTime: {
          gte: today,
          lt: weekFromNow,
        },
        status: {
          in: ['SCHEDULED', 'CONFIRMED'],
        },
      },
    });

    return count;
  }

  /**
   * Get count of new patients this week
   */
  async getNewPatientsThisWeek(): Promise<number> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const count = await this.prisma.patient.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
        user: {
          deletedAt: null,
        },
      },
    });

    return count;
  }

  /**
   * Get sum of unpaid invoices (ISSUED + OVERDUE + PARTIALLY_PAID)
   */
  async getOutstandingInvoices(): Promise<number> {
    // For each outstanding invoice, sum the amount minus any payments
    const outstanding = await this.prisma.invoice.findMany({
      where: {
        status: {
          in: ['ISSUED', 'OVERDUE', 'PARTIALLY_PAID'],
        },
        deletedAt: null,
      },
      include: {
        payments: true,
      },
    });

    let total = 0;
    for (const invoice of outstanding) {
      const paid = invoice.payments.reduce((sum, p) => sum + Number(p.amount), 0);
      const remaining = Number(invoice.amount) - paid;
      total += remaining;
    }

    return total;
  }

  /**
   * Get all dashboard metrics at once
   */
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const [todayRevenue, monthRevenue, todayAppointments, weekAppointments, newPatients, outstanding] = await Promise.all([
      this.getTodayRevenue(),
      this.getMonthRevenue(),
      this.getTodayAppointments(),
      this.getWeekAppointments(),
      this.getNewPatientsThisWeek(),
      this.getOutstandingInvoices(),
    ]);

    return {
      todayRevenue,
      monthRevenue,
      todayAppointments,
      weekAppointments,
      newPatientsThisWeek: newPatients,
      outstandingInvoices: outstanding,
    };
  }
}
