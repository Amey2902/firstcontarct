# Midnight Membership Club

Token-based Membership Club: a Midnight Network dApp that grants exclusive perks, content, and community access to users who hold a membership token, with **tiered membership levels** — holding more tokens unlocks additional benefits.

Built in Compact (Midnight's zero-knowledge smart contract language), a React + Vite browser DApp, and the Midnight Lace wallet.

## Project Vision

Most membership apps force members to prove they belong — by showing their balance, their wallet, or a centralized database — which reveals far more than necessary. This project flips that: membership is granted by a zero-knowledge proof that you hold enough tokens, while **the token balance itself never leaves your device**. An on-chain observer can see that a pseudonymous commitment holds a tier and that perks get claimed, but can never learn the underlying balance, nor link the activity to a real identity.

Midnight's privacy model is the core of the design. The contract keeps only two kinds of public data: the public `thresholds` that define each tier, and a registry mapping a **pseudonymous commitment** (a one-way SHA-256 hash of the member's key) to a tier. Everything else — the membership-token balance — lives only inside a circuit witness and is proved, not revealed. Every action carries a zero-knowledge proof of a statement about that private balance, so the chain verifies the claim without ever seeing the number.

## Smart Contract Deployment

- **Network:** Preview
- **Deployed contract ID:** `35e00dbf117486cc633aaf663cdebeaedf61939289c2c68282d6aa0a99cc4933`

Verified with `npm run test:e2e` (reads the on-chain thresholds `1 · 3 · 10 · 25` back from the live preview ledger).

### The privacy story in plain English

| What | Public (on-chain) | Private (never leaves the circuit) |
| --- | --- | --- |
| Join the club | a new commitment + the tier it maps to | the token balance behind the tier |
| Upgrade tier | the commitment's new tier | the new balance |
| Claim a perk | `perkClaims` incremented + a `perkId` | the balance/tier that unlocked it |
| Leave the club | the commitment removed | anything else |

The `disclose()` calls in the contract are the **only** member data that ever leaves the circuit. Every other action is **"proved without revealing your input."**

## Key Features

- **Tiered membership levels** — Bronze (1), Silver (3), Gold (10), Diamond (25) tokens; holding more tokens unlocks additional benefits.
- **Private balance proofs** — the balance is a circuit witness, proved with zero-knowledge, never revealed.
- **Pseudonymous identity** — commitments, never addresses, reach the ledger.
- **Token-gated perks** — four tiers of perks (Community Badge → Personal Concierge), each claim proved against a private balance.
- **Headless test suite** — 10 vitest tests including a privacy assertion that raw balances never appear in the serialized public state.
- **Interactive CLI** — register / upgrade / claim / leave / inspect the ledger from the terminal.
- **Browser DApp** — React + Vite frontend wired to the Midnight Lace wallet through the DApp Connector; stateless ledger reads need no wallet at all.
- **"Proved without revealing your input" labels** on every privacy-sensitive action in the UI.

## Future Scope

- **Membership NFTs** — switch the token-balance witness for proof of ownership of specific (rarer) NFTs, so rarer tokens unlock higher tiers.
- **Exclusive content gating** — deliver encrypted content; members get a decryption key proved only to members at or above a tier.
- **Airdrops & rewards** — privately claim token rewards with a Sybil-resistant proof (one commitment per key).
- **Private voting / community governance** — tier-weighted votes where votes and balances stay hidden.
- **Multiple clubs** — reusable contract instance per community with per-club thresholds and perks.
- **Mainnet path** — migrate from the Preview testnet to Midnight Mainnet once live.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Smart contract | Compact 0.23, compiled with the `compact` toolchain |
| SDK | Midnight.js 4.1.1, compact-runtime 0.16.0, wallet-sdk 1.2.0 |
| Backend tooling | Node 22, tsx, vitest |
| Frontend | React 19 + Vite 7, vite-plugin-wasm, DApp Connector (Lace) |
| Local devnet | Docker Compose (node + indexer + proof-server) |

