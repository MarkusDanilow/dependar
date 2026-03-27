import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { AiChatController } from './chat.controller';
import { AiTriageService } from './ai-triage.service';
import { IngestionService } from '../ingest/ingestion.service';
import { AiChatService } from './chat.service';
import { TechnologyRepository } from '../technologies/technology.repository';
import { prisma } from '../../db';

export const chatRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const aiTriageService = new AiTriageService();
  const aiChatService = new AiChatService();
  const techRepo = new TechnologyRepository(prisma);
  const ingestionService = new IngestionService(techRepo);
  const chatController = new AiChatController(aiTriageService, ingestionService, aiChatService);

  fastify.post('/message', {
    preValidation: [fastify.authenticate]
  }, async (request, reply) => {
    return chatController.postChatMessage(request, reply);
  });

  fastify.post('/message/stream', {
    preValidation: [fastify.authenticate]
  }, async (request, reply) => {
    return chatController.postChatStreaming(request, reply);
  });
};
