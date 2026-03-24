import { describe, it, expect, beforeAll } from 'vitest';
import { FastifyInstance } from 'fastify';
import { setupTestServer } from '../../../test/utils/test-server';
import { prismaMock } from '../../../test/setup/prisma-mock';

describe('UserController Integration', () => {
  let app: FastifyInstance;
  let token: string;

  beforeAll(async () => {
    app = await setupTestServer();
    token = app.jwt.sign({ id: '1', email: 'dev@local' });
  });

  it('GET /api/v1/users', async () => {
    (prismaMock.user.findMany as any).mockResolvedValue([
      { id: '1', email: 'dev@local', passwordHash: 'hash', role: 'ADMIN', createdAt: new Date() }
    ]);

    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/users',
      headers: { authorization: `Bearer ${token}` }
    });

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.payload).data).toHaveLength(1);
    expect(JSON.parse(res.payload).data[0].email).toBe('dev@local');
  });
});
