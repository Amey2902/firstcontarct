import React, { useState, useEffect } from 'react';
import { Navbar, ViewType } from './components/Navbar';
import { WalletModal } from './components/WalletModal';
import { DashboardView } from './components/DashboardView';
import { DatasetRegistryView, RegisteredDataset } from './components/DatasetRegistryView';
import { ComplianceVerificationView, AuditRecord } from './components/ComplianceVerificationView';
import { AuditHistoryView } from './components/AuditHistoryView';
import { useMidnight } from './hooks/useMidnight';
import { LICENSE_TYPES, AUTH_STATUS } from './contract';
import { ShieldCheck, ExternalLink, Loader2, CheckCircle2, AlertTriangle, X } from 'lucide-react';

const INITIAL_DATASETS: RegisteredDataset[] = [
  {
    id: '0x8f2d3a91b4e5c678a1b2c3d4e5f67890abcdef1234567890abcdef1234567890',
    name: 'RefinedWeb-En-Core-v2',
    owner: '0x1111111111111111111111111111111111111111111111111111111111111111',
    licenseType: LICENSE_TYPES.COMMERCIAL,
    authStatus: AUTH_STATUS.AUTHORIZED,
    validFrom: '2024-01-01',
    validUntil: '2027-12-31',
    contentHash: '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
    licenseHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    registeredAt: Math.floor(Date.now() / 1000) - 86400 * 45,
  },
  {
    id: '0x4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d',
    name: 'OpenOrca-Instruct-Filtered',
    owner: '0x2222222222222222222222222222222222222222222222222222222222222222',
    licenseType: LICENSE_TYPES.OPEN_SOURCE,
    authStatus: AUTH_STATUS.AUTHORIZED,
    validFrom: '2024-03-15',
    validUntil: '2026-12-31',
    contentHash: '0x5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c',
    licenseHash: '0xfeeeddccbbaa99887766554433221100ffeeddccbbaa99887766554433221100',
    registeredAt: Math.floor(Date.now() / 1000) - 86400 * 20,
  },
  {
    id: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    name: 'Restricted-Copyright-Corpus-Raw',
    owner: '0x3333333333333333333333333333333333333333333333333333333333333333',
    licenseType: LICENSE_TYPES.RESTRICTED,
    authStatus: AUTH_STATUS.REVOKED,
    validFrom: '2023-01-01',
    validUntil: '2024-01-01',
    contentHash: '0x3333333333333333333333333333333333333333333333333333333333333333',
    licenseHash: '0x4444444444444444444444444444444444444444444444444444444444444444',
    registeredAt: Math.floor(Date.now() / 1000) - 86400 * 90,
  },
];

const INITIAL_AUDITS: AuditRecord[] = [
  {
    auditId: 'AUDIT-8F92A1',
    modelName: 'DeepSeek-V3-Finance-Agent',
    modelHash: '0x3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b',
    datasetName: 'RefinedWeb-En-Core-v2',
    datasetId: INITIAL_DATASETS[0].id,
    overallStatus: 'VERIFIED_COMPLIANT',
    ruleResults: {
      datasetAuthorized: true,
      licenseCompatible: true,
      temporalValidity: true,
      datasetIntegrity: true,
      piiSanitized: true,
    },
    verifiedAt: Math.floor(Date.now() / 1000) - 3600 * 5,
    proofHash: '0x7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f',
    verifier: '0x4444444444444444444444444444444444444444444444444444444444444444',
    zkCircuit: 'BlackBox.verifyCompliance(modelHash, datasetId, proofCommitment)',
  },
  {
    auditId: 'AUDIT-10C4E9',
    modelName: 'BioMed-Llama3-8B-Specialist',
    modelHash: '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c',
    datasetName: 'OpenOrca-Instruct-Filtered',
    datasetId: INITIAL_DATASETS[1].id,
    overallStatus: 'VERIFIED_COMPLIANT',
    ruleResults: {
      datasetAuthorized: true,
      licenseCompatible: true,
      temporalValidity: true,
      datasetIntegrity: true,
      piiSanitized: true,
    },
    verifiedAt: Math.floor(Date.now() / 1000) - 3600 * 28,
    proofHash: '0x8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a',
    verifier: '0x5555555555555555555555555555555555555555555555555555555555555555',
    zkCircuit: 'BlackBox.verifyCompliance(modelHash, datasetId, proofCommitment)',
  },
];

