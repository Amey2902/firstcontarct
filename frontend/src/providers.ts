/**
 * Browser-side provider initialization for the Membership Club DApp.
 *
 * Connects to the Midnight Lace wallet via the DApp Connector API and wires
 * the midnight-js providers used to find the deployed contract and submit
 * circuit calls. Mirrors the official midnight-leaderboard browser pattern.
 */
import { type ConnectedAPI } from '@midnight-ntwrk/dapp-connector-api';
import { FetchZkConfigProvider } from '@midnight-ntwrk/midnight-js-fetch-zk-config-provider';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { CostModel } from '@midnight-ntwrk/midnight-js-protocol/ledger';
import { fromHex, toHex } from '@midnight-ntwrk/midnight-js-protocol/compact-runtime';
import { Binding, Proof, SignatureEnabled, Transaction, type TransactionId } from '@midnight-ntwrk/midnight-js-protocol/ledger';
import type { UnboundTransaction } from '@midnight-ntwrk/midnight-js-types';
import { dappConnectorProofProvider } from '@midnight-ntwrk/midnight-js-dapp-connector-proof-provider';
import { inMemoryPrivateStateProvider } from './private-state';
import { type MembershipPrivateState } from './contract';

const NETWORK_ID = import.meta.env.VITE_NETWORK_ID ?? 'preview';

export type MembershipProviders = Awaited<ReturnType<typeof createProviders>>;

/**
 * Build the providers needed to find a deployed contract and submit circuit
 * calls. Requires an already-connected wallet (ConnectedAPI).
 */
export async function createProviders(api: ConnectedAPI) {
  setNetworkId(NETWORK_ID);

  const config = await api.getConfiguration();
  const shieldedAddresses = await api.getShieldedAddresses();

  // ZK artifacts (keys/ and zkir/) are served from the DApp's own origin,
  // copied there from the compiled contract by the copy-assets script.
  const zkConfigProvider = new FetchZkConfigProvider<string>(window.location.origin, fetch.bind(window));

  // Prefer the wallet-reported proof server (user's own infrastructure);
  // fall back to the locally-configured one via VITE_PROOF_SERVER_URL; and
  // only if neither is available, delegate proving to the wallet itself.
  const proofServerUri =
    config.proverServerUri || (import.meta.env.VITE_PROOF_SERVER_URL as string | undefined);
  const proofProvider = proofServerUri
    ? httpClientProofProvider(proofServerUri, zkConfigProvider)
    : await dappConnectorProofProvider(api, zkConfigProvider, CostModel.initialCostModel());

  return {
    privateStateProvider: inMemoryPrivateStateProvider<string, MembershipPrivateState>(),
    publicDataProvider: indexerPublicDataProvider(config.indexerUri, config.indexerWsUri),
    zkConfigProvider,
    proofProvider,
    walletProvider: {
      // getShieldedAddresses() returns the keys as bech32m strings, which is
      // exactly the ledger-v8 CoinPublicKey / EncPublicKey representation.
      getCoinPublicKey: () => shieldedAddresses.shieldedCoinPublicKey,
      getEncryptionPublicKey: () => shieldedAddresses.shieldedEncryptionPublicKey,
      balanceTx: async (tx: UnboundTransaction) => {
        const received = await api.balanceUnsealedTransaction(toHex(tx.serialize()));
        return Transaction.deserialize<SignatureEnabled, Proof, Binding>(
          'signature',
          'proof',
          'binding',
          fromHex(received.tx),
        );
      },
    },
    midnightProvider: {
      submitTx: async (tx: Transaction<SignatureEnabled, Proof, Binding>): Promise<TransactionId> => {
        await api.submitTransaction(toHex(tx.serialize()));
        return tx.identifiers()[0];
      },
    },
  };
}
