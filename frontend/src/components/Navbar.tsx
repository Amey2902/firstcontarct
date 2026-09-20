import React from 'react';
import { Shield, Database, CheckCircle2, History, Wallet, ExternalLink } from 'lucide-react';
import { SupportedWallet, WalletStatus } from '../hooks/useMidnight';

export type ViewType = 'dashboard' | 'registry' | 'verify' | 'history';

interface NavbarProps {
  activeView: ViewType;
  onSelectView: (view: ViewType) => void;
  walletState: {
    status: WalletStatus;
    address: string | null;
  };
  onOpenWalletModal: () => void;
  onDisconnect: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  onSelectView,
  walletState,
  onOpenWalletModal,
  onDisconnect,
}) => {
  const { status, address } = walletState;
  const truncAddr = (addr: string) => `${addr.slice(0, 8)}...${addr.slice(-6)}`;

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectView('dashboard')}>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center glow-emerald">
            <Shield className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-headline font-bold text-base sm:text-lg tracking-tight text-slate-900">
                BLACKBOX<span className="text-cyan-600"> AI</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-mono font-semibold">
                Midnight ZK
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">Private AI Training Data Provenance</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1">
          <button
            onClick={() => onSelectView('dashboard')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeView === 'dashboard'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => onSelectView('registry')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeView === 'registry'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Database className="w-4 h-4 text-emerald-600" />
            <span>Dataset Commitments</span>
          </button>

          <button
            onClick={() => onSelectView('verify')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeView === 'verify'
                ? 'bg-cyan-50 text-cyan-800 border border-cyan-200 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-cyan-600" />
            <span>ZK Verifier</span>
          </button>

          <button
            onClick={() => onSelectView('history')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeView === 'history'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <History className="w-4 h-4 text-emerald-600" />
            <span>Audit Trail</span>
          </button>
        </nav>

        {/* Network & Wallet Connector */}
        <div className="flex items-center space-x-3">
          <div className="hidden lg:flex items-center space-x-1.5 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded text-[11px] font-mono text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold">Preprod</span>
          </div>

          {status === 'connected' && address ? (
            <div className="flex items-center space-x-2 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-md shadow-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-xs text-slate-800 font-semibold">{truncAddr(address)}</span>
              <button
                onClick={onDisconnect}
                className="text-[11px] text-slate-400 hover:text-red-600 ml-2 transition-colors font-mono cursor-pointer"
                title="Disconnect Wallet"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenWalletModal}
              className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-md transition-all shadow-xs glow-button font-mono cursor-pointer"
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
