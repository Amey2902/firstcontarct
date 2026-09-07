# BlackBox AI — Privacy-Preserving Training Data Verification

**BlackBox AI** is a zero-knowledge proof system built on the **Midnight Network** that allows AI companies to prove their training data was properly licensed and authorized — **without revealing the training data itself**.

## The Problem

AI companies increasingly need to prove that the data used to train their models was properly licensed, authorized, and compliant. However, proving this usually requires exposing the actual training datasets to auditors, customers, or regulators.

Those datasets may contain:
- Copyrighted material
- Private information
- Proprietary data
- Trade secrets

**How can an AI company prove its training data was legally authorized without revealing the data itself?**

## The Solution

BlackBox AI uses **zero-knowledge proofs** to verify training data compliance against predefined policies — the auditor receives only the verification result and cryptographic proof, while the underlying datasets and sensitive licensing information remain private.

### What BlackBox AI Proves

| Policy Check | Example |
|--------------|---------|
| ✅ 100% of training data was authorized | All datasets have valid authorization |
| ✅ ≥95% of data was properly licensed | Commercial, Open Source, or Proprietary licenses |
| ✅ No restricted datasets were used | No "No AI Training" licensed data |
| ✅ All licenses valid at training time | No expired licenses |

### Example Scenario

An AI company trains a model using:
- **Dataset A** — Commercially licensed ✅
- **Dataset B** — Commercially licensed ✅
- **Dataset C** — Restricted ❌

BlackBox AI evaluates the policy privately and generates:
```
❌ NON-COMPLIANT — Training policy violated
   Authorized: 66% (required: 100%)
   Licensed: 66% (required: 95%)
   Restricted datasets used: 1
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      BLACKBOX AI CONTRACT                        │
│  (Midnight Compact Smart Contract)                               │
├─────────────────────────────────────────────────────────────────┤
│  PUBLIC LEDGER (on-chain)           PRIVATE WITNESSES (off-chain)│
│  ───────────────────────            ──────────────────────────  │
│  • Dataset Registry                 • Dataset Content Hashes    │
│  • Training Commitments             • License Proofs            │
│  • Verification Results             • Training Data Hashes      │
│  • Policies                         • Dataset Licenses          │
│  • Counters                         • Current Timestamp         │
└─────────────────────────────────────────────────────────────────┘
                              │
                    Zero-Knowledge Proofs
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      VERIFICATION RESULT                         │
│  (Public: Compliant/Non-Compliant + Aggregate Metrics)          │
│  Private: Individual dataset details NEVER revealed              │
└─────────────────────────────────────────────────────────────────┘
```

### Privacy Model

| What | Public (On-Chain) | Private (Never Leaves Circuit) |
|------|-------------------|--------------------------------|
| Dataset Registration | Dataset ID, Owner, License Type, Status, Validity Period | Content Hash, License Proof |
| Training Commitment | Commitment ID, Trainer, Dataset Count, Model Hash, Timestamp | Individual Dataset Hashes, License Hashes |
| Policy Creation | Policy ID, Name, Requirements (percentages, flags) | — |
| ZK Verification | **Result only**: Compliant?, % Authorized, % Licensed, Restricted Count, Expired Count | **All evaluation logic**: Which datasets, individual statuses, license details |

---

## Live Demo

| Network | Contract Address | Status |
|---------|-----------------|--------|
| **Preprod** | `TBD_AFTER_DEPLOY` | 🚀 Deployed |
| Preview | `TBD_AFTER_DEPLOY` | 🔄 Pending |
| Local Devnet | `undeployed` | 🛠 Development |

**Frontend Demo**: [TBD_AFTER_DEPLOY] (Netlify/Vercel)

---

## Quick Start

### Prerequisites

