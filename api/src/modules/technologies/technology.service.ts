import { TechnologyRepository } from './technology.repository';
import { Technology, Prisma } from '@prisma/client';

export class TechnologyService {
  constructor(private readonly techRepo: TechnologyRepository) {}

  async getAllTechnologies(): Promise<Technology[]> {
    return this.techRepo.findAll();
  }

  async createTechnology(data: Prisma.TechnologyCreateInput): Promise<Technology> {
    return this.techRepo.create(data);
  }

  async updateTechnology(id: string, data: Prisma.TechnologyUpdateInput): Promise<Technology> {
    return this.techRepo.update(id, data);
  }

  async deleteTechnology(id: string): Promise<Technology> {
    return this.techRepo.delete(id);
  }
}
