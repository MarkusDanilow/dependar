import { describe, it, expect, beforeAll } from 'vitest';
import { FastifyInstance } from 'fastify';
import { setupTestServer } from '../../../test/utils/test-server';
import { prismaMock } from '../../../test/setup/prisma-mock';

describe('GraphController Integration', () => {
  let app: FastifyInstance;
  let token: string;

  beforeAll(async () => {
    app = await setupTestServer();
    token = app.jwt.sign({ id: '1' });
  });

  it('GET /api/v1/graph/full', async () => {
    prismaMock.technology.findMany.mockResolvedValue([
      { id: '1', name: 'node', version: '20' }
    ]);

    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/graph/full',
      headers: { authorization: `Bearer ${token}` }
    });

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.payload).data.nodes).toHaveLength(1);
  });
});
