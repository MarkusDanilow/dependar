import { describe, it, expect, beforeAll } from 'vitest';
import { FastifyInstance } from 'fastify';
import { setupTestServer } from '../../../test/utils/test-server';
import { prismaMock } from '../../../test/setup/prisma-mock';

describe('ContainerController Integration', () => {
  let app: FastifyInstance;
  let token: string;

  beforeAll(async () => {
    app = await setupTestServer();
    token = app.jwt.sign({ id: '1', email: 'dev@local' });
  });

  it('GET /api/v1/containers', async () => {
    (prismaMock.container.findMany as any).mockResolvedValue([
      { id: '1', containerName: 'backend', hostId: 'h1' }
    ]);

    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/containers',
      headers: { authorization: `Bearer ${token}` }
    });

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.payload).data).toHaveLength(1);
  });
});
