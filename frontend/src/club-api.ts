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

// Must match the privateStateId used at deploy time so the DApp reconnects to
// the same private state.
const PRIVATE_STATE_ID = `${CONTRACT_NAME}PrivateState`;

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
      datasetId,
      owner,
      contentHash,
      licenseHash,
      licenseType,
      authorizationStatus,
      validFrom,
      validUntil,
      metadataHash
    );
  }

  async updateAuthorization(datasetId: string, newStatus: number, owner: string): Promise<void> {
    await (this.deployedContract as any).callTx.updateAuthorization(datasetId, newStatus, owner);
  }

  async revokeDataset(datasetId: string, owner: string): Promise<void> {
    await (this.deployedContract as any).callTx.revokeDataset(datasetId, owner);
  }

  async getDataset(datasetId: string): Promise<DatasetInfo> {
    const result = await (this.deployedContract as any).callTx.getDataset(datasetId);
    return result.returnValue;
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
    // Pad datasetIds to 32 elements
    const paddedIds = [...datasetIds];
    while (paddedIds.length < 32) paddedIds.push('0x' + '0'.repeat(64));
    
    await (this.deployedContract as any).callTx.commitTraining(
      commitmentId,
      trainer,
      paddedIds,
      datasetCount,
      trainingTimestamp,
      modelHash
    );
  }

  async getCommitment(commitmentId: string): Promise<TrainingCommitment> {
    const result = await (this.deployedContract as any).callTx.getCommitment(commitmentId);
    return result.returnValue;
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
      policyId,
      name,
      minAuthorizedPercentage,
      minLicensedPercentage,
      allowRestricted,
      requireValidLicenses,
      createdBy
    );
  }

  async verifyCompliance(
    verificationId: string,
    commitmentId: string,
    policyId: string,
    verifier: string
  ): Promise<void> {
    await (this.deployedContract as any).callTx.verifyCompliance(
      verificationId,
      commitmentId,
      policyId,
      verifier
    );
  }

  async getVerification(verificationId: string): Promise<VerificationResult> {
    const result = await (this.deployedContract as any).callTx.getVerification(verificationId);
    return result.returnValue;
  }

  async getPolicy(policyId: string): Promise<Policy> {
    const result = await (this.deployedContract as any).callTx.getPolicy(policyId);
    return result.returnValue;
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