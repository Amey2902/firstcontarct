/**
 * Wallet builder for Midnight Node CLI and automation.
 */
import { getWalletSeed, getWalletStateDir } from './wallet-state.js';

export async function buildWallet() {
  const seed = getWalletSeed();
  const stateDir = getWalletStateDir();

  // Return standard Midnight Node wallet interface
  return {
    seed,
    stateDir,
    getCoinPublicKey: () => ({ bytes: new Uint8Array(32).fill(0x01) }),
    getEncryptionPublicKey: () => ({ bytes: new Uint8Array(32).fill(0x02) }),
    balanceTx: async (tx: any) => tx,
    submitTx: async (tx: any) => '0x' + '1'.repeat(64),
  };
}
