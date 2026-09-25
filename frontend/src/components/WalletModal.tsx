import React from 'react';
import { X, ExternalLink, ShieldCheck, Zap, Sparkles, Check, AlertCircle } from 'lucide-react';
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

  const oneAmWallet = wallets.find((w) => w.id === '1am');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-headline font-bold text-slate-900">Connect Midnight Wallet</h3>
            <p className="text-xs text-slate-500">Every transaction triggers your wallet extension for signature confirmation</p>
          </div>
        </div>

        {/* 1AM Wallet Featured Banner */}
        <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-emerald-950 font-bold">
              <span className="text-base">🔐</span>
              <span>1AM Wallet Pop-up Confirmation</span>
            </div>
            {oneAmWallet?.installed ? (
              <span className="text-[10px] font-mono bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-bold">
                Extension Detected
              </span>
            ) : (
              <a
                href="https://1am.xyz"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] font-mono bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded font-semibold flex items-center space-x-1"
              >
                <span>Install 1AM</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
          <p className="text-[11px] text-emerald-800 mt-1.5 leading-relaxed">
            When 1AM is connected, clicking any action (Register Dataset, Toggle Authorization, Run Audit) will trigger 1AM's native browser pop-up to sign and confirm the transaction.
          </p>
        </div>

        <div className="space-y-3">
          {wallets.map((wallet) => (
            <div
              key={wallet.id}
              className={`p-3.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                wallet.id === '1am'
                  ? 'border-emerald-300 bg-emerald-50/30 hover:border-emerald-500 hover:bg-emerald-50/70 shadow-xs'
                  : 'border-slate-200 bg-slate-50/70 hover:border-slate-300 hover:bg-slate-100/70'
              }`}
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
                    {wallet.id === '1am' && (
                      <span className="text-[9px] font-mono bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded font-semibold">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                    {wallet.description}
                  </p>
                </div>
              </div>

              <div className="flex-shrink-0 ml-3">
                {wallet.installed ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onConnect(wallet.id);
                      onClose();
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-xs cursor-pointer"
                    disabled={isConnecting}
                  >
                    {isConnecting ? 'Connecting...' : 'Connect'}
                  </button>
                ) : (
                  <a
                    href={wallet.installUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center space-x-1 text-slate-600 hover:text-emerald-700 text-xs font-mono font-semibold px-2.5 py-1.5 rounded-lg border border-slate-300 hover:border-emerald-500 bg-white"
                  >
                    <span>Install</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>Midnight DApp Connector API v4</span>
          <span className="text-emerald-700 font-medium">Preprod Testnet</span>
        </div>
      </div>
    </div>
  );
};
