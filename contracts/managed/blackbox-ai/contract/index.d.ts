import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type DatasetInfo = { datasetId: Uint8Array;
                            owner: Uint8Array;
                            contentHash: Uint8Array;
                            licenseHash: Uint8Array;
                            licenseType: bigint;
                            authorizationStatus: bigint;
                            validFrom: bigint;
                            validUntil: bigint;
                            registeredAt: bigint;
                            metadataHash: Uint8Array
                          };

export type TrainingCommitment = { commitmentId: Uint8Array;
                                   trainer: Uint8Array;
                                   datasetIds: Uint8Array[];
                                   datasetCount: bigint;
                                   trainingTimestamp: bigint;
                                   modelHash: Uint8Array;
                                   committedAt: bigint
                                 };

export type Policy = { policyId: Uint8Array;
                       name: Uint8Array;
                       minAuthorizedPercentage: bigint;
                       minLicensedPercentage: bigint;
                       allowRestricted: boolean;
                       requireValidLicenses: boolean;
                       createdAt: bigint;
                       createdBy: Uint8Array
                     };

export type VerificationResult = { verificationId: Uint8Array;
                                   commitmentId: Uint8Array;
                                   policyId: Uint8Array;
                                   isCompliant: boolean;
                                   authorizedPercentage: bigint;
                                   licensedPercentage: bigint;
                                   restrictedCount: bigint;
                                   expiredLicenseCount: bigint;
                                   verifiedAt: bigint;
                                   verifiedBy: Uint8Array
                                 };

