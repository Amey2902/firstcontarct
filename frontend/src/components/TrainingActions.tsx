import { useState } from 'react';
import { BlackBoxAPI } from '../club-api';

interface Props {
  api: BlackBoxAPI;
  address: string;
  busy: boolean;
  onBusyChange: (b: boolean) => void;
  onComplete: () => void;
  onError: (e: string) => void;
  setSimulatedTrainingDataHashes: (v: string[]) => void;
  setSimulatedDatasetLicenses: (v: string[]) => void;
  setSimulatedCurrentTimestamp: (v: bigint) => void;
  computeCommitmentId: (trainer: string, modelName: string) => Promise<string>;
}

export default function TrainingActions({
  api,
  address,
  busy,
  onBusyChange,
  onComplete,
  onError,
  setSimulatedTrainingDataHashes,
  setSimulatedDatasetLicenses,
  setSimulatedCurrentTimestamp,
  computeCommitmentId,
}: Props) {
  const [tab, setTab] = useState<'commit' | 'view'>('commit');

  // Commit form state
  const [modelName, setModelName] = useState('');
  const [datasetIds, setDatasetIds] = useState<string[]>(['']);
  const [trainingTimestamp, setTrainingTimestamp] = useState('');
  const [modelHash, setModelHash] = useState('');

  // View form state
  const [viewCommitmentId, setViewCommitmentId] = useState('');

  const handleCommit = async () => {
    if (!modelName.trim()) {
      onError('Model name is required');
      return;
    }
    const validIds = datasetIds.filter((id) => id.trim());
    if (validIds.length === 0) {
      onError('At least one dataset ID is required');
      return;
    }
    if (validIds.length > 32) {
      onError('Maximum 32 datasets allowed');
      return;
    }

    onBusyChange(true);
    try {
      const commitmentId = await computeCommitmentId(address, modelName);
      const now = BigInt(Math.floor(Date.now() / 1000));
      const timestamp = trainingTimestamp ? BigInt(trainingTimestamp) : now;
      const mHash = modelHash || `0x${(await computeCommitmentId(address, modelName + '-model')).slice(0, 64)}`;

      // Simulate private knowledge of dataset hashes and licenses
      const dataHashes = await Promise.all(validIds.map(async (id) => `0x${(await computeCommitmentId(address, id + '-content')).slice(0, 64)}`));
      const licenseHashes = await Promise.all(validIds.map(async (id) => `0x${(await computeCommitmentId(address, id + '-license')).slice(0, 64)}`));

      // Pad to 32
      while (dataHashes.length < 32) dataHashes.push('0x' + '0'.repeat(64));
      while (licenseHashes.length < 32) licenseHashes.push('0x' + '0'.repeat(64));

      setSimulatedTrainingDataHashes(dataHashes);
      setSimulatedDatasetLicenses(licenseHashes);
      setSimulatedCurrentTimestamp(timestamp);

      const paddedIds = [...validIds];
      while (paddedIds.length < 32) paddedIds.push('0x' + '0'.repeat(64));

      await api.commitTraining(
        commitmentId,
        address,
        paddedIds,
        BigInt(validIds.length),
        timestamp,
        mHash
      );
      onComplete();
      setModelName('');
      setDatasetIds(['']);
      setTrainingTimestamp('');
      setModelHash('');
    } catch (e: any) {
      onError(`Commit failed: ${extract(e)}`);
    } finally {
      onBusyChange(false);
    }
  };

  const handleView = async () => {
    if (!viewCommitmentId.trim()) {
      onError('Commitment ID is required');
      return;
    }
    onBusyChange(true);
    try {
      const info = await api.getCommitment(viewCommitmentId);
      alert(
        `Commitment: ${viewCommitmentId}\n` +
        `Trainer: ${info.trainer}\n` +
        `Datasets Used: ${info.datasetCount}\n` +
        `Dataset IDs: ${info.datasetIds.slice(0, Number(info.datasetCount)).join(', ')}\n` +
        `Training Time: ${new Date(Number(info.trainingTimestamp) * 1000).toLocaleString()}\n` +
        `Model Hash: ${info.modelHash}\n` +
        `Committed: ${new Date(Number(info.committedAt) * 1000).toLocaleString()}`
      );
    } catch (e: any) {
      onError(`View failed: ${extract(e)}`);
    } finally {
      onBusyChange(false);
    }
  };

  const addDatasetId = () => {
    if (datasetIds.length < 32) {
      setDatasetIds([...datasetIds, '']);
    }
  };

  const removeDatasetId = (index: number) => {
    if (datasetIds.length > 1) {
      setDatasetIds(datasetIds.filter((_, i) => i !== index));
    }
  };

  return (
    <section className="card">
      <div className="card-head">
        <h2>AI Company Actions</h2>
      </div>

      <div className="tabs">
        <button className={tab === 'commit' ? 'active' : ''} onClick={() => setTab('commit')}>Commit Training</button>
        <button className={tab === 'view' ? 'active' : ''} onClick={() => setTab('view')}>View Commitment</button>
      </div>

      {tab === 'commit' && (
        <form onSubmit={(e) => { e.preventDefault(); void handleCommit(); }} className="form">
          <div className="form-group">
            <label>Model Name / Identifier</label>
            <input
              type="text"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder="e.g., GPT-4-FineTuned-v1"
              required
            />
          </div>

          <div className="form-group">
            <label>Datasets Used (up to 32)</label>
            {datasetIds.map((id, index) => (
              <div key={index} className="form-row" style={{ alignItems: 'center' }}>
                <input
                  type="text"
                  value={id}
                  onChange={(e) => setDatasetIds(datasetIds.map((d, i) => i === index ? e.target.value : d))}
                  placeholder={`Dataset ${index + 1} ID`}
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => removeDatasetId(index)}
                  disabled={datasetIds.length <= 1}
                  style={{ padding: '0.25rem 0.5rem' }}
                >
                  ✕
                </button>
              </div>
            ))}
            <button type="button" className="btn-ghost" onClick={addDatasetId} disabled={datasetIds.length >= 32}>
              + Add Dataset
            </button>
            <p className="dim small">{datasetIds.filter(Boolean).length}/32 datasets</p>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Training Timestamp (Unix)</label>
              <input
                type="number"
                value={trainingTimestamp}
                onChange={(e) => setTrainingTimestamp(e.target.value)}
                placeholder="Leave empty for now"
              />
            </div>
            <div className="form-group">
              <label>Model Hash (optional)</label>
              <input
                type="text"
                value={modelHash}
                onChange={(e) => setModelHash(e.target.value)}
                placeholder="Auto-generated if empty"
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={busy || !modelName.trim() || datasetIds.filter(Boolean).length === 0}>
            {busy ? 'Committing…' : 'Commit Training Run'}
          </button>
        </form>
      )}

      {tab === 'view' && (
        <form onSubmit={(e) => { e.preventDefault(); void handleView(); }} className="form">
          <div className="form-group">
            <label>Commitment ID</label>
            <input
              type="text"
              value={viewCommitmentId}
              onChange={(e) => setViewCommitmentId(e.target.value)}
              placeholder="Commitment ID (64 hex chars)"
              required
            />
          </div>
          <button type="submit" className="btn-secondary" disabled={busy || !viewCommitmentId.trim()}>
            {busy ? 'Loading…' : 'View Commitment'}
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