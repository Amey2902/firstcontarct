// Print the bech32 address for the active network's seed WITHOUT waiting for
// full wallet sync. Address derivation is pure key math, so this is instant.
// Used to grab the preprod address for faucet funding while a full sync runs
// in the background.
import { resolveNetwork, getOrCreateSeed } from './network';
import { createWallet } from './wallet';

const { network, config: networkConfig } = resolveNetwork();
const SEED = getOrCreateSeed(network);

async function main() {
  const ctx = await createWallet({ network, networkConfig, seed: SEED });
  const address = ctx.unshieldedKeystore.getBech32Address();
  console.log(`Network:  ${network}`);
  console.log(`Address:  ${address}`);
  if (network !== 'undeployed' && networkConfig.faucet) {
    console.log(`Faucet:   ${networkConfig.faucet}`);
  }
  await ctx.wallet.stop();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
