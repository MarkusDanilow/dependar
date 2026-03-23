import { FastifyRequest, FastifyReply } from 'fastify';
import { BaseController } from '../../common/base.controller';
import { TechnologyService } from './technology.service';

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
}
