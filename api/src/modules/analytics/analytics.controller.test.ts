import { describe, it, expect, beforeAll } from 'vitest';
import { FastifyInstance } from 'fastify';
import { setupTestServer } from '../../../test/utils/test-server';
import { prismaMock } from '../../../test/setup/prisma-mock';

describe('AnalyticsController Integration', () => {
  let app: FastifyInstance;
  let token: string;

  beforeAll(async () => {
    app = await setupTestServer();
    token = app.jwt.sign({ id: '1', email: 'test' });
  });

  it('GET /api/v1/analytics/metrics', async () => {
    (prismaMock.vulnState.count as any).mockResolvedValue(10); // Mock all counts to 10 for simplicity
    
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/analytics/metrics',
      headers: { authorization: `Bearer ${token}` }
    });

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.payload).data.stats.total).toBe(10);
  });
});
