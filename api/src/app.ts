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
import { healthRoutes } from './health/health.routes';

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

  // Start Cron Jobs
  const techRepo = new TechnologyRepository(prisma);
  const cveSyncJob = new CveSyncJob(techRepo);
  cveSyncJob.start();

  return app;
}
