import { PrismaClient } from '@prisma/client';
import { Ollama } from 'ollama';

export class AiChatService {
  private readonly model = process.env.OLLAMA_MODEL || 'llama3';
  private readonly ollama = new Ollama({ host: process.env.OLLAMA_ENDPOINT || 'http://localhost:11434' });

  async getSystemContext(prisma: PrismaClient): Promise<string> {
    const projects = await prisma.project.findMany({
      include: {
        containers: {
          include: {
            techs: {
              include: {
                technology: true
              }
            }
          }
        }
      }
    });

    const openVulnerabilities = await prisma.vulnState.findMany({
      where: { status: 'OPEN' },
      include: {
        vulnerability: true,
        project: true,
        technology: true,
      },
    });

    let context = "System-Architektur (Hierarchisch):\n";

    for (const project of projects) {
      context += `\nProjekt: ${project.name}\n`;
      
      if (project.containers.length === 0) {
        context += " (Keine Container)\n";
        continue;
      }

      for (const container of project.containers) {
        context += `  Container: ${container.containerName}\n`;
        
        const techDetails = container.techs.map(ct => 
          `${ct.technology.name} (${ct.technology.version || 'v?'})`
        ).join(', ');

        context += `  Technologien: ${techDetails || 'Keine erfassten Technologien'}\n`;
      }
    }

    context += "\nOffene Schwachstellen:\n";

    const vulnDetails = openVulnerabilities.map((vs) => {
      const projName = vs.project?.name || 'Infrastruktur-weit';
      const techName = vs.technology?.name || 'Unbekannte Technologie';
      const techVer = vs.technology?.version || '';
      const cveId = vs.vulnerability?.id || 'Keine CVE';
      const severity = vs.vulnerability?.baseSeverity || 'UNKNOWN';

      return `- Das Projekt ${projName} nutzt die Technologie ${techName} (${techVer}), welche die Schwachstelle ${cveId} (Severity: ${severity}) hat.`;
    });

    context += vulnDetails.length > 0 ? vulnDetails.join('\n') : "Keine offenen Schwachstellen bekannt.";

    return context;
  }

  async *streamChat(message: string, history: any[], systemContext: string) {
    try {
      console.log(`[AiChatService] Starting stream for model: ${this.model} at ${process.env.OLLAMA_ENDPOINT}`);
      const response = await this.ollama.chat({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: `Du bist der Dependar Copilot, ein Security & Architekturexperte für diese Infrastruktur. 
Antworte kurz und präzise auf Deutsch basierend auf den bereitgestellten hierarchischen System-Architektur-Daten. 
Die Daten sind in Projekten, Containern und Technologien strukturiert. Nutze diese Struktur, um präzise Auskunft zu geben.
Hier ist der aktuelle Systemstatus:\n${systemContext}`,
          },
          ...history,
          { role: 'user', content: message },
        ],
        stream: true,
      });

      for await (const chunk of response) {
        yield chunk.message.content;
      }
    } catch (err) {
      console.error('[AiChatService] Error in streamChat:', err);
      throw err;
    }
  }
}
