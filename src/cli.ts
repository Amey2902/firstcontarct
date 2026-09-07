/**
 * CLI for interacting with the BlackBox AI contract.
 *
 * Dataset owners register datasets with licensing info. AI companies commit
 * to training runs. Verifiers run ZK compliance checks against policies.
 * All sensitive data stays private via zero-knowledge proofs.
 */
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { WebSocket } from 'ws';

// Midnight SDK imports
import { findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import { resolveNetwork, getOrCreateSeed, getDeployment } from './network';
import { createWallet, persistWalletState, unshieldedToken } from './wallet';
import { createProviders } from './providers';
import { loadContractModule, loadCompiledContract, CONTRACT_NAME } from './contract';
import {
  setSimulatedDatasetContentHash,
  setSimulatedLicenseProof,
  setSimulatedTrainingDataHashes,
  setSimulatedDatasetLicenses,
  setSimulatedCurrentTimestamp,
  computeDatasetId,
  computeCommitmentId,
  computeVerificationId,
  computePolicyId,
  licenseTypeName,
  authStatusName,
  LICENSE_TYPES,
  AUTH_STATUS,
} from './contract';

// Enable WebSocket for GraphQL subscriptions
// @ts-expect-error Required for wallet sync
globalThis.WebSocket = WebSocket;

const { network, config: networkConfig } = resolveNetwork();
const SEED = getOrCreateSeed(network);

const PRIVATE_STATE_ID = `${CONTRACT_NAME}PrivateState`;

const LICENSE_MENU = [
  { id: LICENSE_TYPES.COMMERCIAL, name: 'Commercial License' },
  { id: LICENSE_TYPES.OPEN_SOURCE, name: 'Open Source (MIT/Apache/BSD)' },
  { id: LICENSE_TYPES.PROPRIETARY, name: 'Proprietary/Internal' },
  { id: LICENSE_TYPES.RESTRICTED, name: 'Restricted/No AI Training' },
];

const AUTH_MENU = [
  { id: AUTH_STATUS.PENDING, name: 'Pending Review' },
  { id: AUTH_STATUS.AUTHORIZED, name: 'Authorized for AI Training' },
  { id: AUTH_STATUS.REVOKED, name: 'Revoked' },
  { id: AUTH_STATUS.EXPIRED, name: 'Expired' },
];

// ─── State helpers ──────────────────────────────────────────────────────────────

async function showContractState(providers: Awaited<ReturnType<typeof createProviders>>, address: string) {
  const module = await loadContractModule();
  const contractState = await providers.publicDataProvider.queryContractState(address);
  if (!contractState) {
    console.log('\n  📋 No contract state found (contract not indexed yet).\n');
    return;
  }
  const ledgerState = module.ledger(contractState.data);
  console.log('\n  ── BlackBox AI State (Public Ledger) ──');
  console.log(`  Datasets Registered: ${ledgerState.datasetCount}`);
  console.log(`  Training Commitments: ${ledgerState.commitmentCount}`);
  console.log(`  Verifications Run: ${ledgerState.verificationCount}`);
  console.log(`  Policies Created: ${ledgerState.policyCount}`);
  console.log('');
}

// ─── Main CLI ──────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════════════════════╗');
  console.log('║          BlackBox AI — Privacy-Preserving Training Data Verification       ║');
  console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');

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
      initialPrivateState: { datasetSecrets: [], trainingSecrets: [] },
    });

    console.log('  ✅ Connected!\n');

    const ownerAddress = walletCtx.unshieldedKeystore.getBech32Address().toString();
    console.log(`  Your Address: ${ownerAddress}`);

    let running = true;
    while (running) {
      console.log('─── Main Menu ───────────────────────────────────────────────────');
      console.log('  DATASET OWNER ACTIONS:');
      console.log('  1. Register a new dataset');
      console.log('  2. Update dataset authorization status');
      console.log('  3. Revoke dataset');
      console.log('  4. View dataset info');
      console.log('');
      console.log('  AI COMPANY ACTIONS:');
      console.log('  5. Commit training run (link datasets to model)');
      console.log('  6. View training commitment');
      console.log('');
      console.log('  VERIFIER / AUDITOR ACTIONS:');
      console.log('  7. Create verification policy');
      console.log('  8. Run ZK compliance verification');
      console.log('  9. View verification result');
      console.log('');
      console.log('  GENERAL:');
      console.log('  10. View contract state (public ledger)');
      console.log('  11. Check wallet balance');
      console.log('  12. Exit\n');

      const choice = await rl.question('  Your choice: ');

      switch (choice.trim()) {
        case '1': {
          // Register dataset
          console.log('\n  ── Register Dataset ───────────────────────────────────────────');
          const datasetName = (await rl.question('  Dataset name: ')).trim();
          if (!datasetName) {
            console.log('  ❌ Dataset name required.\n');
            break;
          }

          console.log('\n  License type:');
          for (let i = 0; i < LICENSE_MENU.length; i++) {
            console.log(`    ${i + 1}. ${LICENSE_MENU[i].name}`);
          }
          const licenseChoice = parseInt((await rl.question('  Choice [1-4]: ')).trim(), 10) - 1;
          if (![0, 1, 2, 3].includes(licenseChoice)) {
            console.log('  ❌ Invalid choice.\n');
            break;
          }
          const licenseType = LICENSE_MENU[licenseChoice].id;

          console.log('\n  Authorization status:');
          for (let i = 0; i < AUTH_MENU.length; i++) {
            console.log(`    ${i + 1}. ${AUTH_MENU[i].name}`);
          }
          const authChoice = parseInt((await rl.question('  Choice [1-4]: ')).trim(), 10) - 1;
          if (![0, 1, 2, 3].includes(authChoice)) {
            console.log('  ❌ Invalid choice.\n');
            break;
          }
          const authorizationStatus = AUTH_MENU[authChoice].id;

          const validFromInput = (await rl.question('  Valid from (Unix timestamp, empty=now): ')).trim();
          const validFrom = validFromInput ? BigInt(validFromInput) : BigInt(Math.floor(Date.now() / 1000));

          const validUntilInput = (await rl.question('  Valid until (Unix timestamp, empty=10 years): ')).trim();
          const validUntil = validUntilInput ? BigInt(validUntilInput) : BigInt(Math.floor(Date.now() / 1000) + 10 * 365 * 24 * 60 * 60);

          const metadataHash = (await rl.question('  Metadata hash (IPFS/Arweave CID, optional): ')).trim() || '0x';

          // Simulate private witnesses
          const contentHash = `0x${computeDatasetId(ownerAddress, datasetName).slice(0, 64)}`;
          const licenseHash = `0x${computeDatasetId(ownerAddress, datasetName + '-license').slice(0, 64)}`;
          const licenseProof = `0x${computeDatasetId(ownerAddress, datasetName + '-proof').slice(0, 64)}`;

          setSimulatedDatasetContentHash(contentHash);
          setSimulatedLicenseProof(licenseProof);
          setSimulatedCurrentTimestamp(Math.floor(Date.now() / 1000));

          const datasetId = computeDatasetId(ownerAddress, datasetName);

          console.log('\n  Registering dataset... (30-60s)\n');
          try {
            const tx = await deployed.callTx.registerDataset(
              datasetId,
              ownerAddress,
              contentHash,
              licenseHash,
              licenseType,
              authorizationStatus,
              validFrom,
              validUntil,
              metadataHash
            );
            console.log('  ✅ Dataset registered successfully!');
            console.log(`  Dataset ID: ${datasetId}`);
            console.log(`  License: ${licenseTypeName(licenseType)}`);
            console.log(`  Status: ${authStatusName(authorizationStatus)}`);
            console.log(`  Valid: ${new Date(Number(validFrom) * 1000).toISOString()} → ${new Date(Number(validUntil) * 1000).toISOString()}`);
            console.log(`  Transaction ID: ${tx.public.txId}`);
            console.log(`  Block height: ${tx.public.blockHeight}\n`);
          } catch (error) {
            console.error(`\n  ❌ Failed: ${error instanceof Error ? error.message : error}\n`);
          }
          break;
        }

        case '2': {
          // Update authorization
          console.log('\n  ── Update Authorization Status ────────────────────────────────');
          const datasetId = (await rl.question('  Dataset ID: ')).trim();
          if (!datasetId) {
            console.log('  ❌ Dataset ID required.\n');
            break;
          }

          console.log('\n  New authorization status:');
          for (let i = 0; i < AUTH_MENU.length; i++) {
            console.log(`    ${i + 1}. ${AUTH_MENU[i].name}`);
          }
          const authChoice = parseInt((await rl.question('  Choice [1-4]: ')).trim(), 10) - 1;
          if (![0, 1, 2, 3].includes(authChoice)) {
            console.log('  ❌ Invalid choice.\n');
            break;
          }
          const newStatus = AUTH_MENU[authChoice].id;

          console.log('\n  Updating authorization... (30-60s)\n');
          try {
            const tx = await deployed.callTx.updateAuthorization(datasetId, newStatus, ownerAddress);
            console.log('  ✅ Authorization updated!');
            console.log(`  New Status: ${authStatusName(newStatus)}`);
            console.log(`  Transaction ID: ${tx.public.txId}`);
            console.log(`  Block height: ${tx.public.blockHeight}\n`);
          } catch (error) {
            console.error(`\n  ❌ Failed: ${error instanceof Error ? error.message : error}\n`);
          }
          break;
        }

        case '3': {
          // Revoke dataset
          console.log('\n  ── Revoke Dataset ─────────────────────────────────────────────');
          const datasetId = (await rl.question('  Dataset ID: ')).trim();
          if (!datasetId) {
            console.log('  ❌ Dataset ID required.\n');
            break;
          }

          const confirm = await rl.question('  Confirm revocation? [y/N]: ');
          if (confirm.trim().toLowerCase() !== 'y') {
            console.log('\n  Cancelled.\n');
            break;
          }

          console.log('\n  Revoking dataset... (30-60s)\n');
          try {
            const tx = await deployed.callTx.revokeDataset(datasetId, ownerAddress);
            console.log('  ✅ Dataset revoked!');
            console.log(`  Transaction ID: ${tx.public.txId}`);
            console.log(`  Block height: ${tx.public.blockHeight}\n`);
          } catch (error) {
            console.error(`\n  ❌ Failed: ${error instanceof Error ? error.message : error}\n`);
          }
          break;
        }

        case '4': {
          // View dataset
          console.log('\n  ── View Dataset Info ──────────────────────────────────────────');
          const datasetId = (await rl.question('  Dataset ID: ')).trim();
          if (!datasetId) {
            console.log('  ❌ Dataset ID required.\n');
            break;
          }

          try {
            const result = await deployed.callTx.getDataset(datasetId);
            const info = result.returnValue;
            console.log('\n  Dataset Details:');
            console.log(`    ID: ${datasetId}`);
            console.log(`    Owner: ${info.owner}`);
            console.log(`    Content Hash: ${info.contentHash}`);
            console.log(`    License Hash: ${info.licenseHash}`);
            console.log(`    License Type: ${licenseTypeName(Number(info.licenseType))}`);
            console.log(`    Auth Status: ${authStatusName(Number(info.authorizationStatus))}`);
            console.log(`    Valid From: ${new Date(Number(info.validFrom) * 1000).toISOString()}`);
            console.log(`    Valid Until: ${new Date(Number(info.validUntil) * 1000).toISOString()}`);
            console.log(`    Registered: ${new Date(Number(info.registeredAt) * 1000).toISOString()}`);
            console.log(`    Metadata Hash: ${info.metadataHash}\n`);
          } catch (error) {
            console.error(`\n  ❌ Failed: ${error instanceof Error ? error.message : error}\n`);
          }
          break;
        }

        case '5': {
          // Commit training
          console.log('\n  ── Commit Training Run ────────────────────────────────────────');
          const modelName = (await rl.question('  Model name/identifier: ')).trim();
          if (!modelName) {
            console.log('  ❌ Model name required.\n');
            break;
          }

          const datasetCountInput = (await rl.question('  Number of datasets used (1-32): ')).trim();
          const datasetCount = parseInt(datasetCountInput, 10);
          if (isNaN(datasetCount) || datasetCount < 1 || datasetCount > 32) {
            console.log('  ❌ Must be between 1 and 32.\n');
            break;
          }

          const datasetIds: string[] = [];
          const dataHashes: string[] = [];
          const licenseHashes: string[] = [];

          for (let i = 0; i < datasetCount; i++) {
            const dId = (await rl.question(`  Dataset ${i + 1} ID: `)).trim();
            if (!dId) {
              console.log('  ❌ Dataset ID required.\n');
              datasetIds.length = 0;
              break;
            }
            datasetIds.push(dId);
            
            // Simulate private knowledge of content hash and license
            dataHashes.push(`0x${computeDatasetId(ownerAddress, dId + '-content').slice(0, 64)}`);
            licenseHashes.push(`0x${computeDatasetId(ownerAddress, dId + '-license').slice(0, 64)}`);
          }

          if (datasetIds.length === 0) break;

          const trainingTimestampInput = (await rl.question('  Training timestamp (Unix, empty=now): ')).trim();
          const trainingTimestamp = trainingTimestampInput ? BigInt(trainingTimestampInput) : BigInt(Math.floor(Date.now() / 1000));

          const modelHash = (await rl.question('  Model hash (optional): ')).trim() || `0x${computeCommitmentId(ownerAddress, modelName).slice(0, 64)}`;

          // Pad arrays to 32 elements
          while (dataHashes.length < 32) dataHashes.push('0x' + '0'.repeat(64));
          while (licenseHashes.length < 32) licenseHashes.push('0x' + '0'.repeat(64));
          while (datasetIds.length < 32) datasetIds.push('0x' + '0'.repeat(64));

          setSimulatedTrainingDataHashes(dataHashes);
          setSimulatedDatasetLicenses(licenseHashes);
          setSimulatedCurrentTimestamp(Math.floor(Date.now() / 1000));

          const commitmentId = computeCommitmentId(ownerAddress, modelName);

          console.log('\n  Committing training run... (30-60s)\n');
          try {
            const tx = await deployed.callTx.commitTraining(
              commitmentId,
              ownerAddress,
              datasetIds,
              BigInt(datasetCount),
              trainingTimestamp,
              modelHash
            );
            console.log('  ✅ Training commitment recorded!');
            console.log(`  Commitment ID: ${commitmentId}`);
            console.log(`  Datasets Used: ${datasetCount}`);
            console.log(`  Model Hash: ${modelHash}`);
            console.log(`  Training Time: ${new Date(Number(trainingTimestamp) * 1000).toISOString()}`);
            console.log(`  Transaction ID: ${tx.public.txId}`);
            console.log(`  Block height: ${tx.public.blockHeight}\n`);
          } catch (error) {
            console.error(`\n  ❌ Failed: ${error instanceof Error ? error.message : error}\n`);
          }
          break;
        }

        case '6': {
          // View commitment
          console.log('\n  ── View Training Commitment ───────────────────────────────────');
          const commitmentId = (await rl.question('  Commitment ID: ')).trim();
          if (!commitmentId) {
            console.log('  ❌ Commitment ID required.\n');
            break;
          }

          try {
            const result = await deployed.callTx.getCommitment(commitmentId);
            const info = result.returnValue;
            console.log('\n  Training Commitment Details:');
            console.log(`    ID: ${commitmentId}`);
            console.log(`    Trainer: ${info.trainer}`);
            console.log(`    Dataset Count: ${info.datasetCount}`);
            console.log(`    Dataset IDs: ${info.datasetIds.slice(0, Number(info.datasetCount)).join(', ')}`);
            console.log(`    Training Time: ${new Date(Number(info.trainingTimestamp) * 1000).toISOString()}`);
            console.log(`    Model Hash: ${info.modelHash}`);
            console.log(`    Committed: ${new Date(Number(info.committedAt) * 1000).toISOString()}\n`);
          } catch (error) {
            console.error(`\n  ❌ Failed: ${error instanceof Error ? error.message : error}\n`);
          }
          break;
        }

        case '7': {
          // Create policy
          console.log('\n  ── Create Verification Policy ─────────────────────────────────');
          const policyName = (await rl.question('  Policy name: ')).trim();
          if (!policyName) {
            console.log('  ❌ Policy name required.\n');
            break;
          }

          const minAuthInput = (await rl.question('  Minimum authorized % (0-100, default=100): ')).trim();
          const minAuthorizedPercentage = minAuthInput ? parseInt(minAuthInput, 10) : 100;

          const minLicInput = (await rl.question('  Minimum licensed % (0-100, default=95): ')).trim();
          const minLicensedPercentage = minLicInput ? parseInt(minLicInput, 10) : 95;

          const allowRestrictedInput = (await rl.question('  Allow restricted datasets? [y/N]: ')).trim();
          const allowRestricted = allowRestrictedInput.toLowerCase() === 'y';

          const requireValidInput = (await rl.question('  Require valid licenses at training time? [Y/n]: ')).trim();
          const requireValidLicenses = requireValidInput.toLowerCase() !== 'n';

          const policyId = computePolicyId(ownerAddress, policyName);

          console.log('\n  Creating policy... (30-60s)\n');
          try {
            const tx = await deployed.callTx.createPolicy(
              policyId,
              policyName,
              BigInt(minAuthorizedPercentage),
              BigInt(minLicensedPercentage),
              allowRestricted,
              requireValidLicenses,
              ownerAddress
            );
            console.log('  ✅ Policy created!');
            console.log(`  Policy ID: ${policyId}`);
            console.log(`  Name: ${policyName}`);
            console.log(`  Min Authorized: ${minAuthorizedPercentage}%`);
            console.log(`  Min Licensed: ${minLicensedPercentage}%`);
            console.log(`  Allow Restricted: ${allowRestricted ? 'Yes' : 'No'}`);
            console.log(`  Require Valid Licenses: ${requireValidLicenses ? 'Yes' : 'No'}`);
            console.log(`  Transaction ID: ${tx.public.txId}`);
            console.log(`  Block height: ${tx.public.blockHeight}\n`);
          } catch (error) {
            console.error(`\n  ❌ Failed: ${error instanceof Error ? error.message : error}\n`);
          }
          break;
        }

        case '8': {
          // Run ZK verification
          console.log('\n  ── Run ZK Compliance Verification ─────────────────────────────');
          const commitmentId = (await rl.question('  Commitment ID: ')).trim();
          if (!commitmentId) {
            console.log('  ❌ Commitment ID required.\n');
            break;
          }

          const policyId = (await rl.question('  Policy ID: ')).trim();
          if (!policyId) {
            console.log('  ❌ Policy ID required.\n');
            break;
          }

          const verificationId = computeVerificationId(commitmentId, policyId);

          // Simulate private witnesses for ZK proof
          // In reality, these would be computed from actual training data
          const dataHashes: string[] = [];
          const licenseHashes: string[] = [];
          
          // Fetch commitment to know how many datasets
          try {
            const commitmentResult = await deployed.callTx.getCommitment(commitmentId);
            const commitment = commitmentResult.returnValue;
            const count = Number(commitment.datasetCount);
            
            for (let i = 0; i < count; i++) {
              const dId = commitment.datasetIds[i];
              dataHashes.push(`0x${computeDatasetId(ownerAddress, dId + '-content').slice(0, 64)}`);
              licenseHashes.push(`0x${computeDatasetId(ownerAddress, dId + '-license').slice(0, 64)}`);
            }
            while (dataHashes.length < 32) dataHashes.push('0x' + '0'.repeat(64));
            while (licenseHashes.length < 32) licenseHashes.push('0x' + '0'.repeat(64));
          } catch {
            // Fallback
            for (let i = 0; i < 32; i++) {
              dataHashes.push('0x' + '0'.repeat(64));
              licenseHashes.push('0x' + '0'.repeat(64));
            }
          }

          setSimulatedTrainingDataHashes(dataHashes);
          setSimulatedDatasetLicenses(licenseHashes);
          setSimulatedCurrentTimestamp(Math.floor(Date.now() / 1000));

          console.log('\n  Running ZK compliance verification... (60-120s)\n');
          try {
            const tx = await deployed.callTx.verifyCompliance(
              verificationId,
              commitmentId,
              policyId,
              ownerAddress
            );
            console.log('  ✅ Verification complete!');
            console.log(`  Verification ID: ${verificationId}`);
            console.log(`  Transaction ID: ${tx.public.txId}`);
            console.log(`  Block height: ${tx.public.blockHeight}\n`);
            
            // Fetch and display result
            const result = await deployed.callTx.getVerification(verificationId);
            const v = result.returnValue;
            console.log('  ── Verification Result ──');
            console.log(`    Compliant: ${v.isCompliant ? '✅ YES' : '❌ NO'}`);
            console.log(`    Authorized Data: ${v.authorizedPercentage}%`);
            console.log(`    Licensed Data: ${v.licensedPercentage}%`);
            console.log(`    Restricted Datasets: ${v.restrictedCount}`);
            console.log(`    Expired Licenses: ${v.expiredLicenseCount}`);
            console.log(`    Verified At: ${new Date(Number(v.verifiedAt) * 1000).toISOString()}\n`);
          } catch (error) {
            console.error(`\n  ❌ Failed: ${error instanceof Error ? error.message : error}\n`);
          }
          break;
        }

        case '9': {
          // View verification result
          console.log('\n  ── View Verification Result ───────────────────────────────────');
          const verificationId = (await rl.question('  Verification ID: ')).trim();
          if (!verificationId) {
            console.log('  ❌ Verification ID required.\n');
            break;
          }

          try {
            const result = await deployed.callTx.getVerification(verificationId);
            const v = result.returnValue;
            console.log('\n  Verification Result:');
            console.log(`    ID: ${verificationId}`);
            console.log(`    Commitment: ${v.commitmentId}`);
            console.log(`    Policy: ${v.policyId}`);
            console.log(`    Compliant: ${v.isCompliant ? '✅ YES' : '❌ NO'}`);
            console.log(`    Authorized %: ${v.authorizedPercentage}%`);
            console.log(`    Licensed %: ${v.licensedPercentage}%`);
            console.log(`    Restricted Count: ${v.restrictedCount}`);
            console.log(`    Expired Licenses: ${v.expiredLicenseCount}`);
            console.log(`    Verified At: ${new Date(Number(v.verifiedAt) * 1000).toISOString()}`);
            console.log(`    Verified By: ${v.verifiedBy}\n`);
          } catch (error) {
            console.error(`\n  ❌ Failed: ${error instanceof Error ? error.message : error}\n`);
          }
          break;
        }

        case '10': {
          // View contract state
          try {
            await showContractState(providers, deployment.address);
          } catch (error) {
            console.error(`\n  ❌ Failed: ${error instanceof Error ? error.message : error}\n`);
          }
          break;
        }

        case '11': {
          // Check wallet balance
          const currentState = await walletCtx.wallet.waitForSyncedState();
          const currentBalance = currentState.unshielded.balances[unshieldedToken().raw] ?? 0n;
          const dustBalance = currentState.dust.balance(new Date());
          console.log(`\n  tNight: ${currentBalance.toLocaleString()}`);
          console.log(`  DUST: ${dustBalance.toLocaleString()}\n`);
          break;
        }

        case '12': {
          running = false;
          console.log('\n  👋 Goodbye!\n');
          break;
        }

        default:
          console.log('\n  ❌ Invalid choice. Please enter 1-12.\n');
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