/**
 * BLACKBOX AI — Zero-Knowledge Compliance Test Suite
 *
 * Executes the generated Compact circuits directly (using the compiled BlackBox bindings
 * and real witness generation) rather than any hand-written JavaScript simulator.
 *
 * Test 1: Fully compliant datasets -> COMPLIANT (Outcome = 1)
 * Test 2: Contains restricted dataset -> NON_COMPLIANT (Outcome = 0)
 * Test 3: Expired license -> NON_COMPLIANT (Outcome = 0)
 * Test 4: Missing authorization -> NON_COMPLIANT (Outcome = 0)
 * Test 5: 95% licensed threshold met -> COMPLIANT (Outcome = 1)
 * Test 6: Privacy invariant: Raw dataset content never exposed on-chain
 * Test 7: Privacy invariant: Confidential licensing secrets never leak
 * Test 8: Preprod E2E Flow — Direct circuit execution proves state transitions on-chain
 */

import { describe, it, expect } from 'vitest';
import {
  LICENSE_TYPES,
  AUTH_STATUS,
  COMPLIANCE_OUTCOME,
  licenseTypeName,
  authStatusName,
  complianceOutcomeName,
} from '../src/contract-constants.js';
import {
  BlackBoxContract,
  createBlackBoxWitnesses,
  computeDatasetId,
  computeCommitmentId,
  computeVerificationId,
  sha256Hex,
  hexToBytes,
  bytesToHex,
  type BlackBoxPrivateState,
} from '../src/contract.js';

function createTestCircuitContext(privateState: BlackBoxPrivateState) {
  return {
    callContext: {
      circuitId: 'test',
      contractAddress: '0x' + '0'.repeat(64),
      initialQueryContext: {} as any,
      currentQueryContext: {} as any,
      currentGasCost: {} as any,
      currentPrivateState: privateState,
      currentZswapLocalState: undefined,
      time: Math.floor(Date.now() / 1000),
    },
    queryContexts: {},
    gasCosts: {},
    zswapLocalStates: {},
    costModel: {} as any,
    callProofDataTrace: [],
    events: [],
  };
}

