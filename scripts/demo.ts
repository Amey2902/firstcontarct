/**
 * End-to-end demo script for BlackBox AI.
 * Simulates:
 * 1. Dataset Registration with private content hash & license proof
 * 2. Dataset Authorization
 * 3. AI Company Training Commitment
 * 4. Zero-Knowledge Compliance Verification against 5 Policy Rules
 */
import {
  LICENSE_TYPES,
  AUTH_STATUS,
  COMPLIANCE_OUTCOME,
  licenseTypeName,
  authStatusName,
  complianceOutcomeName,
} from '../src/contract-constants.js';
import {
  computeDatasetId,
  computeCommitmentId,
  computeVerificationId,
  sha256Hex,
} from '../src/contract.js';

async function runDemo() {
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log(' BLACKBOX AI — Zero-Knowledge Compliance Verification Demo');
  console.log('═══════════════════════════════════════════════════════════════════\n');

  const datasetOwner = '0x1111111111111111111111111111111111111111111111111111111111111111';
  const aiTrainer    = '0x2222222222222222222222222222222222222222222222222222222222222222';
  const auditor      = '0x3333333333333333333333333333333333333333333333333333333333333333';

  // ── Step 1: Register Datasets ──
  console.log('🔹 Step 1: Dataset Owner Registers Datasets Privately');
  const ds1Name = 'CommonCrawl-Cleaned-v2';
  const ds1Id = computeDatasetId(datasetOwner, ds1Name);
  const ds1SecretHash = sha256Hex('RAW_TRAINING_DATA_CHUNK_001_SECRET');
  const ds1LicenseProof = sha256Hex('COMMERCIAL_LICENSE_TOKEN_PROOF_998');

  console.log(`  • Dataset 1: "${ds1Name}"`);
  console.log(`    ID: ${ds1Id}`);
  console.log(`    License: ${licenseTypeName(LICENSE_TYPES.COMMERCIAL)}`);
  console.log(`    Status: ${authStatusName(AUTH_STATUS.AUTHORIZED)}`);
  console.log(`    [PRIVATE WITNESS] Content Hash: ${ds1SecretHash.slice(0, 16)}... (never exposed)`);
  console.log(`    [PRIVATE WITNESS] License Proof: ${ds1LicenseProof.slice(0, 16)}... (never exposed)\n`);

  // ── Step 2: Submit Training Run Commitment ──
  console.log('🔹 Step 2: AI Company Commits Training Run');
  const modelName = 'Llama-3-Enterprise-FineTuned';
  const commitmentId = computeCommitmentId(aiTrainer, modelName);
  const modelHash = sha256Hex('MODEL_WEIGHTS_SHA256_CHECK_8823');

  console.log(`  • Model: "${modelName}"`);
  console.log(`    Commitment ID: ${commitmentId}`);
  console.log(`    Model Hash: ${modelHash.slice(0, 24)}...`);
  console.log(`    Dataset Count: 1`);
  console.log(`    Linked Datasets: [${ds1Id.slice(0, 16)}...]\n`);

  // ── Step 3: Zero-Knowledge Compliance Verification ──
  console.log('🔹 Step 3: Auditor Requests ZK Compliance Verification');
  const verificationId = computeVerificationId(commitmentId, Date.now());
  console.log(`  • Verification Request ID: ${verificationId}`);
  console.log('  • Evaluating 5 Zero-Knowledge Compliance Rules:');
  console.log('    ✓ Rule 1: 100% datasets authorized? -> PASSED (100%)');
  console.log('    ✓ Rule 2: >=95% properly licensed?  -> PASSED (100%)');
  console.log('    ✓ Rule 3: No restricted datasets?   -> PASSED (0 restricted)');
  console.log('    ✓ Rule 4: Licenses valid at time?   -> PASSED (0 expired)');
  console.log('    ✓ Rule 5: Owner authorization valid?-> PASSED\n');

  console.log('═══════════════════════════════════════════════════════════════════');
  console.log(` 🎉 AUDIT OUTCOME: ${complianceOutcomeName(COMPLIANCE_OUTCOME.COMPLIANT)}`);
  console.log(' Proof generated and recorded on Midnight Ledger.');
  console.log(' No raw dataset contents or confidential licenses were revealed.');
  console.log('═══════════════════════════════════════════════════════════════════');
}

runDemo().catch(console.error);
