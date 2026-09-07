import { useCallback, useEffect, useState } from 'react';
import { useMidnight } from './hooks/useMidnight';
import { useContractState } from './hooks/useContractState';
import { BlackBoxAPI } from './club-api';
import { createProviders } from './providers';
import {
  computeDatasetId,
  computeCommitmentId,
  computeVerificationId,
  computePolicyId,
  licenseTypeName,
  authStatusName,
  LICENSE_TYPES,
  AUTH_STATUS,
  setSimulatedDatasetContentHash,
  setSimulatedLicenseProof,
  setSimulatedTrainingDataHashes,
  setSimulatedDatasetLicenses,
  setSimulatedCurrentTimestamp,
} from './contract';
import WalletConnect from './components/WalletConnect';
import ContractState from './components/ContractState';
import DatasetActions from './components/DatasetActions';
import TrainingActions from './components/TrainingActions';
import PolicyActions from './components/PolicyActions';
import VerificationActions from './components/VerificationActions';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS ?? '';

export default function App() {
  const {
    status: walletStatus,
    wallet,
    address,
    networkId,
    error: walletError,
    connect,
    disconnect,
  } = useMidnight();
  const connected = walletStatus === 'connected' && !!wallet && !!address;

  const [api, setApi] = useState<BlackBoxAPI | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [autoJoinAttempted, setAutoJoinAttempted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastTx, setLastTx] = useState<string | null>(null);

  const { state, refresh } = useContractState(CONTRACT_ADDRESS || null);

  useEffect(() => {
    if (connected && !api && !connecting && !autoJoinAttempted) {
      setAutoJoinAttempted(true);
      void joinContract();
    }
  }, [connected, api, connecting, autoJoinAttempted]);

  // Reset the contract handle whenever the connected identity changes
  useEffect(() => {
    setApi(null);
    setAutoJoinAttempted(false);
    setConnecting(false);
  }, [address]);

  const joinContract = useCallback(async () => {
    if (!wallet || !address) return;
    setConnecting(true);
    setError(null);
    try {
      const providers = await createProviders(wallet);
      const blackboxApi = await BlackBoxAPI.join(providers, CONTRACT_ADDRESS);
      setApi(blackboxApi);
      setLastTx(`Connected to BlackBox AI at ${blackboxApi.contractAddress}`);
    } catch (e: any) {
      setError(`Contract connection failed: ${extract(e)}`);
    } finally {
      setConnecting(false);
    }
  }, [wallet, address]);

  const handleTxComplete = useCallback(() => {
    setLastTx(`Transaction finalized — ledger updated.`);
    setTimeout(() => void refresh(), 2500);
  }, [refresh]);

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <h1 className="title">BlackBox AI</h1>
          <p className="dim small">Privacy-Preserving Training Data Verification — ZK proofs without data exposure.</p>
        </div>
        <div className="header-right">
          <WalletConnect
            status={walletStatus}
            address={address}
            error={walletError}
            connect={connect}
            disconnect={disconnect}
            networkId={networkId}
          />
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
                  Network: {networkId}. Reading the ledger needs no wallet; actions require connection.
                </p>
              </>
            ) : (
              <p className="dim">Set VITE_CONTRACT_ADDRESS to point at a deployed contract.</p>
            )}
          </div>

          <ContractState contractAddress={CONTRACT_ADDRESS || null} />
        </div>

        <div className="col">
          {connected && api ? (
            <>
              <DatasetActions
                api={api}
                address={address}
                busy={busy}
                onBusyChange={setBusy}
                onComplete={handleTxComplete}
                onError={setError}
                setSimulatedDatasetContentHash={setSimulatedDatasetContentHash}
                setSimulatedLicenseProof={setSimulatedLicenseProof}
                setSimulatedCurrentTimestamp={setSimulatedCurrentTimestamp}
                computeDatasetId={computeDatasetId}
                licenseTypeName={licenseTypeName}
                authStatusName={authStatusName}
                LICENSE_TYPES={LICENSE_TYPES}
                AUTH_STATUS={AUTH_STATUS}
              />
              <TrainingActions
                api={api}
                address={address}
                busy={busy}
                onBusyChange={setBusy}
                onComplete={handleTxComplete}
                onError={setError}
                setSimulatedTrainingDataHashes={setSimulatedTrainingDataHashes}
                setSimulatedDatasetLicenses={setSimulatedDatasetLicenses}
                setSimulatedCurrentTimestamp={setSimulatedCurrentTimestamp}
                computeCommitmentId={computeCommitmentId}
              />
              <PolicyActions
                api={api}
                address={address}
                busy={busy}
                onBusyChange={setBusy}
                onComplete={handleTxComplete}
                onError={setError}
                computePolicyId={computePolicyId}
              />
              <VerificationActions
                api={api}
                address={address}
                busy={busy}
                onBusyChange={setBusy}
                onComplete={handleTxComplete}
                onError={setError}
                setSimulatedTrainingDataHashes={setSimulatedTrainingDataHashes}
                setSimulatedDatasetLicenses={setSimulatedDatasetLicenses}
                computeVerificationId={computeVerificationId}
                licenseTypeName={licenseTypeName}
                authStatusName={authStatusName}
              />
            </>
          ) : (
            <section className="card">
              <div className="card-head">
                <h2>Actions</h2>
              </div>
              {walletStatus === 'no-wallet' ? (
                <p className="dim">
                  Install the Midnight Lace wallet to register datasets, commit training runs, create policies, and run ZK verifications.
                </p>
              ) : walletStatus === 'connected' ? (
                <p className="dim">{connecting ? 'Connecting to contract…' : 'Reconnecting…'}</p>
              ) : (
                <p className="dim">Connect your wallet to interact with BlackBox AI.</p>
              )}
              {connected && !api && !connecting && (
                <div className="action-row">
                  <button className="btn-secondary" type="button" onClick={() => void joinContract()}>
                    Retry connection
                  </button>
                </div>
              )}
            </section>
          )}
        </div>
      </main>

      <footer className="footer">
        <span>
          Built on <a href="https://midnight.network" target="_blank" rel="noopener noreferrer">Midnight</a> — public
          ledger & private proofs
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