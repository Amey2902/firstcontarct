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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#0f172a] border border-indigo-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Connect Midnight Wallet</h3>
            <p className="text-xs text-slate-400">Select an official Midnight-compatible wallet</p>
          </div>
        </div>

        <div className="space-y-3">
          {wallets.map((wallet) => (
            <div
              key={wallet.id}
              className={`p-4 rounded-xl border transition-all flex items-center justify-between ${
                wallet.installed
                  ? 'border-indigo-500/30 bg-slate-900/60 hover:bg-slate-800/80 hover:border-indigo-500/60 cursor-pointer'
                  : 'border-slate-800 bg-slate-900/30 opacity-70'
              }`}
              onClick={() => {
                if (wallet.installed && !isConnecting) {
                  onConnect(wallet.id);
                  onClose();
                }
              }}
            >
              <div className="flex items-center space-x-3.5">
                <span className="text-2xl">{wallet.icon}</span>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-sm text-white">{wallet.name}</h4>
                    {wallet.installed && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded">
                        Installed
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">
                    {wallet.id === 'lace' ? 'Official IOG Midnight Lace Extension' : 'Fast 1AM DApp Connector'}
                  </p>
                </div>
              </div>

              {wallet.installed ? (
                <button
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                  disabled={isConnecting}
                >
                  {isConnecting ? 'Connecting...' : 'Connect'}
                </button>
              ) : (
                <a
                  href={wallet.installUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-xs text-cyan-400 hover:text-cyan-300 font-medium"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span>Install</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400">
            Powered by the <span className="text-indigo-300 font-semibold">Midnight DApp Connector API v4</span>
          </p>
        </div>
      </div>
    </div>
  );
};
