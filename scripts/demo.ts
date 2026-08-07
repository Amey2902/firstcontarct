/**
 * End-to-end demo of the membership-club contract on the active network.
 *
 * Drives the full member lifecycle against the deployed contract:
 *   1. join at the tier unlocked by a 5-token balance (Silver)
 *   2. claim a Silver perk
 *   3. upgrade to Diamond by proving a 25-token balance
 *   4. resign
 *
 * Every step is a zero-knowledge proof of the (in-memory, never-stored) token
 * balance. The on-chain ledger only ever records commitments, tiers and the
 * public perk/stat counters.
 *
 * Usage: npm run demo
 */
import { WebSocket } from 'ws';
import * as Rx from 'rxjs';

import { findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import { resolveNetwork, getOrCreateSeed, getDeployment } from '../src/network';
import { createWallet, persistWalletState, unshieldedToken } from '../src/wallet';
import { createProviders } from '../src/providers';
import {
  CONTRACT_NAME,
  loadContractModule,
  loadCompiledContract,
  setSimulatedBalance,
  computeCommitment,
  tierName,
} from '../src/contract';

// @ts-expect-error Required for wallet sync
globalThis.WebSocket = WebSocket;

const PRIVATE_STATE_ID = `${CONTRACT_NAME}PrivateState`;

const { network, config: networkConfig } = resolveNetwork();
const SEED = getOrCreateSeed(network);

const PERKS: Record<string, { perkId: bigint; name: string; requiredTier: bigint }> = {
  communityBadge: { perkId: 0n, name: 'Community Badge', requiredTier: 0n },
  vipLounge: { perkId: 1n, name: 'VIP Lounge Access', requiredTier: 1n },
  airdrops: { perkId: 2n, name: 'Exclusive Airdrops', requiredTier: 2n },
  concierge: { perkId: 3n, name: 'Personal Concierge', requiredTier: 3n },
};

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// Waits until the wallet has fully absorbed the chain: synced AND no
// transactions left pending. Building the next transaction before this point
// risks reusing a coin the previous transaction already spent (double spend).
async function settle(wallet: any) {
  await Rx.firstValueFrom(
    wallet.state().pipe(
      Rx.filter((s: any) => s.isSynced),
      Rx.filter((s: any) => s.pending.all.length === 0),
      Rx.throttleTime(5000),
    ),
  );
}

async function submitWithRetry(wallet: any, fn: () => Promise<any>, label: string, attempts = 3) {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      if (attempt === attempts) throw err;
      console.log(`    (${label} failed on attempt ${attempt}, retrying...)`);
      await sleep(15_000);
      await settle(wallet);
    }
  }
}

async function main() {
  const deployment = getDeployment(network);
  if (!deployment) {
    console.error(`No deploy on file for network ${network}. Run: npm run setup`);
    process.exit(1);
  }

  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║          Midnight Membership Club — demo                       ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');
  console.log(`  Contract: ${deployment.address}`);
  console.log(`  Network:  ${network}\n`);

  const walletCtx = await createWallet({ network, networkConfig, seed: SEED });
  console.log('  Syncing wallet...');
  const state = await walletCtx.wallet.waitForSyncedState();
  await persistWalletState(network, walletCtx);
  const balance = state.unshielded.balances[unshieldedToken().raw] ?? 0n;
  console.log(`  tNight balance: ${balance.toLocaleString()}\n`);

  const providers = await createProviders(walletCtx, networkConfig);

  const deployed: any = await findDeployedContract(providers, {
    compiledContract: await loadCompiledContract(),
    contractAddress: deployment.address,
    privateStateId: PRIVATE_STATE_ID,
    initialPrivateState: {},
  });

  const { ledger } = await loadContractModule();

  const ownerKey = walletCtx.unshieldedKeystore.getBech32Address().toString();
  const commitment = computeCommitment(ownerKey);
  console.log(`  Member commitment (on-chain identity): ${commitment.slice(0, 24)}…\n`);

  const readLedger = async () => {
    const cs = await providers.publicDataProvider.queryContractState(deployment.address);
    return cs ? ledger(cs.data) : null;
  };

  // ── Step 0: clean slate — resign first if a previous run left a member.
  console.log('  Preparing clean slate...');
  setSimulatedBalance(0n);
  try {
    await deployed.callTx.leave(commitment);
    await settle(walletCtx.wallet);
    console.log('  (removed leftover membership from an earlier run)\n');
  } catch {
    console.log('  (no leftover membership)\n');
  }

  // ── Step 1: join as Silver (prove a 5-token balance).
  console.log('  ── Step 1: Join the club with a 5-token balance ──');
  setSimulatedBalance(5n);
  const reg = await submitWithRetry(walletCtx.wallet, () => deployed.callTx.register(commitment), 'register');
  await settle(walletCtx.wallet);
  await sleep(3000); // allow the indexer to catch up before reading back
  console.log(`    ✓ Registered — on-chain tier: ${tierName((await (await readLedger())!).members.lookup(commitment))}`);
  console.log(`    tx: ${reg.public.txId}`);

  // ── Step 2: claim a Silver perk.
  console.log('  ── Step 2: Claim a Silver-tier perk (VIP Lounge Access) ──');
  const perk = PERKS.vipLounge;
  setSimulatedBalance(5n);
  const claim = await submitWithRetry(walletCtx.wallet, () => deployed.callTx.claimPerk(commitment, perk.perkId, perk.requiredTier), 'claimPerk');
  await settle(walletCtx.wallet);
  console.log(`    ✓ Claimed "${perk.name}"`);
  console.log(`    tx: ${claim.public.txId}`);

  // ── Step 3: upgrade to Diamond (prove a 25-token balance).
  console.log('  ── Step 3: Upgrade to Diamond by proving a 25-token balance ──');
  setSimulatedBalance(25n);
  const up = await submitWithRetry(walletCtx.wallet, () => deployed.callTx.upgrade(commitment), 'upgrade');
  await settle(walletCtx.wallet);
  await sleep(3000); // allow the indexer to catch up before reading back
  console.log(`    ✓ Upgraded — on-chain tier: ${tierName((await (await readLedger())!).members.lookup(commitment))}`);
  console.log(`    tx: ${up.public.txId}`);

  // ── Step 4: resign.
  console.log('  ── Step 4: Resign from the club ──');
  const leave = await submitWithRetry(walletCtx.wallet, () => deployed.callTx.leave(commitment), 'leave');
  await settle(walletCtx.wallet);
  console.log(`    ✓ Left the club`);
  console.log(`    tx: ${leave.public.txId}`);

  // ── Final: show the public ledger.
  const finalLedger = await readLedger();
  console.log('\n  ── Public ledger after the demo ──');
  console.log(`    memberCount: ${finalLedger?.memberCount}`);
  console.log(`    perkClaims:  ${finalLedger?.perkClaims}`);
  console.log(`    members:     ${finalLedger?.members.size() === 0n ? '(none — commitment and tier never re-appear)' : '[unexpected]'}\n`);

  console.log('  Demo complete. The balances 5 and 25 were proved, never stored.\n');

  await persistWalletState(network, walletCtx);
  await walletCtx.wallet.stop();
}

main().catch(async (err) => {
  console.error(err);
  process.exit(1);
});
