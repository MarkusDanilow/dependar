import { FastifyRequest, FastifyReply } from 'fastify';
import { BaseController } from '../../common/base.controller';
import { UserService } from './user.service';

export class UserController extends BaseController {
  constructor(private readonly userService: UserService) {
    super();
  }

  async getUsers(request: FastifyRequest, reply: FastifyReply) {
    try {
      return this.sendSuccess(reply, await this.userService.getUsers());
    } catch (error) {
      return this.handleError(reply, error);
    }
  }

  async getUserById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const user = await this.userService.getUserById(request.params.id);
      if (!user) return reply.code(404).send({ message: 'User not found' });
      return this.sendSuccess(reply, user);
    } catch (error) {
      return this.handleError(reply, error);
    }
  }

  async createUser(request: FastifyRequest<{ Body: { email: string; password: string; role?: 'ADMIN' | 'VIEWER'; firstName?: string; lastName?: string } }>, reply: FastifyReply) {
    try {
      const user = await this.userService.createUser(request.body);
      return reply.code(201).send({ success: true, data: user });
    } catch (error) {
      return this.handleError(reply, error);
    }
  }

  async updateUser(request: FastifyRequest<{ Params: { id: string }; Body: any }>, reply: FastifyReply) {
    try {
      const user = await this.userService.updateUser(request.params.id, request.body);
      return this.sendSuccess(reply, user);
    } catch (error) {
      return this.handleError(reply, error);
    }
  }

  async deleteUser(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const user = await this.userService.deleteUser(request.params.id);
      return this.sendSuccess(reply, user);
    } catch (error) {
      return this.handleError(reply, error);
    }
  }
}
