import { useState } from 'react';
import { type MembershipClubAPI } from '../club-api';
import { PERKS, setSimulatedBalance, tierName } from '../contract';

export default function PerkClaims({
  api,
  commitment,
  busy,
  onBusyChange,
  onComplete,
  onError,
}: {
  api: MembershipClubAPI;
  commitment: string;
  busy: boolean;
  onBusyChange: (busy: boolean) => void;
  onComplete: () => void;
  onError: (message: string) => void;
}) {
  const [balance, setBalance] = useState('3');
  const [claiming, setClaiming] = useState<bigint | null>(null);

  const handleClaim = async (perkId: bigint, requiredTier: bigint) => {
    setSimulatedBalance(BigInt(balance.trim() || '0'));
    setClaiming(perkId);
    onBusyChange(true);
    onError('');
    try {
      await api.claimPerk(commitment, perkId, requiredTier);
      onComplete();
    } catch (err: any) {
      onError(`Claim failed: ${friendly(err)}`);
    } finally {
      setClaiming(null);
      onBusyChange(false);
    }
  };

  return (
    <section className="card">
      <div className="card-head">
        <h2>Perks</h2>
      </div>

      <div className="field inline">
        <label htmlFor="perk-balance">Token balance to prove for each claim</label>
        <input
          id="perk-balance"
          type="number"
          min="0"
          step="1"
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
        />
      </div>

      <div className="perk-list">
        {PERKS.map((perk) => (
          <div className="perk" key={perk.perkId.toString()}>
            <div className="perk-info">
              <span className="perk-name">{perk.name}</span>
              <span className="chip muted">requires {tierName(perk.requiredTier)}</span>
            </div>
            <button
              className="btn-secondary btn-sm"
              type="button"
              disabled={busy}
              onClick={() => void handleClaim(perk.perkId, perk.requiredTier)}
            >
              {claiming === perk.perkId ? 'Claiming…' : 'Claim'}
            </button>
          </div>
        ))}
      </div>
      <p className="dim small">
        <span className="privacy-label">Proved without revealing your input.</span> The contract
        records only <em>that</em> a perk was claimed — never which balance proved the right to
        claim it.
      </p>
    </section>
  );
}

function friendly(err: any): string {
  const msg = extract(err);
  if (msg.includes('tier too low')) return 'your tier is too low for this perk.';
  if (msg.includes('not a member')) return 'you must be a member first.';
  if (msg.includes('User rejected')) return 'transaction cancelled by the wallet.';
  return msg || 'unknown error';
}

function extract(e: any): string {
  if (!e) return '';
  if (e.message && e.message !== '') return e.message;
  const failure = e?.cause?.failure;
  if (failure?.message) return failure.message;
  if (e?.cause?.message) return e.cause.message;
  try {
    return JSON.stringify(e);
  } catch {
    return String(e);
  }
}
