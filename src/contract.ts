/**
 * Shared wiring for the membership-club Compact contract.
 *
 * Loads the compiled contract, attaches the `balanceOf` witness, and exposes
 * helpers shared by the deploy script, the CLI, the headless tests, and the
 * browser dapp.
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { CompiledContract } from '@midnight-ntwrk/midnight-js-protocol/compact-js';

export const CONTRACT_NAME = 'membership-club';

export const TIER_NAMES = ['Bronze', 'Silver', 'Gold', 'Diamond'] as const;

export const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const zkConfigPath = path.resolve(__dirname, '..', 'contracts', 'managed', CONTRACT_NAME);
export const contractPath = path.join(zkConfigPath, 'contract', 'index.js');

// The membership-club contract keeps an EMPTY private state. Every circuit
// reads the member's token balance through the `balanceOf` witness instead,
// and no circuit ever writes a value back into private state.
export type MembershipPrivateState = Record<string, never>;

// In-memory slot holding the token balance the member wants to *prove* for the
// current transaction. The CLI / dapp set it right before building a circuit
// call. It lives only in the calling process, is never serialized, never sent
// to the network, and is gone the moment the process ends.
let simulatedBalance = 0n;

export function setSimulatedBalance(value: bigint): void {
  simulatedBalance = value;
}

// The `balanceOf` witness is the only place the token balance exists in the
// contract. Circuits read it and assert constraints on it; the zero-knowledge
// proof vouches for those assertions on-chain without revealing the number.
export const balanceOfWitness = ({ privateState }: { privateState: MembershipPrivateState }) =>
  [privateState, simulatedBalance] as const;

export async function loadContractModule() {
  if (!fs.existsSync(contractPath)) {
    throw new Error('Contract not compiled. Run: npm run compile');
  }
  return import(pathToFileURL(contractPath).href);
}

// The contract is loaded dynamically from compiled JS output, so its static
// type is only available as `any`. The typed, strongly-wired equivalent lives
// in the browser dapp, where the compiled contract's index.d.ts is imported.
export async function loadCompiledContract(): Promise<any> {
  const { Contract } = await loadContractModule();
  // Curried compact combinators are typed with conditional types that collapse
  // to `never` when `C` is `any`, so we bind them through an `any` lens here.
  const make = CompiledContract.make as any;
  const withWitnesses = CompiledContract.withWitnesses as any;
  const withCompiledFileAssets = CompiledContract.withCompiledFileAssets as any;
  return make(CONTRACT_NAME, Contract).pipe(
    withWitnesses({ balanceOf: balanceOfWitness }),
    withCompiledFileAssets(zkConfigPath),
  );
}

/**
 * Compute the pseudonymous on-chain identity of a member.
 *
 * A commitment is a one-way hash of the member's owner key. The chain only
 * ever sees the hash and the tier it maps to — never the owner key, and never
 * the token balance. Because the balance is not part of the preimage, the
 * on-chain commitment carries zero information about how many tokens a member
 * holds; only the ZK proof at transaction time vouches for the balance.
 */
export function computeCommitment(ownerKey: string): string {
  return createHash('sha256').update(ownerKey).digest('hex');
}

export function tierName(tier: bigint): string {
  return TIER_NAMES[Number(tier)] ?? `Tier ${tier}`;
}

export function tierIndex(name: string): number {
  return TIER_NAMES.findIndex((t) => t.toLowerCase() === name.toLowerCase());
}
