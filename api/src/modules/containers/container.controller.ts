import { FastifyRequest, FastifyReply } from 'fastify';
import { BaseController } from '../../common/base.controller';
import { ContainerService } from './container.service';

export class ContainerController extends BaseController {
  constructor(private readonly containerService: ContainerService) {
    super();
  }

  async getContainers(request: FastifyRequest, reply: FastifyReply) {
    try {
      const containers = await this.containerService.getProjectsAndContainers();
      return this.sendSuccess(reply, containers);
    } catch (error) {
      return this.handleError(reply, error);
    }
  }
}
