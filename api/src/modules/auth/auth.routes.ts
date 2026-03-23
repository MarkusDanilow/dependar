import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from '../users/user.repository';
import { prisma } from '../../db';

export const authRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // Dependency Injection setup
  const userRepository = new UserRepository(prisma);
  const authService = new AuthService(userRepository, fastify);
  const authController = new AuthController(authService);

  // Routes
  fastify.post('/login', async (request, reply) => {
    return authController.postLogin(request, reply);
  });

  // Protected route
  fastify.get('/me', {
    preValidation: [fastify.authenticate] // We'll attach this decorator in app.ts
  }, async (request, reply) => {
    return authController.getMe(request, reply);
  });
};
