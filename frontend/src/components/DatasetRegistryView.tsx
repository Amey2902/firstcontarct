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
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <Database className="w-5 h-5 text-cyan-400" />
          <span>Dataset Registry & Authorization Manager</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Register training datasets with cryptographic commitments. Raw content remains strictly off-chain.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center space-x-3 text-emerald-300 text-xs sm:text-sm">
          <Check className="w-5 h-5 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Grid: Form & List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Registration Form */}
        <div className="glass-card rounded-2xl p-6 border border-indigo-500/30 lg:col-span-1 h-fit">
          <h3 className="text-base font-bold text-white mb-4 flex items-center space-x-2">
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>Register New Dataset</span>
          </h3>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Dataset Name / Identifier</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. CommonCrawl-En-v2"
                className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">License Classification</label>
              <select
                value={licenseType}
                onChange={(e) => setLicenseType(Number(e.target.value))}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
              >
                <option value={LICENSE_TYPES.COMMERCIAL}>Commercial (Permissive Paid)</option>
                <option value={LICENSE_TYPES.OPEN_SOURCE}>Open Source (MIT, Apache 2.0)</option>
                <option value={LICENSE_TYPES.PROPRIETARY}>Proprietary (Internal Enterprise)</option>
                <option value={LICENSE_TYPES.RESTRICTED}>Restricted (No AI Training Allowed)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Private Dataset Content Sample <span className="text-rose-400 text-[10px]">(Never leaves browser)</span>
              </label>
              <textarea
                rows={2}
                value={rawSecret}
                onChange={(e) => setRawSecret(e.target.value)}
                placeholder="Confidential text or sample hash..."
                className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                License Proof Token / ID <span className="text-cyan-400 text-[10px]">(ZK Witness)</span>
              </label>
              <input
                type="text"
                value={licenseProof}
                onChange={(e) => setLicenseProof(e.target.value)}
                placeholder="e.g. LICENSE-AGREEMENT-REF-9921"
                className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs sm:text-sm font-semibold py-2.5 rounded-xl transition-all glow-button disabled:opacity-50"
            >
              {isSubmitting ? 'Generating ZK Commitment...' : 'Register On-Chain'}
            </button>
          </form>
        </div>

        {/* Registered Datasets List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Registered Datasets ({datasets.length})</h3>
            <span className="text-xs text-slate-400">Public Ledger Commitments</span>
          </div>

          {datasets.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 text-center text-slate-400 text-xs sm:text-sm">
              No datasets registered yet. Use the form to register your first dataset.
            </div>
          ) : (
            <div className="space-y-3">
              {datasets.map((ds) => (
                <div key={ds.id} className="glass-card rounded-xl p-4 border border-indigo-500/20 hover:border-indigo-500/40 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                    <div>
                      <h4 className="font-bold text-white text-sm sm:text-base">{ds.name}</h4>
                      <span className="font-mono text-[11px] text-slate-400">ID: {ds.id.slice(0, 16)}...{ds.id.slice(-8)}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          ds.licenseType === LICENSE_TYPES.RESTRICTED
                            ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                            : 'bg-indigo-500/10 text-cyan-300 border-indigo-500/30'
                        }`}
                      >
                        {licenseTypeName(ds.licenseType)}
                      </span>

                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          ds.authStatus === AUTH_STATUS.AUTHORIZED
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        {authStatusName(ds.authStatus)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 text-xs text-slate-400 font-mono">
                    <div>
                      <span className="text-slate-500">Content Hash (Commitment):</span>
                      <p className="text-slate-300 truncate">{ds.contentHash}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Validity Period:</span>
                      <p className="text-slate-300">{ds.validFrom} to {ds.validUntil}</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-800/60 flex justify-end">
                    <button
                      onClick={() => onToggleAuth(ds.id)}
                      className={`text-xs px-3 py-1 rounded-lg border font-medium transition-colors ${
                        ds.authStatus === AUTH_STATUS.AUTHORIZED
                          ? 'border-rose-500/30 text-rose-400 hover:bg-rose-500/10'
                          : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
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
