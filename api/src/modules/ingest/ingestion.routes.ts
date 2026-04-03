import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';
import { TechnologyRepository } from '../technologies/technology.repository';
import { prisma } from '../../db';

export const ingestionRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const techRepo = new TechnologyRepository(prisma);
  const ingestionService = new IngestionService(prisma);
  const ingestionController = new IngestionController(ingestionService);

  // Protected route for official agents
  fastify.post('/agent', {
    preValidation: [fastify.authenticateAgent]
  }, async (request, reply) => {
    return ingestionController.postAgentData(request, reply);
  });

  // Helper for flexible auth (API Key OR JWT)
  const authFlexible = async (request: any, reply: any) => {
    try {
      if (request.headers['x-api-key']) {
        await (fastify as any).verifyApiKey(request, reply);
      } else {
        await (fastify as any).authenticate(request, reply);
      }
    } catch (err) {
      // reply is already sent by the decorators if it fails
    }
  };

  fastify.post('/sbom', { preHandler: authFlexible }, async (request, reply) => {
    return ingestionController.postSbomData(request, reply);
  });

  fastify.post('/host-software', { preHandler: authFlexible }, async (request, reply) => {
    return ingestionController.postHostData(request, reply);
  });
};
