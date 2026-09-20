/**
 * Network configuration and state for Midnight.
 * Supports: undeployed (local devnet), preview, preprod.
 */
import * as fs from 'node:fs';
import * as path from 'node:path';

export interface NetworkConfig {
  name: string;
  networkId: string;
  indexerUrl: string;
  indexerWsUrl: string;
  nodeUrl: string;
  proofServerUrl: string;
  faucetUrl?: string;
}

export const NETWORKS: Record<string, NetworkConfig> = {
  undeployed: {
    name: 'undeployed',
    networkId: 'undeployed',
    indexerUrl: 'http://127.0.0.1:8088/api/v1/graphql',
    indexerWsUrl: 'ws://127.0.0.1:8088/api/v1/graphql/ws',
    nodeUrl: 'http://127.0.0.1:9944',
    proofServerUrl: 'http://127.0.0.1:6300',
  },
  preview: {
    name: 'preview',
    networkId: 'preview',
    indexerUrl: 'https://indexer.preview.midnight.network/api/v4/graphql',
    indexerWsUrl: 'wss://indexer.preview.midnight.network/api/v4/graphql/ws',
    nodeUrl: 'https://rpc.preview.midnight.network',
    proofServerUrl: 'http://127.0.0.1:6300',
    faucetUrl: 'https://faucet.preview.midnight.network',
  },
  preprod: {
    name: 'preprod',
    networkId: 'preprod',
    indexerUrl: 'https://indexer.preprod.midnight.network/api/v4/graphql',
    indexerWsUrl: 'wss://indexer.preprod.midnight.network/api/v4/graphql/ws',
    nodeUrl: 'https://rpc.preprod.midnight.network',
    proofServerUrl: 'http://127.0.0.1:6300',
    faucetUrl: 'https://faucet.preprod.midnight.network',
  },
};

const STATE_FILE = path.resolve(process.cwd(), '.midnight-state.json');

export interface DeploymentState {
  network: string;
  contractAddress?: string;
  deployedAt?: string;
}

export function loadDeploymentState(): DeploymentState {
  if (fs.existsSync(STATE_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    } catch {
      // ignore
    }
  }
  return { network: 'undeployed' };
}

export function saveDeploymentState(state: DeploymentState): void {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
}

export function getActiveNetwork(): NetworkConfig {
  const envNet = process.env.MIDNIGHT_NETWORK;
  if (envNet && NETWORKS[envNet]) {
    return NETWORKS[envNet];
  }
  const state = loadDeploymentState();
  return NETWORKS[state.network] || NETWORKS.undeployed;
}
