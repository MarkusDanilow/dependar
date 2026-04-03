import { FastifyRequest, FastifyReply } from 'fastify';
import { HostsService } from './hosts.service';

export class HostsController {
  private hostsService: HostsService;

  constructor(app: any) {
    this.hostsService = new HostsService(app);
  }

  async getHosts(request: FastifyRequest, reply: FastifyReply) {
    const hosts = await this.hostsService.getHosts();
    return reply.send(hosts);
  }

  async createHost(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = request.body as any;
      const newHost = await this.hostsService.createHost(data);
      return reply.status(201).send(newHost);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  }

  async updateHost(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const data = request.body as any;
    const updatedHost = await this.hostsService.updateHost(id, data);
    return reply.send(updatedHost);
  }

  async deleteHost(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    await this.hostsService.deleteHost(id);
    return reply.status(204).send();
  }

  async addTechnology(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const { technologyId } = request.body as { technologyId: string };
    if (!technologyId) {
      return reply.status(400).send({ error: 'technologyId is required' });
    }
    const result = await this.hostsService.addTechnology(id, technologyId);
    return reply.send(result);
  }

  async removeTechnology(request: FastifyRequest, reply: FastifyReply) {
    const { id, techId } = request.params as { id: string, techId: string };
    await this.hostsService.removeTechnology(id, techId);
    return reply.status(204).send();
  }

  async addProject(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const { projectId } = request.body as { projectId: string };
    if (!projectId) {
      return reply.status(400).send({ error: 'projectId is required' });
    }
    const result = await this.hostsService.addProject(id, projectId);
    return reply.send(result);
  }

  async removeProject(request: FastifyRequest, reply: FastifyReply) {
    const { id, projectId } = request.params as { id: string, projectId: string };
    await this.hostsService.removeProject(id, projectId);
    return reply.status(204).send();
  }
}