## Local Development

Requirements: Node 22, Docker (Compose v2), and the Compact compiler version pinned by the project.

```bash
npm install
npm run setup          # start local devnet, compile, deploy
npm run test           # headless contract tests (10 tests)
npm run cli            # interactive CLI against the deployed contract
```

The active network is **sticky** — the project defaults to the bundled local devnet (`undeployed`), and switches with `npm run network preview` / `npm run network preprod`. See the available scripts below.

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

Public networks fund a wallet via the printed faucet URL. Wallet seeds and deploy addresses live in `.midnight-state.json` (gitignored) — back up the seed if you fund a wallet you care about.

### Browser DApp

The `frontend/` workspace is a React + Vite app that talks to the deployed contract two ways:

1. **Stateless reads** — the club ledger (thresholds, members, counters) is fetched from the preview indexer with a plain GraphQL `fetch`. No wallet.
2. **On-chain writes** — join, upgrade, claim perks, and resign go through the **Midnight Lace wallet** via the DApp Connector. The wallet balances and submits the proven transaction.

```bash
cd frontend
cp .env.example .env.local   # defaults already point at the preview deployment
npm install
npm run dev                  # http://localhost:3000
```

Environment variables (`frontend/.env.example`):

| Variable | Purpose |
| --- | --- |
| `VITE_NETWORK` | Network id passed to the wallet's `connect()` (default `preview`) |
| `VITE_INDEXER_URL` | GraphQL indexer URL for ledger reads |
| `VITE_INDEXER_WS_URL` | Indexer WebSocket URL |
| `VITE_CONTRACT_ADDRESS` | The deployed membership-club address |
| `VITE_PROOF_SERVER_URL` | Fallback proof server (used if the wallet reports none) |

`npm run dev` and `npm run build` first copy the compiled ZK artifacts (`keys/`, `zkir/`) from `contracts/managed/membership-club/` into `frontend/public/`, so the browser can fetch prover/verifier keys and zkIR from the DApp's own origin.

The simulated balance a member types into the UI is fed to the `balanceOf` witness for a single transaction, proved with ZK, and **never leaves the page, is never logged, and is never persisted**.

### SPA hosting

The frontend ships hosting config for Vercel (`frontend/vercel.json`) and Netlify (`frontend/netlify.toml` + `frontend/public/_redirects`) with SPA rewrites to `index.html`. Deploy the `frontend/` directory to either platform; set the `VITE_*` environment variables in the platform's dashboard.

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
│   ├── src/hooks/useMidnight.ts     # DApp Connector wallet hook
│   ├── src/hooks/useClubState.ts    # indexer ledger reads
│   ├── src/club-api.ts              # findDeployedContract + circuit calls
│   ├── src/components/              # WalletConnect, MembershipActions, PerkClaims, ClubState
│   ├── vercel.json                  # Vercel SPA hosting config
│   └── netlify.toml                 # Netlify SPA hosting config
├── docker-compose.yml               # local devnet
└── package.json
```

## Verification checklist

- [x] `npm run compile` compiles the membership-club contract (0 errors)
- [x] `npm test` — 10 headless tests pass, including the privacy assertion
- [x] Contract deployed to Preview:
      `35e00dbf117486cc633aaf663cdebeaedf61939289c2c68282d6aa0a99cc4933`
- [x] `npm run test:e2e` reads back thresholds `1 · 3 · 10 · 25` from the ledger
- [x] `npm run demo` completes a full lifecycle on Preview
- [x] `npm run frontend:build` — frontend type-checks and builds with zero errors
- [x] Frontend dev server serves the compiled contract, keys, and zkIR
- [x] Indexer read path verified against the live preview indexer
- [x] SPA hosting config present for Vercel and Netlify
- [ ] Manual browser check: ledger renders with Lace installed; join/claim flow exercised end-to-end from the UI
