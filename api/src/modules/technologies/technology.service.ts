import { TechnologyRepository } from './technology.repository';
import { Technology } from '@prisma/client';

export class TechnologyService {
  constructor(private readonly techRepo: TechnologyRepository) {}

  async getAllTechnologies(): Promise<Technology[]> {
    return this.techRepo.findAll();
  }
}
