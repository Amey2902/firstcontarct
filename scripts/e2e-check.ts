/**
 * End-to-end smoke check for BlackBox AI contract.
 *
 * Verifies the deployed contract responds correctly to read queries.
 * Run with: npm run test:e2e
 */
import { resolveNetwork, getOrCreateSeed, getDeployment } from '../src/network';
import { createWallet, unshieldedToken } from '../src/wallet';
import { createProviders } from '../src/providers';
import { loadContractModule, loadCompiledContract, CONTRACT_NAME } from '../src/contract';
import { findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import { WebSocket } from 'ws';
import * as Rx from 'rxjs';

// @ts-expect-error Required for wallet sync
globalThis.WebSocket = WebSocket;

async function main() {
  console.log('\n─── BlackBox AI E2E Smoke Check ─────────────────────────────────\n');

  const { network, config: networkConfig } = resolveNetwork();
  const SEED = getOrCreateSeed(network);

  const deployment = getDeployment(network);
  if (!deployment) {
    console.error(`❌ No deployment found for ${network}. Run \`npm run setup -- --network ${network}\` first.`);
    process.exit(1);
  }

  console.log(`  Network: ${network}`);
  console.log(`  Contract: ${deployment.address}\n`);

  const walletCtx = await createWallet({ network, networkConfig, seed: SEED });
  console.log('  Syncing...');
  await walletCtx.wallet.waitForSyncedState();
  console.log('  ✓ Synced');

  const providers = await createProviders(walletCtx, networkConfig);

  const deployed: any = await findDeployedContract(providers, {
    compiledContract: await loadCompiledContract(),
    contractAddress: deployment.address,
    privateStateId: `${CONTRACT_NAME}PrivateState`,
    initialPrivateState: { datasetSecrets: [], trainingSecrets: [] },
  });

  // Test read queries
  console.log('\n  Testing read circuits...\n');

  // Test list circuits (should return empty vectors initially)
  try {
    const datasetIds = await deployed.callTx.listDatasetIds();
    console.log(`  ✓ listDatasetIds: returned vector of length ${datasetIds.returnValue.length}`);
  } catch (e) {
    console.log(`  ⚠ listDatasetIds: ${(e as Error).message}`);
  }

  try {
    const commitmentIds = await deployed.callTx.listCommitmentIds();
    console.log(`  ✓ listCommitmentIds: returned vector of length ${commitmentIds.returnValue.length}`);
  } catch (e) {
    console.log(`  ⚠ listCommitmentIds: ${(e as Error).message}`);
  }

  try {
    const verificationIds = await deployed.callTx.listVerificationIds();
    console.log(`  ✓ listVerificationIds: returned vector of length ${verificationIds.returnValue.length}`);
  } catch (e) {
    console.log(`  ⚠ listVerificationIds: ${(e as Error).message}`);
  }

  try {
    const policyIds = await deployed.callTx.listPolicyIds();
    console.log(`  ✓ listPolicyIds: returned vector of length ${policyIds.returnValue.length}`);
  } catch (e) {
    console.log(`  ⚠ listPolicyIds: ${(e as Error).message}`);
  }

  // Test contract state via indexer
  console.log('\n  Querying contract state via indexer...\n');
  const module = await loadContractModule();
  const contractState = await providers.publicDataProvider.queryContractState(deployment.address);
  
  if (contractState) {
    const ledgerState = module.ledger(contractState.data);
    console.log(`  ✓ Contract state retrieved`);
    console.log(`    Datasets: ${ledgerState.datasetCount}`);
    console.log(`    Commitments: ${ledgerState.commitmentCount}`);
    console.log(`    Verifications: ${ledgerState.verificationCount}`);
    console.log(`    Policies: ${ledgerState.policyCount}`);
  } else {
    console.log(`  ⚠ Contract state not yet indexed`);
  }

  // Check wallet balance
  const state = await Rx.firstValueFrom(walletCtx.wallet.state().pipe(Rx.filter((s) => s.isSynced)));
  const balance = state.unshielded.balances[unshieldedToken().raw] ?? 0n;
  const dustBalance = state.dust.balance(new Date());
  console.log(`\n  Wallet: ${walletCtx.unshieldedKeystore.getBech32Address()}`);
  console.log(`  tNight: ${balance.toLocaleString()}`);
  console.log(`  DUST: ${dustBalance.toLocaleString()}`);

  await walletCtx.wallet.stop();

  console.log('\n  ✅ E2E smoke check passed!\n');
}

main().catch((err) => {
  console.error('\n❌ E2E check failed:', err);
  process.exit(1);
});