import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
    } catch (error) {
      console.warn('⚠️  Database connection failed. Running in offline mode.');
      console.warn('Error:', (error as Error).message);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
