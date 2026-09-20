import React from 'react';
import { Shield, Lock, Eye, EyeOff, CheckCircle, Database, FileCheck, ArrowRight, Cpu, Layers } from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (tab: 'registry' | 'verify' | 'audit') => void;
  datasetCount: number;
  commitmentCount: number;
  verificationCount: number;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  datasetCount,
  commitmentCount,
  verificationCount,
}) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Hero Section */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -top-16 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 rounded-full">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-semibold text-cyan-300">Midnight Network Zero-Knowledge Proofs</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Prove AI Training Data Provenance <br />
            <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              Without Exposing Sensitive Datasets
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            BlackBox AI solves the regulatory compliance dilemma for AI enterprises. Prove 100% authorization,
            permissive licensing, and legal validity using Midnight's Compact smart contracts — keeping proprietary dataset contents strictly confidential.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => onNavigate('verify')}
              className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-500/25 transition-all glow-button"
            >
              <span>Run ZK Verification</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('registry')}
              className="flex items-center space-x-2 bg-slate-800/80 hover:bg-slate-700/80 border border-indigo-500/30 text-slate-200 text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              <Database className="w-4 h-4 text-cyan-400" />
              <span>Register Dataset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-5 border-l-4 border-l-cyan-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Registered Datasets</span>
            <Database className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-3xl font-mono font-bold text-white mt-2">{datasetCount}</p>
          <span className="text-xs text-slate-400 mt-1 block">Cryptographic commitments on-chain</span>
        </div>

        <div className="glass-card rounded-xl p-5 border-l-4 border-l-indigo-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Training Commitments</span>
            <Cpu className="w-5 h-5 text-indigo-400" />
          </div>
          <p className="text-3xl font-mono font-bold text-white mt-2">{commitmentCount}</p>
          <span className="text-xs text-slate-400 mt-1 block">AI model training runs bound</span>
        </div>

        <div className="glass-card rounded-xl p-5 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">ZK Verifications</span>
            <FileCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-mono font-bold text-white mt-2">{verificationCount}</p>
          <span className="text-xs text-slate-400 mt-1 block">Audits finalized with proof status</span>
        </div>
      </div>

      {/* Midnight Privacy Model: What Observer CAN vs CANNOT Learn */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Lock className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-bold text-white">Midnight Zero-Knowledge Privacy Model</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* What an observer CANNOT learn */}
          <div className="glass-card rounded-xl p-6 border border-rose-500/30 bg-gradient-to-b from-rose-950/10 to-transparent">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-rose-500/20 flex items-center justify-center text-rose-400">
                <EyeOff className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-rose-300">What an Observer CANNOT Learn</h3>
                <p className="text-xs text-slate-400">Strictly isolated inside private off-chain witnesses</p>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start space-x-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span><strong>Raw Training Data:</strong> Document text, images, proprietary code chunks.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span><strong>Confidential Licensing Terms:</strong> Commercial agreement contents and pricing.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span><strong>Dataset Composition Breakdown:</strong> Exactly which specific internal datasets contributed to which layer.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span><strong>Owner Identity Off-Chain:</strong> Real-world corporate identifiers remain shielded.</span>
              </li>
            </ul>
          </div>

          {/* What an observer CAN learn */}
          <div className="glass-card rounded-xl p-6 border border-emerald-500/30 bg-gradient-to-b from-emerald-950/10 to-transparent">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-emerald-300">What an Observer CAN Learn</h3>
                <p className="text-xs text-slate-400">Cryptographically verifiable on Midnight public ledger</p>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start space-x-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Verification Outcome:</strong> Definitive proof that model is <code className="text-emerald-300">COMPLIANT</code>.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Cryptographic Hash Commitments:</strong> One-way SHA-256 commitments linking dataset IDs.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Aggregate Percentage Compliance:</strong> % of authorized & licensed datasets in run.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Timestamp & Proof Validity:</strong> Exact ledger block time and mathematical proof presence.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 5 Compliance Rules Breakdown */}
      <div className="glass-card rounded-xl p-6 border border-indigo-500/30">
        <div className="flex items-center space-x-3 mb-4">
          <Layers className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-white">5 Core ZK Compliance Rules Evaluated</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
            <span className="text-cyan-400 font-bold font-mono">RULE 1</span>
            <p className="text-white font-medium mt-1">100% Authorized</p>
            <p className="text-slate-400 text-[11px] mt-0.5">All datasets must have active owner authorization.</p>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
            <span className="text-cyan-400 font-bold font-mono">RULE 2</span>
            <p className="text-white font-medium mt-1">≥95% Licensed</p>
            <p className="text-slate-400 text-[11px] mt-0.5">Commercial, Open Source, or Proprietary status.</p>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
            <span className="text-cyan-400 font-bold font-mono">RULE 3</span>
            <p className="text-white font-medium mt-1">Zero Restricted</p>
            <p className="text-slate-400 text-[11px] mt-0.5">Zero "No AI Training" datasets included in run.</p>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
            <span className="text-cyan-400 font-bold font-mono">RULE 4</span>
            <p className="text-white font-medium mt-1">Valid at Training Time</p>
            <p className="text-slate-400 text-[11px] mt-0.5">Licenses active during the actual model training window.</p>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
            <span className="text-cyan-400 font-bold font-mono">RULE 5</span>
            <p className="text-white font-medium mt-1">Owner Authorization</p>
            <p className="text-slate-400 text-[11px] mt-0.5">Cryptographic signature and permission verification.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
