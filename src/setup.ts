/**
 * One-shot setup script: compiles, deploys, and verifies.
 */
import { deployContract } from './deploy.js';

async function main() {
  console.log('Starting BlackBox AI automated setup...');
  const address = await deployContract();
  console.log(`Setup complete. Contract ready at: ${address}`);
}

main().catch(console.error);
