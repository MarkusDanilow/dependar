import { FastifyInstance } from 'fastify';
import { SourcesController } from './sources.controller';

export async function sourcesRoutes(app: FastifyInstance) {
  const controller = new SourcesController(app);

  app.addHook('onRequest', app.authenticate);

  app.get('/', controller.getSources.bind(controller));
  app.post('/', controller.createSource.bind(controller));
  app.put('/:id', controller.updateSource.bind(controller));
  app.delete('/:id', controller.deleteSource.bind(controller));
}
