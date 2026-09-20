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
        <h2 className="text-lg font-headline font-bold text-white flex items-center space-x-2">
          <Database className="w-5 h-5 text-[#10B981]" />
          <span>Dataset Registry & Zero-Knowledge Commitments</span>
        </h2>
        <p className="text-xs text-[#9CA3AF] mt-1">
          Register training datasets with cryptographic commitments on Midnight. Raw contents remain strictly confidential in private witnesses.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded bg-[#10B981]/10 border border-[#10B981]/30 flex items-center space-x-3 text-[#10B981] text-xs font-mono glow-emerald">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Grid: Form & List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Registration Form */}
        <div className="glass-card rounded-lg p-5 bg-[#111827] border border-[#1F2937] lg:col-span-1 h-fit">
          <h3 className="text-sm font-headline font-bold text-white mb-4 flex items-center space-x-2">
            <Plus className="w-4 h-4 text-[#10B981]" />
            <span>Commit New Dataset</span>
          </h3>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono font-semibold text-[#9CA3AF] mb-1">DATASET IDENTIFIER</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. RefinedWeb-En-Core-v2"
                className="w-full bg-[#0B0F17] border border-[#1F2937] rounded px-3 py-2 text-xs text-[#F9FAFB] placeholder-[#4B5563] focus:outline-none focus:border-[#06B6D4] font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono font-semibold text-[#9CA3AF] mb-1">LICENSE CLASSIFICATION</label>
              <select
                value={licenseType}
                onChange={(e) => setLicenseType(Number(e.target.value))}
                className="w-full bg-[#0B0F17] border border-[#1F2937] rounded px-3 py-2 text-xs text-[#F9FAFB] focus:outline-none focus:border-[#06B6D4] font-mono"
              >
                <option value={LICENSE_TYPES.COMMERCIAL}>Commercial (Permissive Paid)</option>
                <option value={LICENSE_TYPES.OPEN_SOURCE}>Open Source (MIT, Apache 2.0)</option>
                <option value={LICENSE_TYPES.PROPRIETARY}>Proprietary (Internal Enterprise)</option>
                <option value={LICENSE_TYPES.RESTRICTED}>Restricted (No AI Training Allowed)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono font-semibold text-[#9CA3AF] mb-1">
                PRIVATE DATA SAMPLE <span className="text-[#EF4444] text-[10px]">(ZK Witness / Never Leaves Prover)</span>
              </label>
              <textarea
                rows={2}
                value={rawSecret}
                onChange={(e) => setRawSecret(e.target.value)}
                placeholder="Confidential text or sample hash..."
                className="w-full bg-[#0B0F17] border border-[#1F2937] rounded px-3 py-2 text-xs text-[#F9FAFB] placeholder-[#4B5563] focus:outline-none focus:border-[#06B6D4] font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono font-semibold text-[#9CA3AF] mb-1">
                LICENSE PROOF TOKEN <span className="text-[#06B6D4] text-[10px]">(Merkle Leaf)</span>
              </label>
              <input
                type="text"
                value={licenseProof}
                onChange={(e) => setLicenseProof(e.target.value)}
                placeholder="e.g. LICENSE-AGREEMENT-REF-9921"
                className="w-full bg-[#0B0F17] border border-[#1F2937] rounded px-3 py-2 text-xs text-[#F9FAFB] placeholder-[#4B5563] focus:outline-none focus:border-[#06B6D4] font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="w-full bg-[#10B981] hover:bg-[#059669] text-[#0B0F17] text-xs font-semibold py-2.5 rounded transition-all glow-button disabled:opacity-50 font-mono"
            >
              {isSubmitting ? 'Computing Midnight ZK Commitment...' : 'Register On Midnight Ledger'}
            </button>
          </form>
        </div>

        {/* Registered Datasets List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-headline font-bold text-white">Committed Datasets ({datasets.length})</h3>
            <span className="text-[11px] font-mono text-[#9CA3AF]">Midnight Public Ledger State</span>
          </div>

          {datasets.length === 0 ? (
            <div className="glass-card rounded-lg p-8 text-center text-[#9CA3AF] text-xs bg-[#111827] border border-[#1F2937]">
              No datasets registered yet. Use the form to commit your first dataset.
            </div>
          ) : (
            <div className="space-y-3">
              {datasets.map((ds) => (
                <div key={ds.id} className="glass-card rounded-lg p-4 bg-[#111827] border border-[#1F2937] hover:border-[#374151] transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#1F2937]">
                    <div>
                      <h4 className="font-headline font-bold text-white text-sm">{ds.name}</h4>
                      <span className="font-mono text-[11px] text-[#9CA3AF]">ID: {ds.id.slice(0, 16)}...{ds.id.slice(-8)}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${
                          ds.licenseType === LICENSE_TYPES.RESTRICTED
                            ? 'bg-[#EF4444]/10 text-[#ffb4ab] border-[#EF4444]/30'
                            : 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30'
                        }`}
                      >
                        {licenseTypeName(ds.licenseType)}
                      </span>

                      <span
                        className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${
                          ds.authStatus === AUTH_STATUS.AUTHORIZED
                            ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30'
                            : 'bg-[#EF4444]/10 text-[#ffb4ab] border-[#EF4444]/30'
                        }`}
                      >
                        {authStatusName(ds.authStatus)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 text-xs text-[#9CA3AF] font-mono">
                    <div>
                      <span className="text-[#4B5563] block text-[10px]">CONTENT COMMITMENT:</span>
                      <p className="text-[#dfe2ee] truncate">{ds.contentHash}</p>
                    </div>
                    <div>
                      <span className="text-[#4B5563] block text-[10px]">VALIDITY WINDOW:</span>
                      <p className="text-[#dfe2ee]">{ds.validFrom} to {ds.validUntil}</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[#1F2937] flex justify-end">
                    <button
                      onClick={() => onToggleAuth(ds.id)}
                      className={`text-[11px] font-mono px-3 py-1 rounded border font-medium transition-colors ${
                        ds.authStatus === AUTH_STATUS.AUTHORIZED
                          ? 'border-[#EF4444]/40 text-[#ffb4ab] hover:bg-[#EF4444]/10'
                          : 'border-[#10B981]/40 text-[#10B981] hover:bg-[#10B981]/10'
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
