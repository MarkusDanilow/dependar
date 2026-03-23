import { FastifyRequest, FastifyReply } from 'fastify';
import { BaseController } from '../../common/base.controller';
import { UserService } from './user.service';

export class UserController extends BaseController {
  constructor(private readonly userService: UserService) {
    super();
  }

  async getUsers(request: FastifyRequest, reply: FastifyReply) {
    try {
      const users = await this.userService.getUsers();
      // Omit passwords from response manually or let a serializer handle it
      return this.sendSuccess(reply, users);
    } catch (error) {
       return this.handleError(reply, error);
    }
  }
}
