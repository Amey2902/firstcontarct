import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type DatasetInfo = {
  datasetId: Uint8Array;
  owner: Uint8Array;
  contentHash: Uint8Array;
  licenseHash: Uint8Array;
  licenseType: number;
  authorizationStatus: number;
  validFrom: bigint;
  validUntil: bigint;
  registeredAt: bigint;
  metadataHash: Uint8Array;
};

export type TrainingCommitment = {
  commitmentId: Uint8Array;
  trainer: Uint8Array;
  datasetCount: number;
  datasetIds: Uint8Array[];
  modelHash: Uint8Array;
  trainingTimestamp: bigint;
  committedAt: bigint;
};

export type VerificationResult = {
  verificationId: Uint8Array;
  commitmentId: Uint8Array;
  verifier: Uint8Array;
  outcome: number;
  authorizedPercentage: number;
  licensedPercentage: number;
  restrictedCount: number;
  expiredCount: number;
  verifiedAt: bigint;
};

export type Ledger = {
  readonly datasetRegistry: ReadonlyMap<string, DatasetInfo>;
  readonly trainingCommitments: ReadonlyMap<string, TrainingCommitment>;
  readonly verificationResults: ReadonlyMap<string, VerificationResult>;
  readonly totalDatasetsRegistered: bigint;
  readonly totalCommitmentsSubmitted: bigint;
  readonly totalVerificationsRun: bigint;
};

export type Witnesses<T_PrivateState = any> = {
  datasetContentHash: (context: __compactRuntime.WitnessContext<__compactRuntime.CircuitContext<T_PrivateState>, T_PrivateState>) => [T_PrivateState, Uint8Array] | Uint8Array;
  licenseProof: (context: __compactRuntime.WitnessContext<__compactRuntime.CircuitContext<T_PrivateState>, T_PrivateState>) => [T_PrivateState, Uint8Array] | Uint8Array;
  trainingDataHashes: (context: __compactRuntime.WitnessContext<__compactRuntime.CircuitContext<T_PrivateState>, T_PrivateState>) => [T_PrivateState, Uint8Array[]] | Uint8Array[];
  datasetLicenses: (context: __compactRuntime.WitnessContext<__compactRuntime.CircuitContext<T_PrivateState>, T_PrivateState>) => [T_PrivateState, Uint8Array[]] | Uint8Array[];
  currentTimestamp: (context: __compactRuntime.WitnessContext<__compactRuntime.CircuitContext<T_PrivateState>, T_PrivateState>) => [T_PrivateState, bigint] | bigint;
};

export type ImpureCircuits<T_PrivateState = any> = {
  registerDataset(
    context: __compactRuntime.CircuitContext<T_PrivateState>,
    datasetId: Uint8Array,
    owner: Uint8Array,
    contentHash: Uint8Array,
    licenseHash: Uint8Array,
    licenseType: number,
    authorizationStatus: number,
    validFrom: bigint,
    validUntil: bigint,
    metadataHash: Uint8Array
  ): Promise<__compactRuntime.CircuitResults<T_PrivateState, void>>;

  authorizeDataset(
    context: __compactRuntime.CircuitContext<T_PrivateState>,
    datasetId: Uint8Array,
    owner: Uint8Array
  ): Promise<__compactRuntime.CircuitResults<T_PrivateState, void>>;

  revokeDataset(
    context: __compactRuntime.CircuitContext<T_PrivateState>,
    datasetId: Uint8Array,
    owner: Uint8Array
  ): Promise<__compactRuntime.CircuitResults<T_PrivateState, void>>;

  submitTrainingCommitment(
    context: __compactRuntime.CircuitContext<T_PrivateState>,
    commitmentId: Uint8Array,
    trainer: Uint8Array,
    datasetIds: Uint8Array[],
    datasetCount: number,
    trainingTimestamp: bigint,
    modelHash: Uint8Array
  ): Promise<__compactRuntime.CircuitResults<T_PrivateState, void>>;

  verifyCompliance(
    context: __compactRuntime.CircuitContext<T_PrivateState>,
    verificationId: Uint8Array,
    commitmentId: Uint8Array,
    minAuthorizedPct: number,
    minLicensedPct: number,
    allowRestricted: boolean,
    requireValidLicenses: boolean,
    verifier: Uint8Array
  ): Promise<__compactRuntime.CircuitResults<T_PrivateState, void>>;

  getVerificationStatus(
    context: __compactRuntime.CircuitContext<T_PrivateState>,
    verificationId: Uint8Array
  ): Promise<__compactRuntime.CircuitResults<T_PrivateState, VerificationResult>>;

  getDataset(
    context: __compactRuntime.CircuitContext<T_PrivateState>,
    datasetId: Uint8Array
  ): Promise<__compactRuntime.CircuitResults<T_PrivateState, DatasetInfo>>;

  getCommitment(
    context: __compactRuntime.CircuitContext<T_PrivateState>,
    commitmentId: Uint8Array
  ): Promise<__compactRuntime.CircuitResults<T_PrivateState, TrainingCommitment>>;
};

export type PureCircuits = {
  getVerificationStatus(
    context: __compactRuntime.QueryContext,
    verificationId: Uint8Array
  ): VerificationResult;

  getDataset(
    context: __compactRuntime.QueryContext,
    datasetId: Uint8Array
  ): DatasetInfo;

  getCommitment(
    context: __compactRuntime.QueryContext,
    commitmentId: Uint8Array
  ): TrainingCommitment;
};

export declare class Contract<T_PrivateState = any> {
  witnesses: Witnesses<T_PrivateState>;
  circuits: ImpureCircuits<T_PrivateState>;
  impureCircuits: ImpureCircuits<T_PrivateState>;
  constructor(witnesses: Witnesses<T_PrivateState>);
  initialState(context?: any): any;
}

export declare const ledger: (state: any) => Ledger;
export declare const pureCircuits: PureCircuits;
export declare const expectedVk: Record<string, string>;
