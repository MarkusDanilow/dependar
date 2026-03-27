import { BaseRepository } from '../../common/base.repository';
import { Container, Prisma, PrismaClient } from '@prisma/client';

export class ContainerRepository extends BaseRepository<Container, Prisma.ContainerCreateInput, Prisma.ContainerUpdateInput, Prisma.ContainerWhereInput> {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async create(data: Prisma.ContainerCreateInput): Promise<Container> {
    return this.prisma.container.create({ data });
  }

  async findById(id: string): Promise<Container | null> {
    return this.prisma.container.findUnique({ where: { id } });
  }

  async findOne(query: Prisma.ContainerWhereInput): Promise<Container | null> {
    return this.prisma.container.findFirst({ where: query });
  }

  async findAll(query?: Prisma.ContainerWhereInput): Promise<Container[]> {
    return this.prisma.container.findMany({ where: query, orderBy: { containerName: 'asc' } });
  }

  async update(id: string, data: Prisma.ContainerUpdateInput): Promise<Container> {
    return this.prisma.container.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Container> {
    return this.prisma.container.delete({ where: { id } });
  }

  async findByHost(hostId: string): Promise<Container[]> {
    return this.prisma.container.findMany({ where: { hostId }, orderBy: { containerName: 'asc' } });
  }
}
