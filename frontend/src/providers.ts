/**
 * Browser providers for the DApp Connector (Midnight Lace wallet).
 *
 * Builds the provider set the contract needs: wallet, proof server, indexer,
 * zk-config, and private state. Mirrors the Node-side `createProviders` but
 * uses browser-native fetch/WebSocket and the DApp Connector wallet API.
 */
import { dappConnectorProofProvider } from '@midnight-ntwrk/midnight-js-dapp-connector-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { FetchZkConfigProvider } from '@midnight-ntwrk/midnight-js-fetch-zk-config-provider';
import type { Wallet, WalletConnectedAPI } from '@midnight-ntwrk/dapp-connector-api';
import { zkConfigPath } from './contract';
import type { CostModel, ProofProvider } from '@midnight-ntwrk/midnight-js-types';
import { browserPrivateStateProvider } from './browserPrivateStateProvider';

const INDEXER_URL = import.meta.env.VITE_INDEXER_URL ?? 'https://indexer.preview.midnight.network/api/v4/graphql';
const INDEXER_WS_URL = import.meta.env.VITE_INDEXER_WS_URL ?? 'wss://indexer.preview.midnight.network/api/v4/graphql/ws';
const PRIVATE_STATE_PASSWORD = import.meta.env.VITE_PRIVATE_STATE_PASSWORD ?? 'Local-Devnet-Development-Placeholder-1';

export interface BlackBoxProviders {
  privateStateProvider: ReturnType<typeof browserPrivateStateProvider>;
  publicDataProvider: ReturnType<typeof indexerPublicDataProvider>;
  zkConfigProvider: ReturnType<typeof FetchZkConfigProvider>;
  proofProvider: ProofProvider<'blackbox-ai'>;
  walletProvider: Wallet;
  midnightProvider: Wallet;
}

export async function createProviders(wallet: Wallet): Promise<BlackBoxProviders> {
  // Private state provider - uses IndexedDB in browser
  const privateStateProvider = browserPrivateStateProvider({
    privateStateStoreName: 'blackbox-ai-state',
    accountId: wallet.getAccountId(),
    privateStoragePasswordProvider: () => PRIVATE_STATE_PASSWORD,
  });

  // Public data provider - reads from indexer
  const publicDataProvider = indexerPublicDataProvider(INDEXER_URL, INDEXER_WS_URL);

  // ZK config provider - fetches verifier keys and zkIR from the deployed contract
  const zkConfigProvider = new FetchZkConfigProvider(zkConfigPath);

  // Proof provider - uses the DApp Connector's proof provider
  const connectedWallet = wallet as WalletConnectedAPI;
  const proofProvider = await dappConnectorProofProvider(connectedWallet, zkConfigProvider, {} as CostModel);

  return {
    privateStateProvider,
    publicDataProvider,
    zkConfigProvider,
    proofProvider,
    walletProvider: wallet,
    midnightProvider: wallet,
  };
}