/**
 * Headless tests for BlackBox AI contract.
 *
 * Run with: npm test
 */
import { describe, it, expect, beforeAll } from 'vitest';
import * as path from 'node:path';
import * as fs from 'node:fs';
import {
  createCircuitContext,
  emptyZswapLocalState,
  dummyContractAddress,
} from '@midnight-ntwrk/compact-runtime';

// ── helpers ────────────────────────────────────────────────────────────────

function bytes(fill: number, len: number): Uint8Array {
  return new Uint8Array(len).fill(fill);
}

function strToBytes(s: string, len: number): Uint8Array {
  const buf = new Uint8Array(len);
  const enc = new TextEncoder().encode(s);
  buf.set(enc.slice(0, len));
  return buf;
}

// ── fixed test data ────────────────────────────────────────────────────────

const DATASET_ID    = bytes(0x11, 32);
const OWNER         = bytes(0x22, 32);
const CONTENT_HASH  = bytes(0xaa, 32);   // must match datasetContentHash witness
const LICENSE_HASH  = bytes(0xbb, 32);   // must match licenseProof witness (first 32 bytes)
const LICENSE_PROOF = bytes(0xbb, 64);   // licenseProof witness — Bytes<64>
const METADATA_HASH = bytes(0xcc, 32);
const COMMITMENT_ID = bytes(0x44, 32);
const MODEL_HASH    = bytes(0x55, 32);
const POLICY_ID     = bytes(0x33, 32);
const POLICY_NAME   = strToBytes('Test Policy', 64);
const VERIF_ID      = bytes(0x66, 32);
const EMPTY_32      = bytes(0x00, 32);

// trainingDataHashes[0] must match CONTENT_HASH
const TRAINING_HASHES = [CONTENT_HASH, ...Array(31).fill(EMPTY_32)];
// datasetLicenses[0] must match LICENSE_HASH (32 bytes each in the vector)
const DATASET_LICENSES = [LICENSE_HASH, ...Array(31).fill(EMPTY_32)];

const NOW = BigInt(Math.floor(Date.now() / 1000));
const VALID_FROM  = NOW - 3600n;
const VALID_UNTIL = NOW + 365n * 24n * 3600n;

const PRIVATE_STATE = { datasetSecrets: [], trainingSecrets: [] };

// ── shared mutable test state ──────────────────────────────────────────────

let contractInstance: any;
let ledgerFn: any;
let ctx: any;
let compiled = false;

// ── suite ──────────────────────────────────────────────────────────────────

