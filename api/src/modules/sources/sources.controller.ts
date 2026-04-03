import { FastifyRequest, FastifyReply } from 'fastify';
import { SourcesService } from './sources.service';

export class SourcesController {
  private sourcesService: SourcesService;

  constructor(app: any) {
    this.sourcesService = new SourcesService(app);
  }

  async getSources(request: FastifyRequest, reply: FastifyReply) {
    const sources = await this.sourcesService.getSources();
    return reply.send(sources);
  }

  async createSource(request: FastifyRequest, reply: FastifyReply) {
    const data = request.body as any;
    const newSource = await this.sourcesService.createSource(data);
    return reply.status(201).send(newSource);
  }

  async updateSource(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const data = request.body as any;
    const updatedSource = await this.sourcesService.updateSource(id, data);
    return reply.send(updatedSource);
  }

  async deleteSource(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    await this.sourcesService.deleteSource(id);
    return reply.status(204).send();
  }
}
