import { FastifyRequest, FastifyReply } from 'fastify';
import { BaseController } from '../../common/base.controller';
import { IngestionService } from './ingestion.service';

export class IngestionController extends BaseController {
  constructor(private readonly ingestionService: IngestionService) {
    super();
  }

  async postAgentData(request: FastifyRequest, reply: FastifyReply) {
    try {
      await this.ingestionService.processPayload('agent', request.body);
      return this.sendSuccess(reply, { status: 'processed_agent_payload' });
    } catch (error) {
      return this.handleError(reply, error);
    }
  }

  async postGenericData(request: FastifyRequest, reply: FastifyReply) {
    try {
      await this.ingestionService.processPayload('generic', request.body);
      return this.sendSuccess(reply, { status: 'processed_generic_payload' });
    } catch (error) {
      return this.handleError(reply, error);
    }
  }
}
