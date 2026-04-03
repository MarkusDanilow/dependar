import 'dotenv/config';
import { scanContainers } from './scanner.js';
import { pushDataToApi } from './api.js';

const SCAN_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

async function runScan() {
  console.log(`[${new Date().toISOString()}] Starting container scan...`);
  try {
    const containers = await scanContainers();
    console.log(`[${new Date().toISOString()}] Found ${containers.length} containers.`);
    
    await pushDataToApi(containers);
    console.log(`[${new Date().toISOString()}] Pushed data to API.`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Scan failed:`, (error as Error).message);
  }
}

async function main() {
  console.log('Dependar Agent (Node.js/TS) started.');
  
  // Initialer Scan beim Start
  await runScan();

  // Danach alle 5 Minuten
  setInterval(async () => {
    await runScan();
  }, SCAN_INTERVAL_MS);
}

main().catch((error) => {
  console.error('Main loop error:', error);
  process.exit(1);
});
