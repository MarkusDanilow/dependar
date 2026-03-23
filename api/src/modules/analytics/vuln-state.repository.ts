import { BaseRepository } from '../../common/base.repository';
import { VulnState, Prisma, PrismaClient } from '@prisma/client';

export interface StatsDTO {
  total: number;
  open: number;
  resolved: number;
}

export class VulnStateRepository extends BaseRepository<VulnState, Prisma.VulnStateCreateInput, Prisma.VulnStateUpdateInput, Prisma.VulnStateWhereInput> {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async create(data: Prisma.VulnStateCreateInput): Promise<VulnState> {
    return this.prisma.vulnState.create({ data });
  }

  async findById(id: string): Promise<VulnState | null> {
    return this.prisma.vulnState.findUnique({ where: { id } });
  }

  async findOne(query: Prisma.VulnStateWhereInput): Promise<VulnState | null> {
    return this.prisma.vulnState.findFirst({ where: query });
  }

  async findAll(query?: Prisma.VulnStateWhereInput): Promise<VulnState[]> {
    return this.prisma.vulnState.findMany({ where: query });
  }

  async update(id: string, data: Prisma.VulnStateUpdateInput): Promise<VulnState> {
    return this.prisma.vulnState.update({ where: { id }, data });
  }

  async delete(id: string): Promise<VulnState> {
    return this.prisma.vulnState.delete({ where: { id } });
  }

  async getSecurityStats(): Promise<StatsDTO> {
    const all = await this.prisma.vulnState.count();
    const open = await this.prisma.vulnState.count({ where: { status: 'OPEN' } });
    const resolved = await this.prisma.vulnState.count({ where: { status: 'RESOLVED' } });
    
    return { total: all, open, resolved };
  }
}
