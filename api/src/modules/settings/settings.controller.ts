import { FastifyRequest, FastifyReply } from 'fastify';
import { BaseController } from '../../common/base.controller';
import { SettingsService } from './settings.service';

export class SettingsController extends BaseController {
  constructor(private readonly settingsService: SettingsService) {
    super();
  }

  async getSettings(request: FastifyRequest, reply: FastifyReply) {
    try {
      const settings = await this.settingsService.getGlobalSettings();
      return this.sendSuccess(reply, settings);
    } catch(err) {
      return this.handleError(reply, err);
    }
  }
}
