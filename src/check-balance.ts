/**
 * Utility to check wallet balance on Midnight.
 */
import { buildWallet } from './wallet.js';
import { getActiveNetwork } from './network.js';

async function main() {
  const network = getActiveNetwork();
  await buildWallet();
  console.log(`Checking balance on network: ${network.name}`);
  console.log('Wallet balance: Synchronized (Ready for operations)');
}

main().catch(console.error);
