import { PrismaClient, Role, Status } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing database...');
  // Delete in reverse order of relationships to avoid foreign key constraints
  await prisma.aiInsight.deleteMany();
  await prisma.vulnState.deleteMany();
  await prisma.vulnerability.deleteMany();
  await prisma.containerTech.deleteMany();
  await prisma.techDependency.deleteMany();
  await prisma.technology.deleteMany();
  await prisma.container.deleteMany();
  await prisma.host.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding Users...');
  const passwordHash = await bcrypt.hash('password123', 10);
  
  await prisma.user.create({
    data: { email: 'admin@dependar.local', passwordHash, role: Role.ADMIN }
  });
  await prisma.user.create({
    data: { email: 'viewer@dependar.local', passwordHash, role: Role.VIEWER }
  });

  console.log('Seeding Hosts & Containers...');
  const host1 = await prisma.host.create({ data: { hostname: 'prod-cluster-01' } });
  const host2 = await prisma.host.create({ data: { hostname: 'dev-cluster-01' } });
  const host3 = await prisma.host.create({ data: { hostname: 'db-cluster-01' } });

  const c1 = await prisma.container.create({ data: { containerName: 'frontend-app', hostId: host1.id } });
  const c2 = await prisma.container.create({ data: { containerName: 'backend-api', hostId: host1.id } });
  const c3 = await prisma.container.create({ data: { containerName: 'worker-node', hostId: host2.id } });
  const c4 = await prisma.container.create({ data: { containerName: 'db-server', hostId: host3.id } });
  // Unused container for variety
  await prisma.container.create({ data: { containerName: 'cache-redis', hostId: host3.id } });

  console.log('Seeding Technologies...');
  const react = await prisma.technology.create({ data: { name: 'react', version: '18.2.0' } });
  const nextjs = await prisma.technology.create({ data: { name: 'next', version: '14.0.0' } });
  const node = await prisma.technology.create({ data: { name: 'node', version: '20.9.0' } });
  const fastify = await prisma.technology.create({ data: { name: 'fastify', version: '4.26.2' } });
  const prismaOrm = await prisma.technology.create({ data: { name: 'prisma', version: '5.10.0' } });
  const postgres = await prisma.technology.create({ data: { name: 'postgresql', version: '16.0' } });
  await prisma.technology.create({ data: { name: 'redis', version: '7.0' } });
  await prisma.technology.create({ data: { name: 'golang', version: '1.21' } });
  await prisma.technology.create({ data: { name: 'nginx', version: '1.24.0' } });
  await prisma.technology.create({ data: { name: 'docker', version: '24.0' } });

  console.log('Seeding Dependencies...');
  await prisma.techDependency.createMany({
    data: [
      { techId: nextjs.id, requiresTechId: react.id },
      { techId: fastify.id, requiresTechId: node.id },
      { techId: prismaOrm.id, requiresTechId: node.id },
    ]
  });

  console.log('Seeding ContainerTechs...');
  const ct1 = await prisma.containerTech.create({ data: { containerId: c1.id, technologyId: nextjs.id, source: 'sbom' } });
  const ct2 = await prisma.containerTech.create({ data: { containerId: c2.id, technologyId: fastify.id, source: 'sbom' } });
  await prisma.containerTech.create({ data: { containerId: c2.id, technologyId: prismaOrm.id, source: 'sbom' } });
  const ct4 = await prisma.containerTech.create({ data: { containerId: c4.id, technologyId: postgres.id, source: 'agent' } });
  
  console.log('Seeding Vulnerabilities...');
  const v1 = await prisma.vulnerability.create({ data: { cveId: 'CVE-2024-1001', vulnerableRange: '< 14.0.1', baseSeverity: 'HIGH' } });
  const v2 = await prisma.vulnerability.create({ data: { cveId: 'CVE-2023-2002', vulnerableRange: '< 4.27.0', baseSeverity: 'CRITICAL' } });
  const v3 = await prisma.vulnerability.create({ data: { cveId: 'CVE-2022-3003', vulnerableRange: '< 16.1', baseSeverity: 'MEDIUM' } });
  await prisma.vulnerability.create({ data: { cveId: 'CVE-2021-4004', vulnerableRange: '< 7.1', baseSeverity: 'LOW' } });
  await prisma.vulnerability.create({ data: { cveId: 'CVE-2024-5005', vulnerableRange: '< 20.10', baseSeverity: 'CRITICAL' } });

  console.log('Seeding Vuln States & Insights...');
  const vs1 = await prisma.vulnState.create({ data: { containerTechId: ct1.id, cveId: v1.cveId, status: Status.OPEN } });
  await prisma.vulnState.create({ data: { containerTechId: ct2.id, cveId: v2.cveId, status: Status.RESOLVED } });
  const vs3 = await prisma.vulnState.create({ data: { containerTechId: ct4.id, cveId: v3.cveId, status: Status.OPEN } });

  await prisma.aiInsight.create({
    data: { vulnStateId: vs1.id, adjustedSeverity: 'MEDIUM' }
  });
  await prisma.aiInsight.create({
    data: { vulnStateId: vs3.id, adjustedSeverity: 'CRITICAL' }
  });

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
