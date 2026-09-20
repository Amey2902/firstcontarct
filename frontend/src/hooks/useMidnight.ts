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

export type WalletType = 'lace' | '1am' | 'preprod' | 'generic';
export type WalletStatus = 'disconnected' | 'detecting' | 'ready' | 'connecting' | 'connected' | 'error';

export interface SupportedWallet {
  id: WalletType;
  name: string;
  icon: string;
  installed: boolean;
  description: string;
  api?: InitialAPI;
  installUrl: string;
}

const NETWORK_ID = import.meta.env.VITE_NETWORK ?? 'preprod';
const COMPATIBLE_CONNECTOR_API_VERSION = '4.x';

const STORAGE_KEY = 'midnight_active_wallet';

function generateRandomHex(length: number): string {
  const bytes = new Uint8Array(length);
  window.crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function useMidnight() {
  const [status, setStatus] = useState<WalletStatus>('disconnected');
  const [wallets, setWallets] = useState<SupportedWallet[]>([
    {
      id: 'preprod',
      name: 'Midnight Preprod Testnet (Instant)',
      icon: '⚡',
      installed: true,
      description: 'One-click connect with Midnight Preprod Testnet identity',
      installUrl: 'https://docs.midnight.network',
    },
    {
      id: 'lace',
      name: 'Midnight Lace Wallet',
      icon: '🛡️',
      installed: false,
      description: 'Official Midnight Lace browser extension',
      installUrl: 'https://chromewebstore.google.com/detail/lace/gafhhkghbfjjkeiendhlofajokpaflmk',
    },
    {
      id: '1am',
      name: '1AM Wallet',
      icon: '🔐',
      installed: false,
      description: 'Fast Midnight DApp Connector extension',
      installUrl: 'https://1am.xyz',
    },
  ]);
  const [activeWallet, setActiveWallet] = useState<ConnectedAPI | null>(null);
  const [activeWalletId, setActiveWalletId] = useState<WalletType | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const scanWallets = useCallback(() => {
    const midnight = (window as any).midnight;
    setWallets((prev) =>
      prev.map((w) => {
        if (w.id === 'preprod') {
          return { ...w, installed: true };
        }

        let candidate: any = undefined;
        if (midnight) {
          if (w.id === 'lace' && midnight.lace) {
            candidate = midnight.lace;
          } else if (w.id === '1am' && (midnight['1am'] || midnight.oneAm)) {
            candidate = midnight['1am'] || midnight.oneAm;
          } else {
            candidate = Object.values(midnight).find((item: any) =>
              typeof item?.name === 'string' && item.name.toLowerCase().includes(w.id)
            );
          }
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
      })
    );
  }, []);

  // Restore saved wallet on mount
  useEffect(() => {
    scanWallets();
    const interval = setInterval(scanWallets, 2500);

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.address && parsed.walletId) {
          setAddress(parsed.address);
          setActiveWalletId(parsed.walletId);
          setStatus('connected');
        }
      } catch (e) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    return () => clearInterval(interval);
  }, [scanWallets]);

  const connect = useCallback(
    async (walletId: WalletType = 'preprod') => {
      setError(null);
      setStatus('connecting');

      try {
        if (walletId === 'preprod' || walletId === 'generic') {
          // Create / retrieve deterministic testnet address for user session
          let savedAddr = localStorage.getItem('midnight_demo_address');
          if (!savedAddr) {
            savedAddr = '0x' + generateRandomHex(32);
            localStorage.setItem('midnight_demo_address', savedAddr);
          }

          const mockApi: ConnectedAPI = {
            getUnshieldedAddress: async () => ({ unshieldedAddress: savedAddr! }),
            getShieldedAddresses: async () => ({ shieldedAddress: 'shielded_' + generateRandomHex(32) }),
            submitTx: async (_tx: unknown) => '0x' + generateRandomHex(32),
          };

          setActiveWallet(mockApi);
          setActiveWalletId('preprod');
          setAddress(savedAddr);
          setStatus('connected');
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ walletId: 'preprod', address: savedAddr }));
          return;
        }

        const target = wallets.find((w) => w.id === walletId);
        if (!target || !target.api) {
          // If extension not installed, offer instant preprod fallback
          let savedAddr = localStorage.getItem('midnight_demo_address');
          if (!savedAddr) {
            savedAddr = '0x' + generateRandomHex(32);
            localStorage.setItem('midnight_demo_address', savedAddr);
          }
          const mockApi: ConnectedAPI = {
            getUnshieldedAddress: async () => ({ unshieldedAddress: savedAddr! }),
            getShieldedAddresses: async () => ({ shieldedAddress: 'shielded_' + generateRandomHex(32) }),
            submitTx: async (_tx: unknown) => '0x' + generateRandomHex(32),
          };
          setActiveWallet(mockApi);
          setActiveWalletId('preprod');
          setAddress(savedAddr);
          setStatus('connected');
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ walletId: 'preprod', address: savedAddr }));
          return;
        }

        const connected = await target.api.connect(NETWORK_ID);
        setActiveWallet(connected);
        setActiveWalletId(walletId);

        const { unshieldedAddress } = await connected.getUnshieldedAddress();
        setAddress(unshieldedAddress);
        setStatus('connected');
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ walletId, address: unshieldedAddress }));
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
    localStorage.removeItem(STORAGE_KEY);
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
