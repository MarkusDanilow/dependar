import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { GraphController } from './graph.controller';
import { GraphService } from './graph.service';
import { TechnologyRepository } from '../technologies/technology.repository';
import { prisma } from '../../db';

export const graphRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const techRepo = new TechnologyRepository(prisma);
  const graphService = new GraphService(techRepo);
  const graphController = new GraphController(graphService);

  fastify.get('/full', {
    preValidation: [fastify.authenticate]
  }, async (request, reply) => {
    return graphController.getGlobalGraph(request, reply);
  });
};
