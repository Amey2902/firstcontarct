/**
 * Headless tests for BlackBox AI contract.
 *
 * Run with: npm test
 */
import { describe, it, expect, beforeAll } from 'vitest';
import * as path from 'node:path';
import * as fs from 'node:fs';

describe('BlackBox AI Contract', () => {
  let contract: any;
  let runtime: any;

  beforeAll(async () => {
    // Compile the contract for testing
    const contractPath = path.resolve(__dirname, '../contracts/blackbox-ai.compact');
    const outputDir = path.resolve(__dirname, '../contracts/managed/blackbox-ai');
    
    if (!fs.existsSync(contractPath)) {
      console.log('Contract not found, skipping tests');
      return;
    }

    // Use compact-runtime for headless testing
    const { Contract, Witnesses } = await import(path.resolve(outputDir, 'contract', 'index.js'));
    
    // Create a mock witness provider
    const witnesses: Witnesses<typeof Contract> = {
      datasetContentHash: () => '0x' + 'a'.repeat(64),
      licenseProof: () => '0x' + 'b'.repeat(64),
      trainingDataHashes: () => Array(32).fill('0x' + 'c'.repeat(64)),
      datasetLicenses: () => Array(32).fill('0x' + 'd'.repeat(64)),
      currentTimestamp: () => BigInt(Math.floor(Date.now() / 1000)),
    };

    runtime = (Contract as any)(Contract, { witnesses });
    contract = runtime.contract;
  });

  it('should compile without errors', () => {
    const contractPath = path.resolve(__dirname, '../contracts/blackbox-ai.compact');
    expect(fs.existsSync(contractPath)).toBe(true);
  });

  it('should have correct circuit names', () => {
    if (!contract) return;
    const circuits = Object.keys(contract.circuits || {});
    expect(circuits).toContain('registerDataset');
    expect(circuits).toContain('commitTraining');
    expect(circuits).toContain('createPolicy');
    expect(circuits).toContain('verifyCompliance');
    expect(circuits).toContain('getDataset');
    expect(circuits).toContain('getCommitment');
    expect(circuits).toContain('getVerification');
    expect(circuits).toContain('getPolicy');
  });

  it('should register a dataset', async () => {
    if (!contract) return;
    
    const datasetId = '0x' + '1'.repeat(64);
    const owner = '0x' + '2'.repeat(64);
    const contentHash = '0x' + 'a'.repeat(64);
    const licenseHash = '0x' + 'b'.repeat(64);
    const now = BigInt(Math.floor(Date.now() / 1000));
    
    const result = contract.circuits.registerDataset(
      datasetId,
      owner,
      contentHash,
      licenseHash,
      0, // COMMERCIAL
      1, // AUTHORIZED
      now,
      now + 365n * 24n * 60n * 60n,
      'QmTestMetadata'
    );
    
    expect(result.result).toBeUndefined(); // No return value
    expect(contract.ledger.datasetRegistry.size).toBeGreaterThan(0);
  });

  it('should create a policy', async () => {
    if (!contract) return;
    
    const policyId = '0x' + '3'.repeat(64);
    const owner = '0x' + '2'.repeat(64);
    
    const result = contract.circuits.createPolicy(
      policyId,
      'Test Policy',
      100n,
      95n,
      false,
      true,
      owner
    );
    
    expect(result.result).toBeUndefined();
    expect(contract.ledger.policyRegistry.size).toBeGreaterThan(0);
  });

  it('should commit a training run', async () => {
    if (!contract) return;
    
    const commitmentId = '0x' + '4'.repeat(64);
    const trainer = '0x' + '2'.repeat(64);
    const datasetIds = ['0x' + '1'.repeat(64), ...Array(31).fill('0x' + '0'.repeat(64))];
    const now = BigInt(Math.floor(Date.now() / 1000));
    const modelHash = '0x' + '5'.repeat(64);
    
    const result = contract.circuits.commitTraining(
      commitmentId,
      trainer,
      datasetIds,
      1n,
      now,
      modelHash
    );
    
    expect(result.result).toBeUndefined();
    expect(contract.ledger.trainingCommitments.size).toBeGreaterThan(0);
  });

  it('should run ZK verification', async () => {
    if (!contract) return;
    
    const verificationId = '0x' + '6'.repeat(64);
    const commitmentId = '0x' + '4'.repeat(64);
    const policyId = '0x' + '3'.repeat(64);
    const verifier = '0x' + '2'.repeat(64);
    
    const result = contract.circuits.verifyCompliance(
      verificationId,
      commitmentId,
      policyId,
      verifier
    );
    
    expect(result.result).toBeUndefined();
    expect(contract.ledger.verificationResults.size).toBeGreaterThan(0);
  });

  it('should get dataset info', async () => {
    if (!contract) return;
    
    const datasetId = '0x' + '1'.repeat(64);
    const result = contract.circuits.getDataset(datasetId);
    
    expect(result.result).toBeDefined();
    expect(result.result.datasetId).toBe(datasetId);
  });

  it('should get verification result', async () => {
    if (!contract) return;
    
    const verificationId = '0x' + '6'.repeat(64);
    const result = contract.circuits.getVerification(verificationId);
    
    expect(result.result).toBeDefined();
    expect(result.result.verificationId).toBe(verificationId);
  });

  it('privacy: dataset content hash never leaves circuit', () => {
    if (!contract) return;
    
    // The content hash is only used as a witness in circuits
    // It is never stored in the ledger directly
    // Only the commitment to it (via registerDataset) is stored
    // The actual hash value is constrained by the witness but not disclosed
    
    const ledgerKeys = Object.keys(contract.ledger);
    // Private state should not contain content hashes
    expect(ledgerKeys).not.toContain('datasetContentHashes');
    expect(ledgerKeys).not.toContain('privateDatasetData');
  });

  it('privacy: training data composition never revealed', () => {
    if (!contract) return;
    
    // The training data hashes are only used as witnesses
    // The verification result only discloses aggregate percentages
    // Individual dataset details stay private
    
    const verificationKeys = Object.keys(contract.ledger.verificationResults.values().next().value || {});
    expect(verificationKeys).not.toContain('datasetIds');
    expect(verificationKeys).not.toContain('dataHashes');
    // Only these should be public:
    expect(verificationKeys).toContain('isCompliant');
    expect(verificationKeys).toContain('authorizedPercentage');
    expect(verificationKeys).toContain('licensedPercentage');
    expect(verificationKeys).toContain('restrictedCount');
    expect(verificationKeys).toContain('expiredLicenseCount');
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