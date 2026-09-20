/**
 * Interactive CLI for BlackBox AI.
 */
import { getActiveNetwork, loadDeploymentState } from './network.js';

async function main() {
  const state = loadDeploymentState();
  const network = getActiveNetwork();
  console.log('═══════════════════════════════════════════════════');
  console.log('BlackBox AI — Interactive CLI');
  console.log('═══════════════════════════════════════════════════');
  console.log(`Active Network: ${network.name}`);
  console.log(`Contract Address: ${state.contractAddress || 'Not deployed yet'}`);
  console.log('\nAvailable operations:');
  console.log('  1. Register Dataset');
  console.log('  2. Authorize Dataset');
  console.log('  3. Submit Training Commitment');
  console.log('  4. Run ZK Compliance Verification');
  console.log('  5. Query Audit Ledger');
}

main().catch(console.error);
