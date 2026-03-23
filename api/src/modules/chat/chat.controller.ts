import { FastifyRequest, FastifyReply } from 'fastify';
import { BaseController } from '../../common/base.controller';
import { AiTriageService } from './ai-triage.service';
import { IngestionService } from '../ingest/ingestion.service';

export class AiChatController extends BaseController {
  constructor(
    private readonly aiTriageService: AiTriageService,
    private readonly ingestionService: IngestionService
  ) {
    super();
  }

  async postChatMessage(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { message } = request.body as any;
      
      if (!message) {
        return this.handleError(reply, { status: 400, message: 'Message text required' });
      }

      // Step 1: AI extracts tech entities from unstructured text
      const entities = await this.aiTriageService.extractEntities(message);
      
      // Step 2: Ingestion Service parses and inserts into Dependency Graph
      await this.ingestionService.processPayload('chat', entities);

      return this.sendSuccess(reply, {
        reply: `Processed! Extracted and ingested ${entities.length} entities.`,
        entities
      });
    } catch(err) {
      return this.handleError(reply, err);
    }
  }
}
