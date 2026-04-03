import { PrismaClient } from '@prisma/client';
import { randomBytes, createHash } from 'crypto';

export class ApiKeyService {
  constructor(private readonly prisma: PrismaClient) {}

  async createApiKey(userId: string, name: string): Promise<{ keyPlaintext: string; apiKey: any }> {
    const keyPlaintext = randomBytes(32).toString('hex');
    const keyHash = createHash('sha256').update(keyPlaintext).digest('hex');

    const apiKey = await (this.prisma as any).apiKey.create({
      data: {
        keyHash,
        name,
        userId
      }
    });

    return { keyPlaintext, apiKey };
  }

  async getApiKeys(userId: string) {
    return (this.prisma as any).apiKey.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
          id: true,
          name: true,
          createdAt: true,
          lastUsedAt: true,
          expiresAt: true
      }
    });
  }

  async deleteApiKey(userId: string, keyId: string) {
    return (this.prisma as any).apiKey.deleteMany({
        where: { id: keyId, userId }
    });
  }
}
