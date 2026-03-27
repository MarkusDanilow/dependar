import { FastifyRequest, FastifyReply } from 'fastify';
import { BaseController } from '../../common/base.controller';
import { ContainerService } from './container.service';
import { Prisma } from '@prisma/client';

export class ContainerController extends BaseController {
  constructor(private readonly containerService: ContainerService) {
    super();
  }

  async getContainers(request: FastifyRequest, reply: FastifyReply) {
    try {
      const containers = await this.containerService.getAllContainers();
      return this.sendSuccess(reply, containers);
    } catch (error) {
      return this.handleError(reply, error);
    }
  }

  async createContainer(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = request.body as Prisma.ContainerCreateInput;
      const container = await this.containerService.createContainer(data);
      return this.sendSuccess(reply, container, 201);
    } catch (error) {
      return this.handleError(reply, error);
    }
  }

  async updateContainer(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const data = request.body as Prisma.ContainerUpdateInput;
      const container = await this.containerService.updateContainer(id, data);
      return this.sendSuccess(reply, container);
    } catch (error) {
      return this.handleError(reply, error);
    }
  }

  async deleteContainer(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const container = await this.containerService.deleteContainer(id);
      return this.sendSuccess(reply, container);
    } catch (error) {
      return this.handleError(reply, error);
    }
  }

  async addTechnology(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const { technologyId } = request.body as { technologyId: string };
      const ct = await this.containerService.addTechnology(id, technologyId);
      return this.sendSuccess(reply, ct, 201);
    } catch (error) {
      return this.handleError(reply, error);
    }
  }

  async removeTechnology(request: FastifyRequest<{ Params: { id: string, techId: string } }>, reply: FastifyReply) {
    try {
      const { id, techId } = request.params;
      await this.containerService.removeTechnology(id, techId);
      return this.sendSuccess(reply, { status: 'success' });
    } catch (error) {
      return this.handleError(reply, error);
    }
  }
}
