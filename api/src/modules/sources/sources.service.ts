import { FastifyInstance } from 'fastify';
import { prisma } from '../../db';

export class SourcesService {
  constructor(private app: FastifyInstance) {}

  async getSources() {
    return prisma.securityScanSource.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async createSource(data: { name: string; url: string; type: string; isActive?: boolean }) {
    return prisma.securityScanSource.create({
      data: {
        name: data.name,
        url: data.url,
        type: data.type,
        isActive: data.isActive ?? true
      }
    });
  }

  async updateSource(id: string, data: Partial<{ name: string; url: string; type: string; isActive: boolean }>) {
    return prisma.securityScanSource.update({
      where: { id },
      data
    });
  }

  async deleteSource(id: string) {
    return prisma.securityScanSource.delete({
      where: { id }
    });
  }
}
