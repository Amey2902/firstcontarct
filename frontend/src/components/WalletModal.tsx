import React from 'react';
import { X, ExternalLink, ShieldCheck, Zap } from 'lucide-react';
import { SupportedWallet, WalletType } from '../hooks/useMidnight';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallets: SupportedWallet[];
  onConnect: (walletId: WalletType) => void;
  isConnecting: boolean;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  wallets,
  onConnect,
  isConnecting,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#111827] border border-[#1F2937] rounded-lg max-w-md w-full p-6 shadow-2xl relative glow-emerald">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#9CA3AF] hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-[#162032] border border-[#1F2937] flex items-center justify-center text-[#10B981]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-headline font-bold text-white">Connect Midnight Wallet</h3>
            <p className="text-[11px] text-[#9CA3AF]">Select an official Midnight-compatible wallet</p>
          </div>
        </div>

        <div className="space-y-3">
          {wallets.map((wallet) => (
            <div
              key={wallet.id}
              className={`p-3.5 rounded border transition-all flex items-center justify-between ${
                wallet.installed
                  ? 'border-[#1F2937] bg-[#162032] hover:border-[#10B981]/50 hover:bg-[#1C2028] cursor-pointer'
                  : 'border-[#1F2937] bg-[#0B0F17]/50 opacity-60'
              }`}
              onClick={() => {
                if (wallet.installed && !isConnecting) {
                  onConnect(wallet.id);
                  onClose();
                }
              }}
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">{wallet.icon}</span>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-headline font-semibold text-xs text-white">{wallet.name}</h4>
                    {wallet.installed && (
                      <span className="text-[10px] font-mono bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30 px-1.5 py-0.2 rounded">
                        Installed
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#9CA3AF] font-mono">
                    {wallet.id === 'lace' ? 'Official Midnight Lace Extension' : 'Fast 1AM DApp Connector'}
                  </p>
                </div>
              </div>

              {wallet.installed ? (
                <button
                  className="bg-[#10B981] hover:bg-[#059669] text-[#0B0F17] text-xs font-mono font-semibold px-3 py-1.5 rounded transition-colors"
                  disabled={isConnecting}
                >
                  {isConnecting ? 'Connecting...' : 'Connect'}
                </button>
              ) : (
                <a
                  href={wallet.installUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-xs text-[#06B6D4] hover:text-[#4cd7f6] font-mono"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span>Install</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-[#1F2937] text-center">
          <p className="text-[11px] font-mono text-[#9CA3AF]">
            Powered by <span className="text-[#10B981] font-semibold">Midnight DApp Connector API v4</span>
          </p>
        </div>
      </div>
    </div>
  );
};
