import { FastifyRequest, FastifyReply } from 'fastify';
import { BaseController } from '../../common/base.controller';
import { ApiKeyService } from './apikeys.service';

export class ApiKeyController extends BaseController {
  constructor(private readonly apiKeyService: ApiKeyService) {
    super();
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = (request as any).user;
      const { name } = request.body as any;
      if (!name) throw new Error('Name is required');

      const result = await this.apiKeyService.createApiKey(user.id, name);
      return this.sendSuccess(reply, result);
    } catch (error) {
      return this.handleError(reply, error);
    }
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = (request as any).user;
      const keys = await this.apiKeyService.getApiKeys(user.id);
      return this.sendSuccess(reply, keys);
    } catch (error) {
      return this.handleError(reply, error);
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = (request as any).user;
      const { id } = request.params as any;
      await this.apiKeyService.deleteApiKey(user.id, id);
      return this.sendSuccess(reply, { status: 'deleted' });
    } catch (error) {
      return this.handleError(reply, error);
    }
  }
}
