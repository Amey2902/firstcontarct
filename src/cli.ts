/**
 * CLI for interacting with the membership-club contract.
 *
 * Everything a member does goes through a zero-knowledge proof of their
 * (private, in-memory) token balance. The balance is typed into this terminal,
 * used inside the circuit for one transaction, and never leaves the process.
 */
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { WebSocket } from 'ws';

// Midnight SDK imports
import { findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import { resolveNetwork, getOrCreateSeed, getDeployment } from './network';
import { createWallet, persistWalletState, unshieldedToken } from './wallet';
import { createProviders } from './providers';
import { loadContractModule, loadCompiledContract, setSimulatedBalance, computeCommitment, tierName, CONTRACT_NAME } from './contract';

// Enable WebSocket for GraphQL subscriptions
// @ts-expect-error Required for wallet sync
globalThis.WebSocket = WebSocket;

const { network, config: networkConfig } = resolveNetwork();
const SEED = getOrCreateSeed(network);

// Must match the privateStateId used at deploy time so the CLI reconnects to
// the same private state.
const PRIVATE_STATE_ID = `${CONTRACT_NAME}PrivateState`;

// Hard-coded perk catalogue used by the demo. In a real deployment this would
// live off-chain and only the (perkId, requiredTier) pair would reach the chain.
const PERKS = [
  { perkId: 0n, name: 'Community Badge', requiredTier: 0n },
  { perkId: 1n, name: 'VIP Lounge Access', requiredTier: 1n },
  { perkId: 2n, name: 'Exclusive Airdrops', requiredTier: 2n },
  { perkId: 3n, name: 'Personal Concierge', requiredTier: 3n },
];

const TIER_MENU = ['1. Bronze', '2. Silver', '3. Gold', '4. Diamond'];

// ─── Club state helpers ────────────────────────────────────────────────────────

async function computeTier(
  providers: Awaited<ReturnType<typeof createProviders>>,
  address: string,
  balance: bigint,
): Promise<bigint> {
  const module = await loadContractModule();
  const contractState = await providers.publicDataProvider.queryContractState(address);
  if (!contractState) return 0n;
  const ledgerState = module.ledger(contractState.data);
  const thresholds = ledgerState.thresholds;
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (balance >= thresholds[i]) return BigInt(i);
  }
  return 0n;
}

async function showClubState(providers: Awaited<ReturnType<typeof createProviders>>, address: string) {
  const module = await loadContractModule();
  const contractState = await providers.publicDataProvider.queryContractState(address);
  if (!contractState) {
    console.log('\n  📋 No club state found (contract not indexed yet).\n');
    return;
  }
  const ledgerState = module.ledger(contractState.data);
  console.log('\n  ── Club state (public ledger) ──');
  const names = ['Bronze', 'Silver', 'Gold', 'Diamond'];
  console.log('  Thresholds (tokens to unlock each tier):');
  for (let i = 0; i < ledgerState.thresholds.length; i++) {
    console.log(`    ${names[i]}: ${ledgerState.thresholds[i]} tokens`);
  }
  console.log(`  Member count: ${ledgerState.memberCount}`);
  console.log(`  Perks claimed: ${ledgerState.perkClaims}`);
  console.log('  Members (commitment -> tier):');
  if (ledgerState.members.size() === 0n) {
    console.log('    (no members yet)');
  } else {
    for (const [commitment, tier] of ledgerState.members) {
      console.log(`    ${commitment.slice(0, 16)}…  →  ${tierName(tier)}`);
    }
  }
  console.log('');
}

