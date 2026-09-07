import { useState } from 'react';
import { BlackBoxAPI } from '../club-api';

interface Props {
  api: BlackBoxAPI;
  address: string;
  busy: boolean;
  onBusyChange: (b: boolean) => void;
  onComplete: () => void;
  onError: (e: string) => void;
  setSimulatedDatasetContentHash: (v: string) => void;
  setSimulatedLicenseProof: (v: string) => void;
  setSimulatedCurrentTimestamp: (v: bigint) => void;
  computeDatasetId: (owner: string, name: string) => Promise<string>;
  licenseTypeName: (type: number) => string;
  authStatusName: (status: number) => string;
  LICENSE_TYPES: typeof import('../contract').LICENSE_TYPES;
  AUTH_STATUS: typeof import('../contract').AUTH_STATUS;
}

const LICENSE_OPTIONS = [
  { value: 0, label: 'Commercial License' },
  { value: 1, label: 'Open Source (MIT/Apache/BSD)' },
  { value: 2, label: 'Proprietary/Internal' },
  { value: 3, label: 'Restricted/No AI Training' },
];

const AUTH_OPTIONS = [
  { value: 0, label: 'Pending Review' },
  { value: 1, label: 'Authorized for AI Training' },
  { value: 2, label: 'Revoked' },
  { value: 3, label: 'Expired' },
];

