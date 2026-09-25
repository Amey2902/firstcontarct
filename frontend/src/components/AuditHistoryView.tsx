import React, { useState } from 'react';
import { History, Search, Filter, CheckCircle2, XCircle, ShieldCheck, Download, ExternalLink } from 'lucide-react';
import { AuditRecord } from './ComplianceVerificationView';
import { TxHistoryItem } from '../hooks/useMidnight';

interface AuditHistoryViewProps {
  audits: AuditRecord[];
  txHistory?: TxHistoryItem[];
  onRefreshWalletHistory?: () => void;
}

export const AuditHistoryView: React.FC<AuditHistoryViewProps> = ({
  audits,
  txHistory = [],
  onRefreshWalletHistory,
}) => {
  const [activeTab, setActiveTab] = useState<'transactions' | 'audits'>('transactions');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'VERIFIED_COMPLIANT' | 'COMPLIANCE_FAILED'>('ALL');
  const [selectedAudit, setSelectedAudit] = useState<AuditRecord | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (onRefreshWalletHistory) {
      setIsRefreshing(true);
      await onRefreshWalletHistory();
      setTimeout(() => setIsRefreshing(false), 800);
    }
  };

  const filteredAudits = audits.filter((a) => {
    const matchesSearch =
      a.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.datasetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.auditId.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === 'ALL') return matchesSearch;
    return matchesSearch && a.overallStatus === filterStatus;
  });

  const filteredTxs = txHistory.filter((tx) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      tx.action.toLowerCase().includes(searchLower) ||
      tx.circuit.toLowerCase().includes(searchLower) ||
      tx.txHash.toLowerCase().includes(searchLower)
    );
  });

  const exportCertificate = (audit: AuditRecord) => {
    const certData = {
      title: 'Midnight BLACKBOX AI Compliance Certificate',
      network: 'Midnight Testnet / Preprod',
      contract: 'BlackBox.compact',
      circuit: audit.zkCircuit,
      auditId: audit.auditId,
      modelName: audit.modelName,
      modelHash: audit.modelHash,
      datasetName: audit.datasetName,
      datasetId: audit.datasetId,
      status: audit.overallStatus,
      ruleResults: audit.ruleResults,
      proofHash: audit.proofHash,
      timestamp: new Date(audit.verifiedAt * 1000).toISOString(),
      verifier: audit.verifier,
    };

    const blob = new Blob([JSON.stringify(certData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Midnight-Certificate-${audit.auditId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-headline font-bold text-slate-900 flex items-center space-x-2">
            <History className="w-5 h-5 text-emerald-600" />
            <span>Midnight Ledger & 1AM Wallet History</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time log of on-chain dataset actions, 1AM wallet signatures, and zero-knowledge audits.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-headline font-bold transition-all cursor-pointer ${
              activeTab === 'transactions'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1AM Transactions ({txHistory.length})
          </button>
          <button
            onClick={() => setActiveTab('audits')}
            className={`px-3 py-1.5 rounded-lg text-xs font-headline font-bold transition-all cursor-pointer ${
              activeTab === 'audits'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            AI Audit Certificates ({audits.length})
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card rounded-xl p-3.5 bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={activeTab === 'transactions' ? 'Search by Action, Circuit, or Tx Hash...' : 'Search by Model, Dataset, or Audit ID...'}
            className="w-full bg-white border border-slate-300 rounded-md pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono shadow-2xs"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
          {activeTab === 'audits' && (
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono shadow-2xs"
              >
                <option value="ALL">All Statuses ({audits.length})</option>
                <option value="VERIFIED_COMPLIANT">Verified Compliant Only</option>
                <option value="COMPLIANCE_FAILED">Failed Invariants Only</option>
              </select>
            </div>
          )}

          {activeTab === 'transactions' && onRefreshWalletHistory && (
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center space-x-1.5 text-xs font-mono font-semibold px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
            >
              <span className={isRefreshing ? 'animate-spin inline-block' : ''}>🔄</span>
              <span>{isRefreshing ? 'Syncing 1AM...' : 'Sync with 1AM Wallet'}</span>
            </button>
          )}
        </div>
      </div>

      {/* View 1: 1AM Transactions View */}
      {activeTab === 'transactions' && (
        <div className="space-y-3">
          {filteredTxs.length === 0 ? (
            <div className="glass-card rounded-xl p-12 text-center text-slate-500 text-xs bg-white border border-slate-200 space-y-2">
              <p className="font-semibold text-slate-700">No transactions recorded yet.</p>
              <p className="text-slate-400">
                Register or revoke a dataset, or execute a compliance audit with 1AM to see transactions appear here.
              </p>
            </div>
          ) : (
            filteredTxs.map((tx) => (
              <div
                key={tx.id}
                className="glass-card rounded-xl p-4 bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <h4 className="font-headline font-bold text-slate-900 text-xs sm:text-sm">{tx.action}</h4>
                    <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
                      Circuit: {tx.circuit}
                    </span>
                    <span className="text-[10px] font-mono bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded font-semibold">
                      1AM Confirmed
                    </span>
                  </div>
                  <p className="font-mono text-[11px] text-slate-500 truncate max-w-xl">
                    TX / SIG HASH: <span className="text-slate-700 font-semibold">{tx.txHash}</span>
                  </p>
                </div>

                <div className="flex items-center space-x-3 sm:flex-col sm:items-end sm:space-x-0 sm:space-y-1 text-right flex-shrink-0">
                  <span className="text-[10px] font-mono text-slate-400">
                    {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                  <a
                    href={`https://explorer.preprod.midnight.network/tx/${tx.txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1 text-[11px] font-mono text-emerald-700 hover:text-emerald-900 font-semibold"
                  >
                    <span>Explorer</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* View 2: Audits View */}
      {activeTab === 'audits' && (
        <div className="space-y-3">
          {filteredAudits.length === 0 ? (
            <div className="glass-card rounded-xl p-12 text-center text-slate-500 text-xs bg-white border border-slate-200">
              No audit records match the current filter criteria.
            </div>
          ) : (
            filteredAudits.map((audit) => (
              <div
                key={audit.auditId}
                className="glass-card rounded-xl p-4 bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                  <div className="flex items-center space-x-3">
                    {audit.overallStatus === 'VERIFIED_COMPLIANT' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    )}
                    <div>
                      <h4 className="font-headline font-bold text-slate-900 text-sm">{audit.modelName}</h4>
                      <p className="font-mono text-[11px] text-slate-500">
                        Audit ID: <span className="text-slate-700 font-semibold">{audit.auditId}</span> | Dataset: {audit.datasetName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                        audit.overallStatus === 'VERIFIED_COMPLIANT'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-red-50 text-red-800 border-red-200'
                      }`}
                    >
                      {audit.overallStatus === 'VERIFIED_COMPLIANT' ? 'COMPLIANT' : 'FAILED'}
                    </span>
                    <button
                      onClick={() => exportCertificate(audit)}
                      className="inline-flex items-center space-x-1 text-[11px] font-mono text-slate-600 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 px-2 py-1 rounded-md transition-colors cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>Certificate</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-3 text-[11px] font-mono">
                  <div className="flex items-center space-x-1.5">
                    {audit.ruleResults.datasetAuthorized ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-red-600" />
                    )}
                    <span className="text-slate-600">Authorized</span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    {audit.ruleResults.licenseCompatible ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-red-600" />
                    )}
                    <span className="text-slate-600">Licensed</span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    {audit.ruleResults.temporalValidity ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-red-600" />
                    )}
                    <span className="text-slate-600">Valid Window</span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    {audit.ruleResults.datasetIntegrity ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-red-600" />
                    )}
                    <span className="text-slate-600">Integrity</span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    {audit.ruleResults.piiSanitized ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-red-600" />
                    )}
                    <span className="text-slate-600">PII Sanitized</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
