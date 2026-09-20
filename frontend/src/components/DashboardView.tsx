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
      <div className="glass-card rounded-2xl p-6 sm:p-8 relative overflow-hidden bg-gradient-to-br from-white via-slate-50 to-emerald-50/30 border border-slate-200 shadow-sm">
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-md">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-xs font-mono font-bold text-emerald-800">Midnight Network Zero-Knowledge Invariants</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-headline font-bold text-slate-900 tracking-tight leading-tight">
            Cryptographic AI Training Data Provenance <br />
            <span className="text-emerald-700">
              Zero-Knowledge Verification on Midnight
            </span>
          </h1>

          <p className="text-sm text-slate-600 leading-relaxed">
            BLACKBOX AI solves the core regulatory dilemma for enterprise AI. Prove dataset licensing, author authorization, and copyright compliance mathematically—without revealing confidential training data or model weights.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => onNavigate('verify')}
              className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-5 py-2.5 rounded-md transition-all shadow-sm glow-button font-mono cursor-pointer"
            >
              <span>Execute ZK Proof Verification</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('registry')}
              className="flex items-center space-x-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold px-5 py-2.5 rounded-md transition-colors shadow-xs font-mono cursor-pointer"
            >
              <Database className="w-4 h-4 text-cyan-600" />
              <span>Register Dataset Commitment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4 bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">Committed Datasets</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Database className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <p className="text-2xl font-mono font-bold text-slate-900 mt-2">{datasetsCount}</p>
          <span className="text-[11px] font-mono text-slate-500 mt-1 block">SHA-256 on Midnight Ledger</span>
        </div>

        <div className="glass-card rounded-xl p-4 bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">Audit Executions</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center">
              <Cpu className="w-4 h-4 text-cyan-600" />
            </div>
          </div>
          <p className="text-2xl font-mono font-bold text-slate-900 mt-2">{auditsCount}</p>
          <span className="text-[11px] font-mono text-slate-500 mt-1 block">ZK circuits evaluated</span>
        </div>

        <div className="glass-card rounded-xl p-4 bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">Compliance Rate</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <p className="text-2xl font-mono font-bold text-emerald-700 mt-2">{complianceRate}%</p>
          <span className="text-[11px] font-mono text-slate-500 mt-1 block">Verified compliant models</span>
        </div>

        <div className="glass-card rounded-xl p-4 bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">Contract Runtime</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center">
              <Layers className="w-4 h-4 text-cyan-600" />
            </div>
          </div>
          <p className="text-2xl font-mono font-bold text-cyan-700 mt-2">Compact 0.22+</p>
          <span className="text-[11px] font-mono text-slate-500 mt-1 block">Midnight Preprod</span>
        </div>
      </div>

      {/* Midnight Privacy Model: What Observer CAN vs CANNOT Learn */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Lock className="w-4 h-4 text-emerald-600" />
          <h2 className="text-sm font-headline font-bold text-slate-900 uppercase tracking-wider">Midnight Zero-Knowledge Privacy Architecture</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* What an observer CANNOT learn */}
          <div className="glass-card rounded-xl p-5 bg-white border border-red-200 shadow-xs">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
                <EyeOff className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-red-800">What Remains Strictly Confidential (Off-Chain)</h3>
                <p className="text-[11px] text-slate-500">Private ZK Witnesses evaluated in user's local prover</p>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-start space-x-2">
                <span className="text-red-500 font-bold">✕</span>
                <span><strong className="text-slate-900">Raw Training Data:</strong> Medical records, proprietary code, document embeddings.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-red-500 font-bold">✕</span>
                <span><strong className="text-slate-900">Confidential License Terms:</strong> Commercial agreement text and enterprise pricing.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-red-500 font-bold">✕</span>
                <span><strong className="text-slate-900">Model Checkpoint Weights:</strong> Exact gradient parameters and training logs.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-red-500 font-bold">✕</span>
                <span><strong className="text-slate-900">Data Sanitization Logs:</strong> PII scrubbing keys and tokenization maps.</span>
              </li>
            </ul>
          </div>

          {/* What an observer CAN learn */}
          <div className="glass-card rounded-xl p-5 bg-white border border-emerald-200 shadow-xs">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <Eye className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-emerald-800">What is Public & Verifiable (On-Chain)</h3>
                <p className="text-[11px] text-slate-500">Midnight ledger state and mathematical verification status</p>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-start space-x-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong className="text-slate-900">Mathematical Compliance Verdict:</strong> Cryptographic proof that model satisfies all 5 rules.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong className="text-slate-900">Cryptographic Commitments:</strong> 32-byte SHA-256 hashes of dataset IDs and model signatures.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong className="text-slate-900">Temporal Validity Stamp:</strong> Verification that training occurred within valid license window.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong className="text-slate-900">Authorization Status:</strong> Dataset status (AUTHORIZED vs REVOKED) verified at proof time.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 5 Compliance Rules Breakdown */}
      <div className="glass-card rounded-xl p-5 bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-2 mb-4">
          <Layers className="w-4 h-4 text-cyan-600" />
          <h3 className="text-sm font-headline font-bold text-slate-900 uppercase tracking-wider">5 Zero-Knowledge Provenance Invariants</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <span className="text-emerald-700 font-bold font-mono text-[11px]">INVARIANT 1</span>
            <p className="text-slate-900 font-bold mt-1">Owner Authorized</p>
            <p className="text-slate-500 text-[11px] mt-0.5">Active authorization flag on Midnight ledger.</p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <span className="text-emerald-700 font-bold font-mono text-[11px]">INVARIANT 2</span>
            <p className="text-slate-900 font-bold mt-1">License Compatibility</p>
            <p className="text-slate-500 text-[11px] mt-0.5">Commercial / Open Source (strictly no Restricted).</p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <span className="text-cyan-700 font-bold font-mono text-[11px]">INVARIANT 3</span>
            <p className="text-slate-900 font-bold mt-1">Temporal Window</p>
            <p className="text-slate-500 text-[11px] mt-0.5">Training timestamp between validFrom and validUntil.</p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <span className="text-cyan-700 font-bold font-mono text-[11px]">INVARIANT 4</span>
            <p className="text-slate-900 font-bold mt-1">Dataset Integrity</p>
            <p className="text-slate-500 text-[11px] mt-0.5">Private hash matches on-chain commitment.</p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <span className="text-emerald-700 font-bold font-mono text-[11px]">INVARIANT 5</span>
            <p className="text-slate-900 font-bold mt-1">PII Sanitization</p>
            <p className="text-slate-500 text-[11px] mt-0.5">Zero-knowledge proof of pre-training scrub.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
