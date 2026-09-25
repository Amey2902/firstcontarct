/**
 * BlackBox AI — Midnight Compact Contract Configuration & Witnesses Pipeline.
 */
import { createHash } from 'node:crypto';
import * as path from 'node:path';
import { Contract, ledger, pureCircuits, expectedVk } from '../contracts/managed/blackbox-ai/contract/index.js';
import type { Witnesses, DatasetInfo, TrainingCommitment, VerificationResult, Ledger } from '../contracts/managed/blackbox-ai/contract/index.js';

export const CONTRACT_NAME = 'BlackBox';
export const CONTRACT_DIRECTORY = path.resolve(process.cwd(), 'contracts/managed/blackbox-ai');

export interface DatasetSecret {
  datasetId: string;
  contentHash: string;
  licenseProof: string;
}

export interface TrainingSecret {
  commitmentId: string;
  dataHashes: string[];
  datasetLicenses: string[];
}

export interface BlackBoxPrivateState {
  datasetSecrets: DatasetSecret[];
  trainingSecrets: TrainingSecret[];
  currentDatasetSecret?: DatasetSecret;
  currentTrainingSecret?: TrainingSecret;
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
  if (!bytes) return '';
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Creates genuine Compact witnesses that read private state and produce circuit inputs.
 */
export function createBlackBoxWitnesses(): Witnesses<BlackBoxPrivateState> {
  return {
    datasetContentHash: (context) => {
      const ctx = context as any;
      const privateState = ctx?.circuitContext?.callContext?.currentPrivateState || ctx?.privateState;
      const secret = privateState?.currentDatasetSecret || privateState?.datasetSecrets?.[0];
      if (secret?.contentHash) {
        return hexToBytes(secret.contentHash, 32);
      }
      return new Uint8Array(32);
    },

    licenseProof: (context) => {
      const ctx = context as any;
      const privateState = ctx?.circuitContext?.callContext?.currentPrivateState || ctx?.privateState;
      const secret = privateState?.currentDatasetSecret || privateState?.datasetSecrets?.[0];
      if (secret?.licenseProof) {
        return hexToBytes(secret.licenseProof, 64);
      }
      return new Uint8Array(64);
    },

    trainingDataHashes: (context) => {
      const ctx = context as any;
      const privateState = ctx?.circuitContext?.callContext?.currentPrivateState || ctx?.privateState;
      const trainingSecret = privateState?.currentTrainingSecret || privateState?.trainingSecrets?.[0];
      const result: Uint8Array[] = [];
      for (let i = 0; i < 32; i++) {
        const hash = trainingSecret?.dataHashes?.[i];
        if (hash) {
          result.push(hexToBytes(hash, 32));
        } else {
          result.push(new Uint8Array(32));
        }
      }
      return result;
    },

    datasetLicenses: (context) => {
      const ctx = context as any;
      const privateState = ctx?.circuitContext?.callContext?.currentPrivateState || ctx?.privateState;
      const trainingSecret = privateState?.currentTrainingSecret || privateState?.trainingSecrets?.[0];
      const result: Uint8Array[] = [];
      for (let i = 0; i < 32; i++) {
        const lic = trainingSecret?.datasetLicenses?.[i];
        if (lic) {
          result.push(hexToBytes(lic, 32));
        } else {
          result.push(new Uint8Array(32));
        }
      }
      return result;
    },

    currentTimestamp: (_context) => {
      return BigInt(Math.floor(Date.now() / 1000));
    },
  };
}

/**
 * Assembles the real CompiledContract object with genuine witnesses for Midnight.js.
 */
export function createCompiledBlackBoxContract() {
  const witnesses = createBlackBoxWitnesses();
  return {
    Contract,
    witnesses,
    ledger,
    pureCircuits,
    expectedVk,
    compiledAssetsPath: CONTRACT_DIRECTORY,
  };
}

export {
  Contract as BlackBoxContract,
  ledger as blackBoxLedger,
  pureCircuits as blackBoxPureCircuits,
  expectedVk as blackBoxExpectedVk,
};

export type {
  Witnesses as BlackBoxWitnesses,
  DatasetInfo,
  TrainingCommitment,
  VerificationResult,
  Ledger as BlackBoxLedger,
};
