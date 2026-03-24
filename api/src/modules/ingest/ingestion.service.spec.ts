import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IngestionService } from './ingestion.service';
import { ITechnologyRepository } from '../../common/interfaces';

describe('IngestionService', () => {
  let ingestionService: IngestionService;
  let techRepoMock: ITechnologyRepository;

  beforeEach(() => {
    techRepoMock = {
      create: vi.fn(),
      findById: vi.fn(),
      findAll: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findBySemVer: vi.fn(),
    };
    ingestionService = new IngestionService(techRepoMock);
  });

  it('should process payload without crashing (stub)', async () => {
    const payload = [{ name: 'react', version: '18', source: 'npm' }];
    await expect(ingestionService.processPayload('generic', payload)).resolves.toBeUndefined();
  });
});
