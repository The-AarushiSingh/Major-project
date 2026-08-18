import { useWeb3 } from "./Web3Context";
import { formatEther } from "ethers";
import PostJob from "./PostJob";
import JobList from "./JobList";
import "./App.css";

function shortAddr(addr) {
  if (!addr) return "";
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

function App() {
  const { account, connectWallet, balance } = useWeb3();

  return (
    <div className="app">
      <div className="header">
        <h1>BLOCKLANCE</h1>
        <p>Decentralised Freelance Platform</p>
      </div>

      {!account ? (
        <button className="connect-btn" onClick={connectWallet}>
          Connect Wallet
        </button>
      ) : (
        <div className="wallet-bar">
          <span className="addr">
            Connected as <code>{shortAddr(account)}</code>
          </span>
          <span className="balance">
            {balance !== null ? Number(formatEther(balance)).toFixed(4) : "..."} ETH
          </span>
        </div>
      )}

      {account && (
        <>
          <PostJob />
          <JobList account={account} />
        </>
      )}
    </div>
  );
}

export default App;
export { shortAddr };