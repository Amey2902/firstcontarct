import React, { useState } from 'react';
import { Navbar, ViewType } from './components/Navbar';
import { WalletModal } from './components/WalletModal';
import { DashboardView } from './components/DashboardView';
import { DatasetRegistryView, RegisteredDataset } from './components/DatasetRegistryView';
import { ComplianceVerificationView, AuditRecord } from './components/ComplianceVerificationView';
import { AuditHistoryView } from './components/AuditHistoryView';
import { useMidnight } from './hooks/useMidnight';
import { LICENSE_TYPES, AUTH_STATUS } from './contract';
import { ShieldCheck, ExternalLink, Github, Terminal } from 'lucide-react';

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
  {
    auditId: 'AUDIT-FAIL-02',
    modelName: 'Scraped-Vision-MultiModal-v1',
    modelHash: '0x9999888877776666555544443333222211110000ffffaaafffeeedddcccbbbaa',
    datasetName: 'Restricted-Copyright-Corpus-Raw',
    datasetId: INITIAL_DATASETS[2].id,
    overallStatus: 'COMPLIANCE_FAILED',
    ruleResults: {
      datasetAuthorized: false,
      licenseCompatible: false,
      temporalValidity: false,
      datasetIntegrity: true,
      piiSanitized: true,
    },
    verifiedAt: Math.floor(Date.now() / 1000) - 3600 * 52,
    proofHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    verifier: '0x3333333333333333333333333333333333333333333333333333333333333333',
    zkCircuit: 'BlackBox.verifyCompliance(modelHash, datasetId, proofCommitment)',
  },
];

export const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [datasets, setDatasets] = useState<RegisteredDataset[]>(INITIAL_DATASETS);
  const [audits, setAudits] = useState<AuditRecord[]>(INITIAL_AUDITS);

  const { status, wallets, address, connect, disconnect } = useMidnight();
  const isConnecting = status === 'connecting';
  const walletState = { status, address, wallets, isConnecting };

  const handleRegisterDataset = (newDataset: RegisteredDataset) => {
    setDatasets((prev) => [newDataset, ...prev]);
  };

  const handleToggleAuth = (datasetId: string) => {
    setDatasets((prev) =>
      prev.map((d) => {
        if (d.id === datasetId) {
          const nextStatus = d.authStatus === AUTH_STATUS.AUTHORIZED ? AUTH_STATUS.REVOKED : AUTH_STATUS.AUTHORIZED;
          return { ...d, authStatus: nextStatus };
        }
        return d;
      })
    );
  };

  const handleAuditComplete = (newAudit: AuditRecord) => {
    setAudits((prev) => [newAudit, ...prev]);
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

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'dashboard' && (
          <DashboardView
            datasetsCount={datasets.length}
            auditsCount={audits.length}
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

        {activeView === 'history' && <AuditHistoryView audits={audits} />}
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
              <span className="text-slate-700 font-medium">Compact ZK Runtime</span>
            </span>
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
