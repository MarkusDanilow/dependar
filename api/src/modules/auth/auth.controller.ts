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
      const decodedUser = request.user as any;
      const user = await this.authService.validateUser(decodedUser.id);
      
      if (!user) {
        return this.handleError(reply, { status: 404, message: 'User not found' });
      }

      const { passwordHash, ...rest } = user as any;
      return this.sendSuccess(reply, { user: rest });
    } catch (error) {
       return this.handleError(reply, error);
    }
  }
}