// ─── Main CLI ──────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║          Midnight Membership Club — CLI                          ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');

  const rl = createInterface({ input: stdin, output: stdout });

  const deployment = getDeployment(network);
  if (!deployment) {
    console.error(`No deploy on file for network ${network}. Run \`npm run setup -- --network ${network}\` first.`);
    process.exit(1);
  }
  console.log(`  Contract: ${deployment.address}`);
  console.log(`  Network: ${network}\n`);

  try {
    const walletCtx = await createWallet({ network, networkConfig, seed: SEED });
    const restoredCount = Object.values(walletCtx.restored).filter(Boolean).length;
    if (restoredCount > 0) {
      console.log(`  Restored ${restoredCount}/3 child wallets from .midnight-wallet-state — sync will resume from saved point.`);
    }

    console.log('  Syncing with network...');
    console.log('  ℹ  This may take several minutes depending on network size.');
    console.log('     RPC disconnection messages during sync are normal and can be safely ignored.\n');
    const syncStart = Date.now();
    const syncInterval = setInterval(() => {
      const elapsed = Math.round((Date.now() - syncStart) / 1000);
      process.stdout.write(`\r  ⏳ Still syncing... (${elapsed}s elapsed)   `);
    }, 5000);
    const state = await walletCtx.wallet.waitForSyncedState();
    clearInterval(syncInterval);
    process.stdout.write('\r  ✓ Synced with network.                                      \n');

    await persistWalletState(network, walletCtx);
    const balance = state.unshielded.balances[unshieldedToken().raw] ?? 0n;
    console.log(`  Balance: ${balance.toLocaleString()} tNight\n`);

    if (balance === 0n && network !== 'undeployed' && networkConfig.faucet) {
      const address = walletCtx.unshieldedKeystore.getBech32Address();
      console.log('  ⚠ Wallet has no tNight. Fund it from the faucet to send transactions:');
      console.log(`     ${networkConfig.faucet}`);
      console.log(`     Wallet address: ${address}\n`);
    }

    console.log('  Connecting to contract...');
    const providers = await createProviders(walletCtx, networkConfig);

    const deployed: any = await findDeployedContract(providers, {
      compiledContract: await loadCompiledContract(),
      contractAddress: deployment.address,
      privateStateId: PRIVATE_STATE_ID,
      initialPrivateState: {},
    });

    console.log('  ✅ Connected!\n');

    // The member's pseudonymous identity. The commitment is a one-way hash of
    // the wallet address — what the chain sees is a random-looking string, not
    // this address and never a balance.
    const ownerKey = walletCtx.unshieldedKeystore.getBech32Address().toString();
    const commitment = computeCommitment(ownerKey);
    console.log(`  Your commitment (on-chain identity): ${commitment.slice(0, 16)}…`);

    let running = true;
    while (running) {
      console.log('─── Menu ───────────────────────────────────────────────────────');
      console.log('  1. Join the club (register)');
      console.log('  2. Upgrade membership tier');
      console.log('  3. Claim a perk');
      console.log('  4. Leave the club');
      console.log('  5. View club state (public ledger)');
      console.log('  6. Check wallet balance');
      console.log('  7. Exit\n');

      const choice = await rl.question('  Your choice: ');

      switch (choice.trim()) {
        case '1': {
          console.log('\n  Pick the tier you want to join at:');
          for (const line of TIER_MENU) console.log(`  ${line}`);
          console.log('  (the club proves you hold enough tokens — the number stays secret)\n');
          const tierChoice = (await rl.question('  Tier [1-4]: ')).trim();
          const tierIdx = parseInt(tierChoice, 10) - 1;
          if (![0, 1, 2, 3].includes(tierIdx)) {
            console.log('  ❌ Invalid tier.\n');
            break;
          }
          const balanceInput = await rl.question('  Your (simulated) token balance: ');
          const tokenBalance = BigInt(balanceInput.trim() || '0');
          setSimulatedBalance(tokenBalance);
          const actualTier = await computeTier(providers, deployment.address, tokenBalance);
          console.log('\n  Proving ownership of your balance... (30-60s)\n');
          try {
            const tx = await deployed.callTx.register(commitment);
            console.log(`  ✅ Registered as ${tierName(actualTier)}!`);
            console.log(`  Transaction ID: ${tx.public.txId}`);
            console.log(`  Block height: ${tx.public.blockHeight}\n`);
          } catch (error) {
            console.error(`\n  ❌ Failed: ${error instanceof Error ? error.message : error}`);
            console.error('  (hint: your balance must be ≥ the tier threshold, and you must not already be a member)\n');
          }
          break;
        }

        case '2': {
          const balanceInput = await rl.question('  Your (simulated) new token balance: ');
          const tokenBalance = BigInt(balanceInput.trim() || '0');
          setSimulatedBalance(tokenBalance);
          const newTier = await computeTier(providers, deployment.address, tokenBalance);
          console.log('\n  Proving the higher balance... (30-60s)\n');
          try {
            const tx = await deployed.callTx.upgrade(commitment);
            console.log(`  ✅ Membership upgraded to ${tierName(newTier)}!`);
            console.log(`  Transaction ID: ${tx.public.txId}`);
            console.log(`  Block height: ${tx.public.blockHeight}\n`);
          } catch (error) {
            console.error(`\n  ❌ Failed: ${error instanceof Error ? error.message : error}`);
            console.error('  (hint: you must be a member and the new balance must unlock a higher tier)\n');
          }
          break;
        }

        case '3': {
          console.log('\n  Available perks:');
          for (const perk of PERKS) console.log(`    ${Number(perk.perkId) + 1}. ${perk.name} (requires ${tierName(perk.requiredTier)})`);
          const perkChoice = (await rl.question('  Perk [1-4]: ')).trim();
          const perk = PERKS[parseInt(perkChoice, 10) - 1];
          if (!perk) {
            console.log('  ❌ Invalid perk.\n');
            break;
          }
          const balanceInput = await rl.question('  Your (simulated) token balance: ');
          setSimulatedBalance(BigInt(balanceInput.trim() || '0'));
          console.log(`\n  Claiming "${perk.name}"... (30-60s)\n`);
          try {
            const tx = await deployed.callTx.claimPerk(commitment, perk.perkId, perk.requiredTier);
            console.log(`  ✅ Perk claimed: ${perk.name}`);
            console.log(`  Transaction ID: ${tx.public.txId}`);
            console.log(`  Block height: ${tx.public.blockHeight}\n`);
          } catch (error) {
            console.error(`\n  ❌ Failed: ${error instanceof Error ? error.message : error}`);
            console.error('  (hint: your tier must be ≥ the perk’s required tier)\n');
          }
          break;
        }

        case '4': {
          const confirm = await rl.question('  Resign from the club? [y/N]: ');
          if (confirm.trim().toLowerCase() === 'y') {
            console.log('\n  Leaving the club... (30-60s)\n');
            try {
              const tx = await deployed.callTx.leave(commitment);
              console.log('  ✅ You have left the club.');
              console.log(`  Transaction ID: ${tx.public.txId}`);
              console.log(`  Block height: ${tx.public.blockHeight}\n`);
            } catch (error) {
              console.error(`\n  ❌ Failed: ${error instanceof Error ? error.message : error}`);
            }
          } else {
            console.log('\n  Cancelled.\n');
          }
          break;
        }

        case '5':
          try {
            await showClubState(providers, deployment.address);
          } catch (error) {
            console.error(`\n  ❌ Failed: ${error instanceof Error ? error.message : error}\n`);
          }
          break;

        case '6': {
          const currentState = await walletCtx.wallet.waitForSyncedState();
          const currentBalance = currentState.unshielded.balances[unshieldedToken().raw] ?? 0n;
          const dustBalance = currentState.dust.balance(new Date());
          console.log(`\n  tNight: ${currentBalance.toLocaleString()}`);
          console.log(`  DUST: ${dustBalance.toLocaleString()}\n`);
          break;
        }

        case '7':
          running = false;
          console.log('\n  👋 Goodbye!\n');
          break;

        default:
          console.log('\n  ❌ Invalid choice. Please enter 1-7.\n');
      }
    }

    await persistWalletState(network, walletCtx);
    await walletCtx.wallet.stop();
  } catch (error) {
    console.error('\n❌ Error:', error instanceof Error ? error.message : error);
  } finally {
    rl.close();
  }
}

main().catch(console.error);
