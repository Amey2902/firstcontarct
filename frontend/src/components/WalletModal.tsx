import React from 'react';
import { X, ExternalLink, ShieldCheck, Zap, Sparkles, Check } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 shadow-2xl relative glow-emerald">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-headline font-bold text-slate-900">Connect Midnight Wallet</h3>
            <p className="text-[11px] text-slate-500">Choose your preferred connection method</p>
          </div>
        </div>

        {/* Instant Connect Banner */}
        <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-emerald-900 font-semibold">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Instant Testnet Access</span>
            </div>
            <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
              Ready
            </span>
          </div>
          <p className="text-[11px] text-emerald-800 mt-1">
            Explore BlackBox AI immediately with deterministic Midnight Preprod credentials.
          </p>
        </div>

        <div className="space-y-2.5">
          {wallets.map((wallet) => (
            <div
              key={wallet.id}
              className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70 hover:border-emerald-400 hover:bg-emerald-50/40 transition-all flex items-center justify-between cursor-pointer"
              onClick={() => {
                if (!isConnecting) {
                  onConnect(wallet.id);
                  onClose();
                }
              }}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{wallet.icon}</span>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-headline font-bold text-xs text-slate-900">{wallet.name}</h4>
                    {wallet.installed && (
                      <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-300 px-1.5 py-0.2 rounded font-semibold">
                        Ready
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                    {wallet.description}
                  </p>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onConnect(wallet.id);
                    onClose();
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-semibold px-3 py-1.5 rounded-md transition-colors shadow-xs cursor-pointer"
                  disabled={isConnecting}
                >
                  {isConnecting ? 'Connecting...' : 'Connect'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-4 border-t border-slate-200 text-center">
          <p className="text-[11px] font-mono text-slate-500">
            Powered by <span className="text-emerald-700 font-bold">Midnight DApp Connector API v4</span>
          </p>
        </div>
      </div>
    </div>
  );
};
