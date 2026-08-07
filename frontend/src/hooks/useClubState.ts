import { useCallback, useEffect, useState } from 'react';
import { ContractState } from '@midnight-ntwrk/midnight-js-protocol/compact-runtime';
import { contractModule, tierName } from '../contract';

const INDEXER_URL = import.meta.env.VITE_INDEXER_URL ?? 'https://indexer.preview.midnight.network/api/v4/graphql';

const CONTRACT_STATE_QUERY = `
  query ContractState($address: HexEncoded!) {
    contractAction(address: $address) {
      state
    }
  }
`;

export interface MemberEntry {
  commitment: string;
  tier: bigint;
}

export interface ClubState {
  thresholds: bigint[];
  members: MemberEntry[];
  memberCount: bigint;
  perkClaims: bigint;
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}

/**
 * Reads the club's public ledger state straight from the indexer via a simple
 * fetch — no wallet or proof server required.
 */
export function useClubState(contractAddress: string | null, refreshInterval = 15_000) {
  const [state, setState] = useState<ClubState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchState = useCallback(async () => {
    if (!contractAddress || !/^[0-9a-fA-F]{64}$/.test(contractAddress)) return;
    try {
      setLoading(true);
      const res = await fetch(INDEXER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: CONTRACT_STATE_QUERY, variables: { address: contractAddress } }),
      });
      const gql = await res.json();
      if (gql.errors) throw new Error(gql.errors[0]?.message ?? 'Indexer query failed');

      const stateHex = gql.data?.contractAction?.state;
      if (!stateHex) throw new Error('Contract not found on this network');

      const contractState = ContractState.deserialize(hexToBytes(stateHex));
      const ledgerState = contractModule.ledger(contractState.data);

      const members: MemberEntry[] = [];
      for (const [commitment, tier] of ledgerState.members) {
        members.push({ commitment, tier });
      }

      setState({
        thresholds: Array.from(ledgerState.thresholds),
        members,
        memberCount: ledgerState.memberCount,
        perkClaims: ledgerState.perkClaims,
      });
      setError(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [contractAddress]);

  useEffect(() => {
    void fetchState();
  }, [fetchState]);

  useEffect(() => {
    if (!contractAddress) return;
    const interval = setInterval(fetchState, refreshInterval);
    return () => clearInterval(interval);
  }, [contractAddress, refreshInterval, fetchState]);

  return { state, loading, error, refresh: fetchState };
}

export function tierLabel(tier: bigint): string {
  return tierName(tier);
}
