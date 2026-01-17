import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditLogService {
  constructor(private prisma: PrismaService) {}

  async logAction(
    userId: string,
    action: string,
    resource: string,
    resourceId?: string,
    summary?: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    return this.prisma.auditLog.create({
      data: {
        userId,
        action,
        resource,
        resourceId,
        summary,
        ipAddress,
        userAgent,
      },
    });
  }

  async logActionWithChanges(
    userId: string,
    action: string,
    resource: string,
    resourceId?: string,
    summary?: string,
    changes?: Array<{
      fieldName: string;
      oldValue?: string;
      newValue?: string;
    }>,
    ipAddress?: string,
    userAgent?: string,
  ) {
    return this.prisma.auditLog.create({
      data: {
        userId,
        action,
        resource,
        resourceId,
        summary,
        ipAddress,
        userAgent,
        changes: changes
          ? {
              create: changes,
            }
          : undefined,
      },
      include: { changes: true },
    });
  }

  async getAuditLogs(filters?: {
    userId?: string;
    action?: string;
    resource?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    return this.prisma.auditLog.findMany({
      where: {
        ...(filters?.userId && { userId: filters.userId }),
        ...(filters?.action && { action: filters.action }),
        ...(filters?.resource && { resource: filters.resource }),
        ...(filters?.startDate &&
          filters?.endDate && {
            createdAt: {
              gte: filters.startDate,
              lte: filters.endDate,
            },
          }),
      },
      include: { changes: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
