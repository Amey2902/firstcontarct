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
          <h2 className="text-lg font-headline font-bold text-slate-900 flex items-center space-x-2">
            <History className="w-5 h-5 text-emerald-600" />
            <span>Midnight Audit Ledger & Provenance History</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Immutable log of zero-knowledge AI training audits recorded on the Midnight network.
          </p>
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
            placeholder="Search by Model, Dataset, or Audit ID..."
            className="w-full bg-white border border-slate-300 rounded-md pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono shadow-2xs"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
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
      </div>

      {/* Audits Table / Cards */}
      {filteredAudits.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center text-slate-500 text-xs bg-white border border-slate-200">
          No audit records match the current filter criteria.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAudits.map((audit) => (
            <div
              key={audit.auditId}
              className="glass-card rounded-xl p-4 bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-xs"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-cyan-700">{audit.auditId}</span>
                    <span
                      className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border flex items-center space-x-1 ${
                        audit.overallStatus === 'VERIFIED_COMPLIANT'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-red-50 text-red-800 border-red-200'
                      }`}
                    >
                      {audit.overallStatus === 'VERIFIED_COMPLIANT' ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>VERIFIED COMPLIANT</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 text-red-600" />
                          <span>COMPLIANCE FAILED</span>
                        </>
                      )}
                    </span>
                  </div>
                  <h3 className="text-sm font-headline font-bold text-slate-900 mt-1">{audit.modelName}</h3>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => exportCertificate(audit)}
                    className="text-xs font-mono px-3 py-1.5 rounded-md bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition-colors flex items-center space-x-1.5 shadow-2xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Download Certificate</span>
                  </button>
                  <button
                    onClick={() => setSelectedAudit(audit)}
                    className="text-xs font-mono px-3 py-1.5 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors font-semibold cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
              </div>

              {/* Summary Stats in Card */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 text-xs font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px] font-semibold">DATASET PROVENANCE:</span>
                  <span className="text-slate-800 font-semibold">{audit.datasetName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-semibold">ZK PROOF HASH:</span>
                  <span className="text-cyan-700 truncate block font-medium">{audit.proofHash}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-semibold">AUDIT TIMESTAMP:</span>
                  <span className="text-slate-600">{new Date(audit.verifiedAt * 1000).toLocaleString()}</span>
                </div>
              </div>

              {/* 5 Invariant Pills */}
              <div className="mt-3 pt-3 border-t border-slate-200 flex flex-wrap gap-1.5 font-mono text-[10px]">
                <span className={`px-2 py-0.5 rounded border font-medium ${audit.ruleResults.datasetAuthorized ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
                  Authorized: {audit.ruleResults.datasetAuthorized ? 'PASS' : 'FAIL'}
                </span>
                <span className={`px-2 py-0.5 rounded border font-medium ${audit.ruleResults.licenseCompatible ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
                  License: {audit.ruleResults.licenseCompatible ? 'PASS' : 'FAIL'}
                </span>
                <span className={`px-2 py-0.5 rounded border font-medium ${audit.ruleResults.temporalValidity ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
                  Temporal: {audit.ruleResults.temporalValidity ? 'PASS' : 'FAIL'}
                </span>
                <span className={`px-2 py-0.5 rounded border font-medium ${audit.ruleResults.datasetIntegrity ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
                  Integrity: {audit.ruleResults.datasetIntegrity ? 'PASS' : 'FAIL'}
                </span>
                <span className={`px-2 py-0.5 rounded border font-medium ${audit.ruleResults.piiSanitized ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
                  PII: {audit.ruleResults.piiSanitized ? 'PASS' : 'FAIL'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Audit Detail Modal */}
      {selectedAudit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="glass-card max-w-2xl w-full rounded-xl p-6 bg-white border border-slate-200 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-headline font-bold text-slate-900">Midnight Provenance Audit Detail</h3>
              </div>
              <button
                onClick={() => setSelectedAudit(null)}
                className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="bg-slate-50 p-4 rounded-lg space-y-2 border border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-500">Audit ID:</span>
                  <span className="text-slate-900 font-bold">{selectedAudit.auditId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Model Identifier:</span>
                  <span className="text-slate-900 font-semibold">{selectedAudit.modelName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Model Hash:</span>
                  <span className="text-slate-800 truncate max-w-[280px]">{selectedAudit.modelHash}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Dataset Identifier:</span>
                  <span className="text-slate-900 font-semibold">{selectedAudit.datasetName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Dataset Commitment ID:</span>
                  <span className="text-slate-800 truncate max-w-[280px]">{selectedAudit.datasetId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">ZK Proof Hash:</span>
                  <span className="text-cyan-700 font-semibold truncate max-w-[280px]">{selectedAudit.proofHash}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Verifier Account:</span>
                  <span className="text-slate-800 truncate max-w-[280px]">{selectedAudit.verifier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Timestamp:</span>
                  <span className="text-slate-700">{new Date(selectedAudit.verifiedAt * 1000).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => exportCertificate(selectedAudit)}
                className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center space-x-2 font-mono shadow-sm cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export JSON Certificate</span>
              </button>
              <button
                onClick={() => setSelectedAudit(null)}
                className="px-4 py-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-semibold font-mono cursor-pointer"
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
