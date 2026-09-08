/**
 * Browser providers wired to the Midnight DApp Connector (Lace wallet).
 */
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { FetchZkConfigProvider } from '@midnight-ntwrk/midnight-js-fetch-zk-config-provider';
import type { ConnectedAPI } from '@midnight-ntwrk/dapp-connector-api';
import { toHex, fromHex, parseCoinPublicKeyToHex, parseEncPublicKeyToHex } from '@midnight-ntwrk/midnight-js-utils';
import { Transaction } from '@midnight-ntwrk/midnight-js-types';
import { getNetworkId, setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { zkConfigPath } from './contract';
import type { PrivateStateProvider, WalletProvider, MidnightProvider, ProofProvider } from '@midnight-ntwrk/midnight-js-types';
import { browserPrivateStateProvider } from './browserPrivateStateProvider';

const INDEXER_URL    = import.meta.env.VITE_INDEXER_URL    ?? 'https://indexer.preview.midnight.network/api/v4/graphql';
const INDEXER_WS_URL = import.meta.env.VITE_INDEXER_WS_URL ?? 'wss://indexer.preview.midnight.network/api/v4/graphql/ws';
const PRIVATE_STATE_PASSWORD = import.meta.env.VITE_PRIVATE_STATE_PASSWORD ?? 'Local-Devnet-Development-Placeholder-1';
const PROOF_SERVER_URL = import.meta.env.VITE_PROOF_SERVER_URL ?? 'http://localhost:6300';
const NETWORK = import.meta.env.VITE_NETWORK ?? 'preview';

export interface BlackBoxProviders {
  privateStateProvider: PrivateStateProvider<string>;
  publicDataProvider:   ReturnType<typeof indexerPublicDataProvider>;
  zkConfigProvider:     InstanceType<typeof FetchZkConfigProvider<string>>;
  proofProvider:        ProofProvider;
  walletProvider:       WalletProvider;
  midnightProvider:     MidnightProvider;
}

export async function createProviders(wallet: ConnectedAPI): Promise<BlackBoxProviders> {
  // ── Set network ID (must be called before any SDK operation) ────────────
  setNetworkId(NETWORK as any);

  // ── ZK config provider ──────────────────────────────────────────────────
  const zkBaseUrl = `${window.location.origin}${zkConfigPath}`;
  const zkConfigProvider = new FetchZkConfigProvider<string>(zkBaseUrl, fetch.bind(window));

  // ── Proof provider — use httpClientProofProvider to talk directly to proof server
  // This avoids the wallet's getProvingProvider() which uses a different check format
  const proofProvider = httpClientProofProvider(PROOF_SERVER_URL, zkConfigProvider);

  // ── Shielded keys (fetched once, cached) ────────────────────────────────
  const shieldedAddr = await wallet.getShieldedAddresses();
  if (!shieldedAddr) throw new Error('No shielded address found in wallet');
  const coinPublicKey = parseCoinPublicKeyToHex(shieldedAddr.shieldedCoinPublicKey, getNetworkId());
  const encPublicKey  = parseEncPublicKeyToHex(shieldedAddr.shieldedEncryptionPublicKey, getNetworkId());

  // ── WalletProvider adapter ───────────────────────────────────────────────
  // The SDK calls getCoinPublicKey() / getEncryptionPublicKey() synchronously
  // and balanceTx(unboundTx) to finalize a proved transaction.
  const walletProvider: WalletProvider = {
    getCoinPublicKey:        () => coinPublicKey as any,
    getEncryptionPublicKey:  () => encPublicKey  as any,

    async balanceTx(tx: any, _ttl?: Date): Promise<any> {
      // Serialize the UnboundTransaction (Transaction<SignatureEnabled, Proof, PreBinding>)
      // to hex, send to the wallet for balancing, then deserialize back.
      const serialized  = toHex(tx.serialize());
      const { tx: balanced } = await wallet.balanceUnsealedTransaction(serialized);
      // Deserialize the balanced+finalized hex back to a FinalizedTransaction object
      return (Transaction as any).deserialize(
        'signature', 'proof', 'binding',
        fromHex(balanced),
      );
    },
  };

  // ── MidnightProvider adapter ─────────────────────────────────────────────
  const midnightProvider: MidnightProvider = {
    async submitTx(tx: any): Promise<any> {
      const serialized = toHex(tx.serialize());
      await wallet.submitTransaction(serialized);
      return serialized; // tx id is not returned by the DApp Connector
    },
  };

  // ── Private state provider ───────────────────────────────────────────────
  const unshieldedResult = await wallet.getUnshieldedAddress().catch(() => null) as any;
  const accountId = unshieldedResult?.unshieldedAddress ?? shieldedAddr.shieldedAddress;

  const privateStateProvider = browserPrivateStateProvider({
    privateStateStoreName: 'blackbox-ai-state',
    accountId,
    privateStoragePasswordProvider: () => PRIVATE_STATE_PASSWORD,
  });

  // ── Public data provider ─────────────────────────────────────────────────
  const publicDataProvider = indexerPublicDataProvider(INDEXER_URL, INDEXER_WS_URL);

  return {
    privateStateProvider,
    publicDataProvider,
    zkConfigProvider,
    proofProvider,
    walletProvider,
    midnightProvider,
  };
}
