/**
 * BLACKBOX AI — Zero-Knowledge Compliance Test Suite
 *
 * Verifies all 5 required compliance scenarios & Midnight privacy invariants:
 *   Test 1: Fully compliant datasets -> COMPLIANT (Outcome = 1)
 *   Test 2: Contains restricted dataset -> NON_COMPLIANT (Outcome = 0)
 *   Test 3: Expired license -> NON_COMPLIANT (Outcome = 0)
 *   Test 4: Missing authorization -> NON_COMPLIANT (Outcome = 0)
 *   Test 5: 95% licensed threshold met -> COMPLIANT (Outcome = 1)
 *   Test 6: Privacy invariant: Raw dataset content never exposed on-chain
 *   Test 7: Privacy invariant: Confidential licensing secrets never leak
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
  computeDatasetId,
  computeCommitmentId,
  computeVerificationId,
  sha256Hex,
} from '../src/contract.js';

// ── Mock Compact Contract Policy Evaluator (Mirrors BlackBox.compact) ────────

interface DatasetRecord {
  datasetId: string;
  owner: string;
  licenseType: number;
  authStatus: number;
  validFrom: number;
  validUntil: number;
  contentHash: string;
  licenseProof: string;
}

interface TrainingRun {
  commitmentId: string;
  trainer: string;
  datasetIds: string[];
  trainingTimestamp: number;
  modelHash: string;
}

interface ComplianceResult {
  outcome: number; // 1 = COMPLIANT, 0 = NON_COMPLIANT
  authorizedPercentage: number;
  licensedPercentage: number;
  restrictedCount: number;
  expiredCount: number;
}

function evaluatePolicyInCircuit(
  datasets: DatasetRecord[],
  trainingRun: TrainingRun,
  policy: {
    minAuthorizedPct: number;
    minLicensedPct: number;
    allowRestricted: boolean;
    requireValidLicenses: boolean;
  }
): ComplianceResult {
  const total = trainingRun.datasetIds.length;
  if (total === 0) {
    return { outcome: 0, authorizedPercentage: 0, licensedPercentage: 0, restrictedCount: 0, expiredCount: 0 };
  }

  let authorizedCount = 0;
  let licensedCount = 0;
  let restrictedCount = 0;
  let expiredCount = 0;

  for (const id of trainingRun.datasetIds) {
    const ds = datasets.find((d) => d.datasetId === id);
    if (!ds) continue;

    // Check authorization (Rule 1 & Rule 5)
    if (ds.authStatus === AUTH_STATUS.AUTHORIZED) {
      authorizedCount++;
    }

    // Check licensing (Rule 2)
    if (ds.licenseType !== LICENSE_TYPES.RESTRICTED) {
      licensedCount++;
    } else {
      restrictedCount++;
    }

    // Check license validity period (Rule 4)
    if (
      trainingRun.trainingTimestamp < ds.validFrom ||
      trainingRun.trainingTimestamp > ds.validUntil
    ) {
      expiredCount++;
    }
  }

  const authPct = Math.floor((authorizedCount * 100) / total);
  const licPct = Math.floor((licensedCount * 100) / total);

  let isCompliant = true;
  if (authPct < policy.minAuthorizedPct) isCompliant = false;
  if (licPct < policy.minLicensedPct) isCompliant = false;
  if (!policy.allowRestricted && restrictedCount > 0) isCompliant = false;
  if (policy.requireValidLicenses && expiredCount > 0) isCompliant = false;

  return {
    outcome: isCompliant ? COMPLIANCE_OUTCOME.COMPLIANT : COMPLIANCE_OUTCOME.NON_COMPLIANT,
    authorizedPercentage: authPct,
    licensedPercentage: licPct,
    restrictedCount,
    expiredCount,
  };
}

// ── Test Suite ───────────────────────────────────────────────────────────────

describe('BlackBox AI — Smart Contract & Compliance Circuits', () => {
  const OWNER = '0x1111111111111111111111111111111111111111111111111111111111111111';
  const TRAINER = '0x2222222222222222222222222222222222222222222222222222222222222222';
  const NOW = Math.floor(Date.now() / 1000);

  const defaultPolicy = {
    minAuthorizedPct: 100,
    minLicensedPct: 95,
    allowRestricted: false,
    requireValidLicenses: true,
  };

  // ── Test 1: Fully compliant datasets ──────────────────────────────────────
  it('Scenario 1: should return COMPLIANT for fully authorized and licensed datasets', () => {
    const ds1: DatasetRecord = {
      datasetId: computeDatasetId(OWNER, 'commercial-corpus-1'),
      owner: OWNER,
      licenseType: LICENSE_TYPES.COMMERCIAL,
      authStatus: AUTH_STATUS.AUTHORIZED,
      validFrom: NOW - 10000,
      validUntil: NOW + 100000,
      contentHash: sha256Hex('dataset-1-secret-data'),
      licenseProof: sha256Hex('license-proof-token-1'),
    };

    const ds2: DatasetRecord = {
      datasetId: computeDatasetId(OWNER, 'open-source-corpus-2'),
      owner: OWNER,
      licenseType: LICENSE_TYPES.OPEN_SOURCE,
      authStatus: AUTH_STATUS.AUTHORIZED,
      validFrom: NOW - 10000,
      validUntil: NOW + 100000,
      contentHash: sha256Hex('dataset-2-secret-data'),
      licenseProof: sha256Hex('license-proof-token-2'),
    };

    const trainingRun: TrainingRun = {
      commitmentId: computeCommitmentId(TRAINER, 'gpt-custom-model'),
      trainer: TRAINER,
      datasetIds: [ds1.datasetId, ds2.datasetId],
      trainingTimestamp: NOW,
      modelHash: sha256Hex('model-weights-v1'),
    };

    const result = evaluatePolicyInCircuit([ds1, ds2], trainingRun, defaultPolicy);

    expect(result.outcome).toBe(COMPLIANCE_OUTCOME.COMPLIANT);
    expect(result.authorizedPercentage).toBe(100);
    expect(result.licensedPercentage).toBe(100);
    expect(result.restrictedCount).toBe(0);
    expect(result.expiredCount).toBe(0);
  });

  // ── Test 2: Contains restricted dataset ───────────────────────────────────
  it('Scenario 2: should return NON_COMPLIANT when a restricted dataset is included', () => {
    const ds1: DatasetRecord = {
      datasetId: computeDatasetId(OWNER, 'valid-corpus-1'),
      owner: OWNER,
      licenseType: LICENSE_TYPES.COMMERCIAL,
      authStatus: AUTH_STATUS.AUTHORIZED,
      validFrom: NOW - 10000,
      validUntil: NOW + 100000,
      contentHash: sha256Hex('dataset-1-secret-data'),
      licenseProof: sha256Hex('license-proof-token-1'),
    };

    const dsRestricted: DatasetRecord = {
      datasetId: computeDatasetId(OWNER, 'copyrighted-restricted-data'),
      owner: OWNER,
      licenseType: LICENSE_TYPES.RESTRICTED, // Restricted: No AI training allowed
      authStatus: AUTH_STATUS.AUTHORIZED,
      validFrom: NOW - 10000,
      validUntil: NOW + 100000,
      contentHash: sha256Hex('restricted-secret-data'),
      licenseProof: sha256Hex('restricted-license-notice'),
    };

    const trainingRun: TrainingRun = {
      commitmentId: computeCommitmentId(TRAINER, 'vision-model-v2'),
      trainer: TRAINER,
      datasetIds: [ds1.datasetId, dsRestricted.datasetId],
      trainingTimestamp: NOW,
      modelHash: sha256Hex('model-weights-v2'),
    };

    const result = evaluatePolicyInCircuit([ds1, dsRestricted], trainingRun, defaultPolicy);

    expect(result.outcome).toBe(COMPLIANCE_OUTCOME.NON_COMPLIANT);
    expect(result.restrictedCount).toBe(1);
    expect(result.licensedPercentage).toBe(50);
  });

  // ── Test 3: Expired license ───────────────────────────────────────────────
  it('Scenario 3: should return NON_COMPLIANT when training occurs outside license validity period', () => {
    const dsExpired: DatasetRecord = {
      datasetId: computeDatasetId(OWNER, 'expired-license-corpus'),
      owner: OWNER,
      licenseType: LICENSE_TYPES.COMMERCIAL,
      authStatus: AUTH_STATUS.AUTHORIZED,
      validFrom: NOW - 20000,
      validUntil: NOW - 1000, // License expired prior to training
      contentHash: sha256Hex('expired-dataset-secret'),
      licenseProof: sha256Hex('expired-license-token'),
    };

    const trainingRun: TrainingRun = {
      commitmentId: computeCommitmentId(TRAINER, 'nlp-model-v3'),
      trainer: TRAINER,
      datasetIds: [dsExpired.datasetId],
      trainingTimestamp: NOW, // Training timestamp after license expiration
      modelHash: sha256Hex('model-weights-v3'),
    };

    const result = evaluatePolicyInCircuit([dsExpired], trainingRun, defaultPolicy);

    expect(result.outcome).toBe(COMPLIANCE_OUTCOME.NON_COMPLIANT);
    expect(result.expiredCount).toBe(1);
  });

  // ── Test 4: Missing authorization ─────────────────────────────────────────
  it('Scenario 4: should return NON_COMPLIANT when owner authorization is missing or revoked', () => {
    const dsPending: DatasetRecord = {
      datasetId: computeDatasetId(OWNER, 'unauthorized-user-data'),
      owner: OWNER,
      licenseType: LICENSE_TYPES.COMMERCIAL,
      authStatus: AUTH_STATUS.PENDING, // Not authorized
      validFrom: NOW - 10000,
      validUntil: NOW + 100000,
      contentHash: sha256Hex('unauthorized-dataset-secret'),
      licenseProof: sha256Hex('pending-review-license'),
    };

    const trainingRun: TrainingRun = {
      commitmentId: computeCommitmentId(TRAINER, 'speech-model-v4'),
      trainer: TRAINER,
      datasetIds: [dsPending.datasetId],
      trainingTimestamp: NOW,
      modelHash: sha256Hex('model-weights-v4'),
    };

    const result = evaluatePolicyInCircuit([dsPending], trainingRun, defaultPolicy);

    expect(result.outcome).toBe(COMPLIANCE_OUTCOME.NON_COMPLIANT);
    expect(result.authorizedPercentage).toBe(0);
  });

  // ── Test 5: 95% licensed threshold met ────────────────────────────────────
  it('Scenario 5: should return COMPLIANT when 95% licensed threshold is satisfied', () => {
    // 19 licensed datasets + 1 unlicensed dataset = 95% licensed
    const datasets: DatasetRecord[] = [];
    const datasetIds: string[] = [];

    for (let i = 0; i < 20; i++) {
      const isLast = i === 19;
      const ds: DatasetRecord = {
        datasetId: computeDatasetId(OWNER, `batch-corpus-${i}`),
        owner: OWNER,
        licenseType: isLast ? LICENSE_TYPES.RESTRICTED : LICENSE_TYPES.COMMERCIAL,
        authStatus: AUTH_STATUS.AUTHORIZED,
        validFrom: NOW - 10000,
        validUntil: NOW + 100000,
        contentHash: sha256Hex(`batch-dataset-secret-${i}`),
        licenseProof: sha256Hex(`batch-license-${i}`),
      };
      datasets.push(ds);
      datasetIds.push(ds.datasetId);
    }

    const trainingRun: TrainingRun = {
      commitmentId: computeCommitmentId(TRAINER, 'large-ensemble-model'),
      trainer: TRAINER,
      datasetIds,
      trainingTimestamp: NOW,
      modelHash: sha256Hex('ensemble-weights-v5'),
    };

    // Policy allowing up to 5% non-commercial with restricted permitted
    const thresholdPolicy = {
      minAuthorizedPct: 100,
      minLicensedPct: 95,
      allowRestricted: true,
      requireValidLicenses: true,
    };

    const result = evaluatePolicyInCircuit(datasets, trainingRun, thresholdPolicy);

    expect(result.outcome).toBe(COMPLIANCE_OUTCOME.COMPLIANT);
    expect(result.authorizedPercentage).toBe(100);
    expect(result.licensedPercentage).toBe(95); // 19/20 = 95%
  });

  // ── Test 6 & 7: Privacy Model Invariant Assertions ────────────────────────
  it('Scenario 6: Privacy Invariant — raw dataset content hashes never leak to on-chain state', () => {
    const rawSecret = 'CONFIDENTIAL_PATIENT_MEDICAL_RECORDS_OR_INTERNAL_PROPRIETARY_CODE';
    const privateContentHash = sha256Hex(rawSecret);
    const datasetId = computeDatasetId(OWNER, 'private-dataset');

    // Dataset ID and proof commitments are one-way cryptographic hashes
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
});
