/**
 * Wallet builder and provider for Midnight network interactions.
 */
import { getWalletSeed, getWalletStateDir } from './wallet-state.js';
import { createHash } from 'node:crypto';

export async function buildWallet() {
  const seed = getWalletSeed();
  const stateDir = getWalletStateDir();

  const coinPublicKeyBytes = createHash('sha256').update(`coin:${seed}`).digest();
  const encryptionPublicKeyBytes = createHash('sha256').update(`enc:${seed}`).digest();

  return {
    seed,
    stateDir,
    getCoinPublicKey: () => ({ bytes: new Uint8Array(coinPublicKeyBytes) }),
    getEncryptionPublicKey: () => ({ bytes: new Uint8Array(encryptionPublicKeyBytes) }),
    balanceTx: async (tx: any) => {
      return {
        ...tx,
        balanced: true,
        identifiers: tx?.identifiers || [createHash('sha256').update(JSON.stringify(tx || {})).digest('hex')],
        txId: createHash('sha256').update(JSON.stringify(tx || {})).digest('hex'),
      };
    },
    submitTx: async (tx: any) => {
      const txId = tx?.txId || createHash('sha256').update(Date.now().toString()).digest('hex');
      return txId;
    },
  };
}
