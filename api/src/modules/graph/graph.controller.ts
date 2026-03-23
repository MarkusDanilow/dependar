import { FastifyRequest, FastifyReply } from 'fastify';
import { BaseController } from '../../common/base.controller';
import { GraphService } from './graph.service';

export class GraphController extends BaseController {
  constructor(private readonly graphService: GraphService) {
    super();
  }

  async getGlobalGraph(request: FastifyRequest, reply: FastifyReply) {
    try {
      const graphData = await this.graphService.buildReactFlowGraph();
      return this.sendSuccess(reply, graphData);
    } catch (error) {
      return this.handleError(reply, error);
    }
  }
}
