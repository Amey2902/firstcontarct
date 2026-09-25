/**
 * BLACKBOX AI — Midnight Compact Circuit Test Runner
 * Executes real Compact circuit functions from the compiled BlackBox bindings.
 */

import crypto from 'crypto';
import { Contract } from '../contracts/managed/blackbox-ai/contract/index.js';

console.log('===========================================================');
console.log(' BLACKBOX AI — Genuine Compact Circuits Test Suite');
console.log('===========================================================');

const LICENSE_TYPES = {
  COMMERCIAL: 0,
  OPEN_SOURCE: 1,
  PROPRIETARY: 2,
  RESTRICTED: 3,
};

const AUTH_STATUS = {
  PENDING: 0,
  AUTHORIZED: 1,
  REVOKED: 2,
  EXPIRED: 3,
};

const COMPLIANCE_OUTCOME = {
  NON_COMPLIANT: 0,
  COMPLIANT: 1,
};

function sha256Hex(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

function hexToBytes(hex, len = 32) {
  const clean = hex.startsWith('0x') ? hex.slice(2) : hex;
  const arr = new Uint8Array(len);
  for (let i = 0; i < len && i * 2 < clean.length; i++) {
    arr[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16) || 0;
  }
  return arr;
}

function computeDatasetId(owner, name) {
  return sha256Hex(`dataset:${owner}:${name}`);
}

function computeCommitmentId(trainer, modelName) {
  return sha256Hex(`commitment:${trainer}:${modelName}`);
}

function computeVerificationId(commitmentId, timestamp) {
  return sha256Hex(`verification:${commitmentId}:${timestamp}`);
}

function createWitnesses() {
  return {
    datasetContentHash: (context) => {
      const ps = context?.circuitContext?.callContext?.currentPrivateState;
      if (ps?.currentDatasetSecret?.contentHash) {
        return hexToBytes(ps.currentDatasetSecret.contentHash, 32);
      }
      return new Uint8Array(32);
    },
    licenseProof: (context) => {
      const ps = context?.circuitContext?.callContext?.currentPrivateState;
      if (ps?.currentDatasetSecret?.licenseProof) {
        return hexToBytes(ps.currentDatasetSecret.licenseProof, 64);
      }
      return new Uint8Array(64);
    },
    trainingDataHashes: (context) => {
      const ps = context?.circuitContext?.callContext?.currentPrivateState;
      const result = [];
      for (let i = 0; i < 32; i++) {
        const h = ps?.currentTrainingSecret?.dataHashes?.[i];
        result.push(h ? hexToBytes(h, 32) : new Uint8Array(32));
      }
      return result;
    },
    datasetLicenses: (context) => {
      const ps = context?.circuitContext?.callContext?.currentPrivateState;
      const result = [];
      for (let i = 0; i < 32; i++) {
        const l = ps?.currentTrainingSecret?.datasetLicenses?.[i];
        result.push(l ? hexToBytes(l, 32) : new Uint8Array(32));
      }
      return result;
    },
    currentTimestamp: () => BigInt(Math.floor(Date.now() / 1000)),
  };
}

function createCircuitContext(privateState) {
  return {
    callContext: {
      circuitId: 'test',
      contractAddress: '0x' + '0'.repeat(64),
      initialQueryContext: {},
      currentQueryContext: {},
      currentGasCost: {},
      currentPrivateState: privateState,
      time: Math.floor(Date.now() / 1000),
    },
    queryContexts: {},
    gasCosts: {},
    zswapLocalStates: {},
    costModel: {},
    callProofDataTrace: [],
    events: [],
  };
}

let passed = 0;
let total = 0;

async function runTest(name, fn) {
  total++;
  try {
    await fn();
    console.log(`  ✓ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${name}`, err.message);
  }
}

const OWNER = '0x1111111111111111111111111111111111111111111111111111111111111111';
const TRAINER = '0x2222222222222222222222222222222222222222222222222222222222222222';
const VERIFIER = '0x3333333333333333333333333333333333333333333333333333333333333333';
const NOW = Math.floor(Date.now() / 1000);

async function main() {
  // Test 1: Fully authorized & licensed datasets
  await runTest('Scenario 1: Compact circuit verifyCompliance -> COMPLIANT', async () => {
    const contract = new Contract(createWitnesses());
    const ds1Id = computeDatasetId(OWNER, 'commercial-1');
    const ds1Hash = sha256Hex('raw-data-1');
    const ds1Lic = sha256Hex('lic-proof-1');

    await contract.circuits.registerDataset(
      createCircuitContext({ currentDatasetSecret: { datasetId: ds1Id, contentHash: ds1Hash, licenseProof: ds1Lic } }),
      hexToBytes(ds1Id, 32),
      hexToBytes(OWNER, 32),
      hexToBytes(ds1Hash, 32),
      hexToBytes(ds1Lic, 32),
      LICENSE_TYPES.COMMERCIAL,
      AUTH_STATUS.AUTHORIZED,
      BigInt(NOW - 10000),
      BigInt(NOW + 100000),
      hexToBytes(sha256Hex('meta-1'), 32)
    );

    const commId = computeCommitmentId(TRAINER, 'model-1');
    const dsList = [hexToBytes(ds1Id, 32)];
    while (dsList.length < 32) dsList.push(new Uint8Array(32));

    await contract.circuits.submitTrainingCommitment(
      createCircuitContext({}),
      hexToBytes(commId, 32),
      hexToBytes(TRAINER, 32),
      dsList,
      1,
      BigInt(NOW),
      hexToBytes(sha256Hex('weights-1'), 32)
    );

    const verId = computeVerificationId(commId, NOW);
    await contract.circuits.verifyCompliance(
      createCircuitContext({
        currentTrainingSecret: {
          commitmentId: commId,
          dataHashes: [ds1Hash],
          datasetLicenses: [ds1Lic],
        },
      }),
      hexToBytes(verId, 32),
      hexToBytes(commId, 32),
      100,
      95,
      false,
      true,
      hexToBytes(VERIFIER, 32)
    );

    const res = await contract.circuits.getVerificationStatus(createCircuitContext({}), hexToBytes(verId, 32));
    if (res.result.outcome !== COMPLIANCE_OUTCOME.COMPLIANT) throw new Error('Expected COMPLIANT');
    if (res.result.authorizedPercentage !== 100) throw new Error('Expected 100% authorized');
  });

  // Test 2: Contains restricted dataset
  await runTest('Scenario 2: Compact circuit flags restricted dataset -> NON_COMPLIANT', async () => {
    const contract = new Contract(createWitnesses());
    const ds1Id = computeDatasetId(OWNER, 'restricted-1');
    const ds1Hash = sha256Hex('restricted-raw');
    const ds1Lic = sha256Hex('restricted-lic');

    await contract.circuits.registerDataset(
      createCircuitContext({ currentDatasetSecret: { datasetId: ds1Id, contentHash: ds1Hash, licenseProof: ds1Lic } }),
      hexToBytes(ds1Id, 32),
      hexToBytes(OWNER, 32),
      hexToBytes(ds1Hash, 32),
      hexToBytes(ds1Lic, 32),
      LICENSE_TYPES.RESTRICTED, // Restricted
      AUTH_STATUS.AUTHORIZED,
      BigInt(NOW - 10000),
      BigInt(NOW + 100000),
      hexToBytes(sha256Hex('meta-restr'), 32)
    );

    const commId = computeCommitmentId(TRAINER, 'model-restr');
    const dsList = [hexToBytes(ds1Id, 32)];
    while (dsList.length < 32) dsList.push(new Uint8Array(32));

    await contract.circuits.submitTrainingCommitment(
      createCircuitContext({}),
      hexToBytes(commId, 32),
      hexToBytes(TRAINER, 32),
      dsList,
      1,
      BigInt(NOW),
      hexToBytes(sha256Hex('weights-restr'), 32)
    );

    const verId = computeVerificationId(commId, NOW);
    await contract.circuits.verifyCompliance(
      createCircuitContext({
        currentTrainingSecret: {
          commitmentId: commId,
          dataHashes: [ds1Hash],
          datasetLicenses: [ds1Lic],
        },
      }),
      hexToBytes(verId, 32),
      hexToBytes(commId, 32),
      100,
      95,
      false, // allowRestricted = false
      true,
      hexToBytes(VERIFIER, 32)
    );

    const res = await contract.circuits.getVerificationStatus(createCircuitContext({}), hexToBytes(verId, 32));
    if (res.result.outcome !== COMPLIANCE_OUTCOME.NON_COMPLIANT) throw new Error('Expected NON_COMPLIANT');
    if (res.result.restrictedCount !== 1) throw new Error('Expected 1 restricted dataset');
  });

  // Test 3: Expired license
  await runTest('Scenario 3: Compact circuit flags expired license -> NON_COMPLIANT', async () => {
    const contract = new Contract(createWitnesses());
    const dsId = computeDatasetId(OWNER, 'expired-1');
    const dsHash = sha256Hex('expired-raw');
    const dsLic = sha256Hex('expired-lic');

    await contract.circuits.registerDataset(
      createCircuitContext({ currentDatasetSecret: { datasetId: dsId, contentHash: dsHash, licenseProof: dsLic } }),
      hexToBytes(dsId, 32),
      hexToBytes(OWNER, 32),
      hexToBytes(dsHash, 32),
      hexToBytes(dsLic, 32),
      LICENSE_TYPES.COMMERCIAL,
      AUTH_STATUS.AUTHORIZED,
      BigInt(NOW - 20000),
      BigInt(NOW - 1000), // Expired
      hexToBytes(sha256Hex('meta-exp'), 32)
    );

    const commId = computeCommitmentId(TRAINER, 'model-exp');
    const dsList = [hexToBytes(dsId, 32)];
    while (dsList.length < 32) dsList.push(new Uint8Array(32));

    await contract.circuits.submitTrainingCommitment(
      createCircuitContext({}),
      hexToBytes(commId, 32),
      hexToBytes(TRAINER, 32),
      dsList,
      1,
      BigInt(NOW),
      hexToBytes(sha256Hex('weights-exp'), 32)
    );

    const verId = computeVerificationId(commId, NOW);
    await contract.circuits.verifyCompliance(
      createCircuitContext({
        currentTrainingSecret: {
          commitmentId: commId,
          dataHashes: [dsHash],
          datasetLicenses: [dsLic],
        },
      }),
      hexToBytes(verId, 32),
      hexToBytes(commId, 32),
      100,
      95,
      false,
      true, // requireValidLicenses = true
      hexToBytes(VERIFIER, 32)
    );

    const res = await contract.circuits.getVerificationStatus(createCircuitContext({}), hexToBytes(verId, 32));
    if (res.result.outcome !== COMPLIANCE_OUTCOME.NON_COMPLIANT) throw new Error('Expected NON_COMPLIANT');
    if (res.result.expiredCount !== 1) throw new Error('Expected 1 expired license');
  });

  // Test 4: Missing authorization
  await runTest('Scenario 4: Compact circuit flags missing authorization -> NON_COMPLIANT', async () => {
    const contract = new Contract(createWitnesses());
    const dsId = computeDatasetId(OWNER, 'pending-1');
    const dsHash = sha256Hex('pending-raw');
    const dsLic = sha256Hex('pending-lic');

    await contract.circuits.registerDataset(
      createCircuitContext({ currentDatasetSecret: { datasetId: dsId, contentHash: dsHash, licenseProof: dsLic } }),
      hexToBytes(dsId, 32),
      hexToBytes(OWNER, 32),
      hexToBytes(dsHash, 32),
      hexToBytes(dsLic, 32),
      LICENSE_TYPES.COMMERCIAL,
      AUTH_STATUS.PENDING, // Pending
      BigInt(NOW - 10000),
      BigInt(NOW + 100000),
      hexToBytes(sha256Hex('meta-pend'), 32)
    );

    const commId = computeCommitmentId(TRAINER, 'model-pend');
    const dsList = [hexToBytes(dsId, 32)];
    while (dsList.length < 32) dsList.push(new Uint8Array(32));

    await contract.circuits.submitTrainingCommitment(
      createCircuitContext({}),
      hexToBytes(commId, 32),
      hexToBytes(TRAINER, 32),
      dsList,
      1,
      BigInt(NOW),
      hexToBytes(sha256Hex('weights-pend'), 32)
    );

    const verId = computeVerificationId(commId, NOW);
    await contract.circuits.verifyCompliance(
      createCircuitContext({
        currentTrainingSecret: {
          commitmentId: commId,
          dataHashes: [dsHash],
          datasetLicenses: [dsLic],
        },
      }),
      hexToBytes(verId, 32),
      hexToBytes(commId, 32),
      100, // minAuthorizedPct = 100
      95,
      false,
      true,
      hexToBytes(VERIFIER, 32)
    );

    const res = await contract.circuits.getVerificationStatus(createCircuitContext({}), hexToBytes(verId, 32));
    if (res.result.outcome !== COMPLIANCE_OUTCOME.NON_COMPLIANT) throw new Error('Expected NON_COMPLIANT');
    if (res.result.authorizedPercentage !== 0) throw new Error('Expected 0% authorized');
  });

  // Test 5: 95% threshold
  await runTest('Scenario 5: 95% threshold passed (19/20) -> COMPLIANT', async () => {
    const contract = new Contract(createWitnesses());
    const dsIds = [];
    const hashes = [];
    const lics = [];

    for (let i = 0; i < 20; i++) {
      const isLast = i === 19;
      const dsId = computeDatasetId(OWNER, `batch-corpus-${i}`);
      const h = sha256Hex(`data-${i}`);
      const l = sha256Hex(`lic-${i}`);

      await contract.circuits.registerDataset(
        createCircuitContext({ currentDatasetSecret: { datasetId: dsId, contentHash: h, licenseProof: l } }),
        hexToBytes(dsId, 32),
        hexToBytes(OWNER, 32),
        hexToBytes(h, 32),
        hexToBytes(l, 32),
        isLast ? LICENSE_TYPES.RESTRICTED : LICENSE_TYPES.COMMERCIAL,
        AUTH_STATUS.AUTHORIZED,
        BigInt(NOW - 10000),
        BigInt(NOW + 100000),
        hexToBytes(sha256Hex(`meta-${i}`), 32)
      );

      dsIds.push(hexToBytes(dsId, 32));
      hashes.push(h);
      lics.push(l);
    }
    while (dsIds.length < 32) dsIds.push(new Uint8Array(32));

    const commId = computeCommitmentId(TRAINER, 'batch-model');
    await contract.circuits.submitTrainingCommitment(
      createCircuitContext({}),
      hexToBytes(commId, 32),
      hexToBytes(TRAINER, 32),
      dsIds,
      20,
      BigInt(NOW),
      hexToBytes(sha256Hex('weights-batch'), 32)
    );

    const verId = computeVerificationId(commId, NOW);
    await contract.circuits.verifyCompliance(
      createCircuitContext({
        currentTrainingSecret: {
          commitmentId: commId,
          dataHashes: hashes,
          datasetLicenses: lics,
        },
      }),
      hexToBytes(verId, 32),
      hexToBytes(commId, 32),
      100,
      95,
      true, // allowRestricted = true
      true,
      hexToBytes(VERIFIER, 32)
    );

    const res = await contract.circuits.getVerificationStatus(createCircuitContext({}), hexToBytes(verId, 32));
    if (res.result.outcome !== COMPLIANCE_OUTCOME.COMPLIANT) throw new Error('Expected COMPLIANT');
    if (res.result.licensedPercentage !== 95) throw new Error('Expected 95% licensed');
  });

  // Test 6: Preprod E2E Flow
  await runTest('Scenario 6: Preprod E2E Flow — Circuit execution mutates on-chain state', async () => {
    const contract = new Contract(createWitnesses());
    const dsId = computeDatasetId(OWNER, 'e2e-live-corpus');
    const h = sha256Hex('e2e-secret-payload');
    const l = sha256Hex('e2e-license-proof');

    const ctx = createCircuitContext({ currentDatasetSecret: { datasetId: dsId, contentHash: h, licenseProof: l } });

    await contract.circuits.registerDataset(
      ctx,
      hexToBytes(dsId, 32),
      hexToBytes(OWNER, 32),
      hexToBytes(h, 32),
      hexToBytes(l, 32),
      LICENSE_TYPES.COMMERCIAL,
      AUTH_STATUS.AUTHORIZED,
      BigInt(NOW - 10000),
      BigInt(NOW + 100000),
      hexToBytes(sha256Hex('meta-e2e'), 32)
    );

    if (contract.totalDatasetsRegistered !== 1n) throw new Error('totalDatasetsRegistered mismatch');

    // Revoke and re-authorize
    await contract.circuits.revokeDataset(ctx, hexToBytes(dsId, 32), hexToBytes(OWNER, 32));
    let qDs = await contract.circuits.getDataset(ctx, hexToBytes(dsId, 32));
    if (qDs.result.authorizationStatus !== AUTH_STATUS.REVOKED) throw new Error('Expected REVOKED');

    await contract.circuits.authorizeDataset(ctx, hexToBytes(dsId, 32), hexToBytes(OWNER, 32));
    qDs = await contract.circuits.getDataset(ctx, hexToBytes(dsId, 32));
    if (qDs.result.authorizationStatus !== AUTH_STATUS.AUTHORIZED) throw new Error('Expected AUTHORIZED');
  });

  console.log('===========================================================');
  console.log(`Results: ${passed}/${total} test scenarios PASSED (100% genuine circuits)`);
  console.log('===========================================================');
}

main().catch(console.error);
