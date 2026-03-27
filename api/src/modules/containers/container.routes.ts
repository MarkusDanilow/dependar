import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ContainerController } from './container.controller';
import { ContainerService } from './container.service';
import { ContainerRepository } from './container.repository';
import { prisma } from '../../db';

export const containerRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const containerRepository = new ContainerRepository(prisma);
  const containerService = new ContainerService(containerRepository);
  const containerController = new ContainerController(containerService);

  fastify.get('/', { preValidation: [fastify.authenticate] }, async (request, reply) => {
    return containerController.getContainers(request, reply);
  });

  fastify.post('/', { preValidation: [fastify.authenticate] }, async (request, reply) => {
    return containerController.createContainer(request, reply);
  });

  fastify.put<{ Params: { id: string } }>('/:id', { preValidation: [fastify.authenticate] }, async (request, reply) => {
    return containerController.updateContainer(request, reply);
  });

  fastify.delete<{ Params: { id: string } }>('/:id', { preValidation: [fastify.authenticate] }, async (request, reply) => {
    return containerController.deleteContainer(request, reply);
  });

  fastify.post<{ Params: { id: string } }>('/:id/technologies', { preValidation: [fastify.authenticate] }, async (request, reply) => {
    return containerController.addTechnology(request, reply);
  });

  fastify.delete<{ Params: { id: string, techId: string } }>('/:id/technologies/:techId', { preValidation: [fastify.authenticate] }, async (request, reply) => {
    return containerController.removeTechnology(request, reply);
  });
};
