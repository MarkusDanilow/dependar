import fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import cors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';

// Routes
import { authRoutes } from './modules/auth/auth.routes';
import { userRoutes } from './modules/users/user.routes';
import { technologyRoutes } from './modules/technologies/technology.routes';
import { containerRoutes } from './modules/containers/container.routes';
import { analyticsRoutes } from './modules/analytics/analytics.routes';
import { settingsRoutes } from './modules/settings/settings.routes';
import { ingestionRoutes } from './modules/ingest/ingestion.routes';
import { graphRoutes } from './modules/graph/graph.routes';
import { chatRoutes } from './modules/chat/chat.routes';
import { projectRoutes } from './modules/projects/project.routes';
import { hostRoutes } from './modules/hosts/hosts.routes';
import { healthRoutes } from './health/health.routes';
import { apiKeyRoutes } from './modules/apikeys/apikeys.routes';
import { sourcesRoutes } from './modules/sources/sources.routes';

// Jobs and Repos
import { CveSyncJob } from './jobs/cve-sync.job';
import { TechnologyRepository } from './modules/technologies/technology.repository';
import { prisma } from './db';

export function buildApp(): FastifyInstance {
  const app = fastify({
    logger: true,
  });

  // Plugins
  app.register(cors, { origin: true });
  
  // JWT Configuration
  app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || 'super-secret-fallback-key'
  });

  // Custom Decorator for Authentication
  app.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  // Custom Decorator for verifyApiKey
  app.decorate('verifyApiKey', async (request: FastifyRequest, reply: FastifyReply) => {
    const apiKeyHeader = request.headers['x-api-key'];

    if (!apiKeyHeader || typeof apiKeyHeader !== 'string') {
      return reply.status(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Missing or invalid X-API-Key header'
      });
    }

    const { createHash } = require('crypto');
    const keyHash = createHash('sha256').update(apiKeyHeader).digest('hex');

    const apiKey = await prisma.apiKey.findUnique({
      where: { keyHash }
    });

    if (!apiKey) {
      return reply.status(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid API Key'
      });
    }

    // Update lastUsedAt in background
    prisma.apiKey.update({
      where: { id: apiKey.id },
      data: { lastUsedAt: new Date() }
    }).catch(console.error);

    // Attach user information to request
    (request as any).apiKeyUserId = apiKey.userId;
  });

  // Custom Decorator for Agent Authentication (API Key)
  app.decorate('authenticateAgent', async (request: FastifyRequest, reply: FastifyReply) => {
    const apiKey = request.headers['x-api-key'];
    const validKey = process.env.WORKER_API_KEY;

    if (!apiKey || apiKey !== validKey) {
      reply.status(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid or missing API Key'
      });
    }
  });

  // Register Domain Routes
  app.register(healthRoutes, { prefix: '/api/v1/health' });
  app.register(authRoutes, { prefix: '/api/v1/auth' });
  app.register(userRoutes, { prefix: '/api/v1/users' });
  app.register(technologyRoutes, { prefix: '/api/v1/technologies' });
  app.register(containerRoutes, { prefix: '/api/v1/containers' });
  app.register(analyticsRoutes, { prefix: '/api/v1/analytics' });
  app.register(settingsRoutes, { prefix: '/api/v1/settings' });
  app.register(ingestionRoutes, { prefix: '/api/v1/ingest' });
  app.register(graphRoutes, { prefix: '/api/v1/graph' });
  app.register(chatRoutes, { prefix: '/api/v1/chat' });
  app.register(projectRoutes, { prefix: '/api/v1/projects' });
  app.register(hostRoutes, { prefix: '/api/v1/hosts' });
  app.register(apiKeyRoutes, { prefix: '/api/v1/apikeys' });
  app.register(sourcesRoutes, { prefix: '/api/v1/scan-sources' });

  // Start Cron Jobs
  const techRepo = new TechnologyRepository(prisma);
  const cveSyncJob = new CveSyncJob(techRepo);
  cveSyncJob.start();

  return app;
}
