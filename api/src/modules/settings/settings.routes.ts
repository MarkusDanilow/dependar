import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';

export const settingsRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const settingsService = new SettingsService();
  const settingsController = new SettingsController(settingsService);

  fastify.get('/', {
    preValidation: [fastify.authenticate]
  }, async (request, reply) => {
    return settingsController.getSettings(request, reply);
  });
};
