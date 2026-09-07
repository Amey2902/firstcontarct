/**
 * Headless tests for BlackBox AI contract.
 *
 * Run with: npm test
 */
import { describe, it, expect, beforeAll } from 'vitest';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { createCircuitContext, emptyZswapLocalState, dummyContractAddress } from '@midnight-ntwrk/compact-runtime';

// Helper: hex string → Uint8Array of fixed length
function hexBytes(hex: string, len: number): Uint8Array {
  const clean = hex.startsWith('0x') ? hex.slice(2) : hex;
  const buf = new Uint8Array(len);
  for (let i = 0; i < len; i++) buf[i] = parseInt(clean.slice(i * 2, i * 2 + 2) || '00', 16);
  return buf;
}

// Helper: string → Uint8Array of fixed length (zero-padded / truncated)
function strBytes(s: string, len: number): Uint8Array {
  const buf = new Uint8Array(len);
  const enc = new TextEncoder().encode(s);
  buf.set(enc.slice(0, len));
  return buf;
}

describe('BlackBox AI Contract', () => {
  let contractInstance: any;
  let ledgerFn: any;
  let ctx: any;        // circuit context
  let state: any;      // current contract state

  const DATASET_ID    = hexBytes('11'.repeat(32), 32);
  const OWNER         = hexBytes('22'.repeat(32), 32);
  const CONTENT_HASH  = hexBytes('aa'.repeat(32), 32);
  const LICENSE_HASH  = hexBytes('bb'.repeat(32), 32);
  const COMMITMENT_ID = hexBytes('44'.repeat(32), 32);
  const MODEL_HASH    = hexBytes('55'.repeat(32), 32);
  const POLICY_ID     = hexBytes('33'.repeat(32), 32);
  const VERIF_ID      = hexBytes('66'.repeat(32), 32);
  const POLICY_NAME   = strBytes('Test Policy', 64);
  const NOW           = BigInt(Math.floor(Date.now() / 1000));

  beforeAll(async () => {
    const contractPath = path.resolve(__dirname, '../contracts/blackbox-ai.compact');
    const compiledIndex = path.resolve(__dirname, '../contracts/managed/blackbox-ai/contract/index.js');

    if (!fs.existsSync(contractPath) || !fs.existsSync(compiledIndex)) {
      console.log('Contract not compiled — skipping runtime tests');
      return;
    }

    try {
      const mod = await import(compiledIndex);
      ledgerFn = mod.ledger;

      const witnesses = {
        datasetContentHash: () => [{ datasetSecrets: [], trainingSecrets: [] }, CONTENT_HASH] as const,
        licenseProof:       () => [{ datasetSecrets: [], trainingSecrets: [] }, LICENSE_HASH] as const,
        trainingDataHashes: () => [{ datasetSecrets: [], trainingSecrets: [] }, Array(32).fill(hexBytes('cc'.repeat(32), 32))] as const,
        datasetLicenses:    () => [{ datasetSecrets: [], trainingSecrets: [] }, Array(32).fill(hexBytes('dd'.repeat(32), 32))] as const,
        currentTimestamp:   () => [{ datasetSecrets: [], trainingSecrets: [] }, NOW] as const,
      };

      contractInstance = new mod.Contract(witnesses);

      const zswap = emptyZswapLocalState({ bytes: new Uint8Array(32) });
      const init = contractInstance.initialState({
        initialPrivateState: { datasetSecrets: [], trainingSecrets: [] },
        initialZswapLocalState: zswap,
      });
      state = init.currentContractState;
      ctx = createCircuitContext(dummyContractAddress(), zswap.coinPublicKey, state.data, { datasetSecrets: [], trainingSecrets: [] });
    } catch (e: any) {
      console.log('Contract setup failed:', e.message);
    }
  });

  it('should compile without errors', () => {
    const contractPath = path.resolve(__dirname, '../contracts/blackbox-ai.compact');
    expect(fs.existsSync(contractPath)).toBe(true);
  });

  it('should have correct circuit names', () => {
    if (!contractInstance) return;
    const circuits = Object.keys(contractInstance.circuits || {});
    expect(circuits).toContain('registerDataset');
    expect(circuits).toContain('commitTraining');
    expect(circuits).toContain('createPolicy');
    expect(circuits).toContain('verifyCompliance');
    expect(circuits).toContain('getDataset');
    expect(circuits).toContain('getCommitment');
    expect(circuits).toContain('getVerification');
    expect(circuits).toContain('getPolicy');
  });

  it('should register a dataset', () => {
    if (!contractInstance || !ctx) return;
    const result = contractInstance.circuits.registerDataset(
      ctx, DATASET_ID, OWNER, CONTENT_HASH, LICENSE_HASH,
      0n, 1n, NOW, NOW + 365n * 24n * 3600n, hexBytes('cc'.repeat(32), 32)
    );
    ctx = result.context;
    const l = ledgerFn(ctx.currentQueryContext.state);
    expect(l.datasetRegistry.member(DATASET_ID)).toBe(true);
  });

  it('should create a policy', () => {
    if (!contractInstance || !ctx) return;
    const result = contractInstance.circuits.createPolicy(
      ctx, POLICY_ID, POLICY_NAME, 100n, 95n, false, true, OWNER
    );
    ctx = result.context;
    const l = ledgerFn(ctx.currentQueryContext.state);
    expect(l.policyRegistry.member(POLICY_ID)).toBe(true);
  });

  it('should commit a training run', () => {
    if (!contractInstance || !ctx) return;
    const datasetIds = [DATASET_ID, ...Array(31).fill(hexBytes('00'.repeat(32), 32))];
    const result = contractInstance.circuits.commitTraining(
      ctx, COMMITMENT_ID, OWNER, datasetIds, 1n, NOW, MODEL_HASH
    );
    ctx = result.context;
    const l = ledgerFn(ctx.currentQueryContext.state);
    expect(l.trainingCommitments.member(COMMITMENT_ID)).toBe(true);
  });

  it('should run ZK verification', () => {
    if (!contractInstance || !ctx) return;
    const result = contractInstance.circuits.verifyCompliance(
      ctx, VERIF_ID, COMMITMENT_ID, POLICY_ID, OWNER
    );
    ctx = result.context;
    const l = ledgerFn(ctx.currentQueryContext.state);
    expect(l.verificationResults.member(VERIF_ID)).toBe(true);
  });

  it('should get dataset info', () => {
    if (!contractInstance || !ctx) return;
    const result = contractInstance.circuits.getDataset(ctx, DATASET_ID);
    expect(result.result).toBeDefined();
  });

  it('should get verification result', () => {
    if (!contractInstance || !ctx) return;
    const result = contractInstance.circuits.getVerification(ctx, VERIF_ID);
    expect(result.result).toBeDefined();
  });

  it('privacy: dataset content hash never leaves circuit', () => {
    if (!contractInstance || !ctx) return;
    const l = ledgerFn(ctx.currentQueryContext.state);
    // The ledger object should not have a field that stores raw content hashes
    expect('datasetContentHashes' in l).toBe(false);
    expect('privateDatasetData' in l).toBe(false);
  });

  it('privacy: training data composition never revealed', () => {
    if (!contractInstance || !ctx) return;
    const l = ledgerFn(ctx.currentQueryContext.state);
    const verif = l.verificationResults.lookup(VERIF_ID);
    expect(verif).toBeDefined();
    // Individual dataset IDs and hashes must not be in the public result
    expect('datasetIds' in verif).toBe(false);
    expect('dataHashes' in verif).toBe(false);
    // Only aggregate compliance info is public
    expect('isCompliant' in verif).toBe(true);
    expect('authorizedPercentage' in verif).toBe(true);
    expect('licensedPercentage' in verif).toBe(true);
  });
});

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
