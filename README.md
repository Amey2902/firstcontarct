# 🛡️ BLACKBOX AI — Private AI Training Data Provenance Verification

[![Midnight Network](https://img.shields.io/badge/Midnight-Network%20Preprod-6366f1.svg)](https://midnight.network)
[![Smart Contract](https://img.shields.io/badge/Compact-0.22%2B-06b6d4.svg)](https://docs.midnight.network)
[![ZK-SNARKs](https://img.shields.io/badge/Zero--Knowledge-Proofs-8b5cf6.svg)](https://docs.midnight.network)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **BLACKBOX AI** is a production-grade Zero-Knowledge (ZK) provenance and compliance verification system built on the **Midnight Network**. It solves the critical AI governance dilemma: proving to regulators, enterprise auditors, and copyright holders that AI models were trained exclusively on legally compliant, authorized, and uncorrupted datasets—**without ever exposing private training data, intellectual property, or confidential model weights.**

---

## 🌟 The Core Problem

Regulatory frameworks (EU AI Act, FTC AI guidelines, US Executive Order on AI) increasingly mandate transparent training data provenance and copyright audits. However:
1. **Revealing Raw Training Data** exposes trade secrets, copyrighted internal documents, proprietary datasets, and potential PII/confidential customer records.
2. **Revealing Model Weights** invites model theft, competitive disadvantage, and security vulnerabilities.
3. **Traditional Blockchains** are fully public, leaking entire datasets or licensing transactions to the world.

### The Solution: Midnight Zero-Knowledge Provenance

Midnight provides private smart contracts written in **Compact**. By separating on-chain public state (commitments, authorization flags, audit counters) from off-chain private witnesses (raw dataset content, license agreements, PII hashes), BLACKBOX AI enables mathematical zero-knowledge proofs for complex AI compliance invariants.

---

## 🔒 The Privacy Model Matrix

| Data Dimension | Public Ledger State (On-Chain) | Private ZK Witness (Off-Chain Only) | Verification Guarantee |
| :--- | :--- | :--- | :--- |
| **Dataset Content** | 32-byte cryptographic commitment (`sha256(content + salt)`) | Raw training texts, embeddings, images, database rows | Proves exact dataset was used without revealing sample data |
| **Dataset Licensing** | License classification (Commercial, Open Source, etc.) | Complete signed legal agreement & token reference | Proves license author was valid and compatible |
| **Authorization State** | `AUTHORIZED` (1) vs `REVOKED` (2) ledger flag | Secret authorization token & owner signature | Instant revocation without breaking previous valid audits |
| **AI Model Checkpoints**| 32-byte model architecture commitment (`modelHash`) | Exact model weights, hyperparameters, training logs | Proves training run produced the committed artifact |
| **Temporal Validity** | License expiration window (`validFrom`, `validUntil`) | Training run timestamp & job run ID | Proves training occurred while license was active |
| **PII & Data Hygiene** | Audit status (`VERIFIED_COMPLIANT`) | Sanitization protocol logs & tokenization hash | Proves PII scrub was executed prior to model update |

---

## ⚡ 5 Zero-Knowledge Compliance Invariants

BLACKBOX AI enforces 5 cryptographic invariants within its Midnight Compact circuits:

1. **Dataset Authorization Invariant**: Verifies the dataset has been registered and is currently in `AUTHORIZED` status on the Midnight ledger (not `REVOKED`).
2. **License Compatibility Invariant**: Verifies the dataset license permits commercial or specialized AI model training (strictly rejects `RESTRICTED` datasets).
3. **Temporal Validity Invariant**: Verifies the training completion timestamp falls strictly between `validFrom` and `validUntil` timestamps.
4. **Cryptographic Integrity Invariant**: Proves that the SHA-256 hash of the private dataset matches the on-chain commitment without exposing any raw records.
5. **PII & Sanitization Invariant**: Attests that privacy sanitization protocols were executed prior to the training gradient steps.

---

## 🏗️ Architecture Overview

```
                          ┌──────────────────────────┐
                          │    AI Developer / Org    │
                          └─────────────┬────────────┘
                                        │
                         1. Register & Commit Datasets
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            MIDNIGHT COMPACT CONTRACT                        │
│                              contracts/BlackBox.compact                     │
│                                                                             │
│  Ledger State:                                                              │
│  - registeredDatasets: Map<Bytes[32], DatasetCommitment>                    │
│  - datasetAuthorizations: Map<Bytes[32], Uint8>                             │
│  - trainingCommitments: Map<Bytes[32], TrainingRecord>                      │
│  - complianceAudits: Map<Bytes[32], AuditStatus>                            │
│                                                                             │
│  ZK Circuits:                                                               │
│  - registerDataset(datasetId, licenseType, validFrom, validUntil, ...)      │
│  - authorizeDataset(datasetId) & revokeDataset(datasetId)                   │
│  - submitTrainingCommitment(modelHash, datasetId, trainingTimestamp, ...)  │
│  - verifyCompliance(modelHash, datasetId, proofCommitment)                  │
└──────────────────────────────────────▲──────────────────────────────────────┘
                                       │
                         2. Zero-Knowledge Proof Evaluation
                                       │
┌──────────────────────────────────────┴──────────────────────────────────────┐
│                            OFF-CHAIN CLIENT RUNTIME                         │
│                                                                             │
│  - Midnight Node & Proof Server (via @midnight-ntwrk/midnight-js-node-zk)   │
│  - Wallet Adapters (Lace Wallet + 1AM Wallet DApp Connectors)               │
│  - Private Witness Evaluator (Generates ZK-SNARK proofs locally)            │
│  - Web UI Dashboard (React + TypeScript + TailwindCSS)                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quickstart & Local Setup

### Prerequisites
- Node.js `>= 20.0.0`
- Docker & Docker Compose (optional for local Midnight devnet)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/shritesh263/AmeyDapp.git
cd AmeyDapp

# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### 2. Run Automated Test Suite
Run the comprehensive suite verifying all 5 compliance invariants and edge cases:
```bash
npm test
```

### 3. Run End-to-End Simulation Script
```bash
npm run demo
```

### 4. Start the Production Frontend
```bash
cd frontend
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🌐 Deploying to Midnight Preprod / Testnet

To deploy the `BlackBox.compact` contract to Midnight Preprod:

1. Configure your `.env` file:
```env
MIDNIGHT_NODE_URL=https://rpc.preprod.midnight.network
MIDNIGHT_PROOF_SERVER_URL=https://prover.preprod.midnight.network
MIDNIGHT_INDEXER_URL=https://indexer.preprod.midnight.network
MIDNIGHT_WALLET_SEED=your_midnight_preprod_wallet_seed_hex_here
```

2. Run the deployment script:
```bash
npm run deploy
```

---

## 📁 Repository Structure

```
├── contracts/
│   └── BlackBox.compact        # Production Midnight Compact Smart Contract
├── src/
│   ├── contract-constants.ts   # Contract enums, IDs, & schema types
│   ├── contract.ts            # Contract interface & ZK helper routines
│   ├── deploy.ts              # Midnight network contract deployment script
│   ├── network.ts             # Midnight RPC and indexer configurations
│   ├── providers.ts           # Midnight provider & proof server setup
│   ├── wallet.ts              # Lace & 1AM wallet adapters
│   └── cli.ts                 # Interactive CLI audit tool
├── tests/
│   └── blackbox.test.ts       # Full automated test suite (5+ invariants)
├── scripts/
│   ├── demo.ts                # End-to-end interactive demo
│   └── e2e-check.ts           # Sanity check script
├── frontend/                  # Modern Web3 dApp
│   ├── src/
│   │   ├── components/        # Dashboard, Registry, Verify, History, Modals
│   │   ├── hooks/             # useMidnight (Lace & 1AM connector)
│   │   ├── App.tsx            # Main application layout
│   │   └── main.tsx           # React entry point with ErrorBoundary
│   ├── vite.config.ts         # Vite configuration with Node polyfills
│   └── tailwind.config.js     # Cyberpunk Midnight theme styling
└── .github/workflows/ci.yml   # GitHub Actions CI/CD Pipeline
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
