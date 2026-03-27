import { FastifyRequest, FastifyReply } from 'fastify';
import { BaseController } from '../../common/base.controller';
import { ProjectService } from './project.service';
import { Prisma } from '@prisma/client';

export class ProjectController extends BaseController {
  constructor(private readonly projectService: ProjectService) {
    super();
  }

  async getProjects(request: FastifyRequest, reply: FastifyReply) {
    try {
      const projects = await this.projectService.getAllProjects();
      return this.sendSuccess(reply, projects);
    } catch (error) {
      return this.handleError(reply, error);
    }
  }

  async createProject(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = request.body as Prisma.ProjectCreateInput;
      const project = await this.projectService.createProject(data);
      return this.sendSuccess(reply, project, 201);
    } catch (error) {
      return this.handleError(reply, error);
    }
  }

  async updateProject(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const data = request.body as Prisma.ProjectUpdateInput;
      const project = await this.projectService.updateProject(id, data);
      return this.sendSuccess(reply, project);
    } catch (error) {
      return this.handleError(reply, error);
    }
  }

  async deleteProject(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const project = await this.projectService.deleteProject(id);
      return this.sendSuccess(reply, project);
    } catch (error) {
      return this.handleError(reply, error);
    }
  }
}
