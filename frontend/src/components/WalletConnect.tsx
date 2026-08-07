import { useWallet } from '../hooks/useWallet';

const LACE_CHROME_URL = 'https://chromewebstore.google.com/detail/lace/gafhhkghbfjjkeiendhlofajokpaflmk';

function truncAddr(addr: string): string {
  return addr.length <= 24 ? addr : `${addr.slice(0, 14)}…${addr.slice(-8)}`;
}

export default function WalletConnect() {
  const { status, address, error, connect, disconnect, networkId } = useWallet();

  return (
    <div className="wallet-bar">
      {status === 'connected' && address ? (
        <>
          <span className="chip ok" title={address}>
            <span className="dot" />
            {truncAddr(address)}
          </span>
          <span className="chip muted">network: {networkId}</span>
          <button className="btn-secondary btn-sm" onClick={disconnect}>
            Disconnect
          </button>
        </>
      ) : status === 'detecting' || status === 'connecting' ? (
        <span className="chip muted">
          <span className="spinner" />
          {status === 'detecting' ? 'Detecting wallet…' : 'Connecting…'}
        </span>
      ) : status === 'no-wallet' ? (
        <a className="chip warn" href={LACE_CHROME_URL} target="_blank" rel="noopener noreferrer">
          Install Midnight Lace →
        </a>
      ) : (
        <>
          <button className="btn-primary" onClick={connect}>
            Connect Wallet
          </button>
          {error && <span className="chip warn">{error}</span>}
        </>
      )}
    </div>
  );
}
