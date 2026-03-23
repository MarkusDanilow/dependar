import { FastifyInstance } from 'fastify';
import { HealthController } from './health.controller';

export async function healthRoutes(fastify: FastifyInstance) {
  const healthController = new HealthController();

  fastify.get('/', async (request, reply) => {
    return healthController.check(request, reply);
  });
}