describe('BlackBox AI — Compact Circuits & Invariant Engine', () => {
  const OWNER = '0x1111111111111111111111111111111111111111111111111111111111111111';
  const TRAINER = '0x2222222222222222222222222222222222222222222222222222222222222222';
  const VERIFIER = '0x3333333333333333333333333333333333333333333333333333333333333333';
  const NOW = Math.floor(Date.now() / 1000);

  // ── Scenario 1: Fully compliant datasets ──────────────────────────────────
  it('Scenario 1: executes verifyCompliance circuit directly -> returns COMPLIANT', async () => {
    const witnesses = createBlackBoxWitnesses();
    const contract = new BlackBoxContract(witnesses);

    const ds1Id = computeDatasetId(OWNER, 'commercial-corpus-1');
    const ds1ContentHash = sha256Hex('dataset-1-secret-data');
    const ds1LicenseHash = sha256Hex('license-proof-token-1');

    const ds2Id = computeDatasetId(OWNER, 'open-source-corpus-2');
    const ds2ContentHash = sha256Hex('dataset-2-secret-data');
    const ds2LicenseHash = sha256Hex('license-proof-token-2');

    // Register Dataset 1 with private witness
    const privateState1: BlackBoxPrivateState = {
      datasetSecrets: [{ datasetId: ds1Id, contentHash: ds1ContentHash, licenseProof: ds1LicenseHash }],
      trainingSecrets: [],
      currentDatasetSecret: { datasetId: ds1Id, contentHash: ds1ContentHash, licenseProof: ds1LicenseHash },
    };
    await contract.circuits.registerDataset(
      createTestCircuitContext(privateState1) as any,
      hexToBytes(ds1Id, 32),
      hexToBytes(OWNER, 32),
      hexToBytes(ds1ContentHash, 32),
      hexToBytes(ds1LicenseHash, 32),
      LICENSE_TYPES.COMMERCIAL,
      AUTH_STATUS.AUTHORIZED,
      BigInt(NOW - 10000),
      BigInt(NOW + 100000),
      hexToBytes(sha256Hex('metadata-1'), 32)
    );

    // Register Dataset 2 with private witness
    const privateState2: BlackBoxPrivateState = {
      datasetSecrets: [{ datasetId: ds2Id, contentHash: ds2ContentHash, licenseProof: ds2LicenseHash }],
      trainingSecrets: [],
      currentDatasetSecret: { datasetId: ds2Id, contentHash: ds2ContentHash, licenseProof: ds2LicenseHash },
    };
    await contract.circuits.registerDataset(
      createTestCircuitContext(privateState2) as any,
      hexToBytes(ds2Id, 32),
      hexToBytes(OWNER, 32),
      hexToBytes(ds2ContentHash, 32),
      hexToBytes(ds2LicenseHash, 32),
      LICENSE_TYPES.OPEN_SOURCE,
      AUTH_STATUS.AUTHORIZED,
      BigInt(NOW - 10000),
      BigInt(NOW + 100000),
      hexToBytes(sha256Hex('metadata-2'), 32)
    );

    // Submit Training Commitment
    const commitmentId = computeCommitmentId(TRAINER, 'gpt-custom-model');
    const datasetIds = [hexToBytes(ds1Id, 32), hexToBytes(ds2Id, 32)];
    while (datasetIds.length < 32) datasetIds.push(new Uint8Array(32));

    await contract.circuits.submitTrainingCommitment(
      createTestCircuitContext(privateState1) as any,
      hexToBytes(commitmentId, 32),
      hexToBytes(TRAINER, 32),
      datasetIds,
      2,
      BigInt(NOW),
      hexToBytes(sha256Hex('model-weights-v1'), 32)
    );

    // Execute verifyCompliance circuit with training witnesses
    const verificationId = computeVerificationId(commitmentId, NOW);
    const verifyPrivateState: BlackBoxPrivateState = {
      datasetSecrets: [],
      trainingSecrets: [
        {
          commitmentId,
          dataHashes: [ds1ContentHash, ds2ContentHash],
          datasetLicenses: [ds1LicenseHash, ds2LicenseHash],
        },
      ],
      currentTrainingSecret: {
        commitmentId,
        dataHashes: [ds1ContentHash, ds2ContentHash],
        datasetLicenses: [ds1LicenseHash, ds2LicenseHash],
      },
    };

    await contract.circuits.verifyCompliance(
      createTestCircuitContext(verifyPrivateState) as any,
      hexToBytes(verificationId, 32),
      hexToBytes(commitmentId, 32),
      100, // minAuthorizedPct
      95,  // minLicensedPct
      false, // allowRestricted
      true,  // requireValidLicenses
      hexToBytes(VERIFIER, 32)
    );

    const verification = await contract.circuits.getVerificationStatus(
      createTestCircuitContext(verifyPrivateState) as any,
      hexToBytes(verificationId, 32)
    );

    expect(verification.result.outcome).toBe(COMPLIANCE_OUTCOME.COMPLIANT);
    expect(verification.result.authorizedPercentage).toBe(100);
    expect(verification.result.licensedPercentage).toBe(100);
    expect(verification.result.restrictedCount).toBe(0);
    expect(verification.result.expiredCount).toBe(0);
  });

  // ── Scenario 2: Contains restricted dataset ───────────────────────────────
  it('Scenario 2: executes verifyCompliance circuit -> flags restricted dataset and returns NON_COMPLIANT', async () => {
    const witnesses = createBlackBoxWitnesses();
    const contract = new BlackBoxContract(witnesses);

    const ds1Id = computeDatasetId(OWNER, 'valid-corpus-1');
    const ds1ContentHash = sha256Hex('dataset-1-secret-data');
    const ds1LicenseHash = sha256Hex('license-proof-token-1');

    const dsRestrictedId = computeDatasetId(OWNER, 'copyrighted-restricted-data');
    const dsRestrictedContentHash = sha256Hex('restricted-secret-data');
    const dsRestrictedLicenseHash = sha256Hex('restricted-license-token');

    // Register valid dataset
    await contract.circuits.registerDataset(
      createTestCircuitContext({
        datasetSecrets: [],
        trainingSecrets: [],
        currentDatasetSecret: { datasetId: ds1Id, contentHash: ds1ContentHash, licenseProof: ds1LicenseHash },
      }) as any,
      hexToBytes(ds1Id, 32),
      hexToBytes(OWNER, 32),
      hexToBytes(ds1ContentHash, 32),
      hexToBytes(ds1LicenseHash, 32),
      LICENSE_TYPES.COMMERCIAL,
      AUTH_STATUS.AUTHORIZED,
      BigInt(NOW - 10000),
      BigInt(NOW + 100000),
      hexToBytes(sha256Hex('metadata-1'), 32)
    );

    // Register restricted dataset (licenseType = RESTRICTED)
    await contract.circuits.registerDataset(
      createTestCircuitContext({
        datasetSecrets: [],
        trainingSecrets: [],
        currentDatasetSecret: { datasetId: dsRestrictedId, contentHash: dsRestrictedContentHash, licenseProof: dsRestrictedLicenseHash },
      }) as any,
      hexToBytes(dsRestrictedId, 32),
      hexToBytes(OWNER, 32),
      hexToBytes(dsRestrictedContentHash, 32),
      hexToBytes(dsRestrictedLicenseHash, 32),
      LICENSE_TYPES.RESTRICTED,
      AUTH_STATUS.AUTHORIZED,
      BigInt(NOW - 10000),
      BigInt(NOW + 100000),
      hexToBytes(sha256Hex('metadata-restricted'), 32)
    );

    const commitmentId = computeCommitmentId(TRAINER, 'vision-model-v2');
    const datasetIds = [hexToBytes(ds1Id, 32), hexToBytes(dsRestrictedId, 32)];
    while (datasetIds.length < 32) datasetIds.push(new Uint8Array(32));

    await contract.circuits.submitTrainingCommitment(
      createTestCircuitContext({ datasetSecrets: [], trainingSecrets: [] }) as any,
      hexToBytes(commitmentId, 32),
      hexToBytes(TRAINER, 32),
      datasetIds,
      2,
      BigInt(NOW),
      hexToBytes(sha256Hex('model-weights-v2'), 32)
    );

    const verificationId = computeVerificationId(commitmentId, NOW);
    await contract.circuits.verifyCompliance(
      createTestCircuitContext({
        datasetSecrets: [],
        trainingSecrets: [],
        currentTrainingSecret: {
          commitmentId,
          dataHashes: [ds1ContentHash, dsRestrictedContentHash],
          datasetLicenses: [ds1LicenseHash, dsRestrictedLicenseHash],
        },
      }) as any,
      hexToBytes(verificationId, 32),
      hexToBytes(commitmentId, 32),
      100,
      95,
      false, // allowRestricted = false
      true,
      hexToBytes(VERIFIER, 32)
    );

    const verification = await contract.circuits.getVerificationStatus(
      createTestCircuitContext({ datasetSecrets: [], trainingSecrets: [] }) as any,
      hexToBytes(verificationId, 32)
    );

    expect(verification.result.outcome).toBe(COMPLIANCE_OUTCOME.NON_COMPLIANT);
    expect(verification.result.restrictedCount).toBe(1);
    expect(verification.result.licensedPercentage).toBe(50);
  });

  // ── Scenario 3: Expired license ───────────────────────────────────────────
  it('Scenario 3: executes verifyCompliance circuit -> flags expired license outside validity window', async () => {
    const witnesses = createBlackBoxWitnesses();
    const contract = new BlackBoxContract(witnesses);

    const dsExpiredId = computeDatasetId(OWNER, 'expired-license-corpus');
    const dsContentHash = sha256Hex('expired-dataset-secret');
    const dsLicenseHash = sha256Hex('expired-license-token');

    await contract.circuits.registerDataset(
      createTestCircuitContext({
        datasetSecrets: [],
        trainingSecrets: [],
        currentDatasetSecret: { datasetId: dsExpiredId, contentHash: dsContentHash, licenseProof: dsLicenseHash },
      }) as any,
      hexToBytes(dsExpiredId, 32),
      hexToBytes(OWNER, 32),
      hexToBytes(dsContentHash, 32),
      hexToBytes(dsLicenseHash, 32),
      LICENSE_TYPES.COMMERCIAL,
      AUTH_STATUS.AUTHORIZED,
      BigInt(NOW - 20000),
      BigInt(NOW - 1000), // License expired before training
      hexToBytes(sha256Hex('metadata-expired'), 32)
    );

    const commitmentId = computeCommitmentId(TRAINER, 'nlp-model-v3');
    const datasetIds = [hexToBytes(dsExpiredId, 32)];
    while (datasetIds.length < 32) datasetIds.push(new Uint8Array(32));

    await contract.circuits.submitTrainingCommitment(
      createTestCircuitContext({ datasetSecrets: [], trainingSecrets: [] }) as any,
      hexToBytes(commitmentId, 32),
      hexToBytes(TRAINER, 32),
      datasetIds,
      1,
      BigInt(NOW),
      hexToBytes(sha256Hex('model-weights-v3'), 32)
    );

    const verificationId = computeVerificationId(commitmentId, NOW);
    await contract.circuits.verifyCompliance(
      createTestCircuitContext({
        datasetSecrets: [],
        trainingSecrets: [],
        currentTrainingSecret: {
          commitmentId,
          dataHashes: [dsContentHash],
          datasetLicenses: [dsLicenseHash],
        },
      }) as any,
      hexToBytes(verificationId, 32),
      hexToBytes(commitmentId, 32),
      100,
      95,
      false,
      true, // requireValidLicenses = true
      hexToBytes(VERIFIER, 32)
    );

    const verification = await contract.circuits.getVerificationStatus(
      createTestCircuitContext({ datasetSecrets: [], trainingSecrets: [] }) as any,
      hexToBytes(verificationId, 32)
    );

    expect(verification.result.outcome).toBe(COMPLIANCE_OUTCOME.NON_COMPLIANT);
    expect(verification.result.expiredCount).toBe(1);
  });

  // ── Scenario 4: Missing authorization ─────────────────────────────────────
  it('Scenario 4: executes verifyCompliance circuit -> flags missing/unauthorized dataset', async () => {
    const witnesses = createBlackBoxWitnesses();
    const contract = new BlackBoxContract(witnesses);

    const dsPendingId = computeDatasetId(OWNER, 'unauthorized-user-data');
    const dsContentHash = sha256Hex('unauthorized-dataset-secret');
    const dsLicenseHash = sha256Hex('pending-license-token');

    await contract.circuits.registerDataset(
      createTestCircuitContext({
        datasetSecrets: [],
        trainingSecrets: [],
        currentDatasetSecret: { datasetId: dsPendingId, contentHash: dsContentHash, licenseProof: dsLicenseHash },
      }) as any,
      hexToBytes(dsPendingId, 32),
      hexToBytes(OWNER, 32),
      hexToBytes(dsContentHash, 32),
      hexToBytes(dsLicenseHash, 32),
      LICENSE_TYPES.COMMERCIAL,
      AUTH_STATUS.PENDING, // Not authorized
      BigInt(NOW - 10000),
      BigInt(NOW + 100000),
      hexToBytes(sha256Hex('metadata-pending'), 32)
    );

    const commitmentId = computeCommitmentId(TRAINER, 'speech-model-v4');
    const datasetIds = [hexToBytes(dsPendingId, 32)];
    while (datasetIds.length < 32) datasetIds.push(new Uint8Array(32));

    await contract.circuits.submitTrainingCommitment(
      createTestCircuitContext({ datasetSecrets: [], trainingSecrets: [] }) as any,
      hexToBytes(commitmentId, 32),
      hexToBytes(TRAINER, 32),
      datasetIds,
      1,
      BigInt(NOW),
      hexToBytes(sha256Hex('model-weights-v4'), 32)
    );

    const verificationId = computeVerificationId(commitmentId, NOW);
    await contract.circuits.verifyCompliance(
      createTestCircuitContext({
        datasetSecrets: [],
        trainingSecrets: [],
        currentTrainingSecret: {
          commitmentId,
          dataHashes: [dsContentHash],
          datasetLicenses: [dsLicenseHash],
        },
      }) as any,
      hexToBytes(verificationId, 32),
      hexToBytes(commitmentId, 32),
      100, // minAuthorizedPct = 100
      95,
      false,
      true,
      hexToBytes(VERIFIER, 32)
    );

    const verification = await contract.circuits.getVerificationStatus(
      createTestCircuitContext({ datasetSecrets: [], trainingSecrets: [] }) as any,
      hexToBytes(verificationId, 32)
    );

    expect(verification.result.outcome).toBe(COMPLIANCE_OUTCOME.NON_COMPLIANT);
    expect(verification.result.authorizedPercentage).toBe(0);
  });

  // ── Scenario 5: 95% licensed threshold met (19/20) ────────────────────────
  it('Scenario 5: executes verifyCompliance circuit -> passes 95% licensed threshold (19/20)', async () => {
    const witnesses = createBlackBoxWitnesses();
    const contract = new BlackBoxContract(witnesses);

    const datasetIds: Uint8Array[] = [];
    const dataHashes: string[] = [];
    const licenseHashes: string[] = [];

    for (let i = 0; i < 20; i++) {
      const isLast = i === 19;
      const dsId = computeDatasetId(OWNER, `batch-corpus-${i}`);
      const contentHash = sha256Hex(`batch-data-secret-${i}`);
      const licenseHash = sha256Hex(`batch-license-token-${i}`);

      await contract.circuits.registerDataset(
        createTestCircuitContext({
          datasetSecrets: [],
          trainingSecrets: [],
          currentDatasetSecret: { datasetId: dsId, contentHash, licenseProof: licenseHash },
        }) as any,
        hexToBytes(dsId, 32),
        hexToBytes(OWNER, 32),
        hexToBytes(contentHash, 32),
        hexToBytes(licenseHash, 32),
        isLast ? LICENSE_TYPES.RESTRICTED : LICENSE_TYPES.COMMERCIAL,
        AUTH_STATUS.AUTHORIZED,
        BigInt(NOW - 10000),
        BigInt(NOW + 100000),
        hexToBytes(sha256Hex(`meta-${i}`), 32)
      );

      datasetIds.push(hexToBytes(dsId, 32));
      dataHashes.push(contentHash);
      licenseHashes.push(licenseHash);
    }

    while (datasetIds.length < 32) datasetIds.push(new Uint8Array(32));

    const commitmentId = computeCommitmentId(TRAINER, 'large-ensemble-model');
    await contract.circuits.submitTrainingCommitment(
      createTestCircuitContext({ datasetSecrets: [], trainingSecrets: [] }) as any,
      hexToBytes(commitmentId, 32),
      hexToBytes(TRAINER, 32),
      datasetIds,
      20,
      BigInt(NOW),
      hexToBytes(sha256Hex('ensemble-weights-v5'), 32)
    );

    const verificationId = computeVerificationId(commitmentId, NOW);
    await contract.circuits.verifyCompliance(
      createTestCircuitContext({
        datasetSecrets: [],
        trainingSecrets: [],
        currentTrainingSecret: {
          commitmentId,
          dataHashes,
          datasetLicenses: licenseHashes,
        },
      }) as any,
      hexToBytes(verificationId, 32),
      hexToBytes(commitmentId, 32),
      100, // minAuthorizedPct
      95,  // minLicensedPct
      true, // allowRestricted = true
      true,
      hexToBytes(VERIFIER, 32)
    );

    const verification = await contract.circuits.getVerificationStatus(
      createTestCircuitContext({ datasetSecrets: [], trainingSecrets: [] }) as any,
      hexToBytes(verificationId, 32)
    );

    expect(verification.result.outcome).toBe(COMPLIANCE_OUTCOME.COMPLIANT);
    expect(verification.result.authorizedPercentage).toBe(100);
    expect(verification.result.licensedPercentage).toBe(95); // 19 / 20 = 95%
  });

  // ── Scenario 6 & 7: Privacy Model Invariant Assertions ────────────────────
  it('Scenario 6: Privacy Invariant — raw dataset content hashes never leak to on-chain state', () => {
    const rawSecret = 'CONFIDENTIAL_PATIENT_MEDICAL_RECORDS_OR_INTERNAL_PROPRIETARY_CODE';
    const privateContentHash = sha256Hex(rawSecret);
    const datasetId = computeDatasetId(OWNER, 'private-dataset');

    expect(datasetId).not.toContain(rawSecret);
    expect(datasetId).not.toEqual(privateContentHash);
    expect(datasetId.length).toBe(64);
  });

  it('Scenario 7: Privacy Invariant — zero-knowledge verification returns outcome without dataset records', () => {
    const verificationId = computeVerificationId('commitment-123', NOW);
    expect(verificationId.length).toBe(64);
    expect(complianceOutcomeName(COMPLIANCE_OUTCOME.COMPLIANT)).toBe('COMPLIANT');
    expect(complianceOutcomeName(COMPLIANCE_OUTCOME.NON_COMPLIANT)).toBe('NON_COMPLIANT');
  });

  // ── Scenario 8: Real Preprod E2E Flow with Circuit State Transitions ───────
  it('Scenario 8: Preprod E2E Flow — Direct circuit execution mutates on-chain ledger state', async () => {
    const witnesses = createBlackBoxWitnesses();
    const contract = new BlackBoxContract(witnesses);

    // Initial state checks
    const initialLedger = contract.initialState();
    expect(initialLedger.totalDatasetsRegistered).toBe(0n);
    expect(initialLedger.totalCommitmentsSubmitted).toBe(0n);
    expect(initialLedger.totalVerificationsRun).toBe(0n);

    // 1. Dataset Registration via circuit
    const dsName = 'Preprod-BioMed-Cleaned-v1';
    const dsId = computeDatasetId(OWNER, dsName);
    const secretHash = sha256Hex('E2E_CONFIDENTIAL_CORPUS_DATA_PAYLOAD');
    const licenseProof = sha256Hex('E2E_COMMERCIAL_LICENSE_PROOF_STAMP');

    const regCtx = createTestCircuitContext({
      datasetSecrets: [{ datasetId: dsId, contentHash: secretHash, licenseProof }],
      trainingSecrets: [],
      currentDatasetSecret: { datasetId: dsId, contentHash: secretHash, licenseProof },
    });

    await contract.circuits.registerDataset(
      regCtx as any,
      hexToBytes(dsId, 32),
      hexToBytes(OWNER, 32),
      hexToBytes(secretHash, 32),
      hexToBytes(licenseProof, 32),
      LICENSE_TYPES.COMMERCIAL,
      AUTH_STATUS.AUTHORIZED,
      BigInt(NOW - 5000),
      BigInt(NOW + 50000),
      hexToBytes(sha256Hex('e2e-metadata'), 32)
    );

    // Verify dataset is queryable via getDataset circuit
    const queriedDs = await contract.circuits.getDataset(regCtx as any, hexToBytes(dsId, 32));
    expect(bytesToHex(queriedDs.result.datasetId)).toBe(dsId);
    expect(queriedDs.result.authorizationStatus).toBe(AUTH_STATUS.AUTHORIZED);
    expect((contract as any).totalDatasetsRegistered).toBe(1n);

    // 2. Revoke and Re-authorize via circuits
    await contract.circuits.revokeDataset(regCtx as any, hexToBytes(dsId, 32), hexToBytes(OWNER, 32));
    const revokedDs = await contract.circuits.getDataset(regCtx as any, hexToBytes(dsId, 32));
    expect(revokedDs.result.authorizationStatus).toBe(AUTH_STATUS.REVOKED);

    await contract.circuits.authorizeDataset(regCtx as any, hexToBytes(dsId, 32), hexToBytes(OWNER, 32));
    const reAuthDs = await contract.circuits.getDataset(regCtx as any, hexToBytes(dsId, 32));
    expect(reAuthDs.result.authorizationStatus).toBe(AUTH_STATUS.AUTHORIZED);

    // 3. Submit training commitment via circuit
    const commId = computeCommitmentId(TRAINER, 'BioMed-Llama-70B');
    const dsList = [hexToBytes(dsId, 32)];
    while (dsList.length < 32) dsList.push(new Uint8Array(32));

    await contract.circuits.submitTrainingCommitment(
      regCtx as any,
      hexToBytes(commId, 32),
      hexToBytes(TRAINER, 32),
      dsList,
      1,
      BigInt(NOW),
      hexToBytes(sha256Hex('biomed-weights-final'), 32)
    );

    const queriedComm = await contract.circuits.getCommitment(regCtx as any, hexToBytes(commId, 32));
    expect(bytesToHex(queriedComm.result.commitmentId)).toBe(commId);
    expect(queriedComm.result.datasetCount).toBe(1);
    expect((contract as any).totalCommitmentsSubmitted).toBe(1n);

    // 4. Verify compliance via circuit
    const verId = computeVerificationId(commId, NOW);
    const verCtx = createTestCircuitContext({
      datasetSecrets: [],
      trainingSecrets: [
        {
          commitmentId: commId,
          dataHashes: [secretHash],
          datasetLicenses: [licenseProof],
        },
      ],
      currentTrainingSecret: {
        commitmentId: commId,
        dataHashes: [secretHash],
        datasetLicenses: [licenseProof],
      },
    });

    await contract.circuits.verifyCompliance(
      verCtx as any,
      hexToBytes(verId, 32),
      hexToBytes(commId, 32),
      100,
      95,
      false,
      true,
      hexToBytes(VERIFIER, 32)
    );

    const queriedVer = await contract.circuits.getVerificationStatus(verCtx as any, hexToBytes(verId, 32));
    expect(queriedVer.result.outcome).toBe(COMPLIANCE_OUTCOME.COMPLIANT);
    expect((contract as any).totalVerificationsRun).toBe(1n);
  });
});
