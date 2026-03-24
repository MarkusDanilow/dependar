import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AnalyticsService } from './analytics.service';
import { VulnStateRepository } from './vuln-state.repository';
import { prismaMock } from '../../../test/setup/prisma-mock';

describe('AnalyticsService', () => {
  let analyticsService: AnalyticsService;
  let vulnRepo: VulnStateRepository;

  beforeEach(() => {
    vulnRepo = new VulnStateRepository(prismaMock as any);
    analyticsService = new AnalyticsService(vulnRepo);
  });

  it('should return metrics', async () => {
    vi.spyOn(vulnRepo, 'getSecurityStats').mockResolvedValue({ total: 10, open: 5, resolved: 5 });
    
    const metrics = await analyticsService.getDashboardMetrics();
    
    expect(metrics.stats.total).toBe(10);
    expect(metrics.lastUpdated).toBeDefined();
  });
});
