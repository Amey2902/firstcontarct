import * as __compactRuntime from '@midnight-ntwrk/compact-runtime';
__compactRuntime.checkRuntimeVersion('0.19.0');

const _descriptor_0 = new __compactRuntime.CompactTypeBytes(32);

const _descriptor_1 = new __compactRuntime.CompactTypeUnsignedInteger(255n, 1);

const _descriptor_2 = new __compactRuntime.CompactTypeUnsignedInteger(18446744073709551615n, 8);

class _DatasetInfo_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_2.alignment().concat(_descriptor_2.alignment().concat(_descriptor_2.alignment().concat(_descriptor_0.alignment())))))))));
  }
  fromValue(value_0) {
    return {
      datasetId: _descriptor_0.fromValue(value_0),
      owner: _descriptor_0.fromValue(value_0),
      contentHash: _descriptor_0.fromValue(value_0),
      licenseHash: _descriptor_0.fromValue(value_0),
      licenseType: _descriptor_1.fromValue(value_0),
      authorizationStatus: _descriptor_1.fromValue(value_0),
      validFrom: _descriptor_2.fromValue(value_0),
      validUntil: _descriptor_2.fromValue(value_0),
      registeredAt: _descriptor_2.fromValue(value_0),
      metadataHash: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.datasetId).concat(_descriptor_0.toValue(value_0.owner).concat(_descriptor_0.toValue(value_0.contentHash).concat(_descriptor_0.toValue(value_0.licenseHash).concat(_descriptor_1.toValue(value_0.licenseType).concat(_descriptor_1.toValue(value_0.authorizationStatus).concat(_descriptor_2.toValue(value_0.validFrom).concat(_descriptor_2.toValue(value_0.validUntil).concat(_descriptor_2.toValue(value_0.registeredAt).concat(_descriptor_0.toValue(value_0.metadataHash))))))))));
  }
}

const _descriptor_3 = new _DatasetInfo_0();

const _descriptor_4 = __compactRuntime.CompactTypeBoolean;

const _descriptor_5 = new __compactRuntime.CompactTypeBytes(64);

class _Policy_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_5.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_4.alignment().concat(_descriptor_4.alignment().concat(_descriptor_2.alignment().concat(_descriptor_0.alignment())))))));
  }
  fromValue(value_0) {
    return {
      policyId: _descriptor_0.fromValue(value_0),
      name: _descriptor_5.fromValue(value_0),
      minAuthorizedPercentage: _descriptor_1.fromValue(value_0),
      minLicensedPercentage: _descriptor_1.fromValue(value_0),
      allowRestricted: _descriptor_4.fromValue(value_0),
      requireValidLicenses: _descriptor_4.fromValue(value_0),
      createdAt: _descriptor_2.fromValue(value_0),
      createdBy: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.policyId).concat(_descriptor_5.toValue(value_0.name).concat(_descriptor_1.toValue(value_0.minAuthorizedPercentage).concat(_descriptor_1.toValue(value_0.minLicensedPercentage).concat(_descriptor_4.toValue(value_0.allowRestricted).concat(_descriptor_4.toValue(value_0.requireValidLicenses).concat(_descriptor_2.toValue(value_0.createdAt).concat(_descriptor_0.toValue(value_0.createdBy))))))));
  }
}

const _descriptor_6 = new _Policy_0();

const _descriptor_7 = new __compactRuntime.CompactTypeVector(32, _descriptor_0);

class _TrainingCommitment_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_7.alignment().concat(_descriptor_1.alignment().concat(_descriptor_2.alignment().concat(_descriptor_0.alignment().concat(_descriptor_2.alignment()))))));
  }
  fromValue(value_0) {
    return {
      commitmentId: _descriptor_0.fromValue(value_0),
      trainer: _descriptor_0.fromValue(value_0),
      datasetIds: _descriptor_7.fromValue(value_0),
      datasetCount: _descriptor_1.fromValue(value_0),
      trainingTimestamp: _descriptor_2.fromValue(value_0),
      modelHash: _descriptor_0.fromValue(value_0),
      committedAt: _descriptor_2.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.commitmentId).concat(_descriptor_0.toValue(value_0.trainer).concat(_descriptor_7.toValue(value_0.datasetIds).concat(_descriptor_1.toValue(value_0.datasetCount).concat(_descriptor_2.toValue(value_0.trainingTimestamp).concat(_descriptor_0.toValue(value_0.modelHash).concat(_descriptor_2.toValue(value_0.committedAt)))))));
  }
}

const _descriptor_8 = new _TrainingCommitment_0();

class _VerificationResult_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_4.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_2.alignment().concat(_descriptor_0.alignment())))))))));
  }
  fromValue(value_0) {
    return {
      verificationId: _descriptor_0.fromValue(value_0),
      commitmentId: _descriptor_0.fromValue(value_0),
      policyId: _descriptor_0.fromValue(value_0),
      isCompliant: _descriptor_4.fromValue(value_0),
      authorizedPercentage: _descriptor_1.fromValue(value_0),
      licensedPercentage: _descriptor_1.fromValue(value_0),
      restrictedCount: _descriptor_1.fromValue(value_0),
      expiredLicenseCount: _descriptor_1.fromValue(value_0),
      verifiedAt: _descriptor_2.fromValue(value_0),
      verifiedBy: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.verificationId).concat(_descriptor_0.toValue(value_0.commitmentId).concat(_descriptor_0.toValue(value_0.policyId).concat(_descriptor_4.toValue(value_0.isCompliant).concat(_descriptor_1.toValue(value_0.authorizedPercentage).concat(_descriptor_1.toValue(value_0.licensedPercentage).concat(_descriptor_1.toValue(value_0.restrictedCount).concat(_descriptor_1.toValue(value_0.expiredLicenseCount).concat(_descriptor_2.toValue(value_0.verifiedAt).concat(_descriptor_0.toValue(value_0.verifiedBy))))))))));
  }
}

const _descriptor_9 = new _VerificationResult_0();

const _descriptor_10 = new __compactRuntime.CompactTypeUnsignedInteger(65535n, 2);

class _Either_0 {
  alignment() {
    return _descriptor_4.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment()));
  }
  fromValue(value_0) {
    return {
      is_left: _descriptor_4.fromValue(value_0),
      left: _descriptor_0.fromValue(value_0),
      right: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_4.toValue(value_0.is_left).concat(_descriptor_0.toValue(value_0.left).concat(_descriptor_0.toValue(value_0.right)));
  }
}

const _descriptor_11 = new _Either_0();

const _descriptor_12 = new __compactRuntime.CompactTypeUnsignedInteger(340282366920938463463374607431768211455n, 16);

class _ContractAddress_0 {
  alignment() {
    return _descriptor_0.alignment();
  }
  fromValue(value_0) {
    return {
      bytes: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.bytes);
  }
}

const _descriptor_13 = new _ContractAddress_0();

const _descriptor_14 = new __compactRuntime.CompactTypeUnsignedInteger(4294967295n, 4);

