import { describe, it, expect } from 'vitest';
import { SettingsService } from './settings.service';

describe('SettingsService', () => {
  it('should return global settings', async () => {
    const service = new SettingsService();
    const settings = await service.getGlobalSettings();
    
    expect(settings.version).toBe('1.0.0');
    expect(settings.features).toContain('GRAPH');
  });
});
