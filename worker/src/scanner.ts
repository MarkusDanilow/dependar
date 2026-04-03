import Docker from 'dockerode';

export interface Technology {
  name: string;
  version: string;
}

export interface ContainerInfo {
  name: string;
  project?: string | undefined;
  technologies: Technology[];
}

const isWindows = process.platform === 'win32';
const docker = new Docker({ 
  socketPath: isWindows ? '//./pipe/docker_engine' : '/var/run/docker.sock' 
});

async function getDeepDependencies(containerId: string): Promise<Technology[]> {
  const container = docker.getContainer(containerId);
  const techList: Technology[] = [];

  // Try to find package.json for Node.js projects
  try {
    const exec = await container.exec({
      Cmd: ['cat', '/app/package.json'],
      AttachStdout: true,
      AttachStderr: true
    });
    const stream = await exec.start({});
    
    return new Promise((resolve) => {
      let output = '';
      stream.on('data', (chunk) => output += chunk.toString());
      stream.on('end', () => {
        try {
          // Remove potential Docker stream headers (first 8 bytes per chunk, simplified for cat output)
          // Docker attaches 8 byte headers to each chunk in pseudo-TTY mode.
          // For simplicity, we just try to find the first '{' and last '}'
          const start = output.indexOf('{');
          const end = output.lastIndexOf('}');
          if (start !== -1 && end !== -1) {
            const pkg = JSON.parse(output.substring(start, end + 1));
            const deps = { ...pkg.dependencies, ...pkg.devDependencies };
            for (const [name, version] of Object.entries(deps)) {
              techList.push({ name, version: (version as string).replace(/[^0-9.]/g, '') });
            }
          }
        } catch (e) { /* ignore parse errors */ }
        resolve(techList);
      });
    });
  } catch (e) {
    return [];
  }
}

function extractVersionFromEnv(env: string[], techName: string): string | undefined {
  const IGNORE_PREFIXES = ['GOSU', 'TINI', 'DEBIAN', 'ALPINE', 'UBUNTU', 'CONFD'];
  const versionVars: { key: string, value: string, score: number }[] = [];

  const normalizedTech = techName.toLowerCase().replace(/[^a-z0-9]/g, '');

  for (const entry of env) {
    const [key, value] = entry.split('=');
    if (!key || !value) continue;

    if (key.endsWith('_VERSION') || key.endsWith('_MAJOR')) {
      const prefix = key.replace(/_(VERSION|MAJOR)$/, '').toLowerCase();
      
      // Skip ignored tools
      if (IGNORE_PREFIXES.some(p => prefix === p.toLowerCase())) continue;

      let score = 0;
      if (prefix === normalizedTech) score = 100;
      else if (normalizedTech.includes(prefix) || prefix.includes(normalizedTech)) score = 50;
      else if (normalizedTech.startsWith(prefix.substring(0, 2)) || prefix.startsWith(normalizedTech.substring(0, 2))) score = 25; // e.g. PG for postgres
      
      versionVars.push({ key, value, score });
    }
  }

  if (versionVars.length === 0) return undefined;

  // Sort by score descending
  versionVars.sort((a, b) => b.score - a.score);
  return versionVars[0]?.value;
}

export async function scanContainers(): Promise<ContainerInfo[]> {
  try {
    const containers = await docker.listContainers();
    const result: ContainerInfo[] = [];

    for (const containerSummary of containers) {
      const container = docker.getContainer(containerSummary.Id);
      const inspectData = await container.inspect();
      
      const name = containerSummary.Names[0] ? containerSummary.Names[0].replace(/^\//, '') : 'unknown';
      const image = containerSummary.Image;
      
      let techName = image;
      let techVersion = 'latest';

      // Determine techName from image without tag first for score calculation
      const lastColonInitial = image.lastIndexOf(':');
      const lastSlashInitial = image.lastIndexOf('/');
      const tempTechName = (lastColonInitial > lastSlashInitial) ? image.substring(0, lastColonInitial) : image;

      // 1. Try to extract version from common ENV variables (PG_VERSION, NODE_VERSION, etc)
      const env = inspectData.Config.Env || [];
      const envVersion = extractVersionFromEnv(env, tempTechName);
      if (envVersion) {
        techVersion = envVersion;
      }

      // 2. Try to extract from labels (OCI spec)
      const labels = inspectData.Config.Labels || {};
      if (labels['org.opencontainers.image.version']) {
        techVersion = labels['org.opencontainers.image.version'];
      }

      // 3. Fallback to image tag splitting
      if (techVersion === 'latest') {
        const lastColon = image.lastIndexOf(':');
        const lastSlash = image.lastIndexOf('/');
        if (lastColon > lastSlash) {
          techName = image.substring(0, lastColon);
          techVersion = image.substring(lastColon + 1);
        }
      } else {
        // If we found a version in meta, techName should just be the image without tag
        const lastColon = image.lastIndexOf(':');
        const lastSlash = image.lastIndexOf('/');
        if (lastColon > lastSlash) {
          techName = image.substring(0, lastColon);
        }
      }

      const technologies: Technology[] = [{ name: techName, version: techVersion }];

      // 4. DEEP SCAN: Try to find dependencies
      const deepDeps = await getDeepDependencies(containerSummary.Id);
      technologies.push(...deepDeps);

      // 5. PROJECT DETECTION: Check labels or fallback to naming convention
      let project = labels['com.docker.compose.project'];
      if (!project && name.includes('_')) {
        // Fallback for docker-compose older versions or specific naming: first part of the name
        project = name.split('_')[0];
      }

      result.push({
        name: name,
        project: project,
        technologies: technologies
      });
    }

    return result;
  } catch (error) {
    console.error('Error scanning containers:', error);
    throw error;
  }
}
