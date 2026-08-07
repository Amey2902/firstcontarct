import { useClubState, tierLabel, type ClubState } from '../hooks/useClubState';

export default function ClubState({ contractAddress }: { contractAddress: string | null }) {
  const { state, loading, error, refresh } = useClubState(contractAddress);

  return (
    <section className="card">
      <div className="card-head">
        <h2>Club ledger</h2>
        <div className="card-actions">
          {loading && <span className="chip muted">refreshing…</span>}
          <button className="btn-secondary btn-sm" onClick={() => void refresh()}>
            Refresh
          </button>
        </div>
      </div>

      {error && <div className="error-bar">{error}</div>}

      {!contractAddress ? (
        <p className="dim">No contract configured. Set VITE_CONTRACT_ADDRESS.</p>
      ) : !state ? (
        <p className="dim">{loading ? 'Reading public ledger from indexer…' : 'No club state yet.'}</p>
      ) : (
        <LedgerView state={state} />
      )}
    </section>
  );
}

function LedgerView({ state }: { state: ClubState }) {
  return (
    <div className="ledger">
      <div className="stats">
        <div className="stat">
          <span className="stat-num">{state.memberCount.toString()}</span>
          <span className="stat-label">members</span>
        </div>
        <div className="stat">
          <span className="stat-num">{state.perkClaims.toString()}</span>
          <span className="stat-label">perks claimed</span>
        </div>
      </div>

      <div className="thresholds">
        <h3>Tiers</h3>
        <table>
          <thead>
            <tr>
              <th>Tier</th>
              <th>Min. tokens (public)</th>
            </tr>
          </thead>
          <tbody>
            {state.thresholds.map((threshold, i) => (
              <tr key={i}>
                <td>{tierLabel(BigInt(i))}</td>
                <td>{threshold.toString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="dim small">
          Your balance itself is never public — only the tier your ZK proof vouches for.
        </p>
      </div>

      <div className="members">
        <h3>Members (commitment → tier)</h3>
        {state.members.length === 0 ? (
          <p className="dim">No members yet — be the first to join.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Commitment</th>
                <th>Tier</th>
              </tr>
            </thead>
            <tbody>
              {state.members.map((m) => (
                <tr key={m.commitment}>
                  <td className="mono">{m.commitment.slice(0, 16)}…</td>
                  <td>{tierLabel(m.tier)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <p className="dim small">
          The chain only ever sees this pseudonymous hash and the tier — never who holds which
          balance.
        </p>
      </div>
    </div>
  );
}
