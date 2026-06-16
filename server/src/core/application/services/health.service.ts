import { Injectable } from '@nestjs/common';

import { MESSAGE } from '@/common/constants/message.constant';
import { STATUS } from '@/common/constants/status.constant';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';

import {
  HealthDbResponse,
  HealthResponse,
  HelloResponse,
} from '../dto/responses';

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  getHello(): HelloResponse {
    return {
      status: STATUS.OK,
      message: MESSAGE.GREATINGS,
    };
  }

  getHealth(): HealthResponse {
    return {
      status: STATUS.OK,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }

  async getHealthDb(): Promise<HealthDbResponse> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: STATUS.OK,
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        database: 'connected',
      };
    } catch (e) {
      return {
        status: STATUS.ERROR,
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: e,
      };
    }
  }
}
