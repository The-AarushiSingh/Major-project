import { useEffect, useState } from "react";
import { formatEther } from "ethers";
import { useWeb3 } from "./Web3Context";
import Navbar from "./components/Navbar";
import Landing from "./components/Landing";
import RoleSelector from "./components/RoleSelector";
import AuthPage from "./components/AuthPage";
import InfoPage from "./components/InfoPage";
import JobDetailsPage from "./components/JobDetailsPage";
import JobList from "./JobList";
import PostJob from "./PostJob";
import { routeTo } from "./utils/navigation";
import "./App.css";

function App() {
  const { account, connectWallet, balance } = useWeb3();
  const [path, setPath] = useState(window.location.pathname || "/");
  const [role, setRole] = useState(null);
  const [afterConnect, setAfterConnect] = useState(null);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname || "/");
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function navigate(nextPath) {
    routeTo(nextPath);
  }

  async function handleConnect() {
    if (!account && !["/", "/login", "/signup", "/role-selection"].includes(path)) setAfterConnect(path);
    await connectWallet();
    navigate("/role-selection");
  }

  function chooseRole(nextRole) {
    setRole(nextRole);
    const destination = afterConnect || `/dashboard/${nextRole}`;
    setAfterConnect(null);
    navigate(destination);
  }

  function showNotice(message, type = "success") {
    setNotice({ message, type });
    window.setTimeout(() => setNotice(null), 5000);
  }

  function renderProtected(view) {
    if (!account) return <AuthPage mode="login" onConnect={handleConnect} onNavigate={navigate} />;
    if (!role && path !== "/role-selection") return <RoleSelector account={account} onSelect={chooseRole} />;
    return view;
  }

  function renderPage() {
    if (path === "/") return <Landing account={account} onNavigate={navigate} />;
    if (path === "/login" || path === "/signup") {
      if (account && !role) return <RoleSelector account={account} onSelect={chooseRole} />;
      if (account && role) return <JobList account={account} mode={role === "client" ? "dashboard-client" : "dashboard-freelancer"} onPostJob={() => navigate("/post-job")} onViewDetails={(job) => navigate(`/jobs/${Number(job.id)}`)} notify={showNotice} />;
      return <AuthPage mode={path === "/signup" ? "signup" : "login"} onConnect={handleConnect} onNavigate={navigate} />;
    }
    if (path === "/role-selection") return account ? <RoleSelector account={account} onSelect={chooseRole} /> : <AuthPage mode="signup" onConnect={handleConnect} onNavigate={navigate} />;
    if (path === "/how-it-works") return <InfoPage onNavigate={navigate} />;
    if (path === "/jobs") {
      if (!account) return <AuthPage mode="login" onConnect={handleConnect} onNavigate={navigate} />;
      return renderProtected(<JobList account={account} mode="marketplace" onViewDetails={(job) => navigate(`/jobs/${Number(job.id)}`)} notify={showNotice} />);
    }
    if (path.startsWith("/jobs/")) {
      if (!account) return <AuthPage mode="login" onConnect={handleConnect} onNavigate={navigate} />;
      const jobId = path.split("/")[2];
      return renderProtected(<JobDetailsPage jobId={jobId} account={account} notify={showNotice} onBack={() => navigate("/jobs")} />);
    }
    if (path === "/post-job") return renderProtected(<PostJob onBack={() => navigate("/workspace")} onSuccess={() => showNotice("Job published successfully.")} onViewJobs={() => navigate("/jobs")} onWorkspace={() => navigate("/workspace")} notify={showNotice} />);
    if (path === "/workspace") return renderProtected(<JobList account={account} mode="workspace" workspaceRole={role || "client"} onPostJob={() => navigate("/post-job")} onViewDetails={(job) => navigate(`/jobs/${Number(job.id)}`)} notify={showNotice} />);
    if (path === "/dashboard" || path === "/dashboard/") return account && role ? <JobList account={account} mode={role === "client" ? "dashboard-client" : "dashboard-freelancer"} workspaceRole={role} onPostJob={() => navigate("/post-job")} onViewDetails={(job) => navigate(`/jobs/${Number(job.id)}`)} notify={showNotice} /> : <RoleSelector account={account} onSelect={chooseRole} />;
    if (path === "/dashboard/client") return renderProtected(<JobList account={account} mode="dashboard-client" workspaceRole="client" onPostJob={() => navigate("/post-job")} onViewDetails={(job) => navigate(`/jobs/${Number(job.id)}`)} notify={showNotice} />);
    if (path === "/dashboard/freelancer") return renderProtected(<JobList account={account} mode="dashboard-freelancer" workspaceRole="freelancer" onViewDetails={(job) => navigate(`/jobs/${Number(job.id)}`)} notify={showNotice} />);
    if (path === "/account") return renderProtected(<AccountPage account={account} balance={balance} role={role} onNavigate={navigate} notify={showNotice} />);
    return <Landing account={account} onNavigate={navigate} />;
  }

  return <div className="app"><Navbar account={account} balance={balance} path={path} onNavigate={navigate} onConnect={handleConnect} />{notice && <div className={`toast toast-${notice.type}`} role="status"><span>{notice.type === "error" ? "!" : "OK"}</span>{notice.message}<button onClick={() => setNotice(null)} aria-label="Dismiss notification">x</button></div>}{renderPage()}</div>;
}

function AccountPage({ account, balance, role, onNavigate, notify }) {
  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(account);
      notify("Wallet address copied.");
    } catch {
      notify("Copy is not available in this browser.", "error");
    }
  }

  return <main className="account-page page-shell"><div className="eyebrow"><span className="eyebrow-line" /> Wallet state</div><h1>Your account<br /><em>is your identity.</em></h1><div className="account-panel"><div className="account-panel-label">CONNECTED WALLET</div><code>{account}</code><button className="button button-ghost button-small" onClick={copyAddress}>Copy address</button><div className="account-balance"><span>AVAILABLE BALANCE</span><strong>{balance !== null ? Number(formatEther(balance)).toFixed(4) : "..."} <small>ETH</small></strong></div><div className="account-facts"><span>FRONTEND ROLE</span><strong>{role || "Not selected"}</strong><span>NETWORK</span><strong>Provided by connected wallet</strong></div><p>Blocklance uses your wallet address as your identity. Profiles and roles are not persisted by the current application.</p><div className="account-actions"><button className="button button-primary button-small" onClick={() => onNavigate(`/dashboard/${role || "client"}`)}>Go to dashboard</button><button className="button button-ghost button-small" onClick={() => onNavigate("/workspace")}>Go to workspace</button><button className="button button-ghost button-small" onClick={() => onNavigate("/jobs")}>Browse jobs</button></div></div></main>;
}

export default App;