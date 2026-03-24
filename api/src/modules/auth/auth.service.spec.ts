import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from './auth.service';
import { prismaMock } from '../../../test/setup/prisma-mock';
import { UserRepository } from '../users/user.repository';
import { AuthUtils } from '../../common/auth/auth.utils';
import { FastifyInstance } from 'fastify';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepo: UserRepository;
  let fastifyMock: FastifyInstance;

  beforeEach(() => {
    userRepo = new UserRepository(prismaMock as any);
    fastifyMock = { jwt: { sign: vi.fn().mockReturnValue('mock-jwt') } } as any;
    authService = new AuthService(userRepo, fastifyMock);
  });

  describe('login', () => {
    it('should return a JWT on valid credentials', async () => {
      const mockUser = { id: 'user-1', email: 'test@example.com', passwordHash: 'hashed', role: 'VIEWER' as any, createdAt: new Date() };

      vi.spyOn(userRepo, 'findByEmail').mockResolvedValue(mockUser);
      vi.spyOn(AuthUtils, 'comparePassword').mockResolvedValue(true);

      const result = await authService.login('test@example.com', 'password123');

      expect(result?.token).toBe('mock-jwt');
      expect(userRepo.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(fastifyMock.jwt.sign).toHaveBeenCalled();
    });

    it('should return null on invalid credentials', async () => {
      vi.spyOn(userRepo, 'findByEmail').mockResolvedValue(null);

      const result = await authService.login('wrong@example.com', 'pw');
      expect(result).toBeNull();
    });
  });
});