- **Node.js 22+** (npm 10+)
- **Docker** with Compose v2 (for local devnet + proof server)
- **Midnight Lace Wallet** browser extension (for browser DApp)
- **Compact Compiler** v0.23+ ([install guide](https://docs.midnight.network/developers/tutorials/compact/install))

### Local Development

```bash
# 1. Clone and install
git clone https://github.com/<your-org>/blackbox-ai.git
cd blackbox-ai
npm install

# 2. Start local devnet (node + indexer + proof server)
npm run proof-server:start

# 3. Compile the contract
npm run compile

# 4. Deploy to local devnet
npm run setup

# 5. Run the CLI demo
npm run demo

# 6. Or start the browser DApp
cd frontend
cp .env.example .env.local
npm install
npm run dev
# Open http://localhost:3000
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run compile` | Compile `contracts/blackbox-ai.compact` |
| `npm run deploy` | Deploy compiled contract to active network |
| `npm run cli` | Interactive CLI for contract interaction |
| `npm run demo` | Full lifecycle demo (register → commit → policy → verify) |
| `npm run test` | Headless vitest suite |
| `npm run test:e2e` | Smoke check against deployed contract |
| `npm run frontend:dev` | Start browser DApp (Vite dev server) |
| `npm run frontend:build` | Type-check + production build of frontend |
| `npm run setup` | One-shot: start devnet, compile, deploy |
| `npm run network <name>` | Switch active network (`undeployed`, `preview`, `preprod`) |
| `npm run clean` | Remove generated artifacts |

### Networks

| Network | Use Case | Default |
|---------|----------|---------|
| `undeployed` | Local devnet (bundled in docker-compose.yml) | ✅ Yes |
| `preview` | Public preview testnet | |
| `preprod` | Public preprod testnet | |

**Switch networks:**
```bash
npm run network preview    # Switch to preview testnet
npm run network preprod    # Switch to preprod testnet
npm run network undeployed # Back to local devnet
```

---

## Contract Circuits

### Dataset Owner Actions
```typescript
// Register a dataset with licensing metadata
registerDataset(
  datasetId, owner, contentHash, licenseHash,
  licenseType, authStatus, validFrom, validUntil, metadataHash
)

// Update authorization status
updateAuthorization(datasetId, newStatus, owner)

// Revoke dataset
revokeDataset(datasetId, owner)

// Query dataset info
getDataset(datasetId)
```

### AI Company Actions
```typescript
// Commit a training run (link datasets to model)
commitTraining(
  commitmentId, trainer, datasetIds, datasetCount,
  trainingTimestamp, modelHash
)

// Query training commitment
getCommitment(commitmentId)
```

### Verifier/Auditor Actions
```typescript
// Create a compliance policy
createPolicy(
  policyId, name, minAuthorizedPct, minLicensedPct,
  allowRestricted, requireValidLicenses, createdBy
)

// Run ZK compliance verification
verifyCompliance(verificationId, commitmentId, policyId, verifier)

// Query results
getVerification(verificationId)
getPolicy(policyId)
```

### License Types
| Value | Type | Description |
|-------|------|-------------|
| 0 | Commercial | Commercial license (paid) |
| 1 | Open Source | MIT, Apache, BSD, etc. |
| 2 | Proprietary | Internal/private use only |
| 3 | Restricted | No AI training allowed |

### Authorization Status
| Value | Status |
|-------|--------|
| 0 | Pending |
| 1 | Authorized |
| 2 | Revoked |
| 3 | Expired |

---

## Frontend DApp

The browser DApp (`frontend/`) is a React + Vite application that connects via the **Midnight Lace Wallet** using the DApp Connector API.

### Features
- 🔐 Wallet connection via Lace
- 📊 Real-time contract state from indexer
- 📝 Dataset registration with license metadata
- 🏷️ Training commitment creation
- 📋 Policy creation for compliance rules
- 🔬 ZK verification with live proof generation
- 📈 Verification result display

### Environment Variables (`frontend/.env.local`)

```env
VITE_NETWORK=preview                 # Network ID for wallet connect
VITE_INDEXER_URL=https://indexer.preview.midnight.network/api/v4/graphql
VITE_INDEXER_WS_URL=wss://indexer.preview.midnight.network/api/v4/graphql/ws
VITE_CONTRACT_ADDRESS=0x...          # Deployed contract address
VITE_PROOF_SERVER_URL=http://127.0.0.1:6300
VITE_PRIVATE_STATE_PASSWORD=your-strong-password-here
```

### Deployment

The frontend includes hosting configs for:
- **Vercel** (`vercel.json`) — SPA rewrites
- **Netlify** (`netlify.toml` + `public/_redirects`) — SPA rewrites

Deploy the `frontend/` directory to either platform and set the `VITE_*` environment variables in the dashboard.

---

## Testing

```bash
# Unit tests (headless, no network required)
npm test

# E2E smoke check (requires deployed contract)
npm run test:e2e

# Full lifecycle demo
npm run demo
```

### Test Coverage
- Contract compilation
- Circuit execution (register, commit, policy, verify)
- Privacy assertions (content hashes never leave circuit)
- ZK verification result structure
- Constant value verification

---

## CI/CD Pipeline

**GitHub Actions** (`.github/workflows/ci.yml`) runs on every push/PR:

1. **Compile** — Compact contract compilation
2. **TypeCheck** — TypeScript strict mode for root + frontend
3. **Test** — Vitest headless suite
4. **Frontend Build** — Vite production build with artifact copying

### Status Badges
![CI](https://github.com/<your-org>/blackbox-ai/actions/workflows/ci.yml/badge.svg)

---

## Project Structure

```
blackbox-ai/
├── .github/workflows/ci.yml          # GitHub Actions CI
├── contracts/
│   └── blackbox-ai.compact           # Compact smart contract
│   └── managed/blackbox-ai/          # Compiled artifacts (keys, zkIR)
├── scripts/
│   ├── demo.ts                       # Full lifecycle demo
│   └── e2e-check.ts                  # E2E smoke check
├── src/
│   ├── contract.ts                   # Shared contract wiring + witnesses
│   ├── deploy.ts                     # Contract deployment script
│   ├── cli.ts                        # Interactive CLI
│   ├── providers.ts                  # Midnight.js providers (Node)
│   ├── network.ts                    # Network configuration & state
│   ├── wallet.ts                     # Wallet construction + sync
│   ├── wallet-state.ts               # Wallet state persistence
│   └── setup.ts                      # Orchestrator for `npm run setup`
├── tests/
│   └── blackbox-ai.test.ts           # Headless vitest suite
├── frontend/                         # Browser DApp (React + Vite)
│   ├── src/
│   │   ├── App.tsx                   # Main UI
│   │   ├── contract.ts               # Browser contract wiring
│   │   ├── club-api.ts               # Typed contract API
│   │   ├── providers.ts              # DApp Connector providers
│   │   ├── hooks/useMidnight.ts      # Wallet connection hook
│   │   ├── hooks/useContractState.ts # Indexer state hook
│   │   └── components/               # UI components
│   ├── public/                       # Copied ZK artifacts (keys/, zkir/)
│   ├── scripts/copy-assets.mjs       # Copies contract artifacts
│   ├── vercel.json                   # Vercel hosting config
│   └── netlify.toml                  # Netlify hosting config
├── docker-compose.yml                # Local devnet (node, indexer, proof-server)
├── package.json
├── tsconfig.json
└── README.md
```

---

## Security Considerations

- **Private State Password**: Set `PRIVATE_STATE_PASSWORD` (min 16 chars) for non-local deployments
- **Wallet Seed**: Back up `.midnight-wallet-state/` — contains encrypted wallet sync state
- **Contract Address**: Verify contract address matches deployment record before interacting
- **Faucet Funding**: On public networks, fund wallet from official faucet only
- **Proof Server**: Local proof server runs in Docker — never expose to public internet without auth

---

## Demo Video

[![BlackBox AI Demo](https://img.youtube.com/vi/TBD/0.jpg)](https://www.youtube.com/watch?v=TBD)

*Video demonstrates: Dataset registration → Training commitment → Policy creation → ZK verification → Result display*

---

## Product X Profile

🐦 **Follow us**: [@BlackBoxAI_Midnight](https://x.com/BlackBoxAI_Midnight)

---

## Roadmap

- [ ] **Multi-party verification** — Multiple auditors can verify independently
- [ ] **Dataset provenance** — IPFS/Arweave integration for metadata
- [ ] **Automated license detection** — ML-based license classification
- [ ] **Batch verification** — Verify multiple training runs in one proof
- [ ] **Mainnet deployment** — Migrate from Preprod to Midnight Mainnet
- [ ] **SDK package** — Publish `@blackbox-ai/sdk` for easy integration
- [ ] **Audit** — Formal security audit of ZK circuits

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

## Acknowledgments

Built with ❤️ on the **Midnight Network** — the privacy-preserving blockchain for zero-knowledge applications.

- [Midnight Documentation](https://docs.midnight.network)
- [Compact Language](https://docs.midnight.network/developers/tutorials/compact/)
- [Midnight.js SDK](https://github.com/midnightntwrk/midnight-js)
- [Lace Wallet](https://lace.io)