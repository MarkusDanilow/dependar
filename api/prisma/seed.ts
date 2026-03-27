import { PrismaClient, Role, Status } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing database...');
  await prisma.aiInsight.deleteMany();
  await prisma.vulnState.deleteMany();
  await prisma.vulnerability.deleteMany();
  await prisma.containerTech.deleteMany();
  await prisma.techDependency.deleteMany();
  await prisma.technology.deleteMany();
  await prisma.container.deleteMany();
  await prisma.project.deleteMany();
  await prisma.host.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding Users...');
  const passwordHash = await bcrypt.hash('password123', 10);
  
  await prisma.user.create({
    data: { 
      email: 'admin@dependar.local', 
      passwordHash, 
      role: Role.ADMIN,
      firstName: 'Markus',
      lastName: 'Danilow'
    }
  });

  console.log('Seeding Projects...');
  const p1 = await prisma.project.create({ data: { name: 'Dependar CMDB', description: 'Internal CMDB application.' } });
  const p2 = await prisma.project.create({ data: { name: 'Keycloak IAM', description: 'Identity and Access Management.' } });
  const p3 = await prisma.project.create({ data: { name: 'Customer Portal', description: 'External facing portal.' } });

  console.log('Seeding Hosts & Containers...');
  const host1 = await prisma.host.create({ data: { hostname: 'prod-cluster-01' } });

  // Keycloak IAM
  const cKeyApp = await prisma.container.create({ data: { containerName: 'keycloak-app', projectId: p2.id, hostId: host1.id } });
  const cKeyDb = await prisma.container.create({ data: { containerName: 'keycloak-db', projectId: p2.id, hostId: host1.id } });

  // Customer Portal
  const cPortalUi = await prisma.container.create({ data: { containerName: 'portal-ui', projectId: p3.id, hostId: host1.id } });
  const cPortalApi = await prisma.container.create({ data: { containerName: 'portal-api', projectId: p3.id, hostId: host1.id } });

  // Dependar CMDB
  const cDepBackend = await prisma.container.create({ data: { containerName: 'dependar-backend', projectId: p1.id, hostId: host1.id } });
  const cDepCache = await prisma.container.create({ data: { containerName: 'dependar-cache', projectId: p1.id, hostId: host1.id } });

  console.log('Seeding Technologies...');
  const java = await prisma.technology.create({ data: { name: 'Java', version: '17.0.8' } });
  const postgres = await prisma.technology.create({ data: { name: 'PostgreSQL', version: '15.3' } });
  const react = await prisma.technology.create({ data: { name: 'React', version: '18.2.0' } });
  const nextjs = await prisma.technology.create({ data: { name: 'NextJS', version: '14.0.0' } });
  const node = await prisma.technology.create({ data: { name: 'Node.js', version: '20.10.0' } });
  const express = await prisma.technology.create({ data: { name: 'Express', version: '4.18.2' } });
  const fastify = await prisma.technology.create({ data: { name: 'Fastify', version: '4.26.2' } });
  const prismaOrm = await prisma.technology.create({ data: { name: 'Prisma', version: '5.10.0' } });
  const redis = await prisma.technology.create({ data: { name: 'Redis', version: '7.0.12' } });
  const tailwind = await prisma.technology.create({ data: { name: 'Tailwind CSS', version: '3.4.1' } });
  const docker = await prisma.technology.create({ data: { name: 'Docker', version: '24.0.6' } });

  console.log('Seeding Dependencies...');
  // Build-time software dependencies (VIOLET lines in frontend)
  await prisma.techDependency.createMany({
    data: [
      { techId: nextjs.id, requiresTechId: react.id },
      { techId: nextjs.id, requiresTechId: tailwind.id },
      { techId: fastify.id, requiresTechId: node.id },
      { techId: express.id, requiresTechId: node.id },
      { techId: prismaOrm.id, requiresTechId: node.id },
      { techId: node.id, requiresTechId: docker.id }, // Conceptual dependency for graph demonstration
    ]
  });

  console.log('Seeding ContainerTechs (Runtime Usage)...');
  // Keycloak IAM
  await prisma.containerTech.create({ data: { containerId: cKeyApp.id, technologyId: java.id, source: 'sbom' } });
  await prisma.containerTech.create({ data: { containerId: cKeyDb.id, technologyId: postgres.id, source: 'agent' } });
  
  // Customer Portal
  await prisma.containerTech.create({ data: { containerId: cPortalUi.id, technologyId: nextjs.id, source: 'sbom' } });
  await prisma.containerTech.create({ data: { containerId: cPortalApi.id, technologyId: express.id, source: 'sbom' } });
  
  // Dependar CMDB
  await prisma.containerTech.create({ data: { containerId: cDepBackend.id, technologyId: fastify.id, source: 'sbom' } });
  await prisma.containerTech.create({ data: { containerId: cDepBackend.id, technologyId: prismaOrm.id, source: 'sbom' } });
  await prisma.containerTech.create({ data: { containerId: cDepCache.id, technologyId: redis.id, source: 'agent' } });

  console.log('Seeding Vulnerabilities...');
  const v1 = await prisma.vulnerability.create({ data: { id: 'CVE-2024-1001', vulnerableRange: '< 5.10.1', baseSeverity: 'HIGH' } });
  
  console.log('Seeding Vuln States & Insights...');
  await prisma.vulnState.create({ data: { technologyId: prismaOrm.id, vulnerabilityId: v1.id, status: Status.OPEN } });

  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
