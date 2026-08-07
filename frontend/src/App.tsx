import { useCallback, useEffect, useState } from 'react';
import { useWallet } from './hooks/useWallet';
import { useClubState } from './hooks/useClubState';
import { MembershipClubAPI } from './club-api';
import { createProviders } from './providers';
import { computeCommitment, tierName } from './contract';
import WalletConnect from './components/WalletConnect';
import ClubState from './components/ClubState';
import MembershipActions from './components/MembershipActions';
import PerkClaims from './components/PerkClaims';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS ?? '';

export default function App() {
  const { status: walletStatus, wallet, address, networkId } = useWallet();
  const connected = walletStatus === 'connected' && !!wallet && !!address;

  const [clubApi, setClubApi] = useState<MembershipClubAPI | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastTx, setLastTx] = useState<string | null>(null);
  const [commitment, setCommitment] = useState<string | null>(null);

  const { state, refresh } = useClubState(CONTRACT_ADDRESS || null);

  useEffect(() => {
    if (address) {
      void computeCommitment(address).then(setCommitment);
    } else {
      setCommitment(null);
    }
  }, [address]);

  const joinContract = useCallback(async () => {
    if (!wallet || !address) return;
    setConnecting(true);
    setError(null);
    try {
      const providers = await createProviders(wallet);
      const api = await MembershipClubAPI.join(providers, CONTRACT_ADDRESS);
      setClubApi(api);
      setLastTx(`Connected to ${api.contractAddress}`);
    } catch (e: any) {
      setError(`Contract connection failed: ${extract(e)}`);
    } finally {
      setConnecting(false);
    }
  }, [wallet, address]);

  useEffect(() => {
    if (connected && !clubApi && !connecting) {
      void joinContract();
    }
  }, [connected, clubApi, connecting, joinContract]);

  // Reset the contract handle whenever the connected identity changes so a
  // disconnect/reconnect (possibly with a different wallet) rejoins cleanly.
  useEffect(() => {
    setClubApi(null);
  }, [address]);

  const handleTxComplete = useCallback(() => {
    setLastTx(`Transaction finalized — ledger updated.`);
    setTimeout(() => void refresh(), 2500);
  }, [refresh]);

  const tiersSummary = state
    ? state.thresholds.map((t, i) => `${tierName(BigInt(i))} ${t.toString()}`).join(' · ')
    : null;

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <h1 className="title">Midnight Membership Club</h1>
          <p className="dim small">Token-gated membership with tiered perks — your balance stays private.</p>
        </div>
        <div className="header-right">
          <WalletConnect />
        </div>
      </header>

      {error && (
        <div className="error-bar">
          <span>{error}</span>
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {lastTx && !error && (
        <div className="success-bar">
          <span>{lastTx}</span>
          <button onClick={() => setLastTx(null)}>✕</button>
        </div>
      )}

      <main className="layout">
        <div className="col">
          <div className="card">
            <div className="card-head">
              <h2>Deployment</h2>
            </div>
            {CONTRACT_ADDRESS ? (
              <>
                <p className="mono addr">{CONTRACT_ADDRESS}</p>
                <p className="dim small">
                  Network: {networkId}. Reading the ledger needs no wallet; joining or claiming does.
                </p>
              </>
            ) : (
              <p className="dim">Set VITE_CONTRACT_ADDRESS to point at a deployed contract.</p>
            )}
          </div>

          {state && (
            <div className="card">
              <div className="card-head">
                <h2>Thresholds</h2>
              </div>
              <p className="mono">{tiersSummary}</p>
            </div>
          )}

          <ClubState contractAddress={CONTRACT_ADDRESS || null} />
        </div>

        <div className="col">
          {connected && clubApi && commitment ? (
            <>
              <MembershipActions
                api={clubApi}
                commitment={commitment}
                busy={busy}
                onBusyChange={setBusy}
                onComplete={handleTxComplete}
                onError={setError}
              />
              <PerkClaims
                api={clubApi}
                commitment={commitment}
                busy={busy}
                onBusyChange={setBusy}
                onComplete={handleTxComplete}
                onError={setError}
              />
            </>
          ) : (
            <section className="card">
              <div className="card-head">
                <h2>Membership actions</h2>
              </div>
              {walletStatus === 'no-wallet' ? (
                <p className="dim">
                  Install the Midnight Lace wallet to join the club, upgrade tiers, and claim perks.
                </p>
              ) : walletStatus === 'connected' ? (
                <p className="dim">{connecting ? 'Connecting to contract…' : 'Reconnecting…'}</p>
              ) : (
                <p className="dim">Connect your wallet to join the club and claim perks.</p>
              )}
            </section>
          )}
        </div>
      </main>

      <footer className="footer">
        <span>
          Built on <a href="https://midnight.network" target="_blank" rel="noopener noreferrer">Midnight</a> — public
          ledger &amp; private proofs
        </span>
      </footer>
    </div>
  );
}

function extract(e: any): string {
  if (!e) return 'unknown error';
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
