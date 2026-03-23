import { FastifyRequest, FastifyReply } from 'fastify';
import { BaseController } from '../../common/base.controller';
import { AuthService } from './auth.service';

export class AuthController extends BaseController {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async postLogin(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { email, password } = request.body as any;

      if (!email || !password) {
        return this.handleError(reply, { status: 400, message: 'Email and password required' });
      }

      const result = await this.authService.login(email, password);

      if (!result) {
        return this.handleError(reply, { status: 401, message: 'Invalid credentials' });
      }

      return this.sendSuccess(reply, result);
    } catch (error) {
      return this.handleError(reply, error);
    }
  }

  async getMe(request: FastifyRequest, reply: FastifyReply) {
    try {
      // The user object is attached to request.user by fastify-jwt during authentication
      return this.sendSuccess(reply, { user: request.user });
    } catch (error) {
       return this.handleError(reply, error);
    }
  }
}
