import * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

function bytesToHex(bytes) {
  if (!bytes) return '';
  if (typeof bytes === 'string') return bytes;
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToBytes(hex, len = 32) {
  if (!hex) return new Uint8Array(len);
  const clean = hex.startsWith('0x') ? hex.slice(2) : hex;
  const arr = new Uint8Array(len);
  for (let i = 0; i < len && i * 2 < clean.length; i++) {
    arr[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16) || 0;
  }
  return arr;
}

function areBytesEqual(a, b) {
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function extractWitnessValue(val) {
  if (Array.isArray(val) && val.length === 2 && (val[1] instanceof Uint8Array || typeof val[1] === 'bigint' || Array.isArray(val[1]))) {
    return val[1];
  }
  return val;
}

export class Contract {
  constructor(witnesses) {
    this.witnesses = witnesses;
    this.datasetRegistry = new Map();
    this.trainingCommitments = new Map();
    this.verificationResults = new Map();
    this.totalDatasetsRegistered = 0n;
    this.totalCommitmentsSubmitted = 0n;
    this.totalVerificationsRun = 0n;

    const self = this;

    this.circuits = {
      async registerDataset(
        context,
        datasetId,
        owner,
        contentHash,
        licenseHash,
        licenseType,
        authorizationStatus,
        validFrom,
        validUntil,
        metadataHash
      ) {
        const idHex = bytesToHex(datasetId);
        if (self.datasetRegistry.has(idHex)) {
          throw new Error('Dataset already registered');
        }
        if (BigInt(validUntil) < BigInt(validFrom)) {
          throw new Error('Invalid license validity period');
        }
        if (licenseType < 0 || licenseType > 3) {
          throw new Error('Invalid license type');
        }
        if (authorizationStatus < 0 || authorizationStatus > 3) {
          throw new Error('Invalid authorization status');
        }

        const witnessCtx = {
          circuitContext: context,
          privateState: context?.callContext?.currentPrivateState,
        };
        const rawWitness = self.witnesses?.datasetContentHash ? await self.witnesses.datasetContentHash(witnessCtx) : contentHash;
        const witnessContentHash = extractWitnessValue(rawWitness);

        if (witnessContentHash && !areBytesEqual(witnessContentHash, contentHash)) {
          throw new Error('Witness content hash mismatch');
        }

        const rawTimestamp = self.witnesses?.currentTimestamp ? await self.witnesses.currentTimestamp(witnessCtx) : BigInt(Math.floor(Date.now() / 1000));
        const now = BigInt(extractWitnessValue(rawTimestamp) || BigInt(Math.floor(Date.now() / 1000)));

        const info = {
          datasetId,
          owner,
          contentHash,
          licenseHash,
          licenseType: Number(licenseType),
          authorizationStatus: Number(authorizationStatus),
          validFrom: BigInt(validFrom),
          validUntil: BigInt(validUntil),
          registeredAt: now,
          metadataHash,
        };

        self.datasetRegistry.set(idHex, info);
        self.totalDatasetsRegistered += 1n;

        return {
          result: undefined,
          context,
          gasCost: __compactRuntime.emptyRunningCost ? __compactRuntime.emptyRunningCost() : {},
        };
      },

      async authorizeDataset(context, datasetId, owner) {
        const idHex = bytesToHex(datasetId);
        if (!self.datasetRegistry.has(idHex)) {
          throw new Error('Dataset not found');
        }
        const current = self.datasetRegistry.get(idHex);
        if (!areBytesEqual(current.owner, owner)) {
          throw new Error('Only dataset owner can authorize');
        }

        const updated = {
          ...current,
          authorizationStatus: 1, // Authorized
        };
        self.datasetRegistry.set(idHex, updated);

        return {
          result: undefined,
          context,
          gasCost: __compactRuntime.emptyRunningCost ? __compactRuntime.emptyRunningCost() : {},
        };
      },

      async revokeDataset(context, datasetId, owner) {
        const idHex = bytesToHex(datasetId);
        if (!self.datasetRegistry.has(idHex)) {
          throw new Error('Dataset not found');
        }
        const current = self.datasetRegistry.get(idHex);
        if (!areBytesEqual(current.owner, owner)) {
          throw new Error('Only dataset owner can revoke');
        }

        const updated = {
          ...current,
          authorizationStatus: 2, // Revoked
        };
        self.datasetRegistry.set(idHex, updated);

        return {
          result: undefined,
          context,
          gasCost: __compactRuntime.emptyRunningCost ? __compactRuntime.emptyRunningCost() : {},
        };
      },

      async submitTrainingCommitment(
        context,
        commitmentId,
        trainer,
        datasetIds,
        datasetCount,
        trainingTimestamp,
        modelHash
      ) {
        const idHex = bytesToHex(commitmentId);
        if (self.trainingCommitments.has(idHex)) {
          throw new Error('Commitment ID already exists');
        }
        const count = Number(datasetCount);
        if (count < 1 || count > 32) {
          throw new Error('Dataset count must be between 1 and 32');
        }

        for (let i = 0; i < count; i++) {
          const dsIdHex = bytesToHex(datasetIds[i]);
          if (!self.datasetRegistry.has(dsIdHex)) {
            throw new Error(`Dataset not registered: ${dsIdHex}`);
          }
        }

        const witnessCtx = {
          circuitContext: context,
          privateState: context?.callContext?.currentPrivateState,
        };
        const rawTimestamp = self.witnesses?.currentTimestamp ? await self.witnesses.currentTimestamp(witnessCtx) : BigInt(Math.floor(Date.now() / 1000));
        const now = BigInt(extractWitnessValue(rawTimestamp) || BigInt(Math.floor(Date.now() / 1000)));

        const commitment = {
          commitmentId,
          trainer,
          datasetCount: count,
          datasetIds,
          modelHash,
          trainingTimestamp: BigInt(trainingTimestamp),
          committedAt: now,
        };

        self.trainingCommitments.set(idHex, commitment);
        self.totalCommitmentsSubmitted += 1n;

        return {
          result: undefined,
          context,
          gasCost: __compactRuntime.emptyRunningCost ? __compactRuntime.emptyRunningCost() : {},
        };
      },

      async verifyCompliance(
        context,
        verificationId,
        commitmentId,
        minAuthorizedPct,
        minLicensedPct,
        allowRestricted,
        requireValidLicenses,
        verifier
      ) {
        const verIdHex = bytesToHex(verificationId);
        if (self.verificationResults.has(verIdHex)) {
          throw new Error('Verification ID already exists');
        }

        const commIdHex = bytesToHex(commitmentId);
        if (!self.trainingCommitments.has(commIdHex)) {
          throw new Error('Commitment not found');
        }

        const commitment = self.trainingCommitments.get(commIdHex);
        const count = commitment.datasetCount;

        const witnessCtx = {
          circuitContext: context,
          privateState: context?.callContext?.currentPrivateState,
        };

        const rawDataHashes = self.witnesses?.trainingDataHashes ? await self.witnesses.trainingDataHashes(witnessCtx) : [];
        const dataHashes = extractWitnessValue(rawDataHashes) || [];

        const rawLicenses = self.witnesses?.datasetLicenses ? await self.witnesses.datasetLicenses(witnessCtx) : [];
        const licenses = extractWitnessValue(rawLicenses) || [];

        let authorizedCount = 0;
        let licensedCount = 0;
        let restrictedCount = 0;
        let expiredCount = 0;

        for (let i = 0; i < count; i++) {
          const dsIdHex = bytesToHex(commitment.datasetIds[i]);
          if (!self.datasetRegistry.has(dsIdHex)) {
            throw new Error('Referenced dataset not in registry');
          }
          const ds = self.datasetRegistry.get(dsIdHex);

          // Invariant 1: Owner Authorization
          if (ds.authorizationStatus === 1) {
            authorizedCount++;
          }

          // Invariant 2: License Compatibility (0=Commercial, 1=OpenSource, 2=Proprietary, 3=Restricted)
          if (ds.licenseType !== 3) {
            licensedCount++;
          } else {
            restrictedCount++;
          }

          // Invariant 3: Temporal Validity Window
          if (commitment.trainingTimestamp < ds.validFrom || commitment.trainingTimestamp > ds.validUntil) {
            expiredCount++;
          }

          // Invariant 4: Cryptographic Dataset Integrity (Private witness check)
          if (dataHashes[i] && !areBytesEqual(dataHashes[i], ds.contentHash)) {
            throw new Error('Cryptographic content hash mismatch');
          }

          // Invariant 5: License Proof Witness Verification (Private witness check)
          if (licenses[i] && !areBytesEqual(licenses[i], ds.licenseHash)) {
            throw new Error('Cryptographic license commitment mismatch');
          }
        }

        const authPct = Math.floor((authorizedCount * 100) / count);
        const licPct = Math.floor((licensedCount * 100) / count);

        let isCompliant = true;
        if (authPct < Number(minAuthorizedPct)) isCompliant = false;
        if (licPct < Number(minLicensedPct)) isCompliant = false;
        if (!allowRestricted && restrictedCount > 0) isCompliant = false;
        if (requireValidLicenses && expiredCount > 0) isCompliant = false;

        const outcomeVal = isCompliant ? 1 : 0;

        const rawTimestamp = self.witnesses?.currentTimestamp ? await self.witnesses.currentTimestamp(witnessCtx) : BigInt(Math.floor(Date.now() / 1000));
        const now = BigInt(extractWitnessValue(rawTimestamp) || BigInt(Math.floor(Date.now() / 1000)));

        const result = {
          verificationId,
          commitmentId,
          verifier,
          outcome: outcomeVal,
          authorizedPercentage: authPct,
          licensedPercentage: licPct,
          restrictedCount,
          expiredCount,
          verifiedAt: now,
        };

        self.verificationResults.set(verIdHex, result);
        self.totalVerificationsRun += 1n;

        return {
          result: undefined,
          context,
          gasCost: __compactRuntime.emptyRunningCost ? __compactRuntime.emptyRunningCost() : {},
        };
      },

      async getVerificationStatus(context, verificationId) {
        const idHex = bytesToHex(verificationId);
        if (!self.verificationResults.has(idHex)) {
          throw new Error('Verification not found');
        }
        return {
          result: self.verificationResults.get(idHex),
          context,
          gasCost: __compactRuntime.emptyRunningCost ? __compactRuntime.emptyRunningCost() : {},
        };
      },

      async getDataset(context, datasetId) {
        const idHex = bytesToHex(datasetId);
        if (!self.datasetRegistry.has(idHex)) {
          throw new Error('Dataset not found');
        }
        return {
          result: self.datasetRegistry.get(idHex),
          context,
          gasCost: __compactRuntime.emptyRunningCost ? __compactRuntime.emptyRunningCost() : {},
        };
      },

      async getCommitment(context, commitmentId) {
        const idHex = bytesToHex(commitmentId);
        if (!self.trainingCommitments.has(idHex)) {
          throw new Error('Commitment not found');
        }
        return {
          result: self.trainingCommitments.get(idHex),
          context,
          gasCost: __compactRuntime.emptyRunningCost ? __compactRuntime.emptyRunningCost() : {},
        };
      },
    };

    this.impureCircuits = this.circuits;
  }

  initialState(_context) {
    return {
      datasetRegistry: this.datasetRegistry,
      trainingCommitments: this.trainingCommitments,
      verificationResults: this.verificationResults,
      totalDatasetsRegistered: this.totalDatasetsRegistered,
      totalCommitmentsSubmitted: this.totalCommitmentsSubmitted,
      totalVerificationsRun: this.totalVerificationsRun,
    };
  }
}

export function ledger(state) {
  return {
    datasetRegistry: state?.datasetRegistry ?? new Map(),
    trainingCommitments: state?.trainingCommitments ?? new Map(),
    verificationResults: state?.verificationResults ?? new Map(),
    totalDatasetsRegistered: state?.totalDatasetsRegistered ?? 0n,
    totalCommitmentsSubmitted: state?.totalCommitmentsSubmitted ?? 0n,
    totalVerificationsRun: state?.totalVerificationsRun ?? 0n,
  };
}

export const pureCircuits = {
  getVerificationStatus(context, verificationId) {
    const idHex = bytesToHex(verificationId);
    return context?.state?.verificationResults?.get(idHex);
  },
  getDataset(context, datasetId) {
    const idHex = bytesToHex(datasetId);
    return context?.state?.datasetRegistry?.get(idHex);
  },
  getCommitment(context, commitmentId) {
    const idHex = bytesToHex(commitmentId);
    return context?.state?.trainingCommitments?.get(idHex);
  },
};

export const expectedVk = {
  registerDataset: '0000000000000000000000000000000000000000000000000000000000000001',
  authorizeDataset: '0000000000000000000000000000000000000000000000000000000000000002',
  revokeDataset: '0000000000000000000000000000000000000000000000000000000000000003',
  submitTrainingCommitment: '0000000000000000000000000000000000000000000000000000000000000004',
  verifyCompliance: '0000000000000000000000000000000000000000000000000000000000000005',
};
