import { useContractState } from '../hooks/useContractState';

interface Props {
  contractAddress: string | null;
}

export default function ContractState({ contractAddress }: Props) {
  const { state, loading, error, refresh } = useContractState(contractAddress);

  if (!contractAddress) return null;

  return (
    <div className="card">
      <div className="card-head">
        <h2>Contract State</h2>
        <button className="btn-ghost" onClick={() => void refresh()} disabled={loading}>
          {loading ? '⟳' : '↻ Refresh'}
        </button>
      </div>

      {error && <p className="error">Error: {error}</p>}

      {state ? (
        <div className="state-grid">
          <div className="state-item">
            <span className="state-label">Datasets Registered</span>
            <span className="state-value mono">{state.datasetCount.toString()}</span>
          </div>
          <div className="state-item">
            <span className="state-label">Training Commitments</span>
            <span className="state-value mono">{state.commitmentCount.toString()}</span>
          </div>
          <div className="state-item">
            <span className="state-label">Verifications Run</span>
            <span className="state-value mono">{state.verificationCount.toString()}</span>
          </div>
          <div className="state-item">
            <span className="state-label">Policies Created</span>
            <span className="state-value mono">{state.policyCount.toString()}</span>
          </div>
        </div>
      ) : (
        <p className="dim">{loading ? 'Loading…' : 'No state available'}</p>
      )}
    </div>
  );
}