/**
 * BlackBox AI - Full Lifecycle Demo
 *
 * Demonstrates the complete flow:
 * 1. Dataset owner registers datasets with different licenses
 * 2. AI company commits a training run using those datasets
 * 3. Verifier creates a compliance policy
 * 4. ZK verification proves compliance without revealing data
 *
 * Run with: npm run demo
 */
import { resolveNetwork, getOrCreateSeed } from '../src/network';
import { createWallet, persistWalletState, unshieldedToken } from '../src/wallet';
import { createProviders } from '../src/providers';
import { loadContractModule, loadCompiledContract, CONTRACT_NAME } from '../src/contract';
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
} from '../src/contract';
import { findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import { createHash } from 'node:crypto';

// @ts-expect-error Required for wallet sync
globalThis.WebSocket = WebSocket;

function hexToBytes(hex: string): Uint8Array {
  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(cleanHex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

const { network, config: networkConfig } = resolveNetwork();
const SEED = getOrCreateSeed(network);
const PRIVATE_STATE_ID = `${CONTRACT_NAME}PrivateState`;

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════════════════════╗');
  console.log('║          BlackBox AI — Full Lifecycle Demo                                ║');
  console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');

  console.log(`  Network: ${network}\n`);

  // ─── Wallet Setup ─────────────────────────────────────────────────────────────
  console.log('─── 1. Wallet Setup ─────────────────────────────────────────────\n');
  const walletCtx = await createWallet({ network, networkConfig, seed: SEED });
  const restoredCount = Object.values(walletCtx.restored).filter(Boolean).length;
  if (restoredCount > 0) {
    console.log(`  Restored ${restoredCount}/3 child wallets from saved state.`);
  }

  console.log('  Syncing with network...');
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
  console.log(`  Wallet: ${walletCtx.unshieldedKeystore.getBech32Address()}`);
  console.log(`  Balance: ${balance.toLocaleString()} tNight\n`);

  // Derive 32-byte owner identifier from wallet public key
  const pubKey = walletCtx.unshieldedKeystore.getPublicKey().toString();
  const ownerAddress = '0x' + createHash('sha256').update(pubKey).digest('hex');
  console.log(`  Owner ID (32 bytes): ${ownerAddress}\n`);

  // ─── Connect to Contract ──────────────────────────────────────────────────────
  console.log('─── 2. Connecting to Contract ───────────────────────────────────\n');
  const providers = await createProviders(walletCtx, networkConfig);

  const deployment = (await import('../src/network')).getDeployment(network);
  if (!deployment) {
    console.error('  No deployment found. Run `npm run setup` first.');
    await walletCtx.wallet.stop();
    process.exit(1);
  }

  const deployed: any = await findDeployedContract(providers, {
    compiledContract: await loadCompiledContract(),
    contractAddress: deployment.address,
    privateStateId: PRIVATE_STATE_ID,
    initialPrivateState: { datasetSecrets: [], trainingSecrets: [] },
  });

  console.log(`  Contract: ${deployment.address}`);
  console.log('  ✅ Connected!\n');

  // ─── Step 1: Register Datasets ────────────────────────────────────────────────
  console.log('─── 3. Registering Datasets (Dataset Owner) ─────────────────────\n');

  const runSuffix = Date.now().toString();

  // Dataset A - Commercially Licensed ✅
  const datasetAId = `0x${computeDatasetId(ownerAddress, 'Dataset-A-CommonCrawl-' + runSuffix)}`;
  const contentHashA = `0x${computeDatasetId(ownerAddress, 'Dataset-A-CommonCrawl-content-' + runSuffix).slice(0, 64)}`;
  const licenseHashA = `0x${computeDatasetId(ownerAddress, 'Dataset-A-CommonCrawl-license-' + runSuffix).slice(0, 64)}`;
  const licenseProofA = `0x${computeDatasetId(ownerAddress, 'Dataset-A-CommonCrawl-proof-' + runSuffix).slice(0, 64)}`;

  setSimulatedDatasetContentHash(contentHashA);
  setSimulatedLicenseProof(licenseProofA);
  setSimulatedCurrentTimestamp(Math.floor(Date.now() / 1000));

  console.log('  Registering Dataset A (Commercially Licensed)...');
  const metadataHashA = '0x' + createHash('sha256').update('QmDatasetAMetadata').digest('hex');
  const txA = await deployed.callTx.registerDataset(
    hexToBytes(datasetAId),
    hexToBytes(ownerAddress),
    hexToBytes(contentHashA),
    hexToBytes(licenseHashA),
    BigInt(LICENSE_TYPES.COMMERCIAL),
    BigInt(AUTH_STATUS.AUTHORIZED),
    BigInt(Math.floor(Date.now() / 1000)),
    BigInt(Math.floor(Date.now() / 1000) + 10 * 365 * 24 * 60 * 60),
    hexToBytes(metadataHashA)
  );
  console.log(`  ✅ Dataset A registered (${licenseTypeName(LICENSE_TYPES.COMMERCIAL)}, ${authStatusName(AUTH_STATUS.AUTHORIZED)})`);
  console.log(`     Tx: ${txA.public.txId}`);

  await sleep(2000);

  // Dataset B - Open Source ✅
  const datasetBId = `0x${computeDatasetId(ownerAddress, 'Dataset-B-Wikipedia-' + runSuffix)}`;
  const contentHashB = `0x${computeDatasetId(ownerAddress, 'Dataset-B-Wikipedia-content-' + runSuffix).slice(0, 64)}`;
  const licenseHashB = `0x${computeDatasetId(ownerAddress, 'Dataset-B-Wikipedia-license-' + runSuffix).slice(0, 64)}`;
  const licenseProofB = `0x${computeDatasetId(ownerAddress, 'Dataset-B-Wikipedia-proof-' + runSuffix).slice(0, 64)}`;

  setSimulatedDatasetContentHash(contentHashB);
  setSimulatedLicenseProof(licenseProofB);
  setSimulatedCurrentTimestamp(Math.floor(Date.now() / 1000));

  console.log('  Registering Dataset B (Open Source - MIT)...');
  const metadataHashB = '0x' + createHash('sha256').update('QmDatasetBMetadata').digest('hex');
  const txB = await deployed.callTx.registerDataset(
    hexToBytes(datasetBId),
    hexToBytes(ownerAddress),
    hexToBytes(contentHashB),
    hexToBytes(licenseHashB),
    BigInt(LICENSE_TYPES.OPEN_SOURCE),
    BigInt(AUTH_STATUS.AUTHORIZED),
    BigInt(Math.floor(Date.now() / 1000)),
    BigInt(Math.floor(Date.now() / 1000) + 10 * 365 * 24 * 60 * 60),
    hexToBytes(metadataHashB)
  );
  console.log(`  ✅ Dataset B registered (${licenseTypeName(LICENSE_TYPES.OPEN_SOURCE)}, ${authStatusName(AUTH_STATUS.AUTHORIZED)})`);
  console.log(`     Tx: ${txB.public.txId}`);

  await sleep(2000);

  // Dataset C - Restricted ❌
  const datasetCId = `0x${computeDatasetId(ownerAddress, 'Dataset-C-Proprietary-' + runSuffix)}`;
  const contentHashC = `0x${computeDatasetId(ownerAddress, 'Dataset-C-Proprietary-content-' + runSuffix).slice(0, 64)}`;
  const licenseHashC = `0x${computeDatasetId(ownerAddress, 'Dataset-C-Proprietary-license-' + runSuffix).slice(0, 64)}`;
  const licenseProofC = `0x${computeDatasetId(ownerAddress, 'Dataset-C-Proprietary-proof-' + runSuffix).slice(0, 64)}`;

  setSimulatedDatasetContentHash(contentHashC);
  setSimulatedLicenseProof(licenseProofC);
  setSimulatedCurrentTimestamp(Math.floor(Date.now() / 1000));

  console.log('  Registering Dataset C (Restricted - No AI Training)...');
  const metadataHashC = '0x' + createHash('sha256').update('QmDatasetCMetadata').digest('hex');
  const txC = await deployed.callTx.registerDataset(
    hexToBytes(datasetCId),
    hexToBytes(ownerAddress),
    hexToBytes(contentHashC),
    hexToBytes(licenseHashC),
    BigInt(LICENSE_TYPES.RESTRICTED),
    BigInt(AUTH_STATUS.REVOKED), // Explicitly revoked for AI training
    BigInt(Math.floor(Date.now() / 1000)),
    BigInt(Math.floor(Date.now() / 1000) + 10 * 365 * 24 * 60 * 60),
    hexToBytes(metadataHashC)
  );
  console.log(`  ✅ Dataset C registered (${licenseTypeName(LICENSE_TYPES.RESTRICTED)}, ${authStatusName(AUTH_STATUS.REVOKED)})`);
  console.log(`     Tx: ${txC.public.txId}`);

  await sleep(3000);

  // ─── Step 2: Commit Training Run ──────────────────────────────────────────────
  console.log('\n─── 4. Committing Training Run (AI Company) ─────────────────────\n');

  const modelName = 'BlackBox-Model-v1.0-' + runSuffix;
  const commitmentId = `0x${computeCommitmentId(ownerAddress, modelName)}`;
  const trainingTimestamp = BigInt(Math.floor(Date.now() / 1000));
  const modelHash = `0x${computeCommitmentId(ownerAddress, modelName + '-model').slice(0, 64)}`;

  // Simulate private knowledge of all dataset hashes and licenses
  const dataHashes = [
    contentHashA,
    contentHashB,
    contentHashC,
  ];
  const licenseHashes = [
    licenseHashA,
    licenseHashB,
    licenseHashC,
  ];

  // Pad to 32
  while (dataHashes.length < 32) dataHashes.push('0x' + '0'.repeat(64));
  while (licenseHashes.length < 32) licenseHashes.push('0x' + '0'.repeat(64));

  setSimulatedTrainingDataHashes(dataHashes);
  setSimulatedDatasetLicenses(licenseHashes);
  setSimulatedCurrentTimestamp(Math.floor(Date.now() / 1000));

  console.log(`  Committing training run for model: ${modelName}`);
  console.log(`  Using datasets: A (Commercial), B (Open Source), C (Restricted)`);
  
  const txTrain = await deployed.callTx.commitTraining(
    hexToBytes(commitmentId),
    hexToBytes(ownerAddress),
    [datasetAId, datasetBId, datasetCId, ...Array(29).fill('0x' + '0'.repeat(64))].map(hexToBytes),
    3n,
    trainingTimestamp,
    hexToBytes(modelHash)
  );
  console.log(`  ✅ Training committed!`);
  console.log(`     Commitment ID: ${commitmentId}`);
  console.log(`     Model Hash: ${modelHash}`);
  console.log(`     Tx: ${txTrain.public.txId}`);

  await sleep(3000);

  // ─── Step 3: Create Verification Policy ───────────────────────────────────────
  console.log('\n─── 5. Creating Verification Policy (Auditor/Regulator) ─────────\n');

  const policyName = 'Enterprise-AI-Compliance-v1-' + runSuffix;
  const policyNameBytes = '0x' + createHash('sha512').update(policyName).digest('hex').slice(0, 128); // 64 bytes = 128 hex chars
  const policyId = `0x${computePolicyId(ownerAddress, policyName)}`;

  console.log(`  Creating policy: ${policyName}`);
  console.log(`  Requirements:`);
  console.log(`    - 100% of data must be authorized`);
  console.log(`    - 95% of data must be properly licensed`);
  console.log(`    - No restricted datasets allowed`);
  console.log(`    - Licenses must be valid at training time`);

  const txPolicy = await deployed.callTx.createPolicy(
    hexToBytes(policyId),
    hexToBytes(policyNameBytes),
    100n,  // 100% authorized
    95n,   // 95% licensed
    false, // No restricted
    true,  // Require valid licenses
    hexToBytes(ownerAddress)
  );
  console.log(`  ✅ Policy created!`);
  console.log(`     Policy ID: ${policyId}`);
  console.log(`     Tx: ${txPolicy.public.txId}`);

  await sleep(3000);

  // ─── Step 4: Run ZK Verification ──────────────────────────────────────────────
  console.log('\n─── 6. Running ZK Compliance Verification ────────────────────────\n');

  const verificationId = `0x${computeVerificationId(commitmentId, policyId)}`;

  // Re-set witnesses for verification
  setSimulatedTrainingDataHashes(dataHashes);
  setSimulatedDatasetLicenses(licenseHashes);
  setSimulatedCurrentTimestamp(Math.floor(Date.now() / 1000));

  console.log('  Running ZK proof of compliance...');
  console.log('  (Proves policy satisfaction WITHOUT revealing dataset contents)');
  
  const txVerify = await deployed.callTx.verifyCompliance(
    hexToBytes(verificationId),
    hexToBytes(commitmentId),
    hexToBytes(policyId),
    hexToBytes(ownerAddress)
  );
  console.log(`  ✅ Verification complete!`);
  console.log(`     Verification ID: ${verificationId}`);
  console.log(`     Tx: ${txVerify.public.txId}`);

  // ─── Step 5: Fetch and Display Result ─────────────────────────────────────────
  console.log('\n─── 7. Verification Result ───────────────────────────────────────\n');

  const result = await deployed.callTx.getVerification(hexToBytes(verificationId));
  const v = result.result ?? result.returnValue ?? result;
  
  console.log('  [DEBUG] Verification result keys:', Object.keys(v));
  console.log('  [DEBUG] isCompliant:', v.isCompliant);
  console.log('  [DEBUG] authorizedPercentage:', v.authorizedPercentage);
  console.log('  [DEBUG] licensedPercentage:', v.licensedPercentage);
  console.log('  [DEBUG] restrictedCount:', v.restrictedCount);
  console.log('  [DEBUG] expiredLicenseCount:', v.expiredLicenseCount);
  console.log('  [DEBUG] verifiedAt:', v.verifiedAt);
  console.log('  [DEBUG] verifiedBy:', v.verifiedBy);

  console.log('  ═══════════════════════════════════════════════════════════════');
  console.log('  BLACKBOX AI VERIFICATION REPORT');
  console.log('  ═══════════════════════════════════════════════════════════════');
  console.log(`  Verification ID: ${verificationId}`);
  console.log(`  Commitment:      ${commitmentId}`);
  console.log(`  Policy:          ${policyId} (${policyName})`);
  console.log(`  ─────────────────────────────────────────────────────────────`);
  console.log(`  RESULT:          ${v.isCompliant ? '✅ COMPLIANT' : '❌ NON-COMPLIANT'}`);
  console.log(`  ─────────────────────────────────────────────────────────────`);
  console.log(`  Authorized Data:  ${v.authorizedPercentage ?? 'N/A'}%  (required: 100%)`);
  console.log(`  Licensed Data:    ${v.licensedPercentage ?? 'N/A'}%  (required: 95%)`);
  console.log(`  Restricted Used:  ${v.restrictedCount ?? 'N/A'}     (allowed: 0)`);
  console.log(`  Expired Licenses: ${v.expiredLicenseCount ?? 'N/A'}     (allowed: 0)`);
  console.log(`  ─────────────────────────────────────────────────────────────`);
  const verifiedAt = v.verifiedAt ? Number(v.verifiedAt) * 1000 : Date.now();
  console.log(`  Verified At:     ${new Date(verifiedAt).toISOString()}`);
  console.log(`  Verified By:     ${v.verifiedBy ?? 'N/A'}`);
  console.log('  ═══════════════════════════════════════════════════════════════\n');

  if (!v.isCompliant) {
    console.log('  📋 ANALYSIS:');
    console.log('    - Dataset A (Commercial): ✅ Authorized, ✅ Licensed');
    console.log('    - Dataset B (Open Source): ✅ Authorized, ✅ Licensed');
    console.log('    - Dataset C (Restricted): ❌ NOT Authorized, ❌ Restricted');
    console.log('    - Policy requires 100% authorized → FAIL');
    console.log('    - Policy forbids restricted data → FAIL\n');
  }

  // ─── Cleanup ──────────────────────────────────────────────────────────────────
  await persistWalletState(network, walletCtx);
  await walletCtx.wallet.stop();

  console.log('─── Demo Complete ───────────────────────────────────────────────\n');
  console.log('  BlackBox AI successfully demonstrated:');
  console.log('  ✓ Dataset registration with licensing metadata');
  console.log('  ✓ Training commitment linking model to datasets');
  console.log('  ✓ Policy creation defining compliance requirements');
  console.log('  ✓ ZK proof verifying compliance WITHOUT data exposure');
  console.log('  ✓ Cryptographic verification result on-chain\n');
}

main().catch((err) => {
  console.error('\n❌ Demo failed:', err);
  process.exit(1);
});