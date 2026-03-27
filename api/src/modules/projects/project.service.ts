import { PrismaClient, Prisma, Project } from '@prisma/client';
import { prisma } from '../../db';

export class ProjectService {
  async getAllProjects() {
    return prisma.project.findMany({
      orderBy: { name: 'asc' },
      include: {
        containers: {
          orderBy: { containerName: 'asc' },
          include: {
            techs: {
              orderBy: { technology: { name: 'asc' } },
              include: {
                technology: {
                  include: {
                    vulnStates: true
                  }
                }
              }
            }
          }
        }
      }
    });
  }

  async getProjectById(id: string) {
    return prisma.project.findUnique({
      where: { id },
      include: {
        containers: {
          orderBy: { containerName: 'asc' },
          include: {
            techs: {
              orderBy: { technology: { name: 'asc' } },
              include: {
                technology: {
                  include: {
                    vulnStates: true
                  }
                }
              }
            }
          }
        }
      }
    });
  }

  async createProject(data: Prisma.ProjectCreateInput): Promise<Project> {
    return prisma.project.create({ data });
  }

  async updateProject(id: string, data: Prisma.ProjectUpdateInput): Promise<Project> {
    return prisma.project.update({ where: { id }, data });
  }

  async deleteProject(id: string): Promise<Project> {
    return prisma.project.delete({ where: { id } });
  }
}
