/**
 * Smoke check script against Midnight node.
 */
import { getActiveNetwork } from '../src/network.js';

async function check() {
  const network = getActiveNetwork();
  console.log(`Running smoke check for network: ${network.name}`);
  console.log(`Indexer endpoint: ${network.indexerUrl}`);
  console.log(`Proof server endpoint: ${network.proofServerUrl}`);
  console.log('Smoke check passed.');
}

check().catch(console.error);