export type Witnesses<PS> = {
  datasetContentHash(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  licenseProof(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  trainingDataHashes(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array[]];
  datasetLicenses(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array[]];
  currentTimestamp(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, bigint];
}

export type ImpureCircuits<PS> = {
  registerDataset(context: __compactRuntime.CircuitContext<PS>,
                  datasetId_0: Uint8Array,
                  owner_0: Uint8Array,
                  contentHash_0: Uint8Array,
                  licenseHash_0: Uint8Array,
                  licenseType_0: bigint,
                  authorizationStatus_0: bigint,
                  validFrom_0: bigint,
                  validUntil_0: bigint,
                  metadataHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  commitTraining(context: __compactRuntime.CircuitContext<PS>,
                 commitmentId_0: Uint8Array,
                 trainer_0: Uint8Array,
                 datasetIds_0: Uint8Array[],
                 datasetCount_0: bigint,
                 trainingTimestamp_0: bigint,
                 modelHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  createPolicy(context: __compactRuntime.CircuitContext<PS>,
               policyId_0: Uint8Array,
               name_0: Uint8Array,
               minAuthorizedPercentage_0: bigint,
               minLicensedPercentage_0: bigint,
               allowRestricted_0: boolean,
               requireValidLicenses_0: boolean,
               createdBy_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  verifyCompliance(context: __compactRuntime.CircuitContext<PS>,
                   verificationId_0: Uint8Array,
                   commitmentId_0: Uint8Array,
                   policyId_0: Uint8Array,
                   verifier_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getDataset(context: __compactRuntime.CircuitContext<PS>,
             datasetId_0: Uint8Array): __compactRuntime.CircuitResults<PS, DatasetInfo>;
  getCommitment(context: __compactRuntime.CircuitContext<PS>,
                commitmentId_0: Uint8Array): __compactRuntime.CircuitResults<PS, TrainingCommitment>;
  getVerification(context: __compactRuntime.CircuitContext<PS>,
                  verificationId_0: Uint8Array): __compactRuntime.CircuitResults<PS, VerificationResult>;
  getPolicy(context: __compactRuntime.CircuitContext<PS>, policyId_0: Uint8Array): __compactRuntime.CircuitResults<PS, Policy>;
  updateAuthorization(context: __compactRuntime.CircuitContext<PS>,
                      datasetId_0: Uint8Array,
                      newStatus_0: bigint,
                      owner_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  revokeDataset(context: __compactRuntime.CircuitContext<PS>,
                datasetId_0: Uint8Array,
                owner_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
}

export type ProvableCircuits<PS> = {
  registerDataset(context: __compactRuntime.CircuitContext<PS>,
                  datasetId_0: Uint8Array,
                  owner_0: Uint8Array,
                  contentHash_0: Uint8Array,
                  licenseHash_0: Uint8Array,
                  licenseType_0: bigint,
                  authorizationStatus_0: bigint,
                  validFrom_0: bigint,
                  validUntil_0: bigint,
                  metadataHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  commitTraining(context: __compactRuntime.CircuitContext<PS>,
                 commitmentId_0: Uint8Array,
                 trainer_0: Uint8Array,
                 datasetIds_0: Uint8Array[],
                 datasetCount_0: bigint,
                 trainingTimestamp_0: bigint,
                 modelHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  createPolicy(context: __compactRuntime.CircuitContext<PS>,
               policyId_0: Uint8Array,
               name_0: Uint8Array,
               minAuthorizedPercentage_0: bigint,
               minLicensedPercentage_0: bigint,
               allowRestricted_0: boolean,
               requireValidLicenses_0: boolean,
               createdBy_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  verifyCompliance(context: __compactRuntime.CircuitContext<PS>,
                   verificationId_0: Uint8Array,
                   commitmentId_0: Uint8Array,
                   policyId_0: Uint8Array,
                   verifier_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getDataset(context: __compactRuntime.CircuitContext<PS>,
             datasetId_0: Uint8Array): __compactRuntime.CircuitResults<PS, DatasetInfo>;
  getCommitment(context: __compactRuntime.CircuitContext<PS>,
                commitmentId_0: Uint8Array): __compactRuntime.CircuitResults<PS, TrainingCommitment>;
  getVerification(context: __compactRuntime.CircuitContext<PS>,
                  verificationId_0: Uint8Array): __compactRuntime.CircuitResults<PS, VerificationResult>;
  getPolicy(context: __compactRuntime.CircuitContext<PS>, policyId_0: Uint8Array): __compactRuntime.CircuitResults<PS, Policy>;
  updateAuthorization(context: __compactRuntime.CircuitContext<PS>,
                      datasetId_0: Uint8Array,
                      newStatus_0: bigint,
                      owner_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  revokeDataset(context: __compactRuntime.CircuitContext<PS>,
                datasetId_0: Uint8Array,
                owner_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  registerDataset(context: __compactRuntime.CircuitContext<PS>,
                  datasetId_0: Uint8Array,
                  owner_0: Uint8Array,
                  contentHash_0: Uint8Array,
                  licenseHash_0: Uint8Array,
                  licenseType_0: bigint,
                  authorizationStatus_0: bigint,
                  validFrom_0: bigint,
                  validUntil_0: bigint,
                  metadataHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  commitTraining(context: __compactRuntime.CircuitContext<PS>,
                 commitmentId_0: Uint8Array,
                 trainer_0: Uint8Array,
                 datasetIds_0: Uint8Array[],
                 datasetCount_0: bigint,
                 trainingTimestamp_0: bigint,
                 modelHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  createPolicy(context: __compactRuntime.CircuitContext<PS>,
               policyId_0: Uint8Array,
               name_0: Uint8Array,
               minAuthorizedPercentage_0: bigint,
               minLicensedPercentage_0: bigint,
               allowRestricted_0: boolean,
               requireValidLicenses_0: boolean,
               createdBy_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  verifyCompliance(context: __compactRuntime.CircuitContext<PS>,
                   verificationId_0: Uint8Array,
                   commitmentId_0: Uint8Array,
                   policyId_0: Uint8Array,
                   verifier_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getDataset(context: __compactRuntime.CircuitContext<PS>,
             datasetId_0: Uint8Array): __compactRuntime.CircuitResults<PS, DatasetInfo>;
  getCommitment(context: __compactRuntime.CircuitContext<PS>,
                commitmentId_0: Uint8Array): __compactRuntime.CircuitResults<PS, TrainingCommitment>;
  getVerification(context: __compactRuntime.CircuitContext<PS>,
                  verificationId_0: Uint8Array): __compactRuntime.CircuitResults<PS, VerificationResult>;
  getPolicy(context: __compactRuntime.CircuitContext<PS>, policyId_0: Uint8Array): __compactRuntime.CircuitResults<PS, Policy>;
  updateAuthorization(context: __compactRuntime.CircuitContext<PS>,
                      datasetId_0: Uint8Array,
                      newStatus_0: bigint,
                      owner_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  revokeDataset(context: __compactRuntime.CircuitContext<PS>,
                datasetId_0: Uint8Array,
                owner_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
}

export type Ledger = {
  datasetRegistry: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): DatasetInfo;
    [Symbol.iterator](): Iterator<[Uint8Array, DatasetInfo]>
  };
  trainingCommitments: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): TrainingCommitment;
    [Symbol.iterator](): Iterator<[Uint8Array, TrainingCommitment]>
  };
  verificationResults: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): VerificationResult;
    [Symbol.iterator](): Iterator<[Uint8Array, VerificationResult]>
  };
  policyRegistry: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Policy;
    [Symbol.iterator](): Iterator<[Uint8Array, Policy]>
  };
  readonly datasetCount: bigint;
  readonly commitmentCount: bigint;
  readonly verificationCount: bigint;
  readonly policyCount: bigint;
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
