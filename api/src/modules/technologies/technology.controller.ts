import { FastifyRequest, FastifyReply } from 'fastify';
import { BaseController } from '../../common/base.controller';
import { TechnologyService } from './technology.service';
import { Prisma } from '@prisma/client';

export class TechnologyController extends BaseController {
  constructor(private readonly techService: TechnologyService) {
    super();
  }

  async getTechnologies(request: FastifyRequest, reply: FastifyReply) {
    try {
      const techs = await this.techService.getAllTechnologies();
      return this.sendSuccess(reply, techs);
    } catch (error) {
      return this.handleError(reply, error);
    }
  }

  async createTechnology(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = request.body as Prisma.TechnologyCreateInput;
      const tech = await this.techService.createTechnology(data);
      return this.sendSuccess(reply, tech, 201);
    } catch (error) {
      return this.handleError(reply, error);
    }
  }

  async updateTechnology(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const data = request.body as Prisma.TechnologyUpdateInput;
      const tech = await this.techService.updateTechnology(id, data);
      return this.sendSuccess(reply, tech);
    } catch (error) {
      return this.handleError(reply, error);
    }
  }

  async deleteTechnology(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const tech = await this.techService.deleteTechnology(id);
      return this.sendSuccess(reply, tech);
    } catch (error) {
      return this.handleError(reply, error);
    }
  }
}
