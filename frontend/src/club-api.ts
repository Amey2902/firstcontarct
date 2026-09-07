/**
 * Business logic for a deployed BlackBox AI contract, browser edition.
 *
 * Mirrors the Node CLI's flow: find the deployed contract (verifying local
 * verifier keys against the chain) and expose typed circuit calls. Every call
 * goes through zero-knowledge proofs that keep sensitive data private.
 */
import { findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import type { ContractAddress } from '@midnight-ntwrk/midnight-js-protocol/compact-runtime';
import { compiledContract, CONTRACT_NAME, contractModule } from './contract';
import { type BlackBoxProviders } from './providers';

const PRIVATE_STATE_ID = `${CONTRACT_NAME}PrivateState`;

// ── Type conversion helpers ────────────────────────────────────────────────

/** hex string (with or without 0x) → Uint8Array of exactly `len` bytes */
function toBytes(hex: string, len: number): Uint8Array {
  const clean = hex.startsWith('0x') ? hex.slice(2) : hex;
  const buf = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    buf[i] = parseInt(clean.slice(i * 2, i * 2 + 2) || '00', 16);
  }
  return buf;
}

/** UTF-8 string → Uint8Array of exactly `len` bytes (zero-padded / truncated) */
function toFixedStr(s: string, len: number): Uint8Array {
  const buf = new Uint8Array(len);
  const enc = new TextEncoder().encode(s);
  buf.set(enc.slice(0, len));
  return buf;
}

/** hex → Bytes<32> */
const b32 = (hex: string) => toBytes(hex, 32);
/** string → Bytes<64> (for policy name) */
const s64 = (s: string) => toFixedStr(s, 64);

/** Bytes<32> Uint8Array → hex string */
function fromBytes(buf: Uint8Array): string {
  return Array.from(buf).map(b => b.toString(16).padStart(2, '0')).join('');
}

/** Read back a Uint8Array field as hex */
const toHex = (v: Uint8Array | string): string =>
  v instanceof Uint8Array ? fromBytes(v) : v;

export interface DatasetInfo {
  datasetId: string;
  owner: string;
  contentHash: string;
  licenseHash: string;
  licenseType: number;
  authorizationStatus: number;
  validFrom: bigint;
  validUntil: bigint;
  registeredAt: bigint;
  metadataHash: string;
}

export interface TrainingCommitment {
  commitmentId: string;
  trainer: string;
  datasetIds: string[];
  datasetCount: bigint;
  trainingTimestamp: bigint;
  modelHash: string;
  committedAt: bigint;
}

export interface Policy {
  policyId: string;
  name: string;
  minAuthorizedPercentage: bigint;
  minLicensedPercentage: bigint;
  allowRestricted: boolean;
  requireValidLicenses: boolean;
  createdAt: bigint;
  createdBy: string;
}

export interface VerificationResult {
  verificationId: string;
  commitmentId: string;
  policyId: string;
  isCompliant: boolean;
  authorizedPercentage: bigint;
  licensedPercentage: bigint;
  restrictedCount: bigint;
  expiredLicenseCount: bigint;
  verifiedAt: bigint;
  verifiedBy: string;
}

export interface ContractState {
  datasetCount: bigint;
  commitmentCount: bigint;
  verificationCount: bigint;
  policyCount: bigint;
}

export class BlackBoxAPI {
  private constructor(
    public readonly deployedContract: any,
    private readonly providers: BlackBoxProviders,
  ) {
    this.contractAddress = deployedContract.deployTxData.public.contractAddress;
    providers.privateStateProvider.setContractAddress(this.contractAddress);
  }

  readonly contractAddress: ContractAddress;

  /** Join an existing BlackBox AI contract. */
  static async join(providers: BlackBoxProviders, contractAddress: ContractAddress): Promise<BlackBoxAPI> {
    // Sanity check — walletProvider must implement the WalletProvider interface
    if (typeof (providers.walletProvider as any).getCoinPublicKey !== 'function') {
      throw new Error('walletProvider.getCoinPublicKey is missing — providers were not built correctly. Please disconnect and reconnect your wallet.');
    }
    const deployedContract = await findDeployedContract(providers as any, {
      contractAddress,
      compiledContract,
      privateStateId: PRIVATE_STATE_ID,
      initialPrivateState: { datasetSecrets: [], trainingSecrets: [] },
    });
    return new BlackBoxAPI(deployedContract, providers);
  }

  // ─── Dataset Owner Actions ─────────────────────────────────────────────────

  async registerDataset(
    datasetId: string,
    owner: string,
    contentHash: string,
    licenseHash: string,
    licenseType: number,
    authorizationStatus: number,
    validFrom: bigint,
    validUntil: bigint,
    metadataHash: string
  ): Promise<void> {
    await (this.deployedContract as any).callTx.registerDataset(
      b32(datasetId),
      b32(owner),
      b32(contentHash),
      b32(licenseHash),
      BigInt(licenseType),
      BigInt(authorizationStatus),
      validFrom,
      validUntil,
      b32(metadataHash),
    );
  }

  async updateAuthorization(datasetId: string, newStatus: number, owner: string): Promise<void> {
    await (this.deployedContract as any).callTx.updateAuthorization(
      b32(datasetId),
      BigInt(newStatus),
      b32(owner),
    );
  }

