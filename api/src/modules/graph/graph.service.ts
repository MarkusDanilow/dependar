import { ITechnologyRepository } from '../../common/interfaces';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Constants for styling/layout
const TECH_W = 280;
const TECH_H = 80;
const TECH_GAP = 20;

const CONT_PAD_X = 24;
const CONT_PAD_Y = 60;
const CONT_MIN_W = 320;
const CONT_GAP = 30;

const PROJ_PAD_X = 32;
const PROJ_PAD_Y = 70;
const PROJ_MIN_W = 400;
const PROJ_GAP = 40;

const HOST_PAD_X = 40;
const HOST_PAD_Y = 90;
const HOST_GAP = 80;

export class GraphService {
  constructor(private readonly techRepo: ITechnologyRepository) { }

  async buildReactFlowGraph(): Promise<any> {
    const projects = await prisma.project.findMany();
    const containers = await prisma.container.findMany();
    const technologies = await prisma.technology.findMany({
      include: {
        vulnStates: {
          include: {
            vulnerability: true,
            aiInsight: true
          }
        }
      }
    });
    const containerTechs = await prisma.containerTech.findMany();
    const techDependencies = await prisma.techDependency.findMany();
    const hosts = await prisma.host.findMany();
    const projectHosts = await prisma.projectHost.findMany();
    const hostTechs = await prisma.hostTech.findMany();

    const nodes: any[] = [];
    const edges: any[] = [];

    // Helper to store instances
    const techInstances = new Map<string, string[]>();

    // Helpers to create nodes
    function createTechNode(id: string, tech: any, parentId?: string, x = 0, y = 0) {
      if (!techInstances.has(tech.id)) techInstances.set(tech.id, []);
      techInstances.get(tech.id)!.push(id);
      const vulns = (tech as any).vulnStates || [];
      const hasCve = vulns.some((vs: any) => vs.status === 'OPEN' || vs.status === 'IN_PROGRESS');
      const getSev = (vs: any) => vs.aiInsight?.adjustedSeverity || vs.vulnerability?.baseSeverity || 'MEDIUM';

      const criticalCount = vulns.filter((vs: any) => getSev(vs) === 'CRITICAL' && (vs.status === 'OPEN' || vs.status === 'IN_PROGRESS')).length;
      const highCount = vulns.filter((vs: any) => getSev(vs) === 'HIGH' && (vs.status === 'OPEN' || vs.status === 'IN_PROGRESS')).length;
      const mediumCount = vulns.filter((vs: any) => getSev(vs) === 'MEDIUM' && (vs.status === 'OPEN' || vs.status === 'IN_PROGRESS')).length;

      const node: any = {
        id,
        type: 'technology',
        position: { x, y },
        style: { width: TECH_W, height: TECH_H },
        data: {
          label: tech.name,
          version: tech.version,
          ecosystem: tech.ecosystem,
          hasCve,
          vulnCounts: { critical: criticalCount, high: highCount, medium: mediumCount }
        }
      };
      if (parentId) {
        node.parentNode = parentId;
        node.extent = 'parent';
      }
      nodes.push(node);
    }

    // --- BOTTOM-UP CALCULATIONS ---

    // 1. Assign Technologies to Containers
    const techsByContainer: Record<string, any[]> = {};
    containerTechs.forEach(ct => {
      if (!techsByContainer[ct.containerId]) techsByContainer[ct.containerId] = [];
      const t = technologies.find(t => t.id === ct.technologyId);
      if (t) techsByContainer[ct.containerId].push(t);
    });

    const containerDims: Record<string, { w: number, h: number }> = {};
    
    // 2. Assign Containers to Projects (per Host instance usually, but visually we nest in Project)
    // Wait, Projects can be on multiple Hosts.
    // So we first determine the Project INSTANCES.
    const projectInstances: { id: string, projId: string, hostId?: string, proj: any }[] = [];
    projects.forEach(p => {
      const mappings = projectHosts.filter(ph => ph.projectId === p.id);
      if (mappings.length > 0) {
         mappings.forEach(m => projectInstances.push({ id: `${p.id}-${m.hostId}`, projId: p.id, hostId: m.hostId, proj: p }));
      } else {
         projectInstances.push({ id: p.id, projId: p.id, proj: p }); // Orphan project
      }
    });

    const contsByProjInstance: Record<string, any[]> = {};
    containers.forEach(c => {
      // Find the best project instance for this container
      let bestInstanceId = c.projectId;
      const possibleInstances = projectInstances.filter(pi => pi.projId === c.projectId);
      
      if (possibleInstances.length > 1) {
         // It's on multiple hosts. Try to match container's hostId
         const match = possibleInstances.find(pi => pi.hostId === c.hostId);
         bestInstanceId = match ? match.id : possibleInstances[0].id;
      } else if (possibleInstances.length === 1) {
         bestInstanceId = possibleInstances[0].id;
      }

      if (!contsByProjInstance[bestInstanceId]) contsByProjInstance[bestInstanceId] = [];
      contsByProjInstance[bestInstanceId].push(c);
    });

    const projInstanceDims: Record<string, { w: number, h: number }> = {};

    // 3. Size calculations
    // Process all containers
    containers.forEach(c => {
      const techs = techsByContainer[c.id] || [];
      const cols = 2; // grid of 2
      const rows = Math.ceil(techs.length / cols);
      
      let w = CONT_MIN_W;
      let h = CONT_PAD_Y + 40; // minimum empty height
      
      if (techs.length > 0) {
        const gridW = Math.min(techs.length, cols) * TECH_W + (Math.min(techs.length, cols) - 1) * TECH_GAP;
        w = Math.max(CONT_MIN_W, CONT_PAD_X * 2 + gridW);
        h = CONT_PAD_Y + rows * TECH_H + (rows - 1) * TECH_GAP + 24;
      }
      containerDims[c.id] = { w, h };
    });

    // Process all project instances
    projectInstances.forEach(pi => {
      const conts = contsByProjInstance[pi.id] || [];
      let w = PROJ_MIN_W;
      let h = PROJ_PAD_Y + 40;
      
      if (conts.length > 0) {
         let rowW = 0;
         let maxH = 0;
         conts.forEach(c => {
           const cDim = containerDims[c.id];
           rowW += cDim.w;
           if (cDim.h > maxH) maxH = cDim.h;
         });
         rowW += (conts.length - 1) * CONT_GAP;
         w = Math.max(PROJ_MIN_W, PROJ_PAD_X * 2 + rowW);
         h = PROJ_PAD_Y + maxH + 32;
      }
      projInstanceDims[pi.id] = { w, h };
    });

    // Process Hosts
    let currentHostX = 0;
    
    // Track deployed tech to identify orphans later
    const deployedTechIds = new Set<string>();

    hosts.forEach(host => {
       const hostProjInstances = projectInstances.filter(pi => pi.hostId === host.id);
       
       // Host might also have direct technologies
       const hTechs = hostTechs.filter(ht => ht.hostId === host.id);
       
       let hW = 400; // Min host width
       let projRowW = 0;
       let projMaxH = 0;
       
       hostProjInstances.forEach(pi => {
          const dim = projInstanceDims[pi.id];
          projRowW += dim.w;
          if (dim.h > projMaxH) projMaxH = dim.h;
       });

       if (hostProjInstances.length > 0) {
          projRowW += (hostProjInstances.length - 1) * PROJ_GAP;
          hW = Math.max(hW, HOST_PAD_X * 2 + projRowW);
       }

       let techRowH = 0;
       if (hTechs.length > 0) {
          techRowH = Math.ceil(hTechs.length / 3) * (TECH_H + TECH_GAP) + 40;
       }

       const hH = HOST_PAD_Y + projMaxH + (hostProjInstances.length > 0 ? 32 : 0) + techRowH;

       // Create Host Node
       nodes.push({
         id: host.id,
         type: 'host',
         data: { label: host.hostname },
         position: { x: currentHostX, y: 0 },
         style: { width: hW, height: hH }
       });

       let currentProjX = HOST_PAD_X;
       hostProjInstances.forEach(pi => {
          const pDim = projInstanceDims[pi.id];
          nodes.push({
             id: pi.id,
             type: 'project',
             data: { label: pi.proj.name, description: pi.proj.description },
             position: { x: currentProjX, y: HOST_PAD_Y },
             parentNode: host.id,
             extent: 'parent',
             style: { width: pDim.w, height: pDim.h }
          });

          // Create Containers in Project
          let currentContX = PROJ_PAD_X;
          const conts = contsByProjInstance[pi.id] || [];
          conts.forEach(c => {
             const cDim = containerDims[c.id];
             nodes.push({
                id: `${c.id}-${pi.id}`, // Unique ID for container in this instance
                type: 'container',
                data: { label: c.containerName },
                position: { x: currentContX, y: PROJ_PAD_Y },
                parentNode: pi.id,
                extent: 'parent',
                style: { width: cDim.w, height: cDim.h }
             });

             // Add tech dependencies edges logically, handled later

             // Create Techs in Container
             const cTechs = techsByContainer[c.id] || [];
             cTechs.forEach((t, tidx) => {
                const col = tidx % 2;
                const row = Math.floor(tidx / 2);
                const tx = CONT_PAD_X + col * (TECH_W + TECH_GAP);
                const ty = CONT_PAD_Y + row * (TECH_H + TECH_GAP);
                const uniqueTechId = `tech-${t.id}-cont-${c.id}-${pi.id}`;
                createTechNode(uniqueTechId, t, `${c.id}-${pi.id}`, tx, ty);
                deployedTechIds.add(t.id);
             });

             currentContX += cDim.w + CONT_GAP;
          });

          currentProjX += pDim.w + PROJ_GAP;
       });

       // Create Host Direct Techs
       if (hTechs.length > 0) {
          let tX = HOST_PAD_X;
          let tY = HOST_PAD_Y + projMaxH + (hostProjInstances.length > 0 ? 40 : 0);
          hTechs.forEach((ht, idx) => {
             const t = technologies.find(t => t.id === ht.technologyId);
             if (t) {
                const col = idx % 3;
                const row = Math.floor(idx / 3);
                const uniqueTechId = `tech-${t.id}-host-${host.id}`;
                createTechNode(uniqueTechId, t, host.id, HOST_PAD_X + col * (TECH_W + TECH_GAP), tY + row * (TECH_H + TECH_GAP));
                deployedTechIds.add(t.id);
             }
          });
       }

       currentHostX += hW + HOST_GAP;
    });

    // 4. Orphaned Projects
    let orphanY = 1200; // Place them below hosts
    const orphanProjs = projectInstances.filter(pi => !pi.hostId);
    let currentOrphanX = 0;
    let maxOrphanH = 0;
    
    orphanProjs.forEach(pi => {
       const pDim = projInstanceDims[pi.id];
       nodes.push({
          id: pi.id,
          type: 'project',
          data: { label: pi.proj.name, description: pi.proj.description },
          position: { x: currentOrphanX, y: orphanY },
          style: { width: pDim.w, height: pDim.h }
       });

       let currentContX = PROJ_PAD_X;
       const conts = contsByProjInstance[pi.id] || [];
       conts.forEach(c => {
          const cDim = containerDims[c.id];
          nodes.push({
             id: c.id, // Original ID is fine since it's an orphan
             type: 'container',
             data: { label: c.containerName },
             position: { x: currentContX, y: PROJ_PAD_Y },
             parentNode: pi.id,
             extent: 'parent',
             style: { width: cDim.w, height: cDim.h }
          });

          const cTechs = techsByContainer[c.id] || [];
          cTechs.forEach((t, tidx) => {
             const col = tidx % 2;
             const row = Math.floor(tidx / 2);
             const uniqueTechId = `tech-${t.id}-cont-${c.id}`;
             createTechNode(uniqueTechId, t, c.id, CONT_PAD_X + col * (TECH_W + TECH_GAP), CONT_PAD_Y + row * (TECH_H + TECH_GAP));
             deployedTechIds.add(t.id);
          });

          currentContX += cDim.w + CONT_GAP;
       });

       currentOrphanX += pDim.w + PROJ_GAP;
       if (pDim.h > maxOrphanH) maxOrphanH = pDim.h;
    });

    // 5. Global Orphaned Techs
    const orphanTechs = technologies.filter(t => !deployedTechIds.has(t.id));
    if (orphanTechs.length > 0) {
       let otY = orphanY + maxOrphanH + 150;
       let otX = 0;
       orphanTechs.forEach(t => {
          createTechNode(t.id, t, undefined, otX, otY);
          otX += TECH_W + TECH_GAP;
          if (otX > 1500) { // wrap
             otX = 0;
             otY += TECH_H + TECH_GAP;
          }
       });
    }

    // 6. Edges
    // Software-Abhängigkeiten (Violett)
    techDependencies.forEach((td, i) => {
       const sources = techInstances.get(td.techId) || [];
       const targets = techInstances.get(td.requiresTechId) || [];
       
       // Draw an edge between the first available instances to avoid web explosion
       if (sources.length > 0 && targets.length > 0) {
          edges.push({
             id: `e-tech-${td.techId}-req-${td.requiresTechId}`,
             source: sources[0],
             target: targets[0],
             type: 'buildtime',
          });
       }
    });

    // Infrastruktur-Nutzung (Blau) - e.g. cross-project API calls if we had them or just container to tech?
    // Since we physically nested them, we can add some subtle edges to signify the runtime link to make it look "techy"
    containerTechs.forEach(ct => {
       const targets = techInstances.get(ct.technologyId) || [];
       if (targets.length > 0) {
          // find the exact instance nested in this container!
          const exactTarget = targets.find(tId => tId.includes(`cont-${ct.containerId}`));
          if (exactTarget) {
             edges.push({
                id: `e-runtime-cont-${ct.containerId}-tech-${ct.technologyId}`,
                source: ct.containerId,
                target: exactTarget,
                type: 'runtime'
             });
          }
       }
    });

    return { nodes, edges };
  }
}
