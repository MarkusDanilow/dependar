import { FastifyInstance } from 'fastify';
import { HostsController } from './hosts.controller';

export async function hostRoutes(app: FastifyInstance) {
  const controller = new HostsController(app);

  app.addHook('onRequest', app.authenticate);

  app.get('/', controller.getHosts.bind(controller));
  app.post('/', controller.createHost.bind(controller));
  app.put('/:id', controller.updateHost.bind(controller));
  app.delete('/:id', controller.deleteHost.bind(controller));

  // Relations
  app.post('/:id/technologies', controller.addTechnology.bind(controller));
  app.delete('/:id/technologies/:techId', controller.removeTechnology.bind(controller));

  // Project Relations
  app.post('/:id/projects', controller.addProject.bind(controller));
  app.delete('/:id/projects/:projectId', controller.removeProject.bind(controller));
}
