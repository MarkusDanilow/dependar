import { FastifyRequest, FastifyReply } from 'fastify';
import { BaseController } from '../common/base.controller';
import { prisma } from '../db';

export class HealthController extends BaseController {
  async check(request: FastifyRequest, reply: FastifyReply) {
    const healthStatus: any = {
      api: 'up',
      timestamp: new Date().toISOString(),
      database: 'pending',
    };

    try {
      // Check database connection
      await prisma.$queryRaw`SELECT 1`;
      healthStatus.database = 'connected';
    } catch (_error) {
      // If DB fails, API is still considered "up"
      // We explicitly swallow the verbose Prisma error string for security & clean UX
      healthStatus.database = 'disconnected';
    }

    // Always return HTTP 200 indicating the API server is up
    return this.sendSuccess(reply, healthStatus);
  }
}
