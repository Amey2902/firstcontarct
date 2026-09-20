import { useCallback, useEffect, useState } from 'react';
import semver from 'semver';

export interface InitialAPI {
  name: string;
  icon: string;
  apiVersion: string;
  connect(networkId: string): Promise<ConnectedAPI>;
}

export interface ConnectedAPI {
  getUnshieldedAddress(): Promise<{ unshieldedAddress: string }>;
  getShieldedAddresses(): Promise<{ shieldedAddress: string }>;
  submitTx(tx: unknown): Promise<string>;
}

export type WalletType = 'lace' | '1am' | 'generic';
export type WalletStatus = 'disconnected' | 'detecting' | 'ready' | 'connecting' | 'connected' | 'error';

export interface SupportedWallet {
  id: WalletType;
  name: string;
  icon: string;
  installed: boolean;
  api?: InitialAPI;
  installUrl: string;
}

const NETWORK_ID = import.meta.env.VITE_NETWORK ?? 'preview';
const COMPATIBLE_CONNECTOR_API_VERSION = '4.x';

export function useMidnight() {
  const [status, setStatus] = useState<WalletStatus>('detecting');
  const [wallets, setWallets] = useState<SupportedWallet[]>([
    {
      id: 'lace',
      name: 'Midnight Lace Wallet',
      icon: '🛡️',
      installed: false,
      installUrl: 'https://chromewebstore.google.com/detail/lace/gafhhkghbfjjkeiendhlofajokpaflmk',
    },
    {
      id: '1am',
      name: '1AM Wallet',
      icon: '⚡',
      installed: false,
      installUrl: 'https://1am.xyz',
    },
  ]);
  const [activeWallet, setActiveWallet] = useState<ConnectedAPI | null>(null);
  const [activeWalletId, setActiveWalletId] = useState<WalletType | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const scanWallets = useCallback(() => {
    const midnight = (window as any).midnight;
    if (!midnight) {
      setWallets((prev) => prev.map((w) => ({ ...w, installed: false, api: undefined })));
      setStatus('disconnected');
      return;
    }

    const updated = wallets.map((w) => {
      let candidate: any = undefined;
      if (w.id === 'lace' && midnight.lace) {
        candidate = midnight.lace;
      } else if (w.id === '1am' && (midnight['1am'] || midnight.oneAm)) {
        candidate = midnight['1am'] || midnight.oneAm;
      } else {
        // Look for matching name in any injected wallet provider
        candidate = Object.values(midnight).find((item: any) =>
          typeof item?.name === 'string' && item.name.toLowerCase().includes(w.id)
        );
      }

      const isInstalled =
        !!candidate &&
        typeof candidate === 'object' &&
        'apiVersion' in candidate &&
        semver.satisfies((candidate as InitialAPI).apiVersion, COMPATIBLE_CONNECTOR_API_VERSION);

      return {
        ...w,
        installed: isInstalled,
        api: isInstalled ? (candidate as InitialAPI) : undefined,
      };
    });

    setWallets(updated);
    setStatus('ready');
  }, []);

  useEffect(() => {
    scanWallets();
    const interval = setInterval(scanWallets, 2000);
    return () => clearInterval(interval);
  }, [scanWallets]);

  const connect = useCallback(
    async (walletId: WalletType = 'lace') => {
      setError(null);
      setStatus('connecting');

      const target = wallets.find((w) => w.id === walletId);
      if (!target || !target.api) {
        setError(`Wallet "${walletId}" not detected. Please install and unlock the browser extension.`);
        setStatus('error');
        return;
      }

      try {
        const connected = await target.api.connect(NETWORK_ID);
        setActiveWallet(connected);
        setActiveWalletId(walletId);

        const { unshieldedAddress } = await connected.getUnshieldedAddress();
        setAddress(unshieldedAddress);
        setStatus('connected');
      } catch (err: any) {
        setError(err?.message || 'Failed to connect wallet.');
        setStatus('error');
      }
    },
    [wallets]
  );

  const disconnect = useCallback(() => {
    setActiveWallet(null);
    setActiveWalletId(null);
    setAddress(null);
    setStatus('disconnected');
    setError(null);
  }, []);

  return {
    status,
    wallets,
    activeWallet,
    activeWalletId,
    address,
    networkId: NETWORK_ID,
    error,
    connect,
    disconnect,
  };
}
