import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
  balanceOf(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, bigint];
}

export type ImpureCircuits<PS> = {
  register(context: __compactRuntime.CircuitContext<PS>, commitment_0: string): __compactRuntime.CircuitResults<PS, []>;
  upgrade(context: __compactRuntime.CircuitContext<PS>, commitment_0: string): __compactRuntime.CircuitResults<PS, []>;
  claimPerk(context: __compactRuntime.CircuitContext<PS>,
            commitment_0: string,
            perkId_0: bigint,
            requiredTier_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  leave(context: __compactRuntime.CircuitContext<PS>, commitment_0: string): __compactRuntime.CircuitResults<PS, []>;
}

export type ProvableCircuits<PS> = {
  register(context: __compactRuntime.CircuitContext<PS>, commitment_0: string): __compactRuntime.CircuitResults<PS, []>;
  upgrade(context: __compactRuntime.CircuitContext<PS>, commitment_0: string): __compactRuntime.CircuitResults<PS, []>;
  claimPerk(context: __compactRuntime.CircuitContext<PS>,
            commitment_0: string,
            perkId_0: bigint,
            requiredTier_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  leave(context: __compactRuntime.CircuitContext<PS>, commitment_0: string): __compactRuntime.CircuitResults<PS, []>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  register(context: __compactRuntime.CircuitContext<PS>, commitment_0: string): __compactRuntime.CircuitResults<PS, []>;
  upgrade(context: __compactRuntime.CircuitContext<PS>, commitment_0: string): __compactRuntime.CircuitResults<PS, []>;
  claimPerk(context: __compactRuntime.CircuitContext<PS>,
            commitment_0: string,
            perkId_0: bigint,
            requiredTier_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  leave(context: __compactRuntime.CircuitContext<PS>, commitment_0: string): __compactRuntime.CircuitResults<PS, []>;
}

export type Ledger = {
  readonly thresholds: bigint[];
  members: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: string): boolean;
    lookup(key_0: string): bigint;
    [Symbol.iterator](): Iterator<[string, bigint]>
  };
  readonly memberCount: bigint;
  readonly perkClaims: bigint;
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
