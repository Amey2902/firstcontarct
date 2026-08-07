import { useCallback, useEffect, useRef, useState } from 'react';
import semver from 'semver';
import type { ConnectedAPI, InitialAPI } from '@midnight-ntwrk/dapp-connector-api';

export type WalletStatus = 'detecting' | 'no-wallet' | 'ready' | 'connecting' | 'connected';

// `VITE_NETWORK` is the canonical setting required by the bootcamp; the legacy
// `VITE_NETWORK_ID` remains supported for backwards compatibility.
const NETWORK_ID = import.meta.env.VITE_NETWORK ?? import.meta.env.VITE_NETWORK_ID ?? 'preview';
const COMPATIBLE_CONNECTOR_API_VERSION = '4.x';

function findWallet(): InitialAPI | undefined {
  const midnight = (window as any).midnight;
  if (!midnight) return undefined;
  return Object.values(midnight).find(
    (w): w is InitialAPI =>
      !!w &&
      typeof w === 'object' &&
      'apiVersion' in w &&
      semver.satisfies((w as InitialAPI).apiVersion, COMPATIBLE_CONNECTOR_API_VERSION),
  );
}

export function useMidnight() {
  const [status, setStatus] = useState<WalletStatus>('detecting');
  const [walletAPI, setWalletAPI] = useState<InitialAPI | undefined>();
  const [wallet, setWallet] = useState<ConnectedAPI | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const found = findWallet();
    if (found) {
      setWalletAPI(found);
      setStatus('ready');
      return;
    }
    let elapsed = 0;
    timerRef.current = setInterval(() => {
      elapsed += 100;
      const w = findWallet();
      if (w) {
        setWalletAPI(w);
        setStatus('ready');
        if (timerRef.current) clearInterval(timerRef.current);
      } else if (elapsed >= 5000) {
        setStatus('no-wallet');
        if (timerRef.current) clearInterval(timerRef.current);
      }
    }, 100);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const connect = useCallback(async () => {
    if (!walletAPI) return;
    setStatus('connecting');
    setError(null);
    try {
      const connected = await walletAPI.connect(NETWORK_ID);
      setWallet(connected);
      const { unshieldedAddress } = await connected.getUnshieldedAddress();
      setAddress(unshieldedAddress);
      setStatus('connected');
    } catch (e: any) {
      setError(extractErrorMessage(e));
      setStatus('ready');
    }
  }, [walletAPI]);

  const disconnect = useCallback(() => {
    setWallet(null);
    setAddress(null);
    setStatus('ready');
    setError(null);
  }, []);

  return { status, wallet, walletAPI, address, error, connect, disconnect, networkId: NETWORK_ID };
}

function extractErrorMessage(e: any): string {
  if (!e) return 'Unknown wallet error';
  if (e.message && e.message !== '') return e.message;
  const failure = e?.cause?.failure;
  if (failure?.message) return failure.message;
  if (failure?.cause?.message) return failure.cause.message;
  if (e?.cause?.message) return e.cause.message;
  try {
    return JSON.stringify(e);
  } catch {
    return String(e);
  }
}
