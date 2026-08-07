# Midnight Membership Club

Token-gated membership with tiered perks, built on [Midnight Network](https://midnight.network).

A **Compact** smart contract that lets members join a club, unlock tiers, and
claim perks based on how many membership tokens they hold — while the token
**balance itself is never revealed on-chain**. Only a pseudonymous commitment
and the tier it maps to are ever public.

```
contracts/membership-club.compact   # the Compact source
```

## The privacy story

The contract stores **only two kinds of public data**:

- `thresholds` — the token count that unlocks each tier (public by design)
- `members` — a mapping from a **pseudonymous commitment** (a one-way SHA-256
  hash of the member's key) to a tier, plus public counters `memberCount` and
  `perkClaims`

The token balance exists **only inside the circuit**, as a witness read by the
`balanceOf()` witness. Every action (register, upgrade, claim a perk, resign)
proves a statement about that private balance with a **zero-knowledge proof**:

| Action | The chain learns | The chain never learns |
| --- | --- | --- |
| Register | a new commitment + tier | the balance behind the tier |
| Upgrade | the commitment's new tier | the new balance |
| Claim a perk | `perkClaims` incremented, a `perkId` | the balance/tier that unlocked it |
| Leave | the commitment removed | anything else |

The `disclose()` calls in the contract are the **only** member data that ever
leaves the circuit.

## Smart contract deployment

Deployed to the **Midnight Preview** testnet:

```
Contract address: 35e00dbf117486cc633aaf663cdebeaedf61939289c2c68282d6aa0a99cc4933
```

Verified with `npm run test:e2e` (reads thresholds `1 · 3 · 10 · 25` from the
on-chain ledger).

## Key features

- **Tiered membership** — Bronze (1), Silver (3), Gold (10), Diamond (25) tokens
- **Private balance proofs** — the balance is a witness, proved not revealed
- **Pseudonymous identity** — commitments, never addresses, reach the ledger
- **Headless test suite** — 10 vitest tests including a privacy assertion that
  raw balances never appear in public contract bytes
- **Interactive CLI** — register / upgrade / claim / leave / inspect the ledger
- **Browser DApp** — React + Vite frontend wired to the Midnight Lace wallet
  through the DApp Connector; stateless ledger reads need no wallet at all

## Tech stack

| Layer | Technology |
| --- | --- |
| Smart contract | Compact 0.23, compiled with the `compact` toolchain |
| SDK | Midnight.js 4.1.1, compact-runtime 0.16.0, wallet-sdk 1.2.0 |
| Backend tooling | Node 22, tsx, vitest |
| Frontend | React 19 + Vite 7, vite-plugin-wasm, DApp Connector (Lace) |
| Local devnet | Docker Compose (node + indexer + proof-server) |

## Local development

Requirements: Node 22, Docker (Compose v2), and the Compact compiler version
pinned by the project.

```bash
npm install
npm run setup          # start local devnet, compile, deploy
npm run test           # headless contract tests (10 tests)
npm run cli            # interactive CLI against the deployed contract
```

The active network is **sticky** — the project defaults to the bundled local
devnet (`undeployed`), and switches with `npm run network preview` /
`npm run network preprod`. See the available scripts below.

### Available scripts

| Script | Description |
| --- | --- |
| `npm run compile` | Compile `contracts/membership-club.compact` |
| `npm run deploy` | Deploy the compiled contract |
| `npm run cli` | Interactive CLI (register / upgrade / claim / leave / ledger) |
| `npm run demo` | Full lifecycle demo (register → claim → upgrade → resign) |
| `npm run test` | Headless vitest suite (10 tests) |
| `npm run test:e2e` | Smoke + read-back check against the deployed contract |
| `npm run frontend:dev` | Start the browser DApp (Vite dev server) |
| `npm run frontend:build` | Type-check + production build of the frontend |
| `npm run setup` | One-shot: start devnet, compile, deploy |
| `npm run network <name>` | Switch the active network |
| `npm run clean` | Remove generated artifacts |

### Networks

| Network | When to use | Default? |
| --- | --- | --- |
| `undeployed` | Local devnet bundled in `docker-compose.yml` | yes |
| `preview` | Public preview testnet (the deployed contract lives here) | |
| `preprod` | Public preprod testnet | |

Public networks fund a wallet via the printed faucet URL. Wallet seeds and
deploy addresses live in `.midnight-state.json` (gitignored) — back up the seed
if you fund a wallet you care about.

## Browser DApp

The `frontend/` workspace is a React + Vite app that talks to the deployed
contract two ways:

1. **Stateless reads** — the club ledger (thresholds, members, counters) is
   fetched from the preview indexer with a plain GraphQL `fetch`. No wallet.
2. **On-chain writes** — join, upgrade, claim perks, and resign go through the
   **Midnight Lace wallet** via the DApp Connector. The wallet balances and
   submits the proven transaction; the proof is generated against the
   wallet-reported proof server (or the locally configured one).

```bash
cd frontend
cp .env.example .env.local   # defaults already point at the preview deployment
npm install
npm run dev                  # http://localhost:3000
```

Environment variables (`frontend/.env.example`):

| Variable | Purpose |
| --- | --- |
| `VITE_NETWORK_ID` | Network id passed to the wallet's `connect()` |
| `VITE_INDEXER_URL` | GraphQL indexer URL for ledger reads |
| `VITE_INDEXER_WS_URL` | Indexer WebSocket URL |
| `VITE_CONTRACT_ADDRESS` | The deployed membership-club address |
| `VITE_PROOF_SERVER_URL` | Fallback proof server (used if the wallet reports none) |

`npm run dev` and `npm run build` first copy the compiled ZK artifacts
(`keys/`, `zkir/`) from `contracts/managed/membership-club/` into
`frontend/public/`, so the browser can fetch prover/verifier keys and zkIR from
the DApp's own origin.

The simulated balance a member types into the UI is fed to the `balanceOf`
witness for a single transaction, proved with ZK, and never leaves the page.

## Project structure

```
my-first-contract/
├── contracts/
│   └── membership-club.compact      # Compact source
├── contracts/managed/membership-club/  # compiled contract + keys + zkIR
├── scripts/
│   ├── demo.ts                      # full lifecycle demo
│   └── e2e-check.ts                 # smoke + read-back check
├── src/
│   ├── contract.ts                  # shared contract wiring + witnesses
│   ├── providers.ts                 # Node wallet providers (CLI/demo)
│   ├── cli.ts                       # interactive CLI
│   ├── deploy.ts                    # deploy the contract
│   ├── network.ts                   # network selection + state file
│   └── wallet.ts                    # wallet construction + sync cache
├── tests/
│   └── membership-club.test.ts      # headless vitest suite (incl. privacy)
├── frontend/                        # browser DApp (React + Vite)
│   ├── src/App.tsx                  # main UI
│   ├── src/providers.ts             # DApp Connector provider wiring
│   ├── src/club-api.ts              # findDeployedContract + circuit calls
│   └── src/hooks/                   # useWallet, useClubState (indexer reads)
├── docker-compose.yml               # local devnet
└── package.json
```

## Verification checklist

- [x] `npm run compile` compiles the membership-club contract
- [x] `npm test` — 10 headless tests pass, including the privacy assertion
- [x] Contract deployed to Preview:
      `35e00dbf117486cc633aaf663cdebeaedf61939289c2c68282d6aa0a99cc4933`
- [x] `npm run test:e2e` reads back thresholds `1 · 3 · 10 · 25` from the ledger
- [x] `npm run demo` completes a full lifecycle on Preview: leave → register
      (Silver) → claim VIP Lounge → upgrade (Diamond) → resign → ledger shows
      `memberCount: 0`, `perkClaims: 1`
- [x] `npm run frontend:build` — frontend type-checks and builds clean
- [x] Frontend dev server serves the compiled contract, keys, and zkIR
- [x] Indexer read path verified against the live preview indexer
- [ ] Manual browser check: ledger renders with Lace installed; join/claim
      flow exercised end-to-end from the UI
