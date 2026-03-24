import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TechnologyService } from './technology.service';
import { TechnologyRepository } from './technology.repository';
import { prismaMock } from '../../../test/setup/prisma-mock';

describe('TechnologyService', () => {
  let techService: TechnologyService;
  let techRepo: TechnologyRepository;

  beforeEach(() => {
    techRepo = new TechnologyRepository(prismaMock as any);
    techService = new TechnologyService(techRepo);
  });

  it('should return all technologies', async () => {
    const mockTechs = [{ id: '1', name: 'react', version: '18' }];
    vi.spyOn(techRepo, 'findAll').mockResolvedValue(mockTechs);
    
    const techs = await techService.getAllTechnologies();
    
    expect(techs).toEqual(mockTechs);
  });
});
