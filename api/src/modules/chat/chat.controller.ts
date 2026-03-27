import { FastifyRequest, FastifyReply } from 'fastify';
import { BaseController } from '../../common/base.controller';
import { AiTriageService } from './ai-triage.service';
import { IngestionService } from '../ingest/ingestion.service';
import { AiChatService } from './chat.service';
import { prisma } from '../../db';

export class AiChatController extends BaseController {
  constructor(
    private readonly aiTriageService: AiTriageService,
    private readonly ingestionService: IngestionService,
    private readonly aiChatService: AiChatService
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

  async postChatStreaming(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { message, history } = request.body as any;
      
      if (!message) {
        return this.handleError(reply, { status: 400, message: 'Message text required' });
      }

      const systemContext = await this.aiChatService.getSystemContext(prisma);
      console.log(`[AiChatController] Got system context, length: ${systemContext.length}`);
      
      // We try to start the stream before sending headers to catch immediate connection errors
      const stream = this.aiChatService.streamChat(message, history || [], systemContext);

      console.log('[AiChatController] Starting stream response...');
      reply.raw.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Content-Type-Options': 'nosniff',
        'Access-Control-Allow-Origin': '*', // Extra safety for CORS in stream
      });

      // Send an initial character or comment to "flush" the connection for some proxies
      reply.raw.write(':\n\n'); 

      for await (const chunk of stream) {
        if (chunk) {
          reply.raw.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
        }
      }

      reply.raw.end();
    } catch (err: any) {
      // If we haven't sent headers yet, we can send a proper JSON error
      if (!reply.raw.headersSent) {
        return this.handleError(reply, err);
      }
      // If headers are already sent, we just end the stream
      reply.raw.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
      reply.raw.end();
    }
  }
}
