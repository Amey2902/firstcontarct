import { useState, type FormEvent } from 'react';
import { type MembershipClubAPI } from '../club-api';
import { setSimulatedBalance, tierName } from '../contract';

export default function MembershipActions({
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
  const [registerBalance, setRegisterBalance] = useState('1');
  const [upgradeBalance, setUpgradeBalance] = useState('3');
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [lastTier, setLastTier] = useState<bigint | null>(null);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    const balance = BigInt(registerBalance.trim() || '0');
    setSimulatedBalance(balance);
    onBusyChange(true);
    onError('');
    try {
      await api.register(commitment);
      void tierFromBalance(api, balance).then(setLastTier);
      onComplete();
    } catch (err: any) {
      onError(`Join failed: ${friendly(err)}`);
    } finally {
      onBusyChange(false);
    }
  };

  const handleUpgrade = async (e: FormEvent) => {
    e.preventDefault();
    const balance = BigInt(upgradeBalance.trim() || '0');
    setSimulatedBalance(balance);
    onBusyChange(true);
    onError('');
    try {
      await api.upgrade(commitment);
      void tierFromBalance(api, balance).then(setLastTier);
      onComplete();
    } catch (err: any) {
      onError(`Upgrade failed: ${friendly(err)}`);
    } finally {
      onBusyChange(false);
    }
  };

  const handleLeave = async () => {
    if (!confirmLeave) {
      setConfirmLeave(true);
      return;
    }
    setSimulatedBalance(0n);
    onBusyChange(true);
    onError('');
    try {
      await api.leave(commitment);
      setLastTier(null);
      onComplete();
      setConfirmLeave(false);
    } catch (err: any) {
      onError(`Leave failed: ${friendly(err)}`);
    } finally {
      onBusyChange(false);
    }
  };

  return (
    <section className="card">
      <div className="card-head">
        <h2>Membership</h2>
        {lastTier !== null && <span className="chip ok">current tier: {tierName(lastTier)}</span>}
      </div>

      <form className="action-row" onSubmit={handleRegister}>
        <div className="field">
          <label htmlFor="register-balance">Token balance you want to prove</label>
          <input
            id="register-balance"
            type="number"
            min="1"
            step="1"
            value={registerBalance}
            onChange={(e) => setRegisterBalance(e.target.value)}
          />
        </div>
        <button className="btn-primary" type="submit" disabled={busy}>
          {busy ? 'Proving & submitting…' : 'Join the club'}
        </button>
      </form>
      <p className="dim small">
        <span className="privacy-label">Proved without revealing your input.</span> Your balance is
        read inside the circuit and proven to the chain with a ZK proof — the number never leaves
        this page.
      </p>

      <form className="action-row" onSubmit={handleUpgrade}>
        <div className="field">
          <label htmlFor="upgrade-balance">New (higher) balance to prove</label>
          <input
            id="upgrade-balance"
            type="number"
            min="1"
            step="1"
            value={upgradeBalance}
            onChange={(e) => setUpgradeBalance(e.target.value)}
          />
        </div>
        <button className="btn-secondary" type="submit" disabled={busy}>
          {busy ? 'Proving & submitting…' : 'Upgrade tier'}
        </button>
      </form>
      <p className="dim small">
        <span className="privacy-label">Proved without revealing your input.</span> The chain learns
        only your commitment's new tier — never the balance that unlocked it.
      </p>

      <div className="action-row">
        <div className="field">
          <label>Leave the club</label>
          <span className="dim small">
            <span className="privacy-label">Proved without revealing your input.</span> Removes your
            commitment from the public registry.
          </span>
        </div>
        <button className="btn-danger" type="button" disabled={busy} onClick={() => void handleLeave()}>
          {confirmLeave ? 'Click again to confirm' : 'Resign'}
        </button>
      </div>
    </section>
  );
}

async function tierFromBalance(api: MembershipClubAPI, balance: bigint): Promise<bigint> {
  try {
    const ledger = await api.getLedgerState?.();
    return tierIndexFor(balance, ledger?.thresholds ?? [1n, 3n, 10n, 25n]);
  } catch {
    return tierIndexFor(balance, [1n, 3n, 10n, 25n]);
  }
}

function tierIndexFor(balance: bigint, thresholds: bigint[]): bigint {
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (balance >= thresholds[i]) return BigInt(i);
  }
  return 0n;
}

function friendly(err: any): string {
  const msg = extract(err);
  if (msg.includes('already a member')) return 'your commitment is already registered.';
  if (msg.includes('not a member')) return 'your commitment is not registered.';
  if (msg.includes('not an upgrade')) return 'the new balance must unlock a higher tier.';
  if (msg.includes('must hold at least one token')) return 'you need at least 1 token to join.';
  if (msg.includes('tier too low')) return 'your tier is too low for this perk.';
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
