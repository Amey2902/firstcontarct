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
    <header className="border-b border-[#1F2937] bg-[#0B0F17]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectView('dashboard')}>
          <div className="w-10 h-10 rounded-lg bg-[#111827] border border-[#1F2937] flex items-center justify-center glow-emerald">
            <Shield className="w-5 h-5 text-[#10B981]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-headline font-bold text-base sm:text-lg tracking-tight text-white">
                BLACKBOX<span className="text-[#06B6D4]"> AI</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30 px-2 py-0.5 rounded font-mono font-semibold">
                Midnight ZK
              </span>
            </div>
            <p className="text-[11px] text-[#9CA3AF] hidden sm:block">Private AI Training Data Provenance</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1">
          <button
            onClick={() => onSelectView('dashboard')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              activeView === 'dashboard'
                ? 'bg-[#162032] text-[#10B981] border border-[#10B981]/30 glow-emerald'
                : 'text-[#9CA3AF] hover:text-white hover:bg-[#111827]'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => onSelectView('registry')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              activeView === 'registry'
                ? 'bg-[#162032] text-[#10B981] border border-[#10B981]/30 glow-emerald'
                : 'text-[#9CA3AF] hover:text-white hover:bg-[#111827]'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Dataset Commitments</span>
          </button>

          <button
            onClick={() => onSelectView('verify')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              activeView === 'verify'
                ? 'bg-[#162032] text-[#06B6D4] border border-[#06B6D4]/30 glow-cyan'
                : 'text-[#9CA3AF] hover:text-white hover:bg-[#111827]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>ZK Verifier</span>
          </button>

          <button
            onClick={() => onSelectView('history')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              activeView === 'history'
                ? 'bg-[#162032] text-[#10B981] border border-[#10B981]/30 glow-emerald'
                : 'text-[#9CA3AF] hover:text-white hover:bg-[#111827]'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Audit Trail</span>
          </button>
        </nav>

        {/* Network & Wallet Connector */}
        <div className="flex items-center space-x-3">
          <div className="hidden lg:flex items-center space-x-1.5 bg-[#111827] border border-[#1F2937] px-2.5 py-1 rounded text-[11px] font-mono text-[#9CA3AF]">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
            <span>Preprod</span>
          </div>

          {status === 'connected' && address ? (
            <div className="flex items-center space-x-2 bg-[#111827] border border-[#1F2937] px-3 py-1.5 rounded">
              <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span className="font-mono text-xs text-[#F9FAFB]">{truncAddr(address)}</span>
              <button
                onClick={onDisconnect}
                className="text-[11px] text-[#9CA3AF] hover:text-[#EF4444] ml-2 transition-colors font-mono"
                title="Disconnect Wallet"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenWalletModal}
              className="flex items-center space-x-2 bg-[#10B981] hover:bg-[#059669] text-[#0B0F17] text-xs font-semibold px-4 py-2 rounded transition-all glow-button font-mono"
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
