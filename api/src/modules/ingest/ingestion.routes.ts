import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';
import { TechnologyRepository } from '../technologies/technology.repository';
import { prisma } from '../../db';

export const ingestionRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const techRepo = new TechnologyRepository(prisma);
  const ingestionService = new IngestionService(techRepo);
  const ingestionController = new IngestionController(ingestionService);

  // Protected route for official agents
  fastify.post('/agent', {
    preValidation: [fastify.authenticate]
  }, async (request, reply) => {
    return ingestionController.postAgentData(request, reply);
  });

  // Open / generically authenticated route
  fastify.post('/generic', async (request, reply) => {
    return ingestionController.postGenericData(request, reply);
  });
};
