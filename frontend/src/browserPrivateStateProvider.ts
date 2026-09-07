/**
 * Browser-compatible private state provider using IndexedDB.
 * Replaces level-based provider which has issues with Vite/browser bundling.
 */
import type { PrivateStateProvider } from '@midnight-ntwrk/midnight-js-types';
import type { ContractAddress } from '@midnight-ntwrk/midnight-js-protocol/compact-runtime';

const DB_NAME = 'blackbox-ai-private-state';
const STORE_NAME = 'private-states';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
}

export function browserPrivateStateProvider(_config: {
  privateStateStoreName: string;
  accountId: string;
  privateStoragePasswordProvider: () => string;
}): PrivateStateProvider<string> {
  let contractAddress: string | undefined;

  function scopedKey(key: string): string {
    return contractAddress ? `${contractAddress}:${key}` : key;
  }

  async function idbGet(key: string): Promise<any> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result ?? null);
      req.onerror = () => reject(req.error);
    });
  }

  async function idbSet(key: string, value: any): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(value, key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async function idbDelete(key: string): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  const provider: PrivateStateProvider<string> = {
    setContractAddress(address: ContractAddress): void {
      contractAddress = typeof address === 'string' ? address : (address as any).toString();
    },

    async get(privateStateId: string): Promise<any> {
      return idbGet(scopedKey(privateStateId));
    },

    async set(privateStateId: string, state: any): Promise<void> {
      return idbSet(scopedKey(privateStateId), state);
    },

    async remove(privateStateId: string): Promise<void> {
      return idbDelete(scopedKey(privateStateId));
    },

    async clear(): Promise<void> {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).clear();
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    },

    async setSigningKey(address: ContractAddress, signingKey: any): Promise<void> {
      return idbSet(`signingKey:${String(address)}`, signingKey);
    },

    async getSigningKey(address: ContractAddress): Promise<any> {
      return idbGet(`signingKey:${String(address)}`);
    },

    async removeSigningKey(address: ContractAddress): Promise<void> {
      return idbDelete(`signingKey:${String(address)}`);
    },

    async clearSigningKeys(): Promise<void> {
      // No-op for simplicity — full implementation would filter by prefix
    },

    async exportPrivateStates(): Promise<any> {
      throw new Error('exportPrivateStates not implemented in browser provider');
    },

    async importPrivateStates(): Promise<any> {
      throw new Error('importPrivateStates not implemented in browser provider');
    },

    async exportSigningKeys(): Promise<any> {
      throw new Error('exportSigningKeys not implemented in browser provider');
    },

    async importSigningKeys(): Promise<any> {
      throw new Error('importSigningKeys not implemented in browser provider');
    },
  };

  return provider;
}
