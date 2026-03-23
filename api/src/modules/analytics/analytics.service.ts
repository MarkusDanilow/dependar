import { VulnStateRepository, StatsDTO } from './vuln-state.repository';

export interface MetricsDTO {
  stats: StatsDTO;
  lastUpdated: string;
}

export class AnalyticsService {
  constructor(private readonly vulnRepo: VulnStateRepository) {}

  async getDashboardMetrics(): Promise<MetricsDTO> {
    const stats = await this.vulnRepo.getSecurityStats();
    return {
      stats,
      lastUpdated: new Date().toISOString()
    };
  }
}
