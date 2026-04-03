import type { ContainerInfo } from './scanner.js';

export async function pushDataToApi(containers: ContainerInfo[]): Promise<void> {
  const payload = {
    source: 'docker-socket',
    host: 'local-machine',
    containers: containers,
  };

  const apiUrl = process.env.API_URL || 'http://127.0.0.1:5000';
  const apiKey = process.env.API_KEY || '';

  console.log(containers, containers.map(c => c.technologies.map(t => t.name).join(",")));

  try {
    const response = await fetch(`${apiUrl}/api/v1/ingest/agent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API returned ${response.status}: ${errorText}`);
    }

    console.log(`Successfully pushed data for ${containers.length} containers to API.`);
  } catch (error) {
    console.error('Error pushing data to API:', error);
    throw error;
  }
}
