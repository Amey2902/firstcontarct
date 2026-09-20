/**
 * Wallet synchronization and state utilities for Midnight.
 */
import * as fs from 'node:fs';
import * as path from 'node:path';

const WALLET_STATE_DIR = path.resolve(process.cwd(), '.midnight-wallet-state');

export function getWalletStateDir(): string {
  if (!fs.existsSync(WALLET_STATE_DIR)) {
    fs.mkdirSync(WALLET_STATE_DIR, { recursive: true });
  }
  return WALLET_STATE_DIR;
}

export function getWalletSeed(): string {
  const seedFile = path.join(getWalletStateDir(), 'seed.hex');
  if (fs.existsSync(seedFile)) {
    return fs.readFileSync(seedFile, 'utf8').trim();
  }
  // Default development / test seed (32 bytes hex)
  const devSeed = '0000000000000000000000000000000000000000000000000000000000000001';
  fs.writeFileSync(seedFile, devSeed, 'utf8');
  return devSeed;
}
