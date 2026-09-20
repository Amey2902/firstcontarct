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
          <h2 className="text-lg font-headline font-bold text-white flex items-center space-x-2">
            <History className="w-5 h-5 text-[#10B981]" />
            <span>Midnight Audit Ledger & Provenance History</span>
          </h2>
          <p className="text-xs text-[#9CA3AF] mt-1">
            Immutable log of zero-knowledge AI training audits recorded on the Midnight network.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card rounded-lg p-3.5 bg-[#111827] border border-[#1F2937] flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Model, Dataset, or Audit ID..."
            className="w-full bg-[#0B0F17] border border-[#1F2937] rounded pl-9 pr-3 py-1.5 text-xs text-[#F9FAFB] placeholder-[#4B5563] focus:outline-none focus:border-[#06B6D4] font-mono"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-[#9CA3AF]" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="bg-[#0B0F17] border border-[#1F2937] rounded px-3 py-1.5 text-xs text-[#F9FAFB] focus:outline-none focus:border-[#06B6D4] font-mono"
          >
            <option value="ALL">All Statuses ({audits.length})</option>
            <option value="VERIFIED_COMPLIANT">Verified Compliant Only</option>
            <option value="COMPLIANCE_FAILED">Failed Invariants Only</option>
          </select>
        </div>
      </div>

      {/* Audits Table / Cards */}
      {filteredAudits.length === 0 ? (
        <div className="glass-card rounded-lg p-12 text-center text-[#9CA3AF] text-xs bg-[#111827] border border-[#1F2937]">
          No audit records match the current filter criteria.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAudits.map((audit) => (
            <div
              key={audit.auditId}
              className="glass-card rounded-lg p-4 bg-[#111827] border border-[#1F2937] hover:border-[#374151] transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#1F2937]">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-[#06B6D4]">{audit.auditId}</span>
                    <span
                      className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border flex items-center space-x-1 ${
                        audit.overallStatus === 'VERIFIED_COMPLIANT'
                          ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30'
                          : 'bg-[#EF4444]/10 text-[#ffb4ab] border-[#EF4444]/30'
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
                  <h3 className="text-sm font-headline font-bold text-white mt-1">{audit.modelName}</h3>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => exportCertificate(audit)}
                    className="text-xs font-mono px-3 py-1.5 rounded bg-[#162032] hover:bg-[#1E293B] text-[#dfe2ee] border border-[#1F2937] transition-colors flex items-center space-x-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-[#06B6D4]" />
                    <span>Download Certificate</span>
                  </button>
                  <button
                    onClick={() => setSelectedAudit(audit)}
                    className="text-xs font-mono px-3 py-1.5 rounded bg-[#10B981]/10 hover:bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>

              {/* Summary Stats in Card */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 text-xs font-mono">
                <div>
                  <span className="text-[#4B5563] block text-[10px]">DATASET PROVENANCE:</span>
                  <span className="text-[#dfe2ee] font-semibold">{audit.datasetName}</span>
                </div>
                <div>
                  <span className="text-[#4B5563] block text-[10px]">ZK PROOF HASH:</span>
                  <span className="text-[#06B6D4] truncate block">{audit.proofHash}</span>
                </div>
                <div>
                  <span className="text-[#4B5563] block text-[10px]">AUDIT TIMESTAMP:</span>
                  <span className="text-[#9CA3AF]">{new Date(audit.verifiedAt * 1000).toLocaleString()}</span>
                </div>
              </div>

              {/* 5 Invariant Pills */}
              <div className="mt-3 pt-3 border-t border-[#1F2937] flex flex-wrap gap-1.5 font-mono text-[10px]">
                <span className={`px-2 py-0.5 rounded border ${audit.ruleResults.datasetAuthorized ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30' : 'bg-[#EF4444]/10 text-[#ffb4ab] border-[#EF4444]/30'}`}>
                  Authorized: {audit.ruleResults.datasetAuthorized ? 'PASS' : 'FAIL'}
                </span>
                <span className={`px-2 py-0.5 rounded border ${audit.ruleResults.licenseCompatible ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30' : 'bg-[#EF4444]/10 text-[#ffb4ab] border-[#EF4444]/30'}`}>
                  License: {audit.ruleResults.licenseCompatible ? 'PASS' : 'FAIL'}
                </span>
                <span className={`px-2 py-0.5 rounded border ${audit.ruleResults.temporalValidity ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30' : 'bg-[#EF4444]/10 text-[#ffb4ab] border-[#EF4444]/30'}`}>
                  Temporal: {audit.ruleResults.temporalValidity ? 'PASS' : 'FAIL'}
                </span>
                <span className={`px-2 py-0.5 rounded border ${audit.ruleResults.datasetIntegrity ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30' : 'bg-[#EF4444]/10 text-[#ffb4ab] border-[#EF4444]/30'}`}>
                  Integrity: {audit.ruleResults.datasetIntegrity ? 'PASS' : 'FAIL'}
                </span>
                <span className={`px-2 py-0.5 rounded border ${audit.ruleResults.piiSanitized ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30' : 'bg-[#EF4444]/10 text-[#ffb4ab] border-[#EF4444]/30'}`}>
                  PII: {audit.ruleResults.piiSanitized ? 'PASS' : 'FAIL'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Audit Detail Modal */}
      {selectedAudit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-card max-w-2xl w-full rounded-lg p-6 bg-[#111827] border border-[#1F2937] space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#1F2937]">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-[#10B981]" />
                <h3 className="text-base font-headline font-bold text-white">Midnight Provenance Audit Detail</h3>
              </div>
              <button
                onClick={() => setSelectedAudit(null)}
                className="text-[#9CA3AF] hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="bg-[#0B0F17] p-4 rounded space-y-2 border border-[#1F2937]">
                <div className="flex justify-between">
                  <span className="text-[#9CA3AF]">Audit ID:</span>
                  <span className="text-[#F9FAFB]">{selectedAudit.auditId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9CA3AF]">Model Identifier:</span>
                  <span className="text-[#F9FAFB]">{selectedAudit.modelName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9CA3AF]">Model Hash:</span>
                  <span className="text-[#F9FAFB] truncate max-w-[280px]">{selectedAudit.modelHash}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9CA3AF]">Dataset Identifier:</span>
                  <span className="text-[#F9FAFB]">{selectedAudit.datasetName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9CA3AF]">Dataset Commitment ID:</span>
                  <span className="text-[#F9FAFB] truncate max-w-[280px]">{selectedAudit.datasetId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9CA3AF]">ZK Proof Hash:</span>
                  <span className="text-[#06B6D4] truncate max-w-[280px]">{selectedAudit.proofHash}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9CA3AF]">Verifier Account:</span>
                  <span className="text-[#F9FAFB] truncate max-w-[280px]">{selectedAudit.verifier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9CA3AF]">Timestamp:</span>
                  <span className="text-[#F9FAFB]">{new Date(selectedAudit.verifiedAt * 1000).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-[#1F2937]">
              <button
                onClick={() => exportCertificate(selectedAudit)}
                className="px-4 py-2 rounded bg-[#10B981] hover:bg-[#059669] text-[#0B0F17] text-xs font-semibold flex items-center space-x-2 font-mono"
              >
                <Download className="w-4 h-4" />
                <span>Export JSON Certificate</span>
              </button>
              <button
                onClick={() => setSelectedAudit(null)}
                className="px-4 py-2 rounded bg-[#162032] hover:bg-[#1E293B] text-[#dfe2ee] text-xs font-semibold font-mono"
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
