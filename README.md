# Midnight Membership Club

Token-based Membership Club: a Midnight Network dApp that grants exclusive perks, content, and community access to users who hold a membership token, with **tiered membership levels** — holding more tokens unlocks additional benefits.

Built in Compact (Midnight's zero-knowledge smart contract language), a React + Vite browser DApp, and the Midnight Lace wallet.

## Live Demo

https://grand-marshmallow-0af42f.netlify.app/

## Contract Address

| Network  | Address                                                          |
|----------|------------------------------------------------------------------|
| Preview  | `35e00dbf117486cc633aaf663cdebeaedf61939289c2c68282d6aa0a99cc4933` |
| Preprod  | not deployed                                                     |

## What This Does

Membership is granted by a zero-knowledge proof that you hold enough membership tokens — **the token balance itself never leaves your device**. The club has four tiers (Bronze 1 · Silver 3 · Gold 10 · Diamond 25); each tier unlocks a perk claim. An on-chain observer can see that a pseudonymous commitment holds a tier and that perks get claimed, but can never learn the underlying balance, nor link the activity to a real identity.

Actions:

- **Join the club** — prove (in ZK) a balance ≥ 1 token; a pseudonymous commitment + tier is disclosed on-chain.
- **Upgrade tier** — prove a higher balance; the commitment's tier updates publicly.
- **Claim a perk** — prove the tier that unlocks a perk; `perkClaims` increments publicly.
- **Leave the club** — the commitment is removed from the public registry.

## Privacy Model

| What | Public (on-chain) | Private (never leaves the circuit) |
| --- | --- | --- |
| Join the club | a new commitment + the tier it maps to | the token balance behind the tier |
| Upgrade tier | the commitment's new tier | the new balance |
| Claim a perk | `perkClaims` incremented + a `perkId` | the balance/tier that unlocked it |
| Leave the club | the commitment removed | anything else |

The contract keeps only two kinds of public data: the public `thresholds` that define each tier, and a registry mapping a **pseudonymous commitment** (a one-way SHA-256 hash of the member's key) to a tier. Everything else — the membership-token balance — lives only inside a circuit witness and is proved, not revealed. Every action carries a zero-knowledge proof of a statement about that private balance, so the chain verifies the claim without ever seeing the number.

## Privacy Claim

The `disclose()` calls in the contract are the **only** member data that ever leaves the circuit. Every other action is **"proved without revealing your input"** — the balance is a private witness, never revealed, never logged, never persisted. The frontend feeds the typed balance only into the `balanceOf` witness for a single proven transaction and discards it immediately.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Smart contract | Compact 0.23, compiled with the `compact` toolchain |
| SDK | Midnight.js 4.1.1, compact-runtime 0.16.0, wallet-sdk 1.2.0 |
| Backend tooling | Node 22, tsx, vitest |
| Frontend | React 19 + Vite 7, vite-plugin-wasm, DApp Connector (Lace) |
| Local devnet | Docker Compose (node + indexer + proof-server) |
| CI | GitHub Actions (compile, test, build) |

## Prerequisites

- Node 22 (npm 10+)
- Docker with Compose v2 (for the bundled local devnet + proof server)
- The Compact compiler version pinned by the project (install per the [Midnight docs](https://docs.midnight.network/developers/tutorials/compact/install))
- Midnight Lace wallet browser extension (for the browser DApp)

## Run Locally

```bash
npm install
npm run setup          # start local devnet, compile, deploy
npm run test           # headless contract tests (10 tests)
npm run cli            # interactive CLI against the deployed contract
```

Browser DApp (points at the Preview deployment out of the box):

```bash
cd frontend
cp .env.example .env.local   # defaults already point at the preview deployment
npm install
npm run dev                  # http://localhost:3000
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

Environment variables (`frontend/.env.example`):

| Variable | Purpose |
| --- | --- |
| `VITE_NETWORK` | Network id passed to the wallet's `connect()` (default `preview`) |
| `VITE_INDEXER_URL` | GraphQL indexer URL for ledger reads |
| `VITE_INDEXER_WS_URL` | Indexer WebSocket URL |
| `VITE_CONTRACT_ADDRESS` | The deployed membership-club address |
| `VITE_PROOF_SERVER_URL` | Fallback proof server (used if the wallet reports none) |

`npm run dev` and `npm run build` first copy the compiled ZK artifacts (`keys/`, `zkir/`) from `contracts/managed/membership-club/` into `frontend/public/`, so the browser can fetch prover/verifier keys and zkIR from the DApp's own origin.

### SPA hosting

The frontend ships hosting config for Vercel (`frontend/vercel.json`) and Netlify (`frontend/netlify.toml` + `frontend/public/_redirects`) with SPA rewrites to `index.html`. Deploy the `frontend/` directory to either platform; set the `VITE_*` environment variables in the platform's dashboard.

## Demo Video

https://github.com/user-attachments/assets/800193c9-36bf-4dce-aa7a-6a3dbd471901

- [ ] Connect Lace wallet and load the ledger
- [ ] Join as Bronze with a balance of 1
- [ ] Claim a perk
- [ ] Upgrade to Diamond and claim the top-tier perk
- [ ] Show a ledger read-back (commitment, tier, `perkClaims`)
- [ ] Show the ZK prove step / wallet transaction approval

## Future Scope

- **Membership NFTs** — switch the token-balance witness for proof of ownership of specific (rarer) NFTs, so rarer tokens unlock higher tiers.
- **Exclusive content gating** — deliver encrypted content; members get a decryption key proved only to members at or above a tier.
- **Airdrops & rewards** — privately claim token rewards with a Sybil-resistant proof (one commitment per key).
- **Private voting / community governance** — tier-weighted votes where votes and balances stay hidden.
- **Multiple clubs** — reusable contract instance per community with per-club thresholds and perks.
- **Mainnet path** — migrate from the Preview testnet to Midnight Mainnet once live.

## Project structure

```
my-first-contract/
├── .github/workflows/ci.yml      # GitHub Actions: compile, test, build
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
- [x] GitHub Actions CI workflow (`.github/workflows/ci.yml`)
- [x] Frontend deployed to Netlify (https://grand-marshmallow-0af42f.netlify.app/) with the Live Demo URL in the README
- [x] Demo video recorded and linked in the `## Demo Video` section

