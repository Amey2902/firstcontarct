/**
 * Midnight.js providers setup for Node CLI, tests, and deployment.
 */
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import * as path from 'node:path';
import { getActiveNetwork } from './network.js';

export async function createNodeProviders(wallet: any) {
  const network = getActiveNetwork();
  setNetworkId(network.networkId as any);

  const zkConfigPath = path.resolve(process.cwd(), 'contracts/managed/blackbox-ai');
  const zkConfigProvider = new NodeZkConfigProvider<string>(zkConfigPath);
  const proofProvider = httpClientProofProvider(network.proofServerUrl, zkConfigProvider);
  const publicDataProvider = indexerPublicDataProvider(network.indexerUrl, network.indexerWsUrl);

  const privateStateDir = path.resolve(process.cwd(), '.midnight-private-state');
  const privateStateProvider = levelPrivateStateProvider<any>({
    privateStateStoreName: privateStateDir,
  });

  return {
    privateStateProvider,
    publicDataProvider,
    zkConfigProvider,
    proofProvider,
    walletProvider: wallet,
    midnightProvider: wallet,
  };
}
