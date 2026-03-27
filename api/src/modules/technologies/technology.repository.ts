import { BaseRepository } from '../../common/base.repository';
import { ITechnologyRepository } from '../../common/interfaces';
import { Technology, Prisma, PrismaClient } from '@prisma/client';

export class TechnologyRepository extends BaseRepository<Technology, Prisma.TechnologyCreateInput, Prisma.TechnologyUpdateInput, Prisma.TechnologyWhereInput> implements ITechnologyRepository {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async create(data: Prisma.TechnologyCreateInput): Promise<Technology> {
    return this.prisma.technology.create({ data });
  }

  async findById(id: string): Promise<Technology | null> {
    return this.prisma.technology.findUnique({ where: { id } });
  }

  async findOne(query: Prisma.TechnologyWhereInput): Promise<Technology | null> {
    return this.prisma.technology.findFirst({ where: query });
  }

  async findAll(query?: Prisma.TechnologyWhereInput): Promise<Technology[]> {
    return this.prisma.technology.findMany({ 
      where: query, 
      orderBy: { name: 'asc' },
      include: { vulnStates: true }
    });
  }

  async update(id: string, data: Prisma.TechnologyUpdateInput): Promise<Technology> {
    return this.prisma.technology.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Technology> {
    return this.prisma.technology.delete({ where: { id } });
  }

  async findBySemVer(name: string, versionRange: string): Promise<Technology[]> {
    return this.prisma.technology.findMany({
      where: { name, version: versionRange }, // Simplified for mock
      orderBy: { name: 'asc' }
    });
  }

  async findGlobalDependencies(techId: string): Promise<Technology[]> {
    const deps = await this.prisma.techDependency.findMany({
      where: { techId },
      include: { requiresTech: true }
    });
    return deps.map(d => d.requiresTech);
  }
}
