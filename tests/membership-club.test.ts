/**
 * Headless circuit tests for the membership-club contract.
 *
 * These tests run the compiled contract logic directly against an in-memory
 * ledger using the compact-runtime circuit harness — no network, no wallet,
 * no proving. They verify both the business rules (tiers, upgrades, perks,
 * resignations) and the privacy story (the token balance is only ever a
 * witness and never appears in the public ledger).
 */
import { describe, it, expect, beforeEach } from 'vitest';
import {
  createCircuitContext,
  emptyZswapLocalState,
  sampleContractAddress,
  ContractState,
} from '@midnight-ntwrk/compact-runtime';
import { Contract, ledger } from '../contracts/managed/membership-club/contract/index.js';
import { balanceOfWitness, computeCommitment, setSimulatedBalance } from '../src/contract';

const contractAddress = sampleContractAddress();
const memberA = computeCommitment('member-a-owner-key');
const memberB = computeCommitment('member-b-owner-key');

// EncodedCoinPublicKey built directly so tests never depend on valid bech32m.
const zswapState = emptyZswapLocalState({ bytes: new Uint8Array(32) });

function makeContract(): any {
  return new Contract({ balanceOf: balanceOfWitness });
}

function freshState(): any {
  const contract = makeContract();
  const result = contract.initialState({
    initialPrivateState: {},
    initialZswapLocalState: zswapState,
  });
  return {
    contract,
    initial: result.currentContractState,
    context: createCircuitContext(contractAddress, zswapState, result.currentContractState.data, {}),
  };
}

// Registers `member` with the given balance and returns the next context.
function register(member: string, balance: bigint, state: any) {
  setSimulatedBalance(balance);
  const result = state.contract.circuits.register(state.context, member);
  state.context = result.context;
  return state.context;
}

function upgrade(member: string, balance: bigint, state: any) {
  setSimulatedBalance(balance);
  const result = state.contract.circuits.upgrade(state.context, member);
  state.context = result.context;
  return state.context;
}

function claimPerk(member: string, perkId: bigint, requiredTier: bigint, balance: bigint, state: any) {
  setSimulatedBalance(balance);
  const result = state.contract.circuits.claimPerk(state.context, member, perkId, requiredTier);
  state.context = result.context;
  return state.context;
}

function leave(member: string, state: any) {
  const result = state.contract.circuits.leave(state.context, member);
  state.context = result.context;
  return state.context;
}

function ledgerOf(state: any) {
  return ledger(state.context.currentQueryContext.state);
}

function serializePublicState(state: any): Uint8Array {
  const contractState = new ContractState();
  contractState.data = state.context.currentQueryContext.state;
  return contractState.serialize();
}

function toBigEndian8(value: bigint): Uint8Array {
  const out = new Uint8Array(8);
  let v = value;
  for (let i = 7; i >= 0; i--) {
    out[i] = Number(v & 0xffn);
    v >>= 8n;
  }
  return out;
}

function includesBytes(haystack: Uint8Array, needle: Uint8Array): boolean {
  outer: for (let i = 0; i + needle.length <= haystack.length; i++) {
    for (let j = 0; j < needle.length; j++) {
      if (haystack[i + j] !== needle[j]) continue outer;
    }
    return true;
  }
  return false;
}

describe('membership-club contract', () => {
  let state: any;

  beforeEach(() => {
    setSimulatedBalance(0n);
    state = freshState();
  });

  it('initializes public thresholds and an empty registry', () => {
    const ledgerState = ledgerOf(state);
    expect(ledgerState.thresholds).toEqual([1n, 3n, 10n, 25n]);
    expect(ledgerState.memberCount).toBe(0n);
    expect(ledgerState.perkClaims).toBe(0n);
    expect(ledgerState.members.size()).toBe(0n);
  });

  it('registers a member who proves a sufficient balance (balance → tier)', () => {
    register(memberA, 5n, state);
    const ledgerState = ledgerOf(state);
    expect(ledgerState.members.member(memberA)).toBe(true);
    expect(ledgerState.members.lookup(memberA)).toBe(1n); // Silver
    expect(ledgerState.memberCount).toBe(1n);
  });

  it('rejects registration when the proved balance unlocks no tier', () => {
    expect(() => register(memberA, 0n, state)).toThrow('must hold at least one token to join');
    expect(ledgerOf(state).members.size()).toBe(0n);
  });

  it('rejects a duplicate registration of the same commitment', () => {
    register(memberA, 3n, state);
    expect(() => register(memberA, 10n, state)).toThrow('already a member');
    expect(ledgerOf(state).memberCount).toBe(1n);
  });

  it('upgrades a member when the proved balance unlocks a higher tier', () => {
    register(memberA, 1n, state); // Bronze
    upgrade(memberA, 25n, state); // Diamond
    const ledgerState = ledgerOf(state);
    expect(ledgerState.members.lookup(memberA)).toBe(3n);
    expect(ledgerState.memberCount).toBe(1n);
  });

  it('rejects an upgrade that is not an upgrade', () => {
    register(memberA, 5n, state); // Silver
    expect(() => upgrade(memberA, 4n, state)).toThrow('not an upgrade');
    expect(ledgerOf(state).members.lookup(memberA)).toBe(1n);
  });

  it('allows claiming a perk when the proved tier meets the requirement', () => {
    register(memberA, 10n, state); // Gold
    claimPerk(memberA, 0n, 2n, 10n, state); // requires Gold
    expect(ledgerOf(state).perkClaims).toBe(1n);
  });

  it('rejects claiming a perk when the proved tier is too low', () => {
    register(memberA, 5n, state); // Silver
    expect(() => claimPerk(memberA, 0n, 2n, 5n, state)).toThrow('tier too low for this perk');
    expect(ledgerOf(state).perkClaims).toBe(0n);
  });

  it('removes a member on resignation', () => {
    register(memberA, 5n, state);
    leave(memberA, state);
    const ledgerState = ledgerOf(state);
    expect(ledgerState.members.member(memberA)).toBe(false);
    expect(ledgerState.memberCount).toBe(0n);
  });

  it('never exposes the balance: different balances with the same tier are indistinguishable on-chain', () => {
    register(memberA, 4n, state); // Silver
    register(memberB, 9n, state); // Silver

    const ledgerState = ledgerOf(state);

    // On-chain, both members reduce to the SAME tier value. The chain cannot
    // distinguish a 4-token holder from a 9-token holder.
    expect(ledgerState.members.lookup(memberA)).toBe(1n);
    expect(ledgerState.members.lookup(memberB)).toBe(1n);

    // The balances 4 and 9 do not appear anywhere in the serialized public
    // state — not as raw cells, not inside the members map, nowhere.
    const serialized = serializePublicState(state);
    const balanceA = toBigEndian8(4n);
    const balanceB = toBigEndian8(9n);
    expect(includesBytes(serialized, balanceA)).toBe(false);
    expect(includesBytes(serialized, balanceB)).toBe(false);

    // The only data that left the circuits is the deliberately disclosed tier
    // plus the fixed public thresholds. Thresholds are untouched.
    expect(ledgerState.thresholds).toEqual([1n, 3n, 10n, 25n]);
  });
});
