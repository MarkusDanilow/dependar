import { describe, it, expect, beforeEach } from 'vitest';
import { AiTriageService } from './ai-triage.service';

describe('AiTriageService', () => {
  let aiService: AiTriageService;

  beforeEach(() => {
    aiService = new AiTriageService();
  });

  it('should analyze risk context using Ollama Mock', async () => {
    const context = await aiService.analyzeRiskContext('vuln-1');
    expect(context.adjustedSeverity).toBe('CRITICAL');
  });

  it('should extract entities via NLP', async () => {
    const entities = await aiService.extractEntities('I use React 18');
    expect(entities).toHaveLength(1);
    expect(entities[0].tech).toBe('mock-tech');
  });
});