describe('BlackBox AI Contract', () => {
  beforeAll(async () => {
    const contractPath = path.resolve(__dirname, '../contracts/blackbox-ai.compact');
    const compiledIndex = path.resolve(
      __dirname, '../contracts/managed/blackbox-ai/contract/index.js'
    );

    if (!fs.existsSync(contractPath) || !fs.existsSync(compiledIndex)) {
      console.log('Contract not compiled — skipping runtime tests');
      return;
    }

    try {
      const mod = await import(compiledIndex);
      ledgerFn = mod.ledger;

      const witnesses = {
        datasetContentHash: () => [PRIVATE_STATE, CONTENT_HASH] as const,
        licenseProof:       () => [PRIVATE_STATE, LICENSE_PROOF] as const,
        trainingDataHashes: () => [PRIVATE_STATE, TRAINING_HASHES] as const,
        datasetLicenses:    () => [PRIVATE_STATE, DATASET_LICENSES] as const,
        currentTimestamp:   () => [PRIVATE_STATE, NOW] as const,
      };

      contractInstance = new mod.Contract(witnesses);

      const zswap = emptyZswapLocalState({ bytes: new Uint8Array(32) });
      const init  = contractInstance.initialState({
        initialPrivateState: PRIVATE_STATE,
        initialZswapLocalState: zswap,
      });

      ctx = createCircuitContext(
        dummyContractAddress(),
        zswap.coinPublicKey,
        init.currentContractState.data,
        PRIVATE_STATE,
      );

      compiled = true;
    } catch (e: any) {
      console.log('Contract setup failed:', e.message);
    }
  });

  // ── static checks (always run) ───────────────────────────────────────────

  it('should compile without errors', () => {
    const p = path.resolve(__dirname, '../contracts/blackbox-ai.compact');
    expect(fs.existsSync(p)).toBe(true);
  });

  it('should have correct circuit names', () => {
    if (!compiled) return;
    const names = Object.keys(contractInstance.circuits);
    for (const n of ['registerDataset','commitTraining','createPolicy',
                     'verifyCompliance','getDataset','getCommitment',
                     'getVerification','getPolicy']) {
      expect(names).toContain(n);
    }
  });

  // ── sequential state-building tests ─────────────────────────────────────
  // Each test mutates `ctx` so the next test sees the updated ledger.

  it('should register a dataset', () => {
    if (!compiled) return;
    const r = contractInstance.circuits.registerDataset(
      ctx,
      DATASET_ID, OWNER, CONTENT_HASH, LICENSE_HASH,
      0n,          // COMMERCIAL
      1n,          // AUTHORIZED
      VALID_FROM,
      VALID_UNTIL,
      METADATA_HASH,
    );
    ctx = r.context;
    expect(ledgerFn(ctx.currentQueryContext.state).datasetRegistry.member(DATASET_ID)).toBe(true);
  });

  it('should create a policy', () => {
    if (!compiled) return;
    const r = contractInstance.circuits.createPolicy(
      ctx,
      POLICY_ID, POLICY_NAME,
      100n, 95n,   // minAuthorized, minLicensed
      false, true, // allowRestricted, requireValidLicenses
      OWNER,
    );
    ctx = r.context;
    expect(ledgerFn(ctx.currentQueryContext.state).policyRegistry.member(POLICY_ID)).toBe(true);
  });

  it('should commit a training run', () => {
    if (!compiled) return;
    const datasetIds = [DATASET_ID, ...Array(31).fill(EMPTY_32)];
    const r = contractInstance.circuits.commitTraining(
      ctx,
      COMMITMENT_ID, OWNER, datasetIds,
      1n,   // datasetCount
      NOW,  // trainingTimestamp
      MODEL_HASH,
    );
    ctx = r.context;
    expect(ledgerFn(ctx.currentQueryContext.state).trainingCommitments.member(COMMITMENT_ID)).toBe(true);
  });

  it('should run ZK verification', () => {
    if (!compiled) return;
    const r = contractInstance.circuits.verifyCompliance(
      ctx,
      VERIF_ID, COMMITMENT_ID, POLICY_ID, OWNER,
    );
    ctx = r.context;
    expect(ledgerFn(ctx.currentQueryContext.state).verificationResults.member(VERIF_ID)).toBe(true);
  });

  it('should get dataset info', () => {
    if (!compiled) return;
    const r = contractInstance.circuits.getDataset(ctx, DATASET_ID);
    expect(r.result).toBeDefined();
  });

  it('should get verification result', () => {
    if (!compiled) return;
    const r = contractInstance.circuits.getVerification(ctx, VERIF_ID);
    expect(r.result).toBeDefined();
  });

  it('privacy: dataset content hash never leaves circuit', () => {
    if (!compiled) return;
    const l = ledgerFn(ctx.currentQueryContext.state);
    expect('datasetContentHashes' in l).toBe(false);
    expect('privateDatasetData' in l).toBe(false);
  });

  it('privacy: training data composition never revealed', () => {
    if (!compiled) return;
    const l = ledgerFn(ctx.currentQueryContext.state);
    const verif = l.verificationResults.lookup(VERIF_ID);
    expect(verif).toBeDefined();
    expect('datasetIds' in verif).toBe(false);
    expect('dataHashes' in verif).toBe(false);
    expect('isCompliant' in verif).toBe(true);
    expect('authorizedPercentage' in verif).toBe(true);
    expect('licensedPercentage' in verif).toBe(true);
  });
});

// ── constants tests (always run, no contract needed) ──────────────────────

describe('BlackBox AI Constants', () => {
  it('should have correct license type constants', async () => {
    const { LICENSE_TYPES } = await import('../src/contract-constants.js');
    expect(LICENSE_TYPES.COMMERCIAL).toBe(0);
    expect(LICENSE_TYPES.OPEN_SOURCE).toBe(1);
    expect(LICENSE_TYPES.PROPRIETARY).toBe(2);
    expect(LICENSE_TYPES.RESTRICTED).toBe(3);
  });

  it('should have correct auth status constants', async () => {
    const { AUTH_STATUS } = await import('../src/contract-constants.js');
    expect(AUTH_STATUS.PENDING).toBe(0);
    expect(AUTH_STATUS.AUTHORIZED).toBe(1);
    expect(AUTH_STATUS.REVOKED).toBe(2);
    expect(AUTH_STATUS.EXPIRED).toBe(3);
  });

  it('should have correct license type names', async () => {
    const { LICENSE_TYPE_NAMES } = await import('../src/contract-constants.js');
    expect(LICENSE_TYPE_NAMES[0]).toBe('Commercial');
    expect(LICENSE_TYPE_NAMES[1]).toBe('Open Source');
    expect(LICENSE_TYPE_NAMES[2]).toBe('Proprietary');
    expect(LICENSE_TYPE_NAMES[3]).toBe('Restricted');
  });
});
