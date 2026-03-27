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

  async getVulnStates(request: FastifyRequest, reply: FastifyReply) {
    try {
      const states = await this.analyticsService.getAllVulnStates();
      return this.sendSuccess(reply, states);
    } catch (error) {
      return this.handleError(reply, error);
    }
  }

  async patchVulnState(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const { status } = request.body as { status: string };
      const updated = await this.analyticsService.updateVulnStatus(id, status);
      return this.sendSuccess(reply, updated);
    } catch (error) {
      return this.handleError(reply, error);
    }
  }
}
