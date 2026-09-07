/**
 * Shared wiring for the BlackBox AI Compact contract.
 *
 * Loads the compiled contract, attaches private witnesses, and exposes
 * helpers shared by the deploy script, the CLI, the headless tests, and the
 * browser dapp.
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { CompiledContract } from '@midnight-ntwrk/midnight-js-protocol/compact-js';

export const CONTRACT_NAME = 'blackbox-ai';

export const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const zkConfigPath = path.resolve(__dirname, '..', 'contracts', 'managed', CONTRACT_NAME);
export const contractPath = path.join(zkConfigPath, 'contract', 'index.js');

// License types
export const LICENSE_TYPES = {
  COMMERCIAL: 0,
  OPEN_SOURCE: 1,
  PROPRIETARY: 2,
  RESTRICTED: 3,
} as const;

export const LICENSE_TYPE_NAMES = ['Commercial', 'Open Source', 'Proprietary', 'Restricted'] as const;

// Authorization statuses
export const AUTH_STATUS = {
  PENDING: 0,
  AUTHORIZED: 1,
  REVOKED: 2,
  EXPIRED: 3,
} as const;

export const AUTH_STATUS_NAMES = ['Pending', 'Authorized', 'Revoked', 'Expired'] as const;

// Private state for the contract - stores local secrets for ZK proofs
export type BlackBoxPrivateState = {
  datasetSecrets: Map<string, { contentHash: string; licenseProof: string }>;
  trainingSecrets: Map<string, { dataHashes: string[]; licenseHashes: string[] }>;
};

// In-memory witnesses for ZK circuits (store as hex strings, convert to Uint8Array for witnesses)
let simulatedDatasetContentHash = '0x' + '0'.repeat(64);
let simulatedLicenseProof = '0x' + '0'.repeat(128);
let simulatedTrainingDataHashes: string[] = [];
let simulatedDatasetLicenses: string[] = [];
let simulatedCurrentTimestamp = BigInt(Math.floor(Date.now() / 1000));

export function setSimulatedDatasetContentHash(value: string): void {
  simulatedDatasetContentHash = value;
}

export function setSimulatedLicenseProof(value: string): void {
  simulatedLicenseProof = value;
}

export function setSimulatedTrainingDataHashes(values: string[]): void {
  simulatedTrainingDataHashes = values;
}

export function setSimulatedDatasetLicenses(values: string[]): void {
  simulatedDatasetLicenses = values;
}

export function setSimulatedCurrentTimestamp(value: number): void {
  simulatedCurrentTimestamp = BigInt(value);
}

// Helper to convert hex string to Uint8Array for witnesses
function hexToUint8Array(hex: string, length: number): Uint8Array {
  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
  const bytes = new Uint8Array(length);
  for (let i = 0; i < length && i * 2 < cleanHex.length; i++) {
    bytes[i] = parseInt(cleanHex.slice(i * 2, i * 2 + 2), 16) || 0;
  }
  return bytes;
}

// Witness: dataset content hash (private, never revealed)
export const datasetContentHashWitness = ({ privateState }: { privateState: BlackBoxPrivateState }) =>
  [privateState, hexToUint8Array(simulatedDatasetContentHash, 32)] as const;

// Witness: license proof (private, never revealed)
export const licenseProofWitness = ({ privateState }: { privateState: BlackBoxPrivateState }) =>
  [privateState, hexToUint8Array(simulatedLicenseProof, 64)] as const;

// Witness: training data hashes (private, never revealed)
export const trainingDataHashesWitness = ({ privateState }: { privateState: BlackBoxPrivateState }) =>
  [privateState, simulatedTrainingDataHashes.map(h => hexToUint8Array(h, 32))] as const;

// Witness: dataset licenses (private, never revealed)
export const datasetLicensesWitness = ({ privateState }: { privateState: BlackBoxPrivateState }) =>
  [privateState, simulatedDatasetLicenses.map(h => hexToUint8Array(h, 32))] as const;

// Witness: current timestamp (private)
export const currentTimestampWitness = ({ privateState }: { privateState: BlackBoxPrivateState }) =>
  [privateState, simulatedCurrentTimestamp] as const;

export async function loadContractModule() {
  if (!fs.existsSync(contractPath)) {
    throw new Error('Contract not compiled. Run: npm run compile');
  }
  return import(pathToFileURL(contractPath).href);
}

export async function loadCompiledContract(): Promise<any> {
  const { Contract } = await loadContractModule();
  const make = CompiledContract.make as any;
  const withWitnesses = CompiledContract.withWitnesses as any;
  const withCompiledFileAssets = CompiledContract.withCompiledFileAssets as any;
  return make(CONTRACT_NAME, Contract).pipe(
    withWitnesses({
      datasetContentHash: datasetContentHashWitness,
      licenseProof: licenseProofWitness,
      trainingDataHashes: trainingDataHashesWitness,
      datasetLicenses: datasetLicensesWitness,
      currentTimestamp: currentTimestampWitness,
    }),
    withCompiledFileAssets(zkConfigPath),
  );
}

/**
 * Compute a deterministic DatasetId from owner and dataset name
 */
export function computeDatasetId(owner: string, datasetName: string): string {
  return createHash('sha256').update(`${owner}:${datasetName}`).digest('hex').slice(0, 64);
}

/**
 * Compute a deterministic CommitmentId from trainer and model name
 */
export function computeCommitmentId(trainer: string, modelName: string): string {
  return createHash('sha256').update(`${trainer}:${modelName}`).digest('hex').slice(0, 64);
}

/**
 * Compute a deterministic VerificationId from commitment and policy
 */
export function computeVerificationId(commitmentId: string, policyId: string): string {
  return createHash('sha256').update(`${commitmentId}:${policyId}`).digest('hex').slice(0, 64);
}

/**
 * Compute a deterministic PolicyId from creator and policy name
 */
export function computePolicyId(creator: string, policyName: string): string {
  return createHash('sha256').update(`${creator}:${policyName}`).digest('hex').slice(0, 64);
}

export function licenseTypeName(type: number): string {
  return LICENSE_TYPE_NAMES[type] ?? `Unknown(${type})`;
}

export function authStatusName(status: number): string {
  return AUTH_STATUS_NAMES[status] ?? `Unknown(${status})`;
}