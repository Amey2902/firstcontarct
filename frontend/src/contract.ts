/**
 * Browser wiring for the BlackBox AI Compact contract.
 *
 * Imports the compiled contract directly (Vite bundles it), attaches the
 * private witnesses, and exposes helpers shared by the UI. This module is
 * browser-safe: no Node built-ins (fs/path/ws) are pulled in.
 */
import { CompiledContract } from '@midnight-ntwrk/midnight-js-protocol/compact-js';
import * as BlackBoxAI from '../public/contract/index.js';

export const CONTRACT_NAME = 'blackbox-ai';

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

// Private state for the contract
export type BlackBoxPrivateState = {
  datasetSecrets: Array<{ contentHash: string; licenseProof: string }>;
  trainingSecrets: Array<{ dataHashes: string[]; licenseHashes: string[] }>;
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

export function setSimulatedCurrentTimestamp(value: bigint): void {
  simulatedCurrentTimestamp = value;
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

const make = CompiledContract.make as any;
const withWitnesses = CompiledContract.withWitnesses as any;

// Path to compiled contract artifacts (keys, zkir)
// Files live in frontend/public/keys/ and frontend/public/zkir/ → served at /keys/ and /zkir/
export const zkConfigPath = '/';

export const compiledContract = make(CONTRACT_NAME, BlackBoxAI.Contract).pipe(
  withWitnesses({
    datasetContentHash: datasetContentHashWitness,
    licenseProof: licenseProofWitness,
    trainingDataHashes: trainingDataHashesWitness,
    datasetLicenses: datasetLicensesWitness,
    currentTimestamp: currentTimestampWitness,
  }),
);

export const contractModule = BlackBoxAI;

/**
 * Compute a deterministic DatasetId from owner and dataset name
 */
export async function computeDatasetId(owner: string, datasetName: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${owner}:${datasetName}`));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 64);
}

/**
 * Compute a deterministic CommitmentId from trainer and model name
 */
export async function computeCommitmentId(trainer: string, modelName: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${trainer}:${modelName}`));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 64);
}

/**
 * Compute a deterministic VerificationId from commitment and policy
 */
export async function computeVerificationId(commitmentId: string, policyId: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${commitmentId}:${policyId}`));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 64);
}

/**
 * Compute a deterministic PolicyId from creator and policy name
 */
export async function computePolicyId(creator: string, policyName: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${creator}:${policyName}`));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 64);
}

export function licenseTypeName(type: number): string {
  return LICENSE_TYPE_NAMES[type] ?? `Unknown(${type})`;
}

export function authStatusName(status: number): string {
  return AUTH_STATUS_NAMES[status] ?? `Unknown(${status})`;
}