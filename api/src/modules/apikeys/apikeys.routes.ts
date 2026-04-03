import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ApiKeyController } from './apikeys.controller';
import { ApiKeyService } from './apikeys.service';
import { prisma } from '../../db';

export const apiKeyRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const service = new ApiKeyService(prisma);
  const controller = new ApiKeyController(service);

  fastify.addHook('preValidation', (fastify as any).authenticate);

  fastify.get('/', async (request, reply) => {
    return controller.list(request, reply);
  });

  fastify.post('/', async (request, reply) => {
    return controller.create(request, reply);
  });

  fastify.delete('/:id', async (request, reply) => {
    return controller.delete(request, reply);
  });
};
