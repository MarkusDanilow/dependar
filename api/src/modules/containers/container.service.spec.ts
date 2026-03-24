import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ContainerService } from './container.service';
import { ContainerRepository } from './container.repository';
import { prismaMock } from '../../../test/setup/prisma-mock';

describe('ContainerService', () => {
  let containerService: ContainerService;
  let containerRepo: ContainerRepository;

  beforeEach(() => {
    containerRepo = new ContainerRepository(prismaMock as any);
    containerService = new ContainerService(containerRepo);
  });

  it('should return all containers', async () => {
    const mockContainers = [{ id: '1', hostId: 'h1', containerName: 'frontend' }];
    vi.spyOn(containerRepo, 'findAll').mockResolvedValue(mockContainers);
    
    const containers = await containerService.getProjectsAndContainers();
    
    expect(containers).toEqual(mockContainers);
  });
});