export const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [datasets, setDatasets] = useState<RegisteredDataset[]>(INITIAL_DATASETS);
  const [audits, setAudits] = useState<AuditRecord[]>(INITIAL_AUDITS);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; title: string; message: string } | null>(null);

  const {
    status,
    wallets,
    address,
    activeWalletId,
    contractAddress,
    contractState,
    isAwaitingConfirmation,
    confirmationNotice,
    txHistory,
    fetchWalletHistory,
    connect,
    disconnect,
    callTx,
    queryIndexerState,
  } = useMidnight();

  const isConnecting = status === 'connecting';
  const walletState = { status, address, wallets, isConnecting };

  // Dismiss toast automatically
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Sync indexer contract state if indexed items are available
  useEffect(() => {
    if (contractState) {
      if (contractState.datasetRegistry && Object.keys(contractState.datasetRegistry).length > 0) {
        const indexedDatasets: RegisteredDataset[] = Object.values(contractState.datasetRegistry).map((ds: any) => ({
          id: ds.datasetId,
          name: ds.name || `Dataset-${ds.datasetId.slice(0, 8)}`,
          owner: ds.owner,
          licenseType: ds.licenseType ?? LICENSE_TYPES.COMMERCIAL,
          authStatus: ds.authorizationStatus ?? AUTH_STATUS.AUTHORIZED,
          validFrom: ds.validFrom ? new Date(Number(ds.validFrom) * 1000).toISOString().split('T')[0] : '2024-01-01',
          validUntil: ds.validUntil ? new Date(Number(ds.validUntil) * 1000).toISOString().split('T')[0] : '2027-12-31',
          contentHash: ds.contentHash,
          licenseHash: ds.licenseHash,
          registeredAt: Number(ds.registeredAt || Math.floor(Date.now() / 1000)),
        }));
        setDatasets((prev) => {
          const existingIds = new Set(prev.map((d) => d.id));
          const uniqueNew = indexedDatasets.filter((d) => !existingIds.has(d.id));
          return [...uniqueNew, ...prev];
        });
      }
    }
  }, [contractState]);

  const requireWallet = (): boolean => {
    if (status !== 'connected' || !address) {
      setIsWalletModalOpen(true);
      setToast({
        type: 'info',
        title: '1AM Wallet Required',
        message: 'Please connect your 1AM wallet first. Every on-chain transaction requires confirmation in your 1AM extension pop-up.',
      });
      return false;
    }
    return true;
  };

  const handleRegisterDataset = async (newDataset: RegisteredDataset) => {
    if (!requireWallet()) return;

    try {
      const result = await callTx.registerDataset({
        datasetId: newDataset.id,
        owner: newDataset.owner,
        contentHash: newDataset.contentHash,
        licenseHash: newDataset.licenseHash,
        licenseType: newDataset.licenseType,
        authorizationStatus: newDataset.authStatus,
        validFrom: Math.floor(new Date(newDataset.validFrom).getTime() / 1000),
        validUntil: Math.floor(new Date(newDataset.validUntil).getTime() / 1000),
        metadataHash: newDataset.licenseHash,
      });

      // User confirmed & signed in 1AM -> update UI state
      setDatasets((prev) => [newDataset, ...prev]);
      setToast({
        type: 'success',
        title: '1AM Pop-up Confirmed & Signed!',
        message: `Dataset "${newDataset.name}" registered successfully on Midnight. Tx / Sig: ${result.txHash.slice(0, 18)}...`,
      });

      queryIndexerState(contractAddress);
    } catch (e: any) {
      console.warn('[callTx.registerDataset] Notice:', e);
      setToast({
        type: 'error',
        title: '1AM Transaction Aborted',
        message: e?.message || 'Transaction was rejected or cancelled in your 1AM wallet window.',
      });
    }
  };

  const handleToggleAuth = async (datasetId: string) => {
    if (!requireWallet()) return;

    const targetDataset = datasets.find((d) => d.id === datasetId);
    if (!targetDataset) return;
    const nextStatus = targetDataset.authStatus === AUTH_STATUS.AUTHORIZED ? AUTH_STATUS.REVOKED : AUTH_STATUS.AUTHORIZED;
    const actionName = nextStatus === AUTH_STATUS.AUTHORIZED ? 'Authorize' : 'Revoke';

    try {
      const owner = targetDataset.owner || address || '0x1111111111111111111111111111111111111111111111111111111111111111';
      let result;
      if (nextStatus === AUTH_STATUS.AUTHORIZED) {
        result = await callTx.authorizeDataset({ datasetId, owner });
      } else {
        result = await callTx.revokeDataset({ datasetId, owner });
      }

      // User confirmed & signed in 1AM -> update UI
      setDatasets((prev) =>
        prev.map((d) => (d.id === datasetId ? { ...d, authStatus: nextStatus } : d))
      );
      setToast({
        type: 'success',
        title: `1AM ${actionName} Confirmed!`,
        message: `Dataset authorization ${actionName.toLowerCase()}d and signed in 1AM! Tx: ${result.txHash.slice(0, 18)}...`,
      });

      queryIndexerState(contractAddress);
    } catch (e: any) {
      console.warn('[callTx.toggleAuth] Notice:', e);
      setToast({
        type: 'error',
        title: '1AM Action Rejected',
        message: e?.message || 'Authorization change was rejected or cancelled in 1AM wallet.',
      });
    }
  };

  const handleAuditComplete = async (newAudit: AuditRecord) => {
    if (!requireWallet()) return;

    try {
      // 1. Submit training commitment with 1AM pop-up approval
      const commitmentId = '0x' + Array.from(crypto.getRandomValues(new Uint8Array(32))).map((b) => b.toString(16).padStart(2, '0')).join('');
      await callTx.submitTrainingCommitment({
        commitmentId,
        trainer: address || '0x2222222222222222222222222222222222222222222222222222222222222222',
        datasetIds: [newAudit.datasetId],
        datasetCount: 1,
        trainingTimestamp: newAudit.verifiedAt,
        modelHash: newAudit.modelHash,
      });

      // 2. Submit verification result with 1AM pop-up approval
      const verificationId = '0x' + Array.from(crypto.getRandomValues(new Uint8Array(32))).map((b) => b.toString(16).padStart(2, '0')).join('');
      const verRes = await callTx.verifyCompliance({
        verificationId,
        commitmentId,
        minAuthorizedPct: 100,
        minLicensedPct: 95,
        allowRestricted: false,
        requireValidLicenses: true,
        verifier: newAudit.verifier,
      });

      setAudits((prev) => [newAudit, ...prev]);
      setToast({
        type: 'success',
        title: '1AM Audit Proof Confirmed & Recorded!',
        message: `Zero-knowledge compliance audit signed via 1AM and ledger proof recorded! Tx: ${verRes.txHash.slice(0, 18)}...`,
      });

      queryIndexerState(contractAddress);
    } catch (e: any) {
      console.warn('[callTx.verifyCompliance] Notice:', e);
      setToast({
        type: 'error',
        title: '1AM Audit Signing Cancelled',
        message: e?.message || 'Proof submission was cancelled or rejected in 1AM wallet window.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col selection:bg-emerald-500/20 selection:text-emerald-800">
      {/* Top Navigation */}
      <Navbar
        activeView={activeView}
        onSelectView={setActiveView}
        walletState={walletState}
        onOpenWalletModal={() => setIsWalletModalOpen(true)}
        onDisconnect={disconnect}
      />

      {/* Floating 1AM Pop-up Awaiting Modal */}
      {isAwaitingConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border-2 border-emerald-500 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 mx-auto flex items-center justify-center text-3xl mb-4 animate-bounce">
              🔐
            </div>
            <h3 className="text-base font-headline font-bold text-slate-900">
              Confirm in 1AM Wallet
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {confirmationNotice || 'Please check your 1AM extension pop-up window in your browser to inspect parameters and click "Sign / Approve".'}
            </p>
            <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-500 flex items-center justify-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
              <span>Awaiting signature from 1AM extension...</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-3">
              If the 1AM pop-up did not open automatically, click your 1AM extension icon in the browser toolbar.
            </p>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-40 max-w-sm w-full bg-white border border-slate-200 rounded-xl shadow-xl p-4 animate-in slide-in-from-bottom-3 duration-200 flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
            {toast.type === 'error' && <AlertTriangle className="w-5 h-5 text-rose-600" />}
            {toast.type === 'info' && <ShieldCheck className="w-5 h-5 text-blue-600" />}
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-headline font-bold text-slate-900">{toast.title}</h4>
            <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{toast.message}</p>
          </div>
          <button
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'dashboard' && (
          <DashboardView
            datasetsCount={contractState?.totalDatasetsRegistered || datasets.length}
            auditsCount={contractState?.totalVerificationsRun || audits.length}
            compliantCount={audits.filter((a) => a.overallStatus === 'VERIFIED_COMPLIANT').length}
            onNavigate={setActiveView}
          />
        )}

        {activeView === 'registry' && (
          <DatasetRegistryView
            datasets={datasets}
            onRegister={handleRegisterDataset}
            onToggleAuth={handleToggleAuth}
            walletAddress={walletState.address}
          />
        )}

        {activeView === 'verify' && (
          <ComplianceVerificationView
            datasets={datasets}
            onAuditComplete={handleAuditComplete}
            walletAddress={walletState.address}
          />
        )}

        {activeView === 'history' && (
          <AuditHistoryView
            audits={audits}
            txHistory={txHistory}
            onRefreshWalletHistory={fetchWalletHistory}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/90 backdrop-blur-md py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-emerald-50 border border-emerald-200 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <span className="text-xs font-mono font-bold text-slate-900 tracking-wider">BLACKBOX AI</span>
            <span className="text-xs text-slate-500">| Midnight Network Preprod</span>
          </div>

          <div className="flex items-center space-x-6 text-xs text-slate-500 font-mono">
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-slate-700 font-medium">1AM DApp Connector v4</span>
            </span>
            <a
              href="https://1am.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-600 text-slate-600 transition-colors flex items-center space-x-1"
            >
              <span>1AM Wallet</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://docs.midnight.network"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-600 text-slate-600 transition-colors flex items-center space-x-1"
            >
              <span>Midnight Docs</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>

      {/* Wallet Connect Modal */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        wallets={walletState.wallets}
        onConnect={connect}
        isConnecting={walletState.isConnecting}
      />
    </div>
  );
};