export default function DatasetActions({
  api,
  address,
  busy,
  onBusyChange,
  onComplete,
  onError,
  setSimulatedDatasetContentHash,
  setSimulatedLicenseProof,
  setSimulatedCurrentTimestamp,
  computeDatasetId,
  licenseTypeName,
  authStatusName,
  LICENSE_TYPES,
  AUTH_STATUS,
}: Props) {
  const [tab, setTab] = useState<'register' | 'update' | 'revoke' | 'view'>('register');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regLicenseType, setRegLicenseType] = useState<number>(LICENSE_TYPES.COMMERCIAL);
  const [regAuthStatus, setRegAuthStatus] = useState<number>(AUTH_STATUS.AUTHORIZED);
  const [regValidFrom, setRegValidFrom] = useState('');
  const [regValidUntil, setRegValidUntil] = useState('');
  const [regMetadataHash, setRegMetadataHash] = useState('');

  // Update/Revoke/View form state
  const [datasetId, setDatasetId] = useState('');
  const [newAuthStatus, setNewAuthStatus] = useState<number>(AUTH_STATUS.AUTHORIZED);

  const handleRegister = async () => {
    if (!regName.trim()) {
      onError('Dataset name is required');
      return;
    }
    onBusyChange(true);
    try {
      const datasetId = await computeDatasetId(address, regName);
      const contentHash = `0x${(await computeDatasetId(address, regName + '-content')).slice(0, 64)}`;
      const licenseHash = `0x${(await computeDatasetId(address, regName + '-license')).slice(0, 64)}`;
      const licenseProof = `0x${(await computeDatasetId(address, regName + '-proof')).slice(0, 64)}`;

      setSimulatedDatasetContentHash(contentHash);
      setSimulatedLicenseProof(licenseProof);
      setSimulatedCurrentTimestamp(BigInt(Math.floor(Date.now() / 1000)));

      const now = BigInt(Math.floor(Date.now() / 1000));
      const validFrom = regValidFrom ? BigInt(regValidFrom) : now;
      const validUntil = regValidUntil ? BigInt(regValidUntil) : now + 365n * 24n * 60n * 60n * 10n;

      await api.registerDataset(
        datasetId,
        address,
        contentHash,
        licenseHash,
        regLicenseType,
        regAuthStatus,
        validFrom,
        validUntil,
        regMetadataHash || 'QmDefaultMetadata'
      );
      onComplete();
      setRegName('');
      setRegMetadataHash('');
    } catch (e: any) {
      onError(`Register failed: ${extract(e)}`);
    } finally {
      onBusyChange(false);
    }
  };

  const handleUpdate = async () => {
    if (!datasetId.trim()) {
      onError('Dataset ID is required');
      return;
    }
    onBusyChange(true);
    try {
      await api.updateAuthorization(datasetId, newAuthStatus, address);
      onComplete();
    } catch (e: any) {
      onError(`Update failed: ${extract(e)}`);
    } finally {
      onBusyChange(false);
    }
  };

  const handleRevoke = async () => {
    if (!datasetId.trim()) {
      onError('Dataset ID is required');
      return;
    }
    if (!window.confirm('Are you sure you want to revoke this dataset?')) return;
    onBusyChange(true);
    try {
      await api.revokeDataset(datasetId, address);
      onComplete();
    } catch (e: any) {
      onError(`Revoke failed: ${extract(e)}`);
    } finally {
      onBusyChange(false);
    }
  };

  const handleView = async () => {
    if (!datasetId.trim()) {
      onError('Dataset ID is required');
      return;
    }
    onBusyChange(true);
    try {
      const info = await api.getDataset(datasetId);
      alert(
        `Dataset: ${datasetId}\n` +
        `Owner: ${info.owner}\n` +
        `License: ${licenseTypeName(Number(info.licenseType))}\n` +
        `Status: ${authStatusName(Number(info.authorizationStatus))}\n` +
        `Valid: ${new Date(Number(info.validFrom) * 1000).toLocaleString()} - ${new Date(Number(info.validUntil) * 1000).toLocaleString()}\n` +
        `Registered: ${new Date(Number(info.registeredAt) * 1000).toLocaleString()}\n` +
        `Metadata: ${info.metadataHash}`
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
        <h2>Dataset Owner Actions</h2>
      </div>

      <div className="tabs">
        <button className={tab === 'register' ? 'active' : ''} onClick={() => setTab('register')}>Register</button>
        <button className={tab === 'update' ? 'active' : ''} onClick={() => setTab('update')}>Update Status</button>
        <button className={tab === 'revoke' ? 'active' : ''} onClick={() => setTab('revoke')}>Revoke</button>
        <button className={tab === 'view' ? 'active' : ''} onClick={() => setTab('view')}>View Info</button>
      </div>

      {tab === 'register' && (
        <form onSubmit={(e) => { e.preventDefault(); void handleRegister(); }} className="form">
          <div className="form-group">
            <label>Dataset Name</label>
            <input
              type="text"
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              placeholder="e.g., CommonCrawl-2024"
              required
            />
          </div>

          <div className="form-group">
            <label>License Type</label>
            <select value={regLicenseType} onChange={(e) => setRegLicenseType(Number(e.target.value))}>
              {LICENSE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Authorization Status</label>
            <select value={regAuthStatus} onChange={(e) => setRegAuthStatus(Number(e.target.value))}>
              {AUTH_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Valid From (Unix timestamp)</label>
              <input
                type="number"
                value={regValidFrom}
                onChange={(e) => setRegValidFrom(e.target.value)}
                placeholder="Leave empty for now"
              />
            </div>
            <div className="form-group">
              <label>Valid Until (Unix timestamp)</label>
              <input
                type="number"
                value={regValidUntil}
                onChange={(e) => setRegValidUntil(e.target.value)}
                placeholder="Leave empty for 10 years"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Metadata Hash (IPFS/Arweave CID)</label>
            <input
              type="text"
              value={regMetadataHash}
              onChange={(e) => setRegMetadataHash(e.target.value)}
              placeholder="Optional"
            />
          </div>

          <button type="submit" className="btn-primary" disabled={busy || !regName.trim()}>
            {busy ? 'Registering…' : 'Register Dataset'}
          </button>
        </form>
      )}

      {tab === 'update' && (
        <form onSubmit={(e) => { e.preventDefault(); void handleUpdate(); }} className="form">
          <div className="form-group">
            <label>Dataset ID</label>
            <input
              type="text"
              value={datasetId}
              onChange={(e) => setDatasetId(e.target.value)}
              placeholder="Dataset ID (64 hex chars)"
              required
            />
          </div>
          <div className="form-group">
            <label>New Authorization Status</label>
            <select value={newAuthStatus} onChange={(e) => setNewAuthStatus(Number(e.target.value))}>
              {AUTH_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn-primary" disabled={busy || !datasetId.trim()}>
            {busy ? 'Updating…' : 'Update Status'}
          </button>
        </form>
      )}

      {tab === 'revoke' && (
        <form onSubmit={(e) => { e.preventDefault(); void handleRevoke(); }} className="form">
          <div className="form-group">
            <label>Dataset ID</label>
            <input
              type="text"
              value={datasetId}
              onChange={(e) => setDatasetId(e.target.value)}
              placeholder="Dataset ID (64 hex chars)"
              required
            />
          </div>
          <p className="dim small">⚠ This action cannot be undone. The dataset will be marked as revoked for AI training.</p>
          <button type="submit" className="btn-danger" disabled={busy || !datasetId.trim()}>
            {busy ? 'Revoking…' : 'Revoke Dataset'}
          </button>
        </form>
      )}

      {tab === 'view' && (
        <form onSubmit={(e) => { e.preventDefault(); void handleView(); }} className="form">
          <div className="form-group">
            <label>Dataset ID</label>
            <input
              type="text"
              value={datasetId}
              onChange={(e) => setDatasetId(e.target.value)}
              placeholder="Dataset ID (64 hex chars)"
              required
            />
          </div>
          <button type="submit" className="btn-secondary" disabled={busy || !datasetId.trim()}>
            {busy ? 'Loading…' : 'View Dataset'}
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