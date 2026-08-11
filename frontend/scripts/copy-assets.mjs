import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const managed = path.resolve(__dirname, '..', 'contracts', 'membership-club');
const publicDir = path.resolve(__dirname, '..', 'public');

const sources = [
  ['keys', 'keys'],
  ['zkir', 'zkir'],
];

if (!fs.existsSync(managed)) {
  console.error(`Compiled contract not found at ${managed}. Run "npm run compile" in the repo root first.`);
  process.exit(1);
}

for (const [from, to] of sources) {
  const src = path.join(managed, from);
  const dest = path.join(publicDir, to);
  fs.rmSync(dest, { recursive: true, force: true });
  if (!fs.existsSync(src)) {
    console.error(`Missing ${from} in compiled contract (${src}).`);
    process.exit(1);
  }
  fs.cpSync(src, dest, { recursive: true });
  console.log(`Copied ${from} -> public/${to}`);
}
