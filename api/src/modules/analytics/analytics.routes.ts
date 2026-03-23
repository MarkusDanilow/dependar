import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { VulnStateRepository } from './vuln-state.repository';
import { prisma } from '../../db';

export const analyticsRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const vulnRepo = new VulnStateRepository(prisma);
  const analyticsService = new AnalyticsService(vulnRepo);
  const analyticsController = new AnalyticsController(analyticsService);

  fastify.get('/metrics', {
    preValidation: [fastify.authenticate]
  }, async (request, reply) => {
    return analyticsController.getMetrics(request, reply);
  });
};
