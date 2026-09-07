import { useState } from 'react';
import { BlackBoxAPI } from '../club-api';

interface Props {
  api: BlackBoxAPI;
  address: string;
  busy: boolean;
  onBusyChange: (b: boolean) => void;
  onComplete: () => void;
  onError: (e: string) => void;
  computePolicyId: (creator: string, policyName: string) => Promise<string>;
}

export default function PolicyActions({
  api,
  address,
  busy,
  onBusyChange,
  onComplete,
  onError,
  computePolicyId,
}: Props) {
  const [tab, setTab] = useState<'create' | 'view'>('create');

  // Create form state
  const [policyName, setPolicyName] = useState('');
  const [minAuth, setMinAuth] = useState(100);
  const [minLicensed, setMinLicensed] = useState(95);
  const [allowRestricted, setAllowRestricted] = useState(false);
  const [requireValid, setRequireValid] = useState(true);

  // View form state
  const [viewPolicyId, setViewPolicyId] = useState('');

  const handleCreate = async () => {
    if (!policyName.trim()) {
      onError('Policy name is required');
      return;
    }
    if (minAuth < 0 || minAuth > 100) {
      onError('Authorized percentage must be 0-100');
      return;
    }
    if (minLicensed < 0 || minLicensed > 100) {
      onError('Licensed percentage must be 0-100');
      return;
    }

    onBusyChange(true);
    try {
      const policyId = await computePolicyId(address, policyName);

      await api.createPolicy(
        policyId,
        policyName,
        BigInt(minAuth),
        BigInt(minLicensed),
        allowRestricted,
        requireValid,
        address
      );
      onComplete();
      setPolicyName('');
      setMinAuth(100);
      setMinLicensed(95);
      setAllowRestricted(false);
      setRequireValid(true);
    } catch (e: any) {
      onError(`Create policy failed: ${extract(e)}`);
    } finally {
      onBusyChange(false);
    }
  };

  const handleView = async () => {
    if (!viewPolicyId.trim()) {
      onError('Policy ID is required');
      return;
    }
    onBusyChange(true);
    try {
      const info = await api.getPolicy(viewPolicyId);
      alert(
        `Policy: ${viewPolicyId}\n` +
        `Name: ${info.name}\n` +
        `Min Authorized: ${info.minAuthorizedPercentage}%\n` +
        `Min Licensed: ${info.minLicensedPercentage}%\n` +
        `Allow Restricted: ${info.allowRestricted ? 'Yes' : 'No'}\n` +
        `Require Valid Licenses: ${info.requireValidLicenses ? 'Yes' : 'No'}\n` +
        `Created: ${new Date(Number(info.createdAt) * 1000).toLocaleString()}\n` +
        `Created By: ${info.createdBy}`
      );
    } catch (e: any) {
      onError(`View failed: ${extract(e)}`);
    } finally {
      onBusyChange(false);
    }
  };

  return (
    <section className="card">
      <div className="card-head">
        <h2>Verifier / Auditor Actions</h2>
      </div>

      <div className="tabs">
        <button className={tab === 'create' ? 'active' : ''} onClick={() => setTab('create')}>Create Policy</button>
        <button className={tab === 'view' ? 'active' : ''} onClick={() => setTab('view')}>View Policy</button>
      </div>

      {tab === 'create' && (
        <form onSubmit={(e) => { e.preventDefault(); void handleCreate(); }} className="form">
          <div className="form-group">
            <label>Policy Name</label>
            <input
              type="text"
              value={policyName}
              onChange={(e) => setPolicyName(e.target.value)}
              placeholder="e.g., Enterprise-AI-Compliance-v1"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Min Authorized % (0-100)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={minAuth}
                onChange={(e) => setMinAuth(Number(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>Min Licensed % (0-100)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={minLicensed}
                onChange={(e) => setMinLicensed(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={allowRestricted}
                onChange={(e) => setAllowRestricted(e.target.checked)}
              />
              Allow restricted datasets
            </label>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={requireValid}
                onChange={(e) => setRequireValid(e.target.checked)}
              />
              Require licenses to be valid at training time
            </label>
          </div>

          <p className="dim small">
            This policy will be used to verify training runs via ZK proofs.
            The verification proves compliance WITHOUT revealing which datasets were used.
          </p>

          <button type="submit" className="btn-primary" disabled={busy || !policyName.trim()}>
            {busy ? 'Creating…' : 'Create Policy'}
          </button>
        </form>
      )}

      {tab === 'view' && (
        <form onSubmit={(e) => { e.preventDefault(); void handleView(); }} className="form">
          <div className="form-group">
            <label>Policy ID</label>
            <input
              type="text"
              value={viewPolicyId}
              onChange={(e) => setViewPolicyId(e.target.value)}
              placeholder="Policy ID (64 hex chars)"
              required
            />
          </div>
          <button type="submit" className="btn-secondary" disabled={busy || !viewPolicyId.trim()}>
            {busy ? 'Loading…' : 'View Policy'}
          </button>
        </form>
      )}
    </section>
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