export interface ParsedTechDTO {
  name: string;
  version: string;
  source: string;
}

export interface IIngestionStrategy {
  parsePayload(payload: any): ParsedTechDTO[];
}

export class AgentIngestionStrategy implements IIngestionStrategy {
  parsePayload(payload: any): ParsedTechDTO[] {
    // Parsing agent-specific payload
    return payload?.technologies || [];
  }
}

export class GenericApiIngestionStrategy implements IIngestionStrategy {
  parsePayload(payload: any): ParsedTechDTO[] {
    // Parsing generic SBOM or CI/CD payload
    return payload?.items || [];
  }
}
