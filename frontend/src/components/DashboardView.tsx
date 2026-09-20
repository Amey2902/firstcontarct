import React from 'react';
import { Shield, Lock, Eye, EyeOff, CheckCircle, Database, FileCheck, ArrowRight, Cpu, Layers } from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (tab: 'registry' | 'verify' | 'history') => void;
  datasetsCount: number;
  auditsCount: number;
  compliantCount: number;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  datasetsCount,
  auditsCount,
  compliantCount,
}) => {
  const complianceRate = auditsCount > 0 ? Math.round((compliantCount / auditsCount) * 100) : 100;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Hero Section */}
      <div className="glass-card rounded-xl p-6 sm:p-8 relative overflow-hidden bg-[#111827] border border-[#1F2937]">
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-[#10B981]/10 border border-[#10B981]/30 px-3 py-1 rounded">
            <Shield className="w-3.5 h-3.5 text-[#10B981]" />
            <span className="text-xs font-mono font-semibold text-[#10B981]">Midnight Network Zero-Knowledge Invariants</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-headline font-bold text-white tracking-tight leading-tight">
            Cryptographic AI Training Data Provenance <br />
            <span className="text-[#10B981]">
              Zero-Knowledge Verification on Midnight
            </span>
          </h1>

          <p className="text-sm text-[#9CA3AF] leading-relaxed">
            BLACKBOX AI solves the core regulatory dilemma for enterprise AI. Prove dataset licensing, author authorization, and copyright compliance mathematically—without revealing confidential training data or model weights.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => onNavigate('verify')}
              className="flex items-center space-x-2 bg-[#10B981] hover:bg-[#059669] text-[#0B0F17] text-xs font-semibold px-5 py-2.5 rounded transition-all glow-button font-mono"
            >
              <span>Execute ZK Proof Verification</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('registry')}
              className="flex items-center space-x-2 bg-[#162032] hover:bg-[#1E293B] border border-[#1F2937] text-[#dfe2ee] text-xs font-semibold px-5 py-2.5 rounded transition-colors font-mono"
            >
              <Database className="w-4 h-4 text-[#06B6D4]" />
              <span>Register Dataset Commitment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-card rounded-lg p-4 bg-[#111827] border border-[#1F2937]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#9CA3AF]">Committed Datasets</span>
            <Database className="w-4 h-4 text-[#10B981]" />
          </div>
          <p className="text-2xl font-mono font-bold text-white mt-2">{datasetsCount}</p>
          <span className="text-[11px] font-mono text-[#9CA3AF] mt-1 block">SHA-256 on Midnight Ledger</span>
        </div>

        <div className="glass-card rounded-lg p-4 bg-[#111827] border border-[#1F2937]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#9CA3AF]">Audit Executions</span>
            <Cpu className="w-4 h-4 text-[#06B6D4]" />
          </div>
          <p className="text-2xl font-mono font-bold text-white mt-2">{auditsCount}</p>
          <span className="text-[11px] font-mono text-[#9CA3AF] mt-1 block">ZK circuits evaluated</span>
        </div>

        <div className="glass-card rounded-lg p-4 bg-[#111827] border border-[#1F2937]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#9CA3AF]">Compliance Rate</span>
            <CheckCircle className="w-4 h-4 text-[#10B981]" />
          </div>
          <p className="text-2xl font-mono font-bold text-[#10B981] mt-2">{complianceRate}%</p>
          <span className="text-[11px] font-mono text-[#9CA3AF] mt-1 block">Verified compliant models</span>
        </div>

        <div className="glass-card rounded-lg p-4 bg-[#111827] border border-[#1F2937]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#9CA3AF]">Contract Runtime</span>
            <Layers className="w-4 h-4 text-[#06B6D4]" />
          </div>
          <p className="text-2xl font-mono font-bold text-[#06B6D4] mt-2">Compact 0.22+</p>
          <span className="text-[11px] font-mono text-[#9CA3AF] mt-1 block">Midnight Preprod</span>
        </div>
      </div>

      {/* Midnight Privacy Model: What Observer CAN vs CANNOT Learn */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Lock className="w-4 h-4 text-[#10B981]" />
          <h2 className="text-sm font-headline font-bold text-white uppercase tracking-wider">Midnight Zero-Knowledge Privacy Architecture</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* What an observer CANNOT learn */}
          <div className="glass-card rounded-lg p-5 bg-[#111827] border border-[#EF4444]/30">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-center justify-center text-[#EF4444]">
                <EyeOff className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#ffb4ab]">What Remains Strictly Confidential (Off-Chain)</h3>
                <p className="text-[11px] text-[#9CA3AF]">Private ZK Witnesses evaluated in user's local prover</p>
              </div>
            </div>

            <ul className="space-y-2 text-xs text-[#9CA3AF]">
              <li className="flex items-start space-x-2">
                <span className="text-[#EF4444] font-bold">✕</span>
                <span><strong className="text-[#dfe2ee]">Raw Training Data:</strong> Medical records, proprietary code, document embeddings.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#EF4444] font-bold">✕</span>
                <span><strong className="text-[#dfe2ee]">Confidential License Terms:</strong> Commercial agreement text and enterprise pricing.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#EF4444] font-bold">✕</span>
                <span><strong className="text-[#dfe2ee]">Model Checkpoint Weights:</strong> Exact gradient parameters and training logs.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#EF4444] font-bold">✕</span>
                <span><strong className="text-[#dfe2ee]">Data Sanitization Logs:</strong> PII scrubbing keys and tokenization maps.</span>
              </li>
            </ul>
          </div>

          {/* What an observer CAN learn */}
          <div className="glass-card rounded-lg p-5 bg-[#111827] border border-[#10B981]/30">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center text-[#10B981]">
                <Eye className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#10B981]">What is Public & Verifiable (On-Chain)</h3>
                <p className="text-[11px] text-[#9CA3AF]">Midnight ledger state and mathematical verification status</p>
              </div>
            </div>

            <ul className="space-y-2 text-xs text-[#9CA3AF]">
              <li className="flex items-start space-x-2">
                <span className="text-[#10B981] font-bold">✓</span>
                <span><strong className="text-[#dfe2ee]">Mathematical Compliance Verdict:</strong> Cryptographic proof that model satisfies all 5 rules.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#10B981] font-bold">✓</span>
                <span><strong className="text-[#dfe2ee]">Cryptographic Commitments:</strong> 32-byte SHA-256 hashes of dataset IDs and model signatures.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#10B981] font-bold">✓</span>
                <span><strong className="text-[#dfe2ee]">Temporal Validity Stamp:</strong> Verification that training occurred within valid license window.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#10B981] font-bold">✓</span>
                <span><strong className="text-[#dfe2ee]">Authorization Status:</strong> Dataset status (AUTHORIZED vs REVOKED) verified at proof time.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 5 Compliance Rules Breakdown */}
      <div className="glass-card rounded-lg p-5 bg-[#111827] border border-[#1F2937]">
        <div className="flex items-center space-x-2 mb-4">
          <Layers className="w-4 h-4 text-[#06B6D4]" />
          <h3 className="text-sm font-headline font-bold text-white uppercase tracking-wider">5 Zero-Knowledge Provenance Invariants</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
          <div className="bg-[#162032] p-3 rounded border border-[#1F2937]">
            <span className="text-[#10B981] font-bold font-mono">INVARIANT 1</span>
            <p className="text-white font-medium mt-1">Owner Authorized</p>
            <p className="text-[#9CA3AF] text-[11px] mt-0.5">Active authorization flag on Midnight ledger.</p>
          </div>

          <div className="bg-[#162032] p-3 rounded border border-[#1F2937]">
            <span className="text-[#10B981] font-bold font-mono">INVARIANT 2</span>
            <p className="text-white font-medium mt-1">License Compatibility</p>
            <p className="text-[#9CA3AF] text-[11px] mt-0.5">Commercial / Open Source (strictly no Restricted).</p>
          </div>

          <div className="bg-[#162032] p-3 rounded border border-[#1F2937]">
            <span className="text-[#06B6D4] font-bold font-mono">INVARIANT 3</span>
            <p className="text-white font-medium mt-1">Temporal Window</p>
            <p className="text-[#9CA3AF] text-[11px] mt-0.5">Training timestamp between validFrom and validUntil.</p>
          </div>

          <div className="bg-[#162032] p-3 rounded border border-[#1F2937]">
            <span className="text-[#06B6D4] font-bold font-mono">INVARIANT 4</span>
            <p className="text-white font-medium mt-1">Dataset Integrity</p>
            <p className="text-[#9CA3AF] text-[11px] mt-0.5">Private hash matches on-chain commitment.</p>
          </div>

          <div className="bg-[#162032] p-3 rounded border border-[#1F2937]">
            <span className="text-[#10B981] font-bold font-mono">INVARIANT 5</span>
            <p className="text-white font-medium mt-1">PII Sanitization</p>
            <p className="text-[#9CA3AF] text-[11px] mt-0.5">Zero-knowledge proof of pre-training scrub.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
