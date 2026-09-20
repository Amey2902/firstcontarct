import React from 'react';
import { Shield, Database, CheckCircle2, History, Wallet, ExternalLink } from 'lucide-react';
import { SupportedWallet, WalletStatus } from '../hooks/useMidnight';

interface NavbarProps {
  activeTab: 'dashboard' | 'registry' | 'verify' | 'audit';
  setActiveTab: (tab: 'dashboard' | 'registry' | 'verify' | 'audit') => void;
  status: WalletStatus;
  address: string | null;
  onOpenWalletModal: () => void;
  onDisconnect: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  status,
  address,
  onOpenWalletModal,
  onDisconnect,
}) => {
  const truncAddr = (addr: string) => `${addr.slice(0, 8)}...${addr.slice(-6)}`;

  return (
    <header className="border-b border-indigo-500/20 bg-[#070b14]/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight text-white">BLACKBOX<span className="text-cyan-400">.AI</span></span>
              <span className="text-[10px] uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-mono font-semibold">
                Midnight ZK
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Private AI Training Data Provenance</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-indigo-600/20 text-cyan-300 border border-indigo-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('registry')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'registry'
                ? 'bg-indigo-600/20 text-cyan-300 border border-indigo-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Dataset Registry</span>
          </button>

          <button
            onClick={() => setActiveTab('verify')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'verify'
                ? 'bg-indigo-600/20 text-cyan-300 border border-indigo-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Compliance Verification</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'audit'
                ? 'bg-indigo-600/20 text-cyan-300 border border-indigo-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Audit Ledger</span>
          </button>
        </nav>

        {/* Wallet Connector */}
        <div className="flex items-center space-x-3">
          {status === 'connected' && address ? (
            <div className="flex items-center space-x-2 bg-slate-900 border border-indigo-500/30 px-3 py-1.5 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-xs text-slate-200">{truncAddr(address)}</span>
              <button
                onClick={onDisconnect}
                className="text-xs text-slate-400 hover:text-rose-400 ml-2 transition-colors"
                title="Disconnect Wallet"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenWalletModal}
              className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg shadow-lg shadow-indigo-500/25 transition-all glow-button"
            >
              <Wallet className="w-4 h-4" />
              <span>Connect Wallet</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
