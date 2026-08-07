/**
 * Browser wiring for the membership-club Compact contract.
 *
 * Imports the compiled contract directly (Vite bundles it), attaches the
 * `balanceOf` witness, and exposes helpers shared by the UI. This module is
 * browser-safe: no Node built-ins (fs/path/ws) are pulled in.
 */
import { CompiledContract } from '@midnight-ntwrk/midnight-js-protocol/compact-js';
import * as MembershipClub from '../../contracts/managed/membership-club/contract/index.js';

export const CONTRACT_NAME = 'membership-club';

export const TIER_NAMES = ['Bronze', 'Silver', 'Gold', 'Diamond'] as const;

export const PERKS = [
  { perkId: 0n, name: 'Community Badge', requiredTier: 0n },
  { perkId: 1n, name: 'VIP Lounge Access', requiredTier: 1n },
  { perkId: 2n, name: 'Exclusive Airdrops', requiredTier: 2n },
  { perkId: 3n, name: 'Personal Concierge', requiredTier: 3n },
] as const;

// The membership-club contract keeps an EMPTY private state. Every circuit
// reads the member's token balance through the `balanceOf` witness instead,
// and no circuit ever writes a value back into private state.
export type MembershipPrivateState = Record<string, never>;

// In-memory slot holding the token balance the member wants to *prove* for the
// current transaction. Set right before building a circuit call. It lives only
// in the browser tab, is never serialized, never sent to the network, and is
// gone the moment the page is closed.
let simulatedBalance = 0n;

export function setSimulatedBalance(value: bigint): void {
  simulatedBalance = value;
}

// The `balanceOf` witness is the only place the token balance exists in the
// contract. Circuits read it and assert constraints on it; the zero-knowledge
// proof vouches for those assertions on-chain without revealing the number.
export const balanceOfWitness = ({ privateState }: { privateState: MembershipPrivateState }) =>
  [privateState, simulatedBalance] as const;

// The compiled contract's static types are strong (see index.d.ts), but the
// CompiledContract combinators are typed with conditional types that collapse
// to `never` when the contract is consumed through the Effect pipeline, so we
// bind them through an `any` lens — exactly like the Node-side loader does.
const make = CompiledContract.make as any;
const withWitnesses = CompiledContract.withWitnesses as any;

export const compiledContract = make(CONTRACT_NAME, MembershipClub.Contract).pipe(
  withWitnesses({ balanceOf: balanceOfWitness }),
);

export const contractModule = MembershipClub;

/**
 * Compute the pseudonymous on-chain identity of a member.
 *
 * A commitment is a one-way hash of the member's owner key. The chain only
 * ever sees the hash and the tier it maps to — never the owner key, and never
 * the token balance.
 */
export async function computeCommitment(ownerKey: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ownerKey));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function tierName(tier: bigint): string {
  return TIER_NAMES[Number(tier)] ?? `Tier ${tier}`;
}

export function tierIndex(name: string): number {
  return TIER_NAMES.findIndex((t) => t.toLowerCase() === name.toLowerCase());
}
