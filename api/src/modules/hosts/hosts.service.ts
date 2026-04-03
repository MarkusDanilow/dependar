import { FastifyInstance } from 'fastify';
import { prisma } from '../../db';

export class HostsService {
  constructor(private app: FastifyInstance) {}

  async getHosts() {
    return prisma.host.findMany({
      include: {
        containers: true,
        projectHosts: {
          include: {
            project: true
          }
        },
        hostTechs: {
          include: {
            technology: {
              include: {
                vulnStates: true
              }
            }
          }
        }
      },
      orderBy: { hostname: 'asc' }
    });
  }

  async createHost(data: { hostname: string }) {
    if (!data?.hostname) throw new Error("Hostname is required");
    return prisma.host.create({
      data: {
        hostname: data.hostname
      }
    });
  }

  async updateHost(id: string, data: { hostname: string }) {
    return prisma.host.update({
      where: { id },
      data
    });
  }

  async deleteHost(id: string) {
    return prisma.host.delete({
      where: { id }
    });
  }

  async addTechnology(hostId: string, technologyId: string) {
    // Check if already exists to prevent duplicate key errors cleanly
    const existing = await prisma.hostTech.findUnique({
      where: {
        hostId_technologyId: {
          hostId,
          technologyId
        }
      }
    });
    if (existing) return existing;

    return prisma.hostTech.create({
      data: {
        hostId,
        technologyId,
        source: 'manual'
      }
    });
  }

  async removeTechnology(hostId: string, technologyId: string) {
    return prisma.hostTech.delete({
      where: {
        hostId_technologyId: {
          hostId,
          technologyId
        }
      }
    });
  }

  async addProject(hostId: string, projectId: string) {
    const existing = await prisma.projectHost.findUnique({
      where: {
        projectId_hostId: { projectId, hostId }
      }
    });
    if (existing) return existing;

    return prisma.projectHost.create({
      data: {
        hostId,
        projectId,
        source: 'manual'
      }
    });
  }

  async removeProject(hostId: string, projectId: string) {
    return prisma.projectHost.delete({
      where: {
        projectId_hostId: { projectId, hostId }
      }
    });
  }
}
