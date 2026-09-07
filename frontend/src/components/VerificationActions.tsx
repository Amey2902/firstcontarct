import { useState } from 'react';
import { BlackBoxAPI } from '../club-api';

interface Props {
  api: BlackBoxAPI;
  address: string;
  busy: boolean;
  onBusyChange: (b: boolean) => void;
  onComplete: () => void;
  onError: (e: string) => void;
  setSimulatedTrainingDataHashes: (v: string[]) => void;
  setSimulatedDatasetLicenses: (v: string[]) => void;
  setSimulatedCurrentTimestamp: (v: bigint) => void;
  computeVerificationId: (commitmentId: string, policyId: string) => Promise<string>;
}

export default function VerificationActions({
  api,
  address,
  busy,
  onBusyChange,
  onComplete,
  onError,
  setSimulatedTrainingDataHashes,
  setSimulatedDatasetLicenses,
  setSimulatedCurrentTimestamp,
  computeVerificationId,
}: Props) {
  const [commitmentId, setCommitmentId] = useState('');
  const [policyId, setPolicyId] = useState('');
  const [viewVerificationId, setViewVerificationId] = useState('');
  const [lastResult, setLastResult] = useState<string | null>(null);

  const handleVerify = async () => {
    if (!commitmentId.trim()) {
      onError('Commitment ID is required');
      return;
    }
    if (!policyId.trim()) {
      onError('Policy ID is required');
      return;
    }

    onBusyChange(true);
    try {
      const verificationId = await computeVerificationId(commitmentId, policyId);

      // Fetch commitment to know which datasets were used
      let dataHashes: string[] = [];
      let licenseHashes: string[] = [];

      try {
        const commitment = await api.getCommitment(commitmentId);
        const count = Number(commitment.datasetCount);
        
        for (let i = 0; i < count; i++) {
          const dId = commitment.datasetIds[i];
          dataHashes.push(`0x${(await computeVerificationId(address, dId + '-content')).slice(0, 64)}`);
          licenseHashes.push(`0x${(await computeVerificationId(address, dId + '-license')).slice(0, 64)}`);
        }
      } catch {
        // Fallback if commitment fetch fails
      }

      // Pad to 32
      while (dataHashes.length < 32) dataHashes.push('0x' + '0'.repeat(64));
      while (licenseHashes.length < 32) licenseHashes.push('0x' + '0'.repeat(64));

      setSimulatedTrainingDataHashes(dataHashes);
      setSimulatedDatasetLicenses(licenseHashes);
      setSimulatedCurrentTimestamp(BigInt(Math.floor(Date.now() / 1000)));

      await api.verifyCompliance(verificationId, commitmentId, policyId, address);
      
      // Fetch and display result
      const result = await api.getVerification(verificationId);
      const v = result;
      
      const resultText = 
        `═══════════════════════════════════════════════════════════════\n` +
        `BLACKBOX AI VERIFICATION REPORT\n` +
        `═══════════════════════════════════════════════════════════════\n` +
        `Verification ID: ${verificationId}\n` +
        `Commitment:      ${commitmentId}\n` +
        `Policy:          ${policyId}\n` +
        `─────────────────────────────────────────────────────────────\n` +
        `RESULT:          ${v.isCompliant ? '✅ COMPLIANT' : '❌ NON-COMPLIANT'}\n` +
        `─────────────────────────────────────────────────────────────\n` +
        `Authorized Data:  ${v.authorizedPercentage}%  (required: check policy)\n` +
        `Licensed Data:    ${v.licensedPercentage}%  (required: check policy)\n` +
        `Restricted Used:  ${v.restrictedCount}\n` +
        `Expired Licenses: ${v.expiredLicenseCount}\n` +
        `─────────────────────────────────────────────────────────────\n` +
        `Verified At:     ${new Date(Number(v.verifiedAt) * 1000).toLocaleString()}\n` +
        `Verified By:     ${v.verifiedBy}\n` +
        `═══════════════════════════════════════════════════════════════\n`;

      setLastResult(resultText);
      alert(resultText);
      onComplete();
    } catch (e: any) {
      onError(`Verification failed: ${extract(e)}`);
    } finally {
      onBusyChange(false);
    }
  };

  const handleView = async () => {
    if (!viewVerificationId.trim()) {
      onError('Verification ID is required');
      return;
    }
    onBusyChange(true);
    try {
      const v = await api.getVerification(viewVerificationId);
      const resultText = 
        `Verification: ${viewVerificationId}\n` +
        `Commitment: ${v.commitmentId}\n` +
        `Policy: ${v.policyId}\n` +
        `Compliant: ${v.isCompliant ? 'YES' : 'NO'}\n` +
        `Authorized: ${v.authorizedPercentage}%\n` +
        `Licensed: ${v.licensedPercentage}%\n` +
        `Restricted: ${v.restrictedCount}\n` +
        `Expired: ${v.expiredLicenseCount}\n` +
        `At: ${new Date(Number(v.verifiedAt) * 1000).toLocaleString()}\n` +
        `By: ${v.verifiedBy}`;
      setLastResult(resultText);
      alert(resultText);
    } catch (e: any) {
      onError(`View failed: ${extract(e)}`);
    } finally {
      onBusyChange(false);
    }
  };

  return (
    <section className="card">
      <div className="card-head">
        <h2>ZK Compliance Verification</h2>
      </div>

      <p className="dim small">
        Run a zero-knowledge proof to verify that a training run complies with a policy.
        <strong>The proof reveals ONLY the result — never the underlying datasets.</strong>
      </p>

      <form onSubmit={(e) => { e.preventDefault(); void handleVerify(); }} className="form">
        <div className="form-group">
          <label>Commitment ID (Training Run)</label>
          <input
            type="text"
            value={commitmentId}
            onChange={(e) => setCommitmentId(e.target.value)}
            placeholder="Commitment ID (64 hex chars)"
            required
          />
        </div>

        <div className="form-group">
          <label>Policy ID</label>
          <input
            type="text"
            value={policyId}
            onChange={(e) => setPolicyId(e.target.value)}
            placeholder="Policy ID (64 hex chars)"
            required
          />
        </div>

        <button type="submit" className="btn-primary" disabled={busy || !commitmentId.trim() || !policyId.trim()}>
          {busy ? 'Generating ZK Proof…' : 'Run ZK Verification'}
        </button>
      </form>

      <div className="divider" />

      <form onSubmit={(e) => { e.preventDefault(); void handleView(); }} className="form">
        <div className="form-group">
          <label>Verification ID (to view past result)</label>
          <input
            type="text"
            value={viewVerificationId}
            onChange={(e) => setViewVerificationId(e.target.value)}
            placeholder="Verification ID (64 hex chars)"
            required
          />
        </div>
        <button type="submit" className="btn-secondary" disabled={busy || !viewVerificationId.trim()}>
          {busy ? 'Loading…' : 'View Result'}
        </button>
      </form>

      {lastResult && (
        <div className="result-box">
          <pre>{lastResult}</pre>
        </div>
      )}
    </section>
  );
}

function extract(e: any): string {
  if (!e) return 'unknown error';
  if (e.message && e.message !== '') return e.message;
  const failure = e?.cause?.failure;
  if (failure?.message) return failure.message;
  if (e?.cause?.message) return e.cause.message;
  try {
    return JSON.stringify(e);
  } catch {
    return String(e);
  }
}