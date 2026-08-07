/**
 * Business logic for a deployed membership-club contract, browser edition.
 *
 * Mirrors the Node CLI's flow: find the deployed contract (verifying local
 * verifier keys against the chain) and expose typed circuit calls. Every call
 * goes through a zero-knowledge proof of the member's (private, in-memory)
 * token balance.
 */
import { findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import type { ContractAddress } from '@midnight-ntwrk/midnight-js-protocol/compact-runtime';
import { compiledContract, CONTRACT_NAME, contractModule } from './contract';
import { type MembershipProviders } from './providers';

// Must match the privateStateId used at deploy time so the DApp reconnects to
// the same private state.
const PRIVATE_STATE_ID = `${CONTRACT_NAME}PrivateState`;

export class MembershipClubAPI {
  private constructor(
    public readonly deployedContract: any,
    private readonly providers: MembershipProviders,
  ) {
    this.contractAddress = deployedContract.deployTxData.public.contractAddress;
    providers.privateStateProvider.setContractAddress(this.contractAddress);
  }

  readonly contractAddress: ContractAddress;

  /** Join an existing membership-club contract (member operation). */
  static async join(providers: MembershipProviders, contractAddress: ContractAddress): Promise<MembershipClubAPI> {
    const deployedContract = await findDeployedContract(providers as any, {
      contractAddress,
      compiledContract,
      privateStateId: PRIVATE_STATE_ID,
      initialPrivateState: {},
    });
    return new MembershipClubAPI(deployedContract, providers);
  }

  async register(commitment: string): Promise<void> {
    await (this.deployedContract as any).callTx.register(commitment);
  }

  async upgrade(commitment: string): Promise<void> {
    await (this.deployedContract as any).callTx.upgrade(commitment);
  }

  async claimPerk(commitment: string, perkId: bigint, requiredTier: bigint): Promise<void> {
    await (this.deployedContract as any).callTx.claimPerk(commitment, perkId, requiredTier);
  }

  async leave(commitment: string): Promise<void> {
    await (this.deployedContract as any).callTx.leave(commitment);
  }

  /** Read the public ledger for this contract via the indexer. */
  async getLedgerState(): Promise<ReturnType<typeof contractModule.ledger>> {
    const contractState = await this.providers.publicDataProvider.queryContractState(this.contractAddress);
    if (!contractState) throw new Error('Contract not found on this network');
    return contractModule.ledger(contractState.data);
  }
}
