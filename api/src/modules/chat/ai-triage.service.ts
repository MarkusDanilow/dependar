export class AiTriageService {
  private readonly ollamaEndpoint = process.env.OLLAMA_ENDPOINT || 'http://localhost:11434';

  async analyzeRiskContext(vulnStateId: string): Promise<any> {
    return { adjustedSeverity: 'CRITICAL', reason: 'Mocked AI Triage Response' };
  }

  async extractEntities(message: string): Promise<any[]> {
    console.log(`[AiTriageService] Requesting NLP entity extraction from: ${message}`);
    
    // Stub returning mocked entities parsed by Ollama models
    return [{ tech: 'mock-tech', version: '1.0', host: 'mock-host' }];
  }
}
