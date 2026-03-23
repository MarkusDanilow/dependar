import { FastifyReply } from 'fastify';

export abstract class BaseController {
  protected sendSuccess(reply: FastifyReply, data: any, statusCode: number = 200): void {
    reply.status(statusCode).send({
      success: true,
      data,
    });
  }

  protected handleError(reply: FastifyReply, error: Error | any): void {
    const statusCode = error.status || 500;
    
    reply.status(statusCode).send({
      success: false,
      message: error.message || 'Internal Server Error',
    });
  }
}
