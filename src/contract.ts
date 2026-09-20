/**
 * Shared contract wiring, types, and deterministic hashing utilities for BlackBox AI.
 */
import { createHash } from 'node:crypto';

export const CONTRACT_NAME = 'BlackBox';

export interface DatasetSecrets {
  datasetId: string;
  contentHash: string;
  licenseProof: string;
}

export interface TrainingSecrets {
  commitmentId: string;
  dataHashes: string[];
  datasetLicenses: string[];
}

export interface BlackBoxPrivateState {
  datasetSecrets: DatasetSecrets[];
  trainingSecrets: TrainingSecrets[];
}

export const INITIAL_PRIVATE_STATE: BlackBoxPrivateState = {
  datasetSecrets: [],
  trainingSecrets: [],
};

export function sha256Hex(data: string | Buffer | Uint8Array): string {
  return createHash('sha256').update(data).digest('hex');
}

export function computeDatasetId(owner: string, datasetName: string): string {
  return sha256Hex(`dataset:${owner}:${datasetName}`);
}

export function computeCommitmentId(trainer: string, modelName: string): string {
  return sha256Hex(`commitment:${trainer}:${modelName}`);
}

export function computeVerificationId(commitmentId: string, timestamp: number): string {
  return sha256Hex(`verification:${commitmentId}:${timestamp}`);
}

export function hexToBytes(hex: string, length = 32): Uint8Array {
  const clean = hex.startsWith('0x') ? hex.slice(2) : hex;
  const arr = new Uint8Array(length);
  for (let i = 0; i < length && i * 2 < clean.length; i++) {
    arr[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16) || 0;
  }
  return arr;
}

export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
