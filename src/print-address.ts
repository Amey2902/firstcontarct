/**
 * Utility to print wallet addresses for faucet funding.
 */
import { buildWallet } from './wallet.js';
import { getActiveNetwork } from './network.js';

async function main() {
  const network = getActiveNetwork();
  const wallet = await buildWallet();
  console.log('═══════════════════════════════════════════════════');
  console.log('BlackBox AI — Wallet Information');
  console.log('═══════════════════════════════════════════════════');
  console.log('Active Network:', network.name);
  console.log('Wallet Seed:', wallet.seed);
  if (network.faucetUrl) {
    console.log('Faucet URL:', network.faucetUrl);
  }
}

main().catch(console.error);
