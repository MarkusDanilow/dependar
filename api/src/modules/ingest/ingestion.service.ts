import { PrismaClient } from '@prisma/client';

export class IngestionService {
  constructor(private readonly prisma: PrismaClient) {}

  async processPayload(source: string, payload: any): Promise<void> {
    console.log(`[IngestionService] Processing payload from source: ${source}`);
    
    const { host: hostName, containers } = payload;
    if (!hostName || !containers) {
      throw new Error('Invalid payload: Missing host or containers');
    }

    // 1. Transaction to ensure atomicity
    await this.prisma.$transaction(async (tx) => {
      // 2. Upsert Host
      const host = await tx.host.upsert({
        where: { id: (await tx.host.findFirst({ where: { hostname: hostName } }))?.id || '00000000-0000-0000-0000-000000000000' },
        update: {}, // Keine Änderungen am Host nötig, falls er schon da ist
        create: { hostname: hostName },
      });

      for (const containerData of containers) {
        // 3. Find or Create Project for this container
        const projectName = containerData.project || 'Auto-Scanned';
        const project = await tx.project.upsert({
          where: { name: projectName },
          update: {},
          create: { 
            name: projectName, 
            description: projectName === 'Auto-Scanned' 
              ? 'Automatically discovered containers without a specific project'
              : `Docker Compose project: ${projectName}`
          },
        });

        // 4. Upsert Container
        const container = await tx.container.upsert({
          where: { 
            id: (await tx.container.findFirst({ 
              where: { hostId: host.id, containerName: containerData.name } 
            }))?.id || '00000000-0000-0000-0000-000000000000' 
          },
          update: { projectId: project.id },
          create: { 
            containerName: containerData.name,
            hostId: host.id,
            projectId: project.id
          },
        });

        const syncedTechIds: string[] = [];
        for (const techData of containerData.technologies) {
          // 5. Upsert Technology
          const technology = await tx.technology.upsert({
            where: { 
              id: (await tx.technology.findFirst({ 
                where: { name: techData.name, version: techData.version } 
              }))?.id || '00000000-0000-0000-0000-000000000000' 
            },
            update: {},
            create: { name: techData.name, version: techData.version },
          });
          
          syncedTechIds.push(technology.id);

          // 6. Link Technology to Container (ContainerTech)
          await tx.containerTech.upsert({
            where: { 
              id: (await tx.containerTech.findFirst({ 
                where: { containerId: container.id, technologyId: technology.id } 
              }))?.id || '00000000-0000-0000-0000-000000000000' 
            },
            update: {},
            create: { 
              containerId: container.id, 
              technologyId: technology.id,
              source: source
            },
          });
        }

        // 7. Reconciliation: Remove any old tech links that are no longer present for this container
        await tx.containerTech.deleteMany({
          where: {
            containerId: container.id,
            technologyId: { notIn: syncedTechIds }
          }
        });
      }
    });

    console.log(`[IngestionService] Sync completed for ${containers.length} containers.`);
  }

  async processSbom(payload: any): Promise<void> {
    console.log(`[IngestionService] Processing SBOM for project: ${payload.projectName}`);
    
    if (!payload.projectName || !Array.isArray(payload.dependencies)) {
      throw new Error('Invalid SBOM payload: Missing projectName or dependencies');
    }

    await this.prisma.$transaction(async (tx) => {
      // Upsert Project
      const project = await tx.project.upsert({
        where: { name: payload.projectName },
        update: {},
        create: { 
          name: payload.projectName,
          description: 'API-Ingested Project'
        },
      });

      const syncedTechIds: string[] = [];
      for (const techData of payload.dependencies) {
        if (!techData.name || !techData.version) continue;

        // Upsert Technology
        const technology = await tx.technology.upsert({
          where: { 
            id: (await tx.technology.findFirst({ 
              where: { name: techData.name, version: techData.version, ecosystem: techData.ecosystem || null } 
            }))?.id || '00000000-0000-0000-0000-000000000000' 
          },
          update: {
            ecosystem: techData.ecosystem || null
          },
          create: { 
            name: techData.name, 
            version: techData.version,
            ecosystem: techData.ecosystem || null
          },
        });
        
        syncedTechIds.push(technology.id);

        // Define generic source based on ecosystem or generic
        const sourceLabel = techData.ecosystem ? `${techData.ecosystem}-sbom` : 'sbom-api';

        // Link Technology to Project (ProjectTech)
        await tx.projectTech.upsert({
          where: { 
            projectId_technologyId: {
               projectId: project.id,
               technologyId: technology.id
            }
          },
          update: { source: sourceLabel },
          create: { 
            projectId: project.id, 
            technologyId: technology.id,
            source: sourceLabel
          },
        });
      }
    });

    console.log(`[IngestionService] SBOM Sync completed for ${payload.projectName}.`);
  }

  async processHostSoftware(payload: any): Promise<void> {
    console.log(`[IngestionService] Processing Host Software for: ${payload.hostname}`);
    
    if (!payload.hostname || !Array.isArray(payload.software)) {
      throw new Error('Invalid Host payload: Missing hostname or software');
    }

    await this.prisma.$transaction(async (tx) => {
      // Upsert Host
      const host = await tx.host.upsert({
        where: { 
          id: (await tx.host.findFirst({ where: { hostname: payload.hostname } }))?.id || '00000000-0000-0000-0000-000000000000' 
        },
        update: {},
        create: { hostname: payload.hostname },
      });

      const syncedTechIds: string[] = [];
      for (const techData of payload.software) {
        if (!techData.name || !techData.version) continue;

        // Upsert Technology
        const technology = await tx.technology.upsert({
          where: { 
            id: (await tx.technology.findFirst({ 
              where: { name: techData.name, version: techData.version, ecosystem: techData.ecosystem || null } 
            }))?.id || '00000000-0000-0000-0000-000000000000' 
          },
          update: {
            ecosystem: techData.ecosystem || null
          },
          create: { 
            name: techData.name, 
            version: techData.version,
            ecosystem: techData.ecosystem || null
          },
        });
        
        syncedTechIds.push(technology.id);

        // Define generic source based on ecosystem or generic
        const sourceLabel = techData.ecosystem ? `${techData.ecosystem}-host` : 'host-api';

        // Link Technology to Host (HostTech)
        await tx.hostTech.upsert({
          where: { 
            hostId_technologyId: {
               hostId: host.id,
               technologyId: technology.id
            }
          },
          update: { source: sourceLabel },
          create: { 
            hostId: host.id, 
            technologyId: technology.id,
            source: sourceLabel
          },
        });
      }
    });

    console.log(`[IngestionService] Host Software Sync completed for ${payload.hostname}.`);
  }
}
