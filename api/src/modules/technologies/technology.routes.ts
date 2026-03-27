import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { TechnologyController } from './technology.controller';
import { TechnologyService } from './technology.service';
import { TechnologyRepository } from './technology.repository';
import { prisma } from '../../db';

export const technologyRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const techRepository = new TechnologyRepository(prisma);
  const techService = new TechnologyService(techRepository);
  const techController = new TechnologyController(techService);

  fastify.get('/', { preValidation: [fastify.authenticate] }, async (request, reply) => {
    return techController.getTechnologies(request, reply);
  });

  fastify.post('/', { preValidation: [fastify.authenticate] }, async (request, reply) => {
    return techController.createTechnology(request, reply);
  });

  fastify.put('/:id', { preValidation: [fastify.authenticate] }, async (request, reply) => {
    return techController.updateTechnology(request, reply);
  });

  fastify.delete('/:id', { preValidation: [fastify.authenticate] }, async (request, reply) => {
    return techController.deleteTechnology(request, reply);
  });
};