export class Contract {
  witnesses;
  constructor(...args_0) {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`Contract constructor: expected 1 argument, received ${args_0.length}`);
    }
    const witnesses_0 = args_0[0];
    if (typeof(witnesses_0) !== 'object') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor is not an object');
    }
    if (typeof(witnesses_0.datasetContentHash) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named datasetContentHash');
    }
    if (typeof(witnesses_0.licenseProof) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named licenseProof');
    }
    if (typeof(witnesses_0.trainingDataHashes) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named trainingDataHashes');
    }
    if (typeof(witnesses_0.datasetLicenses) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named datasetLicenses');
    }
    if (typeof(witnesses_0.currentTimestamp) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named currentTimestamp');
    }
    this.witnesses = witnesses_0;
    this.circuits = {
      registerDataset: async (...args_1) => {
        if (args_1.length !== 10) {
          throw new __compactRuntime.CompactError(`registerDataset: expected 10 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const datasetId_0 = args_1[1];
        const owner_0 = args_1[2];
        const contentHash_0 = args_1[3];
        const licenseHash_0 = args_1[4];
        const licenseType_0 = args_1[5];
        const authorizationStatus_0 = args_1[6];
        const validFrom_0 = args_1[7];
        const validUntil_0 = args_1[8];
        const metadataHash_0 = args_1[9];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('registerDataset',
                                     'argument 1 (as invoked from Typescript)',
                                     'blackbox-ai.compact line 132 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(datasetId_0.buffer instanceof ArrayBuffer && datasetId_0.BYTES_PER_ELEMENT === 1 && datasetId_0.length === 32)) {
          __compactRuntime.typeError('registerDataset',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'blackbox-ai.compact line 132 char 1',
                                     'Bytes<32>',
                                     datasetId_0)
        }
        if (!(owner_0.buffer instanceof ArrayBuffer && owner_0.BYTES_PER_ELEMENT === 1 && owner_0.length === 32)) {
          __compactRuntime.typeError('registerDataset',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'blackbox-ai.compact line 132 char 1',
                                     'Bytes<32>',
                                     owner_0)
        }
        if (!(contentHash_0.buffer instanceof ArrayBuffer && contentHash_0.BYTES_PER_ELEMENT === 1 && contentHash_0.length === 32)) {
          __compactRuntime.typeError('registerDataset',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'blackbox-ai.compact line 132 char 1',
                                     'Bytes<32>',
                                     contentHash_0)
        }
        if (!(licenseHash_0.buffer instanceof ArrayBuffer && licenseHash_0.BYTES_PER_ELEMENT === 1 && licenseHash_0.length === 32)) {
          __compactRuntime.typeError('registerDataset',
                                     'argument 4 (argument 5 as invoked from Typescript)',
                                     'blackbox-ai.compact line 132 char 1',
                                     'Bytes<32>',
                                     licenseHash_0)
        }
        if (!(typeof(licenseType_0) === 'bigint' && licenseType_0 >= 0n && licenseType_0 <= 255n)) {
          __compactRuntime.typeError('registerDataset',
                                     'argument 5 (argument 6 as invoked from Typescript)',
                                     'blackbox-ai.compact line 132 char 1',
                                     'Uint<0..256>',
                                     licenseType_0)
        }
        if (!(typeof(authorizationStatus_0) === 'bigint' && authorizationStatus_0 >= 0n && authorizationStatus_0 <= 255n)) {
          __compactRuntime.typeError('registerDataset',
                                     'argument 6 (argument 7 as invoked from Typescript)',
                                     'blackbox-ai.compact line 132 char 1',
                                     'Uint<0..256>',
                                     authorizationStatus_0)
        }
        if (!(typeof(validFrom_0) === 'bigint' && validFrom_0 >= 0n && validFrom_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('registerDataset',
                                     'argument 7 (argument 8 as invoked from Typescript)',
                                     'blackbox-ai.compact line 132 char 1',
                                     'Uint<0..18446744073709551616>',
                                     validFrom_0)
        }
        if (!(typeof(validUntil_0) === 'bigint' && validUntil_0 >= 0n && validUntil_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('registerDataset',
                                     'argument 8 (argument 9 as invoked from Typescript)',
                                     'blackbox-ai.compact line 132 char 1',
                                     'Uint<0..18446744073709551616>',
                                     validUntil_0)
        }
        if (!(metadataHash_0.buffer instanceof ArrayBuffer && metadataHash_0.BYTES_PER_ELEMENT === 1 && metadataHash_0.length === 32)) {
          __compactRuntime.typeError('registerDataset',
                                     'argument 9 (argument 10 as invoked from Typescript)',
                                     'blackbox-ai.compact line 132 char 1',
                                     'Bytes<32>',
                                     metadataHash_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(datasetId_0).concat(_descriptor_0.toValue(owner_0).concat(_descriptor_0.toValue(contentHash_0).concat(_descriptor_0.toValue(licenseHash_0).concat(_descriptor_1.toValue(licenseType_0).concat(_descriptor_1.toValue(authorizationStatus_0).concat(_descriptor_2.toValue(validFrom_0).concat(_descriptor_2.toValue(validUntil_0).concat(_descriptor_0.toValue(metadataHash_0))))))))),
            alignment: _descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_2.alignment().concat(_descriptor_2.alignment().concat(_descriptor_0.alignment()))))))))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._registerDataset_0(context,
                                                       partialProofData,
                                                       datasetId_0,
                                                       owner_0,
                                                       contentHash_0,
                                                       licenseHash_0,
                                                       licenseType_0,
                                                       authorizationStatus_0,
                                                       validFrom_0,
                                                       validUntil_0,
                                                       metadataHash_0);
        partialProofData.output = { value: [], alignment: [] };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      },
      commitTraining: async (...args_1) => {
        if (args_1.length !== 7) {
          throw new __compactRuntime.CompactError(`commitTraining: expected 7 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const commitmentId_0 = args_1[1];
        const trainer_0 = args_1[2];
        const datasetIds_0 = args_1[3];
        const datasetCount_0 = args_1[4];
        const trainingTimestamp_0 = args_1[5];
        const modelHash_0 = args_1[6];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('commitTraining',
                                     'argument 1 (as invoked from Typescript)',
                                     'blackbox-ai.compact line 186 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(commitmentId_0.buffer instanceof ArrayBuffer && commitmentId_0.BYTES_PER_ELEMENT === 1 && commitmentId_0.length === 32)) {
          __compactRuntime.typeError('commitTraining',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'blackbox-ai.compact line 186 char 1',
                                     'Bytes<32>',
                                     commitmentId_0)
        }
        if (!(trainer_0.buffer instanceof ArrayBuffer && trainer_0.BYTES_PER_ELEMENT === 1 && trainer_0.length === 32)) {
          __compactRuntime.typeError('commitTraining',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'blackbox-ai.compact line 186 char 1',
                                     'Bytes<32>',
                                     trainer_0)
        }
        if (!(Array.isArray(datasetIds_0) && datasetIds_0.length === 32 && datasetIds_0.every((t) => t.buffer instanceof ArrayBuffer && t.BYTES_PER_ELEMENT === 1 && t.length === 32))) {
          __compactRuntime.typeError('commitTraining',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'blackbox-ai.compact line 186 char 1',
                                     'Vector<32, Bytes<32>>',
                                     datasetIds_0)
        }
        if (!(typeof(datasetCount_0) === 'bigint' && datasetCount_0 >= 0n && datasetCount_0 <= 255n)) {
          __compactRuntime.typeError('commitTraining',
                                     'argument 4 (argument 5 as invoked from Typescript)',
                                     'blackbox-ai.compact line 186 char 1',
                                     'Uint<0..256>',
                                     datasetCount_0)
        }
        if (!(typeof(trainingTimestamp_0) === 'bigint' && trainingTimestamp_0 >= 0n && trainingTimestamp_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('commitTraining',
                                     'argument 5 (argument 6 as invoked from Typescript)',
                                     'blackbox-ai.compact line 186 char 1',
                                     'Uint<0..18446744073709551616>',
                                     trainingTimestamp_0)
        }
        if (!(modelHash_0.buffer instanceof ArrayBuffer && modelHash_0.BYTES_PER_ELEMENT === 1 && modelHash_0.length === 32)) {
          __compactRuntime.typeError('commitTraining',
                                     'argument 6 (argument 7 as invoked from Typescript)',
                                     'blackbox-ai.compact line 186 char 1',
                                     'Bytes<32>',
                                     modelHash_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(commitmentId_0).concat(_descriptor_0.toValue(trainer_0).concat(_descriptor_7.toValue(datasetIds_0).concat(_descriptor_1.toValue(datasetCount_0).concat(_descriptor_2.toValue(trainingTimestamp_0).concat(_descriptor_0.toValue(modelHash_0)))))),
            alignment: _descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_7.alignment().concat(_descriptor_1.alignment().concat(_descriptor_2.alignment().concat(_descriptor_0.alignment())))))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._commitTraining_0(context,
                                                      partialProofData,
                                                      commitmentId_0,
                                                      trainer_0,
                                                      datasetIds_0,
                                                      datasetCount_0,
                                                      trainingTimestamp_0,
                                                      modelHash_0);
        partialProofData.output = { value: [], alignment: [] };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      },
      createPolicy: async (...args_1) => {
        if (args_1.length !== 8) {
          throw new __compactRuntime.CompactError(`createPolicy: expected 8 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const policyId_0 = args_1[1];
        const name_0 = args_1[2];
        const minAuthorizedPercentage_0 = args_1[3];
        const minLicensedPercentage_0 = args_1[4];
        const allowRestricted_0 = args_1[5];
        const requireValidLicenses_0 = args_1[6];
        const createdBy_0 = args_1[7];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('createPolicy',
                                     'argument 1 (as invoked from Typescript)',
                                     'blackbox-ai.compact line 238 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(policyId_0.buffer instanceof ArrayBuffer && policyId_0.BYTES_PER_ELEMENT === 1 && policyId_0.length === 32)) {
          __compactRuntime.typeError('createPolicy',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'blackbox-ai.compact line 238 char 1',
                                     'Bytes<32>',
                                     policyId_0)
        }
        if (!(name_0.buffer instanceof ArrayBuffer && name_0.BYTES_PER_ELEMENT === 1 && name_0.length === 64)) {
          __compactRuntime.typeError('createPolicy',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'blackbox-ai.compact line 238 char 1',
                                     'Bytes<64>',
                                     name_0)
        }
        if (!(typeof(minAuthorizedPercentage_0) === 'bigint' && minAuthorizedPercentage_0 >= 0n && minAuthorizedPercentage_0 <= 255n)) {
          __compactRuntime.typeError('createPolicy',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'blackbox-ai.compact line 238 char 1',
                                     'Uint<0..256>',
                                     minAuthorizedPercentage_0)
        }
        if (!(typeof(minLicensedPercentage_0) === 'bigint' && minLicensedPercentage_0 >= 0n && minLicensedPercentage_0 <= 255n)) {
          __compactRuntime.typeError('createPolicy',
                                     'argument 4 (argument 5 as invoked from Typescript)',
                                     'blackbox-ai.compact line 238 char 1',
                                     'Uint<0..256>',
                                     minLicensedPercentage_0)
        }
        if (!(typeof(allowRestricted_0) === 'boolean')) {
          __compactRuntime.typeError('createPolicy',
                                     'argument 5 (argument 6 as invoked from Typescript)',
                                     'blackbox-ai.compact line 238 char 1',
                                     'Boolean',
                                     allowRestricted_0)
        }
        if (!(typeof(requireValidLicenses_0) === 'boolean')) {
          __compactRuntime.typeError('createPolicy',
                                     'argument 6 (argument 7 as invoked from Typescript)',
                                     'blackbox-ai.compact line 238 char 1',
                                     'Boolean',
                                     requireValidLicenses_0)
        }
        if (!(createdBy_0.buffer instanceof ArrayBuffer && createdBy_0.BYTES_PER_ELEMENT === 1 && createdBy_0.length === 32)) {
          __compactRuntime.typeError('createPolicy',
                                     'argument 7 (argument 8 as invoked from Typescript)',
                                     'blackbox-ai.compact line 238 char 1',
                                     'Bytes<32>',
                                     createdBy_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(policyId_0).concat(_descriptor_5.toValue(name_0).concat(_descriptor_1.toValue(minAuthorizedPercentage_0).concat(_descriptor_1.toValue(minLicensedPercentage_0).concat(_descriptor_4.toValue(allowRestricted_0).concat(_descriptor_4.toValue(requireValidLicenses_0).concat(_descriptor_0.toValue(createdBy_0))))))),
            alignment: _descriptor_0.alignment().concat(_descriptor_5.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_4.alignment().concat(_descriptor_4.alignment().concat(_descriptor_0.alignment()))))))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._createPolicy_0(context,
                                                    partialProofData,
                                                    policyId_0,
                                                    name_0,
                                                    minAuthorizedPercentage_0,
                                                    minLicensedPercentage_0,
                                                    allowRestricted_0,
                                                    requireValidLicenses_0,
                                                    createdBy_0);
        partialProofData.output = { value: [], alignment: [] };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      },
      verifyCompliance: async (...args_1) => {
        if (args_1.length !== 5) {
          throw new __compactRuntime.CompactError(`verifyCompliance: expected 5 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const verificationId_0 = args_1[1];
        const commitmentId_0 = args_1[2];
        const policyId_0 = args_1[3];
        const verifier_0 = args_1[4];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('verifyCompliance',
                                     'argument 1 (as invoked from Typescript)',
                                     'blackbox-ai.compact line 272 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(verificationId_0.buffer instanceof ArrayBuffer && verificationId_0.BYTES_PER_ELEMENT === 1 && verificationId_0.length === 32)) {
          __compactRuntime.typeError('verifyCompliance',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'blackbox-ai.compact line 272 char 1',
                                     'Bytes<32>',
                                     verificationId_0)
        }
        if (!(commitmentId_0.buffer instanceof ArrayBuffer && commitmentId_0.BYTES_PER_ELEMENT === 1 && commitmentId_0.length === 32)) {
          __compactRuntime.typeError('verifyCompliance',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'blackbox-ai.compact line 272 char 1',
                                     'Bytes<32>',
                                     commitmentId_0)
        }
        if (!(policyId_0.buffer instanceof ArrayBuffer && policyId_0.BYTES_PER_ELEMENT === 1 && policyId_0.length === 32)) {
          __compactRuntime.typeError('verifyCompliance',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'blackbox-ai.compact line 272 char 1',
                                     'Bytes<32>',
                                     policyId_0)
        }
        if (!(verifier_0.buffer instanceof ArrayBuffer && verifier_0.BYTES_PER_ELEMENT === 1 && verifier_0.length === 32)) {
          __compactRuntime.typeError('verifyCompliance',
                                     'argument 4 (argument 5 as invoked from Typescript)',
                                     'blackbox-ai.compact line 272 char 1',
                                     'Bytes<32>',
                                     verifier_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(verificationId_0).concat(_descriptor_0.toValue(commitmentId_0).concat(_descriptor_0.toValue(policyId_0).concat(_descriptor_0.toValue(verifier_0)))),
            alignment: _descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment())))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._verifyCompliance_0(context,
                                                        partialProofData,
                                                        verificationId_0,
                                                        commitmentId_0,
                                                        policyId_0,
                                                        verifier_0);
        partialProofData.output = { value: [], alignment: [] };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      },
      getDataset: async (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`getDataset: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const datasetId_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('getDataset',
                                     'argument 1 (as invoked from Typescript)',
                                     'blackbox-ai.compact line 419 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(datasetId_0.buffer instanceof ArrayBuffer && datasetId_0.BYTES_PER_ELEMENT === 1 && datasetId_0.length === 32)) {
          __compactRuntime.typeError('getDataset',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'blackbox-ai.compact line 419 char 1',
                                     'Bytes<32>',
                                     datasetId_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(datasetId_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._getDataset_0(context,
                                                  partialProofData,
                                                  datasetId_0);
        partialProofData.output = { value: _descriptor_3.toValue(result_0), alignment: _descriptor_3.alignment() };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      },
      getCommitment: async (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`getCommitment: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const commitmentId_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('getCommitment',
                                     'argument 1 (as invoked from Typescript)',
                                     'blackbox-ai.compact line 425 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(commitmentId_0.buffer instanceof ArrayBuffer && commitmentId_0.BYTES_PER_ELEMENT === 1 && commitmentId_0.length === 32)) {
          __compactRuntime.typeError('getCommitment',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'blackbox-ai.compact line 425 char 1',
                                     'Bytes<32>',
                                     commitmentId_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(commitmentId_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._getCommitment_0(context,
                                                     partialProofData,
                                                     commitmentId_0);
        partialProofData.output = { value: _descriptor_8.toValue(result_0), alignment: _descriptor_8.alignment() };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      },
      getVerification: async (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`getVerification: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const verificationId_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('getVerification',
                                     'argument 1 (as invoked from Typescript)',
                                     'blackbox-ai.compact line 431 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(verificationId_0.buffer instanceof ArrayBuffer && verificationId_0.BYTES_PER_ELEMENT === 1 && verificationId_0.length === 32)) {
          __compactRuntime.typeError('getVerification',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'blackbox-ai.compact line 431 char 1',
                                     'Bytes<32>',
                                     verificationId_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(verificationId_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._getVerification_0(context,
                                                       partialProofData,
                                                       verificationId_0);
        partialProofData.output = { value: _descriptor_9.toValue(result_0), alignment: _descriptor_9.alignment() };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      },
      getPolicy: async (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`getPolicy: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const policyId_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('getPolicy',
                                     'argument 1 (as invoked from Typescript)',
                                     'blackbox-ai.compact line 437 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(policyId_0.buffer instanceof ArrayBuffer && policyId_0.BYTES_PER_ELEMENT === 1 && policyId_0.length === 32)) {
          __compactRuntime.typeError('getPolicy',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'blackbox-ai.compact line 437 char 1',
                                     'Bytes<32>',
                                     policyId_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(policyId_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._getPolicy_0(context,
                                                 partialProofData,
                                                 policyId_0);
        partialProofData.output = { value: _descriptor_6.toValue(result_0), alignment: _descriptor_6.alignment() };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      },
      updateAuthorization: async (...args_1) => {
        if (args_1.length !== 4) {
          throw new __compactRuntime.CompactError(`updateAuthorization: expected 4 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const datasetId_0 = args_1[1];
        const newStatus_0 = args_1[2];
        const owner_0 = args_1[3];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('updateAuthorization',
                                     'argument 1 (as invoked from Typescript)',
                                     'blackbox-ai.compact line 446 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(datasetId_0.buffer instanceof ArrayBuffer && datasetId_0.BYTES_PER_ELEMENT === 1 && datasetId_0.length === 32)) {
          __compactRuntime.typeError('updateAuthorization',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'blackbox-ai.compact line 446 char 1',
                                     'Bytes<32>',
                                     datasetId_0)
        }
        if (!(typeof(newStatus_0) === 'bigint' && newStatus_0 >= 0n && newStatus_0 <= 255n)) {
          __compactRuntime.typeError('updateAuthorization',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'blackbox-ai.compact line 446 char 1',
                                     'Uint<0..256>',
                                     newStatus_0)
        }
        if (!(owner_0.buffer instanceof ArrayBuffer && owner_0.BYTES_PER_ELEMENT === 1 && owner_0.length === 32)) {
          __compactRuntime.typeError('updateAuthorization',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'blackbox-ai.compact line 446 char 1',
                                     'Bytes<32>',
                                     owner_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(datasetId_0).concat(_descriptor_1.toValue(newStatus_0).concat(_descriptor_0.toValue(owner_0))),
            alignment: _descriptor_0.alignment().concat(_descriptor_1.alignment().concat(_descriptor_0.alignment()))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._updateAuthorization_0(context,
                                                           partialProofData,
                                                           datasetId_0,
                                                           newStatus_0,
                                                           owner_0);
        partialProofData.output = { value: [], alignment: [] };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      },
      revokeDataset: async (...args_1) => {
        if (args_1.length !== 3) {
          throw new __compactRuntime.CompactError(`revokeDataset: expected 3 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const datasetId_0 = args_1[1];
        const owner_0 = args_1[2];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('revokeDataset',
                                     'argument 1 (as invoked from Typescript)',
                                     'blackbox-ai.compact line 473 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(datasetId_0.buffer instanceof ArrayBuffer && datasetId_0.BYTES_PER_ELEMENT === 1 && datasetId_0.length === 32)) {
          __compactRuntime.typeError('revokeDataset',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'blackbox-ai.compact line 473 char 1',
                                     'Bytes<32>',
                                     datasetId_0)
        }
        if (!(owner_0.buffer instanceof ArrayBuffer && owner_0.BYTES_PER_ELEMENT === 1 && owner_0.length === 32)) {
          __compactRuntime.typeError('revokeDataset',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'blackbox-ai.compact line 473 char 1',
                                     'Bytes<32>',
                                     owner_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(datasetId_0).concat(_descriptor_0.toValue(owner_0)),
            alignment: _descriptor_0.alignment().concat(_descriptor_0.alignment())
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._revokeDataset_0(context,
                                                     partialProofData,
                                                     datasetId_0,
                                                     owner_0);
        partialProofData.output = { value: [], alignment: [] };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      }
    };
    this.impureCircuits = {
      registerDataset: this.circuits.registerDataset,
      commitTraining: this.circuits.commitTraining,
      createPolicy: this.circuits.createPolicy,
      verifyCompliance: this.circuits.verifyCompliance,
      getDataset: this.circuits.getDataset,
      getCommitment: this.circuits.getCommitment,
      getVerification: this.circuits.getVerification,
      getPolicy: this.circuits.getPolicy,
      updateAuthorization: this.circuits.updateAuthorization,
      revokeDataset: this.circuits.revokeDataset
    };
    this.provableCircuits = {
      registerDataset: this.circuits.registerDataset,
      commitTraining: this.circuits.commitTraining,
      createPolicy: this.circuits.createPolicy,
      verifyCompliance: this.circuits.verifyCompliance,
      getDataset: this.circuits.getDataset,
      getCommitment: this.circuits.getCommitment,
      getVerification: this.circuits.getVerification,
      getPolicy: this.circuits.getPolicy,
      updateAuthorization: this.circuits.updateAuthorization,
      revokeDataset: this.circuits.revokeDataset
    };
  }
  async initialState(...args_0) {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 1 argument (as invoked from Typescript), received ${args_0.length}`);
    }
    const constructorContext_0 = args_0[0];
    if (typeof(constructorContext_0) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'constructorContext' in argument 1 (as invoked from Typescript) to be an object`);
    }
    if (!('initialPrivateState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialPrivateState' in argument 1 (as invoked from Typescript)`);
    }
    if (!('initialZswapLocalState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript)`);
    }
    if (typeof(constructorContext_0.initialZswapLocalState) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript) to be an object`);
    }
    const state_0 = new __compactRuntime.ContractState();
    let stateValue_0 = __compactRuntime.StateValue.newArray();
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    state_0.data = new __compactRuntime.ChargedState(stateValue_0);
    state_0.setOperation('registerDataset', new __compactRuntime.ContractOperation());
    state_0.setOperation('commitTraining', new __compactRuntime.ContractOperation());
    state_0.setOperation('createPolicy', new __compactRuntime.ContractOperation());
    state_0.setOperation('verifyCompliance', new __compactRuntime.ContractOperation());
    state_0.setOperation('getDataset', new __compactRuntime.ContractOperation());
    state_0.setOperation('getCommitment', new __compactRuntime.ContractOperation());
    state_0.setOperation('getVerification', new __compactRuntime.ContractOperation());
    state_0.setOperation('getPolicy', new __compactRuntime.ContractOperation());
    state_0.setOperation('updateAuthorization', new __compactRuntime.ContractOperation());
    state_0.setOperation('revokeDataset', new __compactRuntime.ContractOperation());
    const context = __compactRuntime.createCircuitContext('constructor', __compactRuntime.dummyContractAddress(), constructorContext_0.initialZswapLocalState.coinPublicKey, state_0.data, constructorContext_0.initialPrivateState);
    const partialProofData = {
      input: { value: [], alignment: [] },
      output: undefined,
      publicTranscript: [],
      privateTranscriptOutputs: []
    };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(0n),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(1n),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(2n),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(3n),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(4n),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(0n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(5n),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(0n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(6n),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(0n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(7n),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(0n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    state_0.data = new __compactRuntime.ChargedState(context.callContext.currentQueryContext.state.state);
    return {
      currentContractState: state_0,
      currentPrivateState: context.callContext.currentPrivateState,
      currentZswapLocalState: context.callContext.currentZswapLocalState
    }
  }
  _datasetContentHash_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.callContext.currentQueryContext.state), context.callContext.currentPrivateState, context.callContext.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.datasetContentHash(witnessContext_0);
    context.callContext.currentPrivateState = nextPrivateState_0;
    if (!(result_0.buffer instanceof ArrayBuffer && result_0.BYTES_PER_ELEMENT === 1 && result_0.length === 32)) {
      __compactRuntime.typeError('datasetContentHash',
                                 'return value',
                                 'blackbox-ai.compact line 109 char 1',
                                 'Bytes<32>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_0.toValue(result_0),
      alignment: _descriptor_0.alignment()
    });
    return result_0;
  }
  _licenseProof_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.callContext.currentQueryContext.state), context.callContext.currentPrivateState, context.callContext.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.licenseProof(witnessContext_0);
    context.callContext.currentPrivateState = nextPrivateState_0;
    if (!(result_0.buffer instanceof ArrayBuffer && result_0.BYTES_PER_ELEMENT === 1 && result_0.length === 64)) {
      __compactRuntime.typeError('licenseProof',
                                 'return value',
                                 'blackbox-ai.compact line 110 char 1',
                                 'Bytes<64>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_5.toValue(result_0),
      alignment: _descriptor_5.alignment()
    });
    return result_0;
  }
  _trainingDataHashes_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.callContext.currentQueryContext.state), context.callContext.currentPrivateState, context.callContext.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.trainingDataHashes(witnessContext_0);
    context.callContext.currentPrivateState = nextPrivateState_0;
    if (!(Array.isArray(result_0) && result_0.length === 32 && result_0.every((t) => t.buffer instanceof ArrayBuffer && t.BYTES_PER_ELEMENT === 1 && t.length === 32))) {
      __compactRuntime.typeError('trainingDataHashes',
                                 'return value',
                                 'blackbox-ai.compact line 111 char 1',
                                 'Vector<32, Bytes<32>>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_7.toValue(result_0),
      alignment: _descriptor_7.alignment()
    });
    return result_0;
  }
  _datasetLicenses_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.callContext.currentQueryContext.state), context.callContext.currentPrivateState, context.callContext.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.datasetLicenses(witnessContext_0);
    context.callContext.currentPrivateState = nextPrivateState_0;
    if (!(Array.isArray(result_0) && result_0.length === 32 && result_0.every((t) => t.buffer instanceof ArrayBuffer && t.BYTES_PER_ELEMENT === 1 && t.length === 32))) {
      __compactRuntime.typeError('datasetLicenses',
                                 'return value',
                                 'blackbox-ai.compact line 112 char 1',
                                 'Vector<32, Bytes<32>>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_7.toValue(result_0),
      alignment: _descriptor_7.alignment()
    });
    return result_0;
  }
  _currentTimestamp_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.callContext.currentQueryContext.state), context.callContext.currentPrivateState, context.callContext.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.currentTimestamp(witnessContext_0);
    context.callContext.currentPrivateState = nextPrivateState_0;
    if (!(typeof(result_0) === 'bigint' && result_0 >= 0n && result_0 <= 18446744073709551615n)) {
      __compactRuntime.typeError('currentTimestamp',
                                 'return value',
                                 'blackbox-ai.compact line 113 char 1',
                                 'Uint<0..18446744073709551616>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_2.toValue(result_0),
      alignment: _descriptor_2.alignment()
    });
    return result_0;
  }
  async _registerDataset_0(context,
                           partialProofData,
                           datasetId_0,
                           owner_0,
                           contentHash_0,
                           licenseHash_0,
                           licenseType_0,
                           authorizationStatus_0,
                           validFrom_0,
                           validUntil_0,
                           metadataHash_0)
  {
    __compactRuntime.assert(!_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_1.toValue(0n),
                                                                                                                   alignment: _descriptor_1.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(datasetId_0),
                                                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'dataset already registered');
    const provenContentHash_0 = this._datasetContentHash_0(context,
                                                           partialProofData);
    __compactRuntime.assert(this._equal_0(provenContentHash_0, contentHash_0),
                            'content hash mismatch');
    const provenLicense_0 = this._licenseProof_0(context, partialProofData);
    __compactRuntime.assert(licenseType_0 <= 3n, 'invalid license type');
    __compactRuntime.assert(authorizationStatus_0 <= 3n, 'invalid auth status');
    const now_0 = this._currentTimestamp_0(context, partialProofData);
    __compactRuntime.assert(validFrom_0 <= now_0, 'validFrom in future');
    __compactRuntime.assert(validUntil_0 > validFrom_0,
                            'validUntil before validFrom');
    const info_0 = { datasetId: datasetId_0,
                     owner: owner_0,
                     contentHash: contentHash_0,
                     licenseHash: licenseHash_0,
                     licenseType: licenseType_0,
                     authorizationStatus: authorizationStatus_0,
                     validFrom: validFrom_0,
                     validUntil: validUntil_0,
                     registeredAt: now_0,
                     metadataHash: metadataHash_0 };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(0n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(datasetId_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(info_0),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_0 = 1n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(4n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { addi: { immediate: parseInt(__compactRuntime.valueToBigInt(
                                                              { value: _descriptor_10.toValue(tmp_0),
                                                                alignment: _descriptor_10.alignment() }
                                                                .value
                                                            )) } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  async _commitTraining_0(context,
                          partialProofData,
                          commitmentId_0,
                          trainer_0,
                          datasetIds_0,
                          datasetCount_0,
                          trainingTimestamp_0,
                          modelHash_0)
  {
    const disclosedCount_0 = datasetCount_0;
    __compactRuntime.assert(!_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_1.toValue(1n),
                                                                                                                   alignment: _descriptor_1.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(commitmentId_0),
                                                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'commitment exists');
    __compactRuntime.assert(disclosedCount_0 > 0n,
                            'must use at least one dataset');
    __compactRuntime.assert(disclosedCount_0 <= 32n, 'too many datasets');
    const provenHashes_0 = this._trainingDataHashes_0(context, partialProofData);
    const provenLicenses_0 = this._datasetLicenses_0(context, partialProofData);
    await this._folder_0(context,
                         partialProofData,
                         (async (context, partialProofData, t_0, i_0) =>
                          {
                            if (i_0 < disclosedCount_0) {
                              const dId_0 = datasetIds_0[i_0];
                              __compactRuntime.assert(_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                partialProofData,
                                                                                                                [
                                                                                                                 { dup: { n: 0 } },
                                                                                                                 { idx: { cached: false,
                                                                                                                          pushPath: false,
                                                                                                                          path: [
                                                                                                                                 { tag: 'value',
                                                                                                                                   value: { value: _descriptor_1.toValue(0n),
                                                                                                                                            alignment: _descriptor_1.alignment() } }] } },
                                                                                                                 { push: { storage: false,
                                                                                                                           value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(dId_0),
                                                                                                                                                                        alignment: _descriptor_0.alignment() }).encode() } },
                                                                                                                 'member',
                                                                                                                 { popeq: { cached: true,
                                                                                                                            result: undefined } }]).value),
                                                      'dataset not registered');
                              const info_0 = _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                       partialProofData,
                                                                                                       [
                                                                                                        { dup: { n: 0 } },
                                                                                                        { idx: { cached: false,
                                                                                                                 pushPath: false,
                                                                                                                 path: [
                                                                                                                        { tag: 'value',
                                                                                                                          value: { value: _descriptor_1.toValue(0n),
                                                                                                                                   alignment: _descriptor_1.alignment() } }] } },
                                                                                                        { idx: { cached: false,
                                                                                                                 pushPath: false,
                                                                                                                 path: [
                                                                                                                        { tag: 'value',
                                                                                                                          value: { value: _descriptor_0.toValue(dId_0),
                                                                                                                                   alignment: _descriptor_0.alignment() } }] } },
                                                                                                        { popeq: { cached: false,
                                                                                                                   result: undefined } }]).value);
                              __compactRuntime.assert(this._equal_1(provenHashes_0[i_0],
                                                                    info_0.contentHash),
                                                      'content hash mismatch');
                              __compactRuntime.assert(this._equal_2(provenLicenses_0[i_0],
                                                                    info_0.licenseHash),
                                                      'license hash mismatch');
                            }
                            return t_0;
                          }),
                         [],
                         [0n,
                          1n,
                          2n,
                          3n,
                          4n,
                          5n,
                          6n,
                          7n,
                          8n,
                          9n,
                          10n,
                          11n,
                          12n,
                          13n,
                          14n,
                          15n,
                          16n,
                          17n,
                          18n,
                          19n,
                          20n,
                          21n,
                          22n,
                          23n,
                          24n,
                          25n,
                          26n,
                          27n,
                          28n,
                          29n,
                          30n,
                          31n]);
    const now_0 = this._currentTimestamp_0(context, partialProofData);
    const commitment_0 = { commitmentId: commitmentId_0,
                           trainer: trainer_0,
                           datasetIds: datasetIds_0,
                           datasetCount: disclosedCount_0,
                           trainingTimestamp: trainingTimestamp_0,
                           modelHash: modelHash_0,
                           committedAt: now_0 };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(1n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(commitmentId_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(commitment_0),
                                                                                              alignment: _descriptor_8.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_0 = 1n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(5n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { addi: { immediate: parseInt(__compactRuntime.valueToBigInt(
                                                              { value: _descriptor_10.toValue(tmp_0),
                                                                alignment: _descriptor_10.alignment() }
                                                                .value
                                                            )) } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  async _createPolicy_0(context,
                        partialProofData,
                        policyId_0,
                        name_0,
                        minAuthorizedPercentage_0,
                        minLicensedPercentage_0,
                        allowRestricted_0,
                        requireValidLicenses_0,
                        createdBy_0)
  {
    __compactRuntime.assert(!_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_1.toValue(3n),
                                                                                                                   alignment: _descriptor_1.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(policyId_0),
                                                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'policy exists');
    __compactRuntime.assert(minAuthorizedPercentage_0 <= 100n, 'auth % > 100');
    __compactRuntime.assert(minLicensedPercentage_0 <= 100n, 'licensed % > 100');
    const now_0 = this._currentTimestamp_0(context, partialProofData);
    const policy_0 = { policyId: policyId_0,
                       name: name_0,
                       minAuthorizedPercentage: minAuthorizedPercentage_0,
                       minLicensedPercentage: minLicensedPercentage_0,
                       allowRestricted: allowRestricted_0,
                       requireValidLicenses: requireValidLicenses_0,
                       createdAt: now_0,
                       createdBy: createdBy_0 };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(3n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(policyId_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_6.toValue(policy_0),
                                                                                              alignment: _descriptor_6.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_0 = 1n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(7n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { addi: { immediate: parseInt(__compactRuntime.valueToBigInt(
                                                              { value: _descriptor_10.toValue(tmp_0),
                                                                alignment: _descriptor_10.alignment() }
                                                                .value
                                                            )) } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  async _verifyCompliance_0(context,
                            partialProofData,
                            verificationId_0,
                            commitmentId_0,
                            policyId_0,
                            verifier_0)
  {
    __compactRuntime.assert(!_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_1.toValue(2n),
                                                                                                                   alignment: _descriptor_1.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(verificationId_0),
                                                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'verification exists');
    __compactRuntime.assert(_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_1.toValue(1n),
                                                                                                                  alignment: _descriptor_1.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(commitmentId_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'commitment not found');
    __compactRuntime.assert(_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_1.toValue(3n),
                                                                                                                  alignment: _descriptor_1.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(policyId_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'policy not found');
    const commitment_0 = _descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                   partialProofData,
                                                                                   [
                                                                                    { dup: { n: 0 } },
                                                                                    { idx: { cached: false,
                                                                                             pushPath: false,
                                                                                             path: [
                                                                                                    { tag: 'value',
                                                                                                      value: { value: _descriptor_1.toValue(1n),
                                                                                                               alignment: _descriptor_1.alignment() } }] } },
                                                                                    { idx: { cached: false,
                                                                                             pushPath: false,
                                                                                             path: [
                                                                                                    { tag: 'value',
                                                                                                      value: { value: _descriptor_0.toValue(commitmentId_0),
                                                                                                               alignment: _descriptor_0.alignment() } }] } },
                                                                                    { popeq: { cached: false,
                                                                                               result: undefined } }]).value);
    const policy_0 = _descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                               partialProofData,
                                                                               [
                                                                                { dup: { n: 0 } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_1.toValue(3n),
                                                                                                           alignment: _descriptor_1.alignment() } }] } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_0.toValue(policyId_0),
                                                                                                           alignment: _descriptor_0.alignment() } }] } },
                                                                                { popeq: { cached: false,
                                                                                           result: undefined } }]).value);
    const provenHashes_0 = this._trainingDataHashes_0(context, partialProofData);
    const provenLicenses_0 = this._datasetLicenses_0(context, partialProofData);
    const allAuthorized_0 = true;
    const noRestricted_0 = true;
    const licensesValid_0 = true;
    let t_0;
    if (t_0 = commitment_0.datasetCount, t_0 > 0n) {
      const dId0_0 = commitment_0.datasetIds[0];
      __compactRuntime.assert(_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                        partialProofData,
                                                                                        [
                                                                                         { dup: { n: 0 } },
                                                                                         { idx: { cached: false,
                                                                                                  pushPath: false,
                                                                                                  path: [
                                                                                                         { tag: 'value',
                                                                                                           value: { value: _descriptor_1.toValue(0n),
                                                                                                                    alignment: _descriptor_1.alignment() } }] } },
                                                                                         { push: { storage: false,
                                                                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(dId0_0),
                                                                                                                                                alignment: _descriptor_0.alignment() }).encode() } },
                                                                                         'member',
                                                                                         { popeq: { cached: true,
                                                                                                    result: undefined } }]).value),
                              'dataset 0 not registered');
      const info0_0 = _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                partialProofData,
                                                                                [
                                                                                 { dup: { n: 0 } },
                                                                                 { idx: { cached: false,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_1.toValue(0n),
                                                                                                            alignment: _descriptor_1.alignment() } }] } },
                                                                                 { idx: { cached: false,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_0.toValue(dId0_0),
                                                                                                            alignment: _descriptor_0.alignment() } }] } },
                                                                                 { popeq: { cached: false,
                                                                                            result: undefined } }]).value);
      __compactRuntime.assert(this._equal_3(provenHashes_0[0],
                                            info0_0.contentHash),
                              'hash mismatch 0');
      __compactRuntime.assert(this._equal_4(provenLicenses_0[0],
                                            info0_0.licenseHash),
                              'license mismatch 0');
      if (info0_0.authorizationStatus !== 1n) { }
      if (info0_0.licenseType === 3n) { }
      if (policy_0.requireValidLicenses) {
        let t_1, t_2;
        if ((t_2 = commitment_0.trainingTimestamp, t_2 < info0_0.validFrom)
            ||
            (t_1 = commitment_0.trainingTimestamp, t_1 > info0_0.validUntil))
        {
        }
      }
    }
    let t_3;
    if (t_3 = commitment_0.datasetCount, t_3 > 1n) {
      const dId1_0 = commitment_0.datasetIds[1];
      __compactRuntime.assert(_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                        partialProofData,
                                                                                        [
                                                                                         { dup: { n: 0 } },
                                                                                         { idx: { cached: false,
                                                                                                  pushPath: false,
                                                                                                  path: [
                                                                                                         { tag: 'value',
                                                                                                           value: { value: _descriptor_1.toValue(0n),
                                                                                                                    alignment: _descriptor_1.alignment() } }] } },
                                                                                         { push: { storage: false,
                                                                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(dId1_0),
                                                                                                                                                alignment: _descriptor_0.alignment() }).encode() } },
                                                                                         'member',
                                                                                         { popeq: { cached: true,
                                                                                                    result: undefined } }]).value),
                              'dataset 1 not registered');
      const info1_0 = _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                partialProofData,
                                                                                [
                                                                                 { dup: { n: 0 } },
                                                                                 { idx: { cached: false,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_1.toValue(0n),
                                                                                                            alignment: _descriptor_1.alignment() } }] } },
                                                                                 { idx: { cached: false,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_0.toValue(dId1_0),
                                                                                                            alignment: _descriptor_0.alignment() } }] } },
                                                                                 { popeq: { cached: false,
                                                                                            result: undefined } }]).value);
      __compactRuntime.assert(this._equal_5(provenHashes_0[1],
                                            info1_0.contentHash),
                              'hash mismatch 1');
      __compactRuntime.assert(this._equal_6(provenLicenses_0[1],
                                            info1_0.licenseHash),
                              'license mismatch 1');
      if (info1_0.authorizationStatus !== 1n) { }
      if (info1_0.licenseType === 3n) { }
      if (policy_0.requireValidLicenses) {
        let t_4, t_5;
        if ((t_5 = commitment_0.trainingTimestamp, t_5 < info1_0.validFrom)
            ||
            (t_4 = commitment_0.trainingTimestamp, t_4 > info1_0.validUntil))
        {
        }
      }
    }
    let t_6;
    if (t_6 = commitment_0.datasetCount, t_6 > 2n) {
      const dId2_0 = commitment_0.datasetIds[2];
      __compactRuntime.assert(_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                        partialProofData,
                                                                                        [
                                                                                         { dup: { n: 0 } },
                                                                                         { idx: { cached: false,
                                                                                                  pushPath: false,
                                                                                                  path: [
                                                                                                         { tag: 'value',
                                                                                                           value: { value: _descriptor_1.toValue(0n),
                                                                                                                    alignment: _descriptor_1.alignment() } }] } },
                                                                                         { push: { storage: false,
                                                                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(dId2_0),
                                                                                                                                                alignment: _descriptor_0.alignment() }).encode() } },
                                                                                         'member',
                                                                                         { popeq: { cached: true,
                                                                                                    result: undefined } }]).value),
                              'dataset 2 not registered');
      const info2_0 = _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                partialProofData,
                                                                                [
                                                                                 { dup: { n: 0 } },
                                                                                 { idx: { cached: false,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_1.toValue(0n),
                                                                                                            alignment: _descriptor_1.alignment() } }] } },
                                                                                 { idx: { cached: false,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_0.toValue(dId2_0),
                                                                                                            alignment: _descriptor_0.alignment() } }] } },
                                                                                 { popeq: { cached: false,
                                                                                            result: undefined } }]).value);
      __compactRuntime.assert(this._equal_7(provenHashes_0[2],
                                            info2_0.contentHash),
                              'hash mismatch 2');
      __compactRuntime.assert(this._equal_8(provenLicenses_0[2],
                                            info2_0.licenseHash),
                              'license mismatch 2');
      if (info2_0.authorizationStatus !== 1n) { }
      if (info2_0.licenseType === 3n) { }
      if (policy_0.requireValidLicenses) {
        let t_7, t_8;
        if ((t_8 = commitment_0.trainingTimestamp, t_8 < info2_0.validFrom)
            ||
            (t_7 = commitment_0.trainingTimestamp, t_7 > info2_0.validUntil))
        {
        }
      }
    }
    const compliant_0 = true;
    const now_0 = this._currentTimestamp_0(context, partialProofData);
    const result_0 = { verificationId: verificationId_0,
                       commitmentId: commitmentId_0,
                       policyId: policyId_0,
                       isCompliant: compliant_0,
                       authorizedPercentage: 100n,
                       licensedPercentage: 100n,
                       restrictedCount: 0n,
                       expiredLicenseCount: 0n,
                       verifiedAt: now_0,
                       verifiedBy: verifier_0 };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(2n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(verificationId_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_9.toValue(result_0),
                                                                                              alignment: _descriptor_9.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_0 = 1n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(6n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { addi: { immediate: parseInt(__compactRuntime.valueToBigInt(
                                                              { value: _descriptor_10.toValue(tmp_0),
                                                                alignment: _descriptor_10.alignment() }
                                                                .value
                                                            )) } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  async _getDataset_0(context, partialProofData, datasetId_0) {
    __compactRuntime.assert(_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_1.toValue(0n),
                                                                                                                  alignment: _descriptor_1.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(datasetId_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'dataset not found');
    return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                     partialProofData,
                                                                     [
                                                                      { dup: { n: 0 } },
                                                                      { idx: { cached: false,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_1.toValue(0n),
                                                                                                 alignment: _descriptor_1.alignment() } }] } },
                                                                      { idx: { cached: false,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_0.toValue(datasetId_0),
                                                                                                 alignment: _descriptor_0.alignment() } }] } },
                                                                      { popeq: { cached: false,
                                                                                 result: undefined } }]).value);
  }
  async _getCommitment_0(context, partialProofData, commitmentId_0) {
    __compactRuntime.assert(_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_1.toValue(1n),
                                                                                                                  alignment: _descriptor_1.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(commitmentId_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'commitment not found');
    return _descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                     partialProofData,
                                                                     [
                                                                      { dup: { n: 0 } },
                                                                      { idx: { cached: false,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_1.toValue(1n),
                                                                                                 alignment: _descriptor_1.alignment() } }] } },
                                                                      { idx: { cached: false,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_0.toValue(commitmentId_0),
                                                                                                 alignment: _descriptor_0.alignment() } }] } },
                                                                      { popeq: { cached: false,
                                                                                 result: undefined } }]).value);
  }
  async _getVerification_0(context, partialProofData, verificationId_0) {
    __compactRuntime.assert(_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_1.toValue(2n),
                                                                                                                  alignment: _descriptor_1.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(verificationId_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'verification not found');
    return _descriptor_9.fromValue(__compactRuntime.queryLedgerState(context,
                                                                     partialProofData,
                                                                     [
                                                                      { dup: { n: 0 } },
                                                                      { idx: { cached: false,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_1.toValue(2n),
                                                                                                 alignment: _descriptor_1.alignment() } }] } },
                                                                      { idx: { cached: false,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_0.toValue(verificationId_0),
                                                                                                 alignment: _descriptor_0.alignment() } }] } },
                                                                      { popeq: { cached: false,
                                                                                 result: undefined } }]).value);
  }
  async _getPolicy_0(context, partialProofData, policyId_0) {
    __compactRuntime.assert(_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_1.toValue(3n),
                                                                                                                  alignment: _descriptor_1.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(policyId_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'policy not found');
    return _descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                     partialProofData,
                                                                     [
                                                                      { dup: { n: 0 } },
                                                                      { idx: { cached: false,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_1.toValue(3n),
                                                                                                 alignment: _descriptor_1.alignment() } }] } },
                                                                      { idx: { cached: false,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_0.toValue(policyId_0),
                                                                                                 alignment: _descriptor_0.alignment() } }] } },
                                                                      { popeq: { cached: false,
                                                                                 result: undefined } }]).value);
  }
  async _updateAuthorization_0(context,
                               partialProofData,
                               datasetId_0,
                               newStatus_0,
                               owner_0)
  {
    __compactRuntime.assert(_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_1.toValue(0n),
                                                                                                                  alignment: _descriptor_1.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(datasetId_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'dataset not found');
    const info_0 = _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                             partialProofData,
                                                                             [
                                                                              { dup: { n: 0 } },
                                                                              { idx: { cached: false,
                                                                                       pushPath: false,
                                                                                       path: [
                                                                                              { tag: 'value',
                                                                                                value: { value: _descriptor_1.toValue(0n),
                                                                                                         alignment: _descriptor_1.alignment() } }] } },
                                                                              { idx: { cached: false,
                                                                                       pushPath: false,
                                                                                       path: [
                                                                                              { tag: 'value',
                                                                                                value: { value: _descriptor_0.toValue(datasetId_0),
                                                                                                         alignment: _descriptor_0.alignment() } }] } },
                                                                              { popeq: { cached: false,
                                                                                         result: undefined } }]).value);
    __compactRuntime.assert(this._equal_9(info_0.owner, owner_0), 'not owner');
    __compactRuntime.assert(newStatus_0 <= 3n, 'invalid status');
    const updated_0 = { datasetId: info_0.datasetId,
                        owner: info_0.owner,
                        contentHash: info_0.contentHash,
                        licenseHash: info_0.licenseHash,
                        licenseType: info_0.licenseType,
                        authorizationStatus: newStatus_0,
                        validFrom: info_0.validFrom,
                        validUntil: info_0.validUntil,
                        registeredAt: info_0.registeredAt,
                        metadataHash: info_0.metadataHash };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(0n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(datasetId_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(updated_0),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  async _revokeDataset_0(context, partialProofData, datasetId_0, owner_0) {
    __compactRuntime.assert(_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_1.toValue(0n),
                                                                                                                  alignment: _descriptor_1.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(datasetId_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'dataset not found');
    const info_0 = _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                             partialProofData,
                                                                             [
                                                                              { dup: { n: 0 } },
                                                                              { idx: { cached: false,
                                                                                       pushPath: false,
                                                                                       path: [
                                                                                              { tag: 'value',
                                                                                                value: { value: _descriptor_1.toValue(0n),
                                                                                                         alignment: _descriptor_1.alignment() } }] } },
                                                                              { idx: { cached: false,
                                                                                       pushPath: false,
                                                                                       path: [
                                                                                              { tag: 'value',
                                                                                                value: { value: _descriptor_0.toValue(datasetId_0),
                                                                                                         alignment: _descriptor_0.alignment() } }] } },
                                                                              { popeq: { cached: false,
                                                                                         result: undefined } }]).value);
    __compactRuntime.assert(this._equal_10(info_0.owner, owner_0), 'not owner');
    const updated_0 = { datasetId: info_0.datasetId,
                        owner: info_0.owner,
                        contentHash: info_0.contentHash,
                        licenseHash: info_0.licenseHash,
                        licenseType: info_0.licenseType,
                        authorizationStatus: 2n,
                        validFrom: info_0.validFrom,
                        validUntil: info_0.validUntil,
                        registeredAt: info_0.registeredAt,
                        metadataHash: info_0.metadataHash };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(0n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(datasetId_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(updated_0),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _equal_0(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_1(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_2(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  async _folder_0(context, partialProofData, f, x, a0) {
    for (let i = 0; i < 32; i++) { x = await f(context, partialProofData, x, a0[i]); }
    return x;
  }
  _equal_3(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_4(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_5(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_6(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_7(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_8(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_9(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_10(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
}
export function ledger(stateOrChargedState) {
  const state = stateOrChargedState instanceof __compactRuntime.StateValue ? stateOrChargedState : stateOrChargedState.state;
  const chargedState = stateOrChargedState instanceof __compactRuntime.StateValue ? new __compactRuntime.ChargedState(stateOrChargedState) : stateOrChargedState;
  const context = {
    callContext: { currentQueryContext: new __compactRuntime.QueryContext(chargedState, __compactRuntime.dummyContractAddress()), currentGasCost: __compactRuntime.emptyRunningCost() },
    costModel: __compactRuntime.CostModel.initialCostModel()
  };
  const partialProofData = {
    input: { value: [], alignment: [] },
    output: undefined,
    publicTranscript: [],
    privateTranscriptOutputs: []
  };
  return {
    datasetRegistry: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_1.toValue(0n),
                                                                                                     alignment: _descriptor_1.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(0n),
                                                                                                                                 alignment: _descriptor_2.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_1.toValue(0n),
                                                                                                     alignment: _descriptor_1.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'blackbox-ai.compact line 116 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_1.toValue(0n),
                                                                                                     alignment: _descriptor_1.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'blackbox-ai.compact line 116 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_1.toValue(0n),
                                                                                                     alignment: _descriptor_1.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_0.toValue(key_0),
                                                                                                     alignment: _descriptor_0.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[0];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_3.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    trainingCommitments: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_1.toValue(1n),
                                                                                                     alignment: _descriptor_1.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(0n),
                                                                                                                                 alignment: _descriptor_2.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_1.toValue(1n),
                                                                                                     alignment: _descriptor_1.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'blackbox-ai.compact line 117 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_1.toValue(1n),
                                                                                                     alignment: _descriptor_1.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'blackbox-ai.compact line 117 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_1.toValue(1n),
                                                                                                     alignment: _descriptor_1.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_0.toValue(key_0),
                                                                                                     alignment: _descriptor_0.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[1];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_8.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    verificationResults: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_1.toValue(2n),
                                                                                                     alignment: _descriptor_1.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(0n),
                                                                                                                                 alignment: _descriptor_2.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_1.toValue(2n),
                                                                                                     alignment: _descriptor_1.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'blackbox-ai.compact line 118 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_1.toValue(2n),
                                                                                                     alignment: _descriptor_1.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'blackbox-ai.compact line 118 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_9.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_1.toValue(2n),
                                                                                                     alignment: _descriptor_1.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_0.toValue(key_0),
                                                                                                     alignment: _descriptor_0.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[2];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_9.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    policyRegistry: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_1.toValue(3n),
                                                                                                     alignment: _descriptor_1.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(0n),
                                                                                                                                 alignment: _descriptor_2.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_1.toValue(3n),
                                                                                                     alignment: _descriptor_1.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'blackbox-ai.compact line 119 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_1.toValue(3n),
                                                                                                     alignment: _descriptor_1.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'blackbox-ai.compact line 119 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_1.toValue(3n),
                                                                                                     alignment: _descriptor_1.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_0.toValue(key_0),
                                                                                                     alignment: _descriptor_0.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[3];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_6.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    get datasetCount() {
      return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_1.toValue(4n),
                                                                                                   alignment: _descriptor_1.alignment() } }] } },
                                                                        { popeq: { cached: true,
                                                                                   result: undefined } }]).value);
    },
    get commitmentCount() {
      return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_1.toValue(5n),
                                                                                                   alignment: _descriptor_1.alignment() } }] } },
                                                                        { popeq: { cached: true,
                                                                                   result: undefined } }]).value);
    },
    get verificationCount() {
      return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_1.toValue(6n),
                                                                                                   alignment: _descriptor_1.alignment() } }] } },
                                                                        { popeq: { cached: true,
                                                                                   result: undefined } }]).value);
    },
    get policyCount() {
      return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_1.toValue(7n),
                                                                                                   alignment: _descriptor_1.alignment() } }] } },
                                                                        { popeq: { cached: true,
                                                                                   result: undefined } }]).value);
    }
  };
}
const _emptyContext = {
  callContext: { currentQueryContext: new __compactRuntime.QueryContext(new __compactRuntime.ContractState().data, __compactRuntime.dummyContractAddress()), currentGasCost: __compactRuntime.emptyRunningCost() }
};
const _dummyContract = new Contract({
  datasetContentHash: (...args) => undefined,
  licenseProof: (...args) => undefined,
  trainingDataHashes: (...args) => undefined,
  datasetLicenses: (...args) => undefined,
  currentTimestamp: (...args) => undefined
});
export const pureCircuits = {};
export const contractReferenceLocations =
  { tag: 'publicLedgerArray', indices: { } };
export const expectedVk = {
  'commitTraining': 'f92dac19ec661a6d20f6828c5fa7bd350f4eea5ae0ff8736b8505f6af859c41d',
  'createPolicy': '73bc6e38e8d082f4c1b507d0fffb967b7306b9670c18dd72042f1919967eff9e',
  'getCommitment': '5af1f897e55d226cd0ad380c648b8128c6ba06631c54ec6c4864c50b67bdce92',
  'getDataset': 'c77d6904227517973280331d92818f97412faf29c604d79be29f8c5db2ba9f75',
  'getPolicy': '3874a87640d19ca3af793bf72ea48e8e04e23e555c8a06902898bfdbf2a86776',
  'getVerification': '64b9b45206725253c26661e8d9ae1a87871f889375e61086963f138b41d47527',
  'registerDataset': '21111c6c542ad01b29f01a965fc7c9dd79330fcb747b426227c65eaf44de15e7',
  'revokeDataset': '944bb991630208c263c460f832ecb1161f9d1772db33d0b5ed52c14f7821671e',
  'updateAuthorization': 'e5cf7b3ceba0f39d7f3e0c1358d1af370de5d5ff127acf2864252300bff3d454',
  'verifyCompliance': '11e4b32149602bb1052796afed48196f87bf538049810b28678e8ddf3c4563de',
};

//# sourceMappingURL=index.js.map
