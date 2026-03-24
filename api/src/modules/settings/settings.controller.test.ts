import { describe, it, expect, beforeAll } from 'vitest';
import { FastifyInstance } from 'fastify';
import { setupTestServer } from '../../../test/utils/test-server';

describe('SettingsController Integration', () => {
  let app: FastifyInstance;
  let token: string;

  beforeAll(async () => {
    app = await setupTestServer();
    token = app.jwt.sign({ id: '1', email: 'test' });
  });

  it('GET /api/v1/settings', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/settings',
      headers: { authorization: `Bearer ${token}` }
    });

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.payload).data.version).toBe('1.0.0');
  });
});
