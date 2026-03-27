import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { prisma } from '../../db';

export const userRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const userRepository = new UserRepository(prisma);
  const userService = new UserService(userRepository);
  const userController = new UserController(userService);

  fastify.get('/', { preValidation: [fastify.authenticate] }, (req, reply) =>
    userController.getUsers(req, reply)
  );

  fastify.get('/:id', { preValidation: [fastify.authenticate] }, (req: any, reply) =>
    userController.getUserById(req, reply)
  );

  fastify.post('/', { preValidation: [fastify.authenticate] }, (req: any, reply) =>
    userController.createUser(req, reply)
  );

  fastify.put('/:id', { preValidation: [fastify.authenticate] }, (req: any, reply) =>
    userController.updateUser(req, reply)
  );

  fastify.delete('/:id', { preValidation: [fastify.authenticate] }, (req: any, reply) =>
    userController.deleteUser(req, reply)
  );
};
