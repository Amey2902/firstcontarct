import React, { useState } from 'react';
import { History, Search, Filter, CheckCircle2, XCircle, ShieldCheck, Download, ExternalLink, Key, Lock } from 'lucide-react';
import { AuditRecord } from './ComplianceVerificationView';

interface AuditHistoryViewProps {
  audits: AuditRecord[];
}

export const AuditHistoryView: React.FC<AuditHistoryViewProps> = ({ audits }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'VERIFIED_COMPLIANT' | 'COMPLIANCE_FAILED'>('ALL');
  const [selectedAudit, setSelectedAudit] = useState<AuditRecord | null>(null);

  const filteredAudits = audits.filter((a) => {
    const matchesSearch =
      a.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.datasetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.auditId.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === 'ALL') return matchesSearch;
    return matchesSearch && a.overallStatus === filterStatus;
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
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <History className="w-5 h-5 text-cyan-400" />
            <span>Midnight Audit Ledger & Provenance History</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Immutable log of zero-knowledge AI training audits recorded on the Midnight network.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card rounded-xl p-4 border border-indigo-500/20 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Model, Dataset, or Audit ID..."
            className="w-full bg-slate-900/80 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-1.5 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Statuses ({audits.length})</option>
            <option value="VERIFIED_COMPLIANT">Verified Compliant Only</option>
            <option value="COMPLIANCE_FAILED">Failed Invariants Only</option>
          </select>
        </div>
      </div>

      {/* Audits Table / Cards */}
      {filteredAudits.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center text-slate-400 text-xs sm:text-sm">
          No audit records match the current filter criteria.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAudits.map((audit) => (
            <div
              key={audit.auditId}
              className="glass-card rounded-xl p-5 border border-indigo-500/20 hover:border-indigo-500/50 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-indigo-400">{audit.auditId}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border flex items-center space-x-1 ${
                        audit.overallStatus === 'VERIFIED_COMPLIANT'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}
                    >
                      {audit.overallStatus === 'VERIFIED_COMPLIANT' ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>VERIFIED COMPLIANT</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" />
                          <span>COMPLIANCE FAILED</span>
                        </>
                      )}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">{audit.modelName}</h3>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => exportCertificate(audit)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center space-x-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Download Certificate</span>
                  </button>
                  <button
                    onClick={() => setSelectedAudit(audit)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>

              {/* Summary Stats in Card */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block">Dataset Provenance:</span>
                  <span className="text-slate-200 font-semibold">{audit.datasetName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">ZK Proof Hash:</span>
                  <span className="text-cyan-400 truncate block">{audit.proofHash}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Audit Timestamp:</span>
                  <span className="text-slate-300">{new Date(audit.verifiedAt * 1000).toLocaleString()}</span>
                </div>
              </div>

              {/* 5 Invariant Pills */}
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex flex-wrap gap-2">
                <span className={`text-[10px] px-2 py-0.5 rounded border ${audit.ruleResults.datasetAuthorized ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' : 'bg-rose-500/10 text-rose-300 border-rose-500/30'}`}>
                  Authorized: {audit.ruleResults.datasetAuthorized ? 'PASS' : 'FAIL'}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded border ${audit.ruleResults.licenseCompatible ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' : 'bg-rose-500/10 text-rose-300 border-rose-500/30'}`}>
                  License: {audit.ruleResults.licenseCompatible ? 'PASS' : 'FAIL'}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded border ${audit.ruleResults.temporalValidity ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' : 'bg-rose-500/10 text-rose-300 border-rose-500/30'}`}>
                  Temporal: {audit.ruleResults.temporalValidity ? 'PASS' : 'FAIL'}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded border ${audit.ruleResults.datasetIntegrity ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' : 'bg-rose-500/10 text-rose-300 border-rose-500/30'}`}>
                  Integrity: {audit.ruleResults.datasetIntegrity ? 'PASS' : 'FAIL'}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded border ${audit.ruleResults.piiSanitized ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' : 'bg-rose-500/10 text-rose-300 border-rose-500/30'}`}>
                  PII Sanitized: {audit.ruleResults.piiSanitized ? 'PASS' : 'FAIL'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Audit Detail Modal */}
      {selectedAudit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-card max-w-2xl w-full rounded-2xl p-6 border border-indigo-500/40 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-6 h-6 text-cyan-400" />
                <h3 className="text-lg font-bold text-white">Midnight Provenance Audit Detail</h3>
              </div>
              <button
                onClick={() => setSelectedAudit(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="bg-slate-900/80 p-4 rounded-xl space-y-2 border border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-500">Audit ID:</span>
                  <span className="text-slate-200">{selectedAudit.auditId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Model Name:</span>
                  <span className="text-slate-200">{selectedAudit.modelName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Model Hash:</span>
                  <span className="text-slate-200 truncate max-w-[280px]">{selectedAudit.modelHash}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Dataset Name:</span>
                  <span className="text-slate-200">{selectedAudit.datasetName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Dataset Commitment ID:</span>
                  <span className="text-slate-200 truncate max-w-[280px]">{selectedAudit.datasetId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">ZK Proof Hash:</span>
                  <span className="text-cyan-400 truncate max-w-[280px]">{selectedAudit.proofHash}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Verifier Address:</span>
                  <span className="text-slate-200 truncate max-w-[280px]">{selectedAudit.verifier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Verified Timestamp:</span>
                  <span className="text-slate-200">{new Date(selectedAudit.verifiedAt * 1000).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => exportCertificate(selectedAudit)}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export JSON Certificate</span>
              </button>
              <button
                onClick={() => setSelectedAudit(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
