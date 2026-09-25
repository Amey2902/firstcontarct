/**
 * Interactive CLI for BlackBox AI.
 * Interacts with Midnight Compact smart contracts via callTx pipeline.
 */
import { getActiveNetwork, loadDeploymentState } from './network.js';
import { deployContract } from './deploy.js';
import {
  BlackBoxContract,
  createBlackBoxWitnesses,
  computeDatasetId,
  computeCommitmentId,
  computeVerificationId,
  sha256Hex,
  hexToBytes,
  bytesToHex,
  type BlackBoxPrivateState,
} from './contract.js';
import { LICENSE_TYPES, AUTH_STATUS, COMPLIANCE_OUTCOME, licenseTypeName, authStatusName, complianceOutcomeName } from './contract-constants.js';

function createCircuitContext(privateState: BlackBoxPrivateState) {
  return {
    callContext: {
      circuitId: 'cli',
      contractAddress: '0x' + '0'.repeat(64),
      initialQueryContext: {} as any,
      currentQueryContext: {} as any,
      currentGasCost: {} as any,
      currentPrivateState: privateState,
      time: Math.floor(Date.now() / 1000),
    },
    queryContexts: {},
    gasCosts: {},
    zswapLocalStates: {},
    costModel: {} as any,
    callProofDataTrace: [],
    events: [],
  };
}

async function main() {
  const state = loadDeploymentState();
  const network = getActiveNetwork();
  console.log('═══════════════════════════════════════════════════');
  console.log('BlackBox AI — Midnight Compact Interactive CLI');
  console.log('═══════════════════════════════════════════════════');
  console.log(`Active Network: ${network.name}`);
  console.log(`Contract Address: ${state.contractAddress || 'Not deployed yet'}`);
  console.log(`Indexer URL: ${network.indexerUrl}`);
  console.log(`Proof Server: ${network.proofServerUrl}`);
  console.log('\nContract Circuits Ready:');
  console.log('  1. registerDataset(datasetId, owner, contentHash, licenseHash, ... )');
  console.log('  2. authorizeDataset(datasetId, owner)');
  console.log('  3. revokeDataset(datasetId, owner)');
  console.log('  4. submitTrainingCommitment(commitmentId, trainer, datasetIds, ... )');
  console.log('  5. verifyCompliance(verificationId, commitmentId, ... )');
  console.log('  6. getVerificationStatus(verificationId)');
  console.log('  7. getDataset(datasetId)');
  console.log('  8. getCommitment(commitmentId)');
}

main().catch(console.error);
