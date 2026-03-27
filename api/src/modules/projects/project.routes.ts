import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

export const projectRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const projectService = new ProjectService();
  const projectController = new ProjectController(projectService);

  fastify.get('/', { preValidation: [fastify.authenticate] }, async (request, reply) => {
    return projectController.getProjects(request, reply);
  });

  fastify.post('/', { preValidation: [fastify.authenticate] }, async (request, reply) => {
    return projectController.createProject(request, reply);
  });

  fastify.put<{ Params: { id: string } }>('/:id', { preValidation: [fastify.authenticate] }, async (request, reply) => {
    return projectController.updateProject(request, reply);
  });

  fastify.delete<{ Params: { id: string } }>('/:id', { preValidation: [fastify.authenticate] }, async (request, reply) => {
    return projectController.deleteProject(request, reply);
  });
};
