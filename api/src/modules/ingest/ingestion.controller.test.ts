import { describe, it, expect, beforeAll } from 'vitest';
import { FastifyInstance } from 'fastify';
import { setupTestServer } from '../../../test/utils/test-server';
import { prismaMock } from '../../../test/setup/prisma-mock';

describe('IngestionController Integration', () => {
  let app: FastifyInstance;
  let token: string;

  beforeAll(async () => {
    app = await setupTestServer();
    token = app.jwt.sign({ id: '1' });
  });

  it('POST /api/v1/ingest/generic', async () => {
    prismaMock.technology.findMany.mockResolvedValue([]);
    prismaMock.technology.create.mockResolvedValue({ id: '1', name: 'react', version: '18' });

    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/ingest/generic',
      headers: { authorization: `Bearer ${token}` },
      payload: [{ name: 'react', version: '18', source: 'test' }]
    });

    expect(res.statusCode).toBe(200);
  });
});
