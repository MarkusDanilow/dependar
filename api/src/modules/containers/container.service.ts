import { ContainerRepository } from './container.repository';
import { Container } from '@prisma/client';

export class ContainerService {
  constructor(private readonly containerRepo: ContainerRepository) {}

  async getProjectsAndContainers(): Promise<Container[]> {
    return this.containerRepo.findAll();
  }
}
