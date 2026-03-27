import { ITechnologyRepository } from '../../common/interfaces';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class GraphService {
  constructor(private readonly techRepo: ITechnologyRepository) { }

  async buildReactFlowGraph(): Promise<any> {
    const projects = await prisma.project.findMany();
    const containers = await prisma.container.findMany();
    const technologies = await prisma.technology.findMany({
      include: {
        vulnStates: true
      }
    });
    const containerTechs = await prisma.containerTech.findMany();
    const techDependencies = await prisma.techDependency.findMany();

    const nodes: any[] = [];
    const edges: any[] = [];

    // Basic layout strategy (Dagre in frontend is better, but this gives a fallback)
    const projectWidth = 380;
    const projectHeight = 300;

    // A1. Mappe Projekte zu Nodes
    projects.forEach((proj, idx) => {
      nodes.push({
        id: proj.id,
        type: 'project',
        data: { label: proj.name, description: proj.description },
        position: { x: idx * 450, y: 0 },
        style: { width: projectWidth, height: projectHeight }
      });
    });

    // A2. Mappe Container zu Nodes
    const containerCountPerProject: Record<string, number> = {};
    containers.forEach((cont) => {
      const pIdx = containerCountPerProject[cont.projectId] || 0;
      containerCountPerProject[cont.projectId] = pIdx + 1;

      nodes.push({
        id: cont.id,
        type: 'container',
        data: { label: cont.containerName },
        position: { x: 20, y: 60 + (pIdx * 80) }, // Relative to parent
        parentNode: cont.projectId,
        extent: 'parent'
      });

      // B1. Relation "Runs Within": Project -> Container
      edges.push({
        id: `e-proj-${cont.projectId}-cont-${cont.id}`,
        source: cont.projectId,
        target: cont.id,
        type: 'runtime',
      });
    });

    // A3. Mappe Technologien zu Nodes (markiere mit CVE)
    technologies.forEach((tech, idx) => {
      const hasCve = (tech as any).vulnStates?.some((vs: any) => vs.status === 'OPEN' || vs.status === 'IN_PROGRESS');

      nodes.push({
        id: tech.id,
        type: 'technology',
        data: {
          label: tech.name,
          version: tech.version,
          hasCve
        },
        position: { x: idx * 220, y: 500 }, // Placed below projects globally
      });
    });

    // B2. Relation "Uses Infrastructure": Container -> Technology
    containerTechs.forEach((ct, i) => {
      edges.push({
        id: `e-cont-${ct.containerId}-tech-${ct.technologyId}-${i}`,
        source: ct.containerId,
        target: ct.technologyId,
        type: 'runtime',
      });
    });

    // B3. Relation "Builds On": Technology -> Technology
    techDependencies.forEach((td, i) => {
      edges.push({
        id: `e-tech-${td.techId}-req-${td.requiresTechId}-${i}`,
        source: td.techId,
        target: td.requiresTechId,
        type: 'buildtime',
      });
    });

    return { nodes, edges };
  }
}
