export interface SettingsDTO {
  version: string;
  environment: string;
  features: string[];
}

export class SettingsService {
  async getGlobalSettings(): Promise<SettingsDTO> {
    return {
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      features: ['GRAPH', 'CHAT', 'CVS_SYNC']
    };
  }
}
