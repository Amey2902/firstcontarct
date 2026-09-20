import React, { useState } from 'react';
import { Database, Plus, ShieldCheck, FileText, Check, AlertCircle, Key } from 'lucide-react';
import { LICENSE_TYPES, AUTH_STATUS, computeDatasetIdBrowser, sha256HexBrowser, licenseTypeName, authStatusName } from '../contract';

export interface RegisteredDataset {
  id: string;
  name: string;
  owner: string;
  licenseType: number;
  authStatus: number;
  validFrom: string;
  validUntil: string;
  contentHash: string;
  licenseHash: string;
  registeredAt: number;
}

interface DatasetRegistryViewProps {
  datasets: RegisteredDataset[];
  onRegister: (dataset: RegisteredDataset) => void;
  onToggleAuth: (datasetId: string) => void;
  walletAddress: string | null;
}

export const DatasetRegistryView: React.FC<DatasetRegistryViewProps> = ({
  datasets,
  onRegister,
  onToggleAuth,
  walletAddress,
}) => {
  const [name, setName] = useState('');
  const [licenseType, setLicenseType] = useState<number>(LICENSE_TYPES.COMMERCIAL);
  const [rawSecret, setRawSecret] = useState('');
  const [licenseProof, setLicenseProof] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      const owner = walletAddress || '0x1111111111111111111111111111111111111111111111111111111111111111';
      const datasetId = await computeDatasetIdBrowser(owner, name);
      const contentHash = await sha256HexBrowser(rawSecret || `raw-dataset-content-${name}`);
      const licenseHash = await sha256HexBrowser(licenseProof || `license-proof-doc-${name}`);

      const now = Math.floor(Date.now() / 1000);
      const newDataset: RegisteredDataset = {
        id: datasetId,
        name: name.trim(),
        owner,
        licenseType,
        authStatus: AUTH_STATUS.AUTHORIZED,
        validFrom: new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0],
        validUntil: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
        contentHash,
        licenseHash,
        registeredAt: now,
      };

      onRegister(newDataset);
      setSuccessMsg(`Dataset "${name}" registered with cryptographic commitment on Midnight!`);
      setName('');
      setRawSecret('');
      setLicenseProof('');
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h2 className="text-lg font-headline font-bold text-slate-900 flex items-center space-x-2">
          <Database className="w-5 h-5 text-emerald-600" />
          <span>Dataset Registry & Zero-Knowledge Commitments</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Register training datasets with cryptographic commitments on Midnight. Raw contents remain strictly confidential in private witnesses.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center space-x-3 text-emerald-800 text-xs font-mono glow-emerald">
          <Check className="w-4 h-4 flex-shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Grid: Form & List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Registration Form */}
        <div className="glass-card rounded-xl p-5 bg-white border border-slate-200 lg:col-span-1 h-fit shadow-xs">
          <h3 className="text-sm font-headline font-bold text-slate-900 mb-4 flex items-center space-x-2">
            <Plus className="w-4 h-4 text-emerald-600" />
            <span>Commit New Dataset</span>
          </h3>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono font-semibold text-slate-600 mb-1">DATASET IDENTIFIER</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. RefinedWeb-En-Core-v2"
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono font-semibold text-slate-600 mb-1">LICENSE CLASSIFICATION</label>
              <select
                value={licenseType}
                onChange={(e) => setLicenseType(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono shadow-2xs"
              >
                <option value={LICENSE_TYPES.COMMERCIAL}>Commercial (Permissive Paid)</option>
                <option value={LICENSE_TYPES.OPEN_SOURCE}>Open Source (MIT, Apache 2.0)</option>
                <option value={LICENSE_TYPES.PROPRIETARY}>Proprietary (Internal Enterprise)</option>
                <option value={LICENSE_TYPES.RESTRICTED}>Restricted (No AI Training Allowed)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono font-semibold text-slate-600 mb-1">
                PRIVATE DATA SAMPLE <span className="text-red-600 text-[10px]">(ZK Witness / Never Leaves Prover)</span>
              </label>
              <textarea
                rows={2}
                value={rawSecret}
                onChange={(e) => setRawSecret(e.target.value)}
                placeholder="Confidential text or sample hash..."
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono font-semibold text-slate-600 mb-1">
                LICENSE PROOF TOKEN <span className="text-cyan-700 text-[10px]">(Merkle Leaf)</span>
              </label>
              <input
                type="text"
                value={licenseProof}
                onChange={(e) => setLicenseProof(e.target.value)}
                placeholder="e.g. LICENSE-AGREEMENT-REF-9921"
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono shadow-2xs"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2.5 rounded-md transition-all shadow-sm glow-button disabled:opacity-50 font-mono cursor-pointer"
            >
              {isSubmitting ? 'Computing Midnight ZK Commitment...' : 'Register On Midnight Ledger'}
            </button>
          </form>
        </div>

        {/* Registered Datasets List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-headline font-bold text-slate-900">Committed Datasets ({datasets.length})</h3>
            <span className="text-[11px] font-mono text-slate-500">Midnight Public Ledger State</span>
          </div>

          {datasets.length === 0 ? (
            <div className="glass-card rounded-xl p-8 text-center text-slate-500 text-xs bg-white border border-slate-200">
              No datasets registered yet. Use the form to commit your first dataset.
            </div>
          ) : (
            <div className="space-y-3">
              {datasets.map((ds) => (
                <div key={ds.id} className="glass-card rounded-xl p-4 bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                    <div>
                      <h4 className="font-headline font-bold text-slate-900 text-sm">{ds.name}</h4>
                      <span className="font-mono text-[11px] text-slate-500">ID: {ds.id.slice(0, 16)}...{ds.id.slice(-8)}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${
                          ds.licenseType === LICENSE_TYPES.RESTRICTED
                            ? 'bg-red-50 text-red-800 border-red-200'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        {licenseTypeName(ds.licenseType)}
                      </span>

                      <span
                        className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${
                          ds.authStatus === AUTH_STATUS.AUTHORIZED
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-red-50 text-red-800 border-red-200'
                        }`}
                      >
                        {authStatusName(ds.authStatus)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 text-xs text-slate-600 font-mono">
                    <div>
                      <span className="text-slate-400 block text-[10px] font-semibold">CONTENT COMMITMENT:</span>
                      <p className="text-slate-800 truncate">{ds.contentHash}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] font-semibold">VALIDITY WINDOW:</span>
                      <p className="text-slate-800">{ds.validFrom} to {ds.validUntil}</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-200 flex justify-end">
                    <button
                      onClick={() => onToggleAuth(ds.id)}
                      className={`text-[11px] font-mono px-3 py-1 rounded-md border font-semibold transition-colors cursor-pointer ${
                        ds.authStatus === AUTH_STATUS.AUTHORIZED
                          ? 'border-red-300 text-red-700 hover:bg-red-50'
                          : 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                      }`}
                    >
                      {ds.authStatus === AUTH_STATUS.AUTHORIZED ? 'Revoke Authorization' : 'Grant Authorization'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
