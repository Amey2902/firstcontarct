import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const managed = path.resolve(__dirname, '..', '..', 'contracts', 'managed', 'blackbox-ai');
const publicDir = path.resolve(__dirname, '..', 'public');

if (!fs.existsSync(managed)) {
  console.error(`Compiled contract not found at ${managed}. Run "npm run compile" in the repo root first.`);
  process.exit(1);
}

const sources = [
  ['keys', 'keys'],
  ['zkir', 'zkir'],
  ['contract', 'contract'],
];

for (const [from, to] of sources) {
  const src = path.join(managed, from);
  const dest = path.join(publicDir, to);

  if (!fs.existsSync(src)) {
    // keys and zkir may be absent in CI/Vercel (too large to commit) —
    // warn but continue so the JS bundle can still be built.
    console.warn(`Warning: ${from} not found at ${src} — skipping (runtime ZK assets may be missing).`);
    continue;
  }

  fs.rmSync(dest, { recursive: true, force: true });
  fs.cpSync(src, dest, { recursive: true });
  console.log(`Copied ${from} -> public/${to}`);
}
