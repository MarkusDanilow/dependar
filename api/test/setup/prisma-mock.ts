import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'vitest-mock-extended';
import { vi, beforeEach } from 'vitest';
import { prisma } from '../../src/db';

vi.mock('../../src/db', () => ({
  __esModule: true,
  prisma: mockDeep<PrismaClient>(),
}));

export const prismaMock = prisma as any;

beforeEach(() => {
  mockReset(prismaMock);
});
