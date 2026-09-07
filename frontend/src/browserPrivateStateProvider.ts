/**
 * Browser-compatible private state provider using IndexedDB.
 * Replaces level-based provider which has issues with Vite/browser bundling.
 */
import type { PrivateStateProvider } from '@midnight-ntwrk/midnight-js-types';

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

export function browserPrivateStateProvider(config: {
  privateStateStoreName: string;
  accountId: string;
  privateStoragePasswordProvider: () => string;
}): PrivateStateProvider<Record<string, unknown>> {
  const storeName = config.privateStateStoreName;
  const accountId = config.accountId;

  async function getState(): Promise<Record<string, unknown>> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(`${storeName}-${accountId}`);
      request.onsuccess = () => resolve(request.result?.data ?? {});
      request.onerror = () => reject(request.error);
    });
  }

  async function setState(state: Record<string, unknown>): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.put({ data: state }, `${storeName}-${accountId}`);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  return {
    get: async (key: string) => {
      const state = await getState();
      return state[key];
    },
    set: async (key: string, value: unknown) => {
      const state = await getState();
      state[key] = value;
      await setState(state);
    },
    delete: async (key: string) => {
      const state = await getState();
      delete state[key];
      await setState(state);
    },
    clear: async () => {
      await setState({});
    },
    keys: async () => {
      const state = await getState();
      return Object.keys(state);
    },
  };
}