  async revokeDataset(datasetId: string, owner: string): Promise<void> {
    await (this.deployedContract as any).callTx.revokeDataset(b32(datasetId), b32(owner));
  }

  async getDataset(datasetId: string): Promise<DatasetInfo> {
    const result = await (this.deployedContract as any).callTx.getDataset(b32(datasetId));
    const r = result.result ?? result.returnValue;
    return {
      datasetId:           toHex(r.datasetId),
      owner:               toHex(r.owner),
      contentHash:         toHex(r.contentHash),
      licenseHash:         toHex(r.licenseHash),
      licenseType:         Number(r.licenseType),
      authorizationStatus: Number(r.authorizationStatus),
      validFrom:           BigInt(r.validFrom),
      validUntil:          BigInt(r.validUntil),
      registeredAt:        BigInt(r.registeredAt),
      metadataHash:        toHex(r.metadataHash),
    };
  }

  // ─── AI Company Actions ────────────────────────────────────────────────────

  async commitTraining(
    commitmentId: string,
    trainer: string,
    datasetIds: string[],
    datasetCount: bigint,
    trainingTimestamp: bigint,
    modelHash: string
  ): Promise<void> {
    const padded = [...datasetIds];
    while (padded.length < 32) padded.push('0'.repeat(64));
    await (this.deployedContract as any).callTx.commitTraining(
      b32(commitmentId),
      b32(trainer),
      padded.map(id => b32(id)),
      datasetCount,
      trainingTimestamp,
      b32(modelHash),
    );
  }

  async getCommitment(commitmentId: string): Promise<TrainingCommitment> {
    const result = await (this.deployedContract as any).callTx.getCommitment(b32(commitmentId));
    const r = result.result ?? result.returnValue;
    return {
      commitmentId:       toHex(r.commitmentId),
      trainer:            toHex(r.trainer),
      datasetIds:         Array.from(r.datasetIds as Uint8Array[]).map(toHex),
      datasetCount:       BigInt(r.datasetCount),
      trainingTimestamp:  BigInt(r.trainingTimestamp),
      modelHash:          toHex(r.modelHash),
      committedAt:        BigInt(r.committedAt),
    };
  }

  // ─── Verifier/Auditor Actions ──────────────────────────────────────────────

  async createPolicy(
    policyId: string,
    name: string,
    minAuthorizedPercentage: bigint,
    minLicensedPercentage: bigint,
    allowRestricted: boolean,
    requireValidLicenses: boolean,
    createdBy: string
  ): Promise<void> {
    await (this.deployedContract as any).callTx.createPolicy(
      b32(policyId),
      s64(name),
      minAuthorizedPercentage,
      minLicensedPercentage,
      allowRestricted,
      requireValidLicenses,
      b32(createdBy),
    );
  }

  async verifyCompliance(
    verificationId: string,
    commitmentId: string,
    policyId: string,
    verifier: string
  ): Promise<void> {
    await (this.deployedContract as any).callTx.verifyCompliance(
      b32(verificationId),
      b32(commitmentId),
      b32(policyId),
      b32(verifier),
    );
  }

  async getVerification(verificationId: string): Promise<VerificationResult> {
    const result = await (this.deployedContract as any).callTx.getVerification(b32(verificationId));
    const r = result.result ?? result.returnValue;
    return {
      verificationId:       toHex(r.verificationId),
      commitmentId:         toHex(r.commitmentId),
      policyId:             toHex(r.policyId),
      isCompliant:          Boolean(r.isCompliant),
      authorizedPercentage: BigInt(r.authorizedPercentage),
      licensedPercentage:   BigInt(r.licensedPercentage),
      restrictedCount:      BigInt(r.restrictedCount),
      expiredLicenseCount:  BigInt(r.expiredLicenseCount),
      verifiedAt:           BigInt(r.verifiedAt),
      verifiedBy:           toHex(r.verifiedBy),
    };
  }

  async getPolicy(policyId: string): Promise<Policy> {
    const result = await (this.deployedContract as any).callTx.getPolicy(b32(policyId));
    const r = result.result ?? result.returnValue;
    return {
      policyId:                toHex(r.policyId),
      name:                    r.name instanceof Uint8Array
                                 ? new TextDecoder().decode(r.name).replace(/\0/g, '')
                                 : String(r.name),
      minAuthorizedPercentage: BigInt(r.minAuthorizedPercentage),
      minLicensedPercentage:   BigInt(r.minLicensedPercentage),
      allowRestricted:         Boolean(r.allowRestricted),
      requireValidLicenses:    Boolean(r.requireValidLicenses),
      createdAt:               BigInt(r.createdAt),
      createdBy:               toHex(r.createdBy),
    };
  }

  // ─── Public State Queries ──────────────────────────────────────────────────

  /** Read the public ledger for this contract via the indexer. */
  async getContractState(): Promise<ContractState> {
    const contractState = await this.providers.publicDataProvider.queryContractState(this.contractAddress);
    if (!contractState) throw new Error('Contract not found on this network');
    const ledgerState = contractModule.ledger(contractState.data);
    return {
      datasetCount: ledgerState.datasetCount,
      commitmentCount: ledgerState.commitmentCount,
      verificationCount: ledgerState.verificationCount,
      policyCount: ledgerState.policyCount,
    };
  }
}