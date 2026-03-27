import { UserRepository } from '../users/user.repository';
import { AuthUtils } from '../../common/auth/auth.utils';
import { FastifyInstance } from 'fastify';

export class AuthService {
  constructor(private readonly userRepo: UserRepository, private readonly fastify: FastifyInstance) {}

  async login(email: string, passwordPlain: string): Promise<{ token: string; user: any } | null> {
    const user = await this.userRepo.findByEmail(email);
    
    if (!user) {
      return null;
    }

    const isValid = await AuthUtils.comparePassword(passwordPlain, user.passwordHash);
    if (!isValid) {
      return null;
    }

    // Generate JWT
    const payload = { id: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName };
    const token = this.fastify.jwt.sign(payload);

    return { token, user: { id: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName } };
  }

  async validateUser(userId: string) {
     return this.userRepo.findById(userId);
  }
}
