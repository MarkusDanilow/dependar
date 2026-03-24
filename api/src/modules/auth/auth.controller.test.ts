import { describe, it, expect, vi, beforeAll } from 'vitest';
import { FastifyInstance } from 'fastify';
import { setupTestServer } from '../../../test/utils/test-server';
import { prismaMock } from '../../../test/setup/prisma-mock';
import bcrypt from 'bcrypt';

describe('AuthController Integration', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await setupTestServer();
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login and return token', async () => {
      const passwordHash = await bcrypt.hash('password123', 10);
      (prismaMock.user.findUnique as any).mockResolvedValue({
        id: '1', email: 'dev@local', passwordHash, role: 'ADMIN', createdAt: new Date()
      });

      const res = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/login',
        payload: { email: 'dev@local', password: 'password123' }
      });

      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res.payload).data.token).toBeTypeOf('string'); // JWT Token
    });

    it('should fail with 401 on wrong password', async () => {
      const passwordHash = await bcrypt.hash('password123', 10);
      (prismaMock.user.findUnique as any).mockResolvedValue({
        id: '1', email: 'dev@local', passwordHash, role: 'ADMIN', createdAt: new Date()
      });

      const res = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/login',
        payload: { email: 'dev@local', password: 'wrong' }
      });

      expect(res.statusCode).toBe(401); 
    });
  });
});
