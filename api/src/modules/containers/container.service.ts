import { ContainerRepository } from './container.repository';
import { Container, Prisma } from '@prisma/client';
import { prisma } from '../../db';

export class ContainerService {
  constructor(private readonly containerRepo: ContainerRepository) {}

  async getAllContainers() {
    return (this.containerRepo as any).prisma.container.findMany({
      include: {
        project: true,
        host: true,
        techs: {
          include: {
            technology: {
              include: {
                vulnStates: true
              }
            }
          }
        }
      }
    });
  }

  async createContainer(data: Prisma.ContainerCreateInput): Promise<Container> {
    return this.containerRepo.create(data);
  }

  async updateContainer(id: string, data: Prisma.ContainerUpdateInput): Promise<Container> {
    return this.containerRepo.update(id, data);
  }

  async deleteContainer(id: string): Promise<Container> {
    return this.containerRepo.delete(id);
  }

  async addTechnology(containerId: string, technologyId: string, source: string = 'manual') {
    // Check if already exists to prevent duplicate entries
    const existing = await prisma.containerTech.findFirst({
      where: { containerId, technologyId }
    });
    if (existing) return existing;

    return prisma.containerTech.create({
      data: { containerId, technologyId, source }
    });
  }

  async removeTechnology(containerId: string, technologyId: string) {
    const ct = await prisma.containerTech.findFirst({
      where: { containerId, technologyId }
    });
    if (!ct) throw new Error("Technology not linked to this container");
    
    // Vulnerabilities are now global to the technology, so we don't delete them here.
    return prisma.containerTech.delete({ where: { id: ct.id } });
  }
}
