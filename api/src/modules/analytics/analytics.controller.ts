import { FastifyRequest, FastifyReply } from 'fastify';
import { BaseController } from '../../common/base.controller';
import { AnalyticsService } from './analytics.service';

export class AnalyticsController extends BaseController {
  constructor(private readonly analyticsService: AnalyticsService) {
    super();
  }

  async getMetrics(request: FastifyRequest, reply: FastifyReply) {
    try {
      const metrics = await this.analyticsService.getDashboardMetrics();
      return this.sendSuccess(reply, metrics);
    } catch (error) {
      return this.handleError(reply, error);
    }
  }
}
