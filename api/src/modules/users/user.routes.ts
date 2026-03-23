import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { prisma } from '../../db';

export const userRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const userRepository = new UserRepository(prisma);
  const userService = new UserService(userRepository);
  const userController = new UserController(userService);

  fastify.get('/', {
    preValidation: [fastify.authenticate]
  }, async (request, reply) => {
    return userController.getUsers(request, reply);
  });
};
