import { describe, it, expect, beforeAll } from 'vitest';
import { FastifyInstance } from 'fastify';
import { setupTestServer } from '../../../test/utils/test-server';
import { prismaMock } from '../../../test/setup/prisma-mock';

describe('AiChatController Integration', () => {
  let app: FastifyInstance;
  let token: string;

  beforeAll(async () => {
    app = await setupTestServer();
    token = app.jwt.sign({ id: '1' });
  });

  it('POST /api/v1/chat/message', async () => {
    prismaMock.technology.findMany.mockResolvedValue([]); 
    prismaMock.technology.create.mockResolvedValue({ id: 't1', name: 'mock', version: '1.0' });

    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/chat/message',
      headers: { authorization: `Bearer ${token}` },
      payload: { message: 'Hello AI' }
    });

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.payload).data.entities).toBeDefined();
  });
});
