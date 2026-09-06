import { useState } from "react";
import { formatEther } from "ethers";

function shortAddr(addr) {
  if (!addr) return "";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function Navbar({ account, balance, path, onNavigate, onConnect }) {
  const [menuOpen, setMenuOpen] = useState(false);

  function navigate(view) {
    onNavigate(view);
    setMenuOpen(false);
  }

  return (
    <header className="site-nav">
      <button className="brand" onClick={() => navigate("/")} aria-label="Go to Blocklance home">
        <span className="brand-mark">BL</span>
        <span>blocklance<span className="brand-dot">.</span></span>
      </button>

      <button className="nav-menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle navigation">
        <span />
        <span />
        <span />
      </button>

      <nav className={`nav-links ${menuOpen ? "is-open" : ""}`}>
        <button className={path === "/" ? "nav-link active" : "nav-link"} onClick={() => navigate("/")}>Home</button>
        <button className={path.startsWith("/jobs") ? "nav-link active" : "nav-link"} onClick={() => navigate("/jobs")}>Browse jobs</button>
        {account && <button className={path.startsWith("/workspace") ? "nav-link active" : "nav-link"} onClick={() => navigate("/workspace")}>My workspace</button>}
        <button className={path === "/how-it-works" ? "nav-link active" : "nav-link"} onClick={() => navigate("/how-it-works")}>How it works</button>
        {!account && <button className={path === "/login" ? "nav-link active" : "nav-link"} onClick={() => navigate("/login")}>Login</button>}
        {!account && <button className={path === "/signup" ? "nav-link active" : "nav-link"} onClick={() => navigate("/signup")}>Sign up</button>}
        {account && <button className={path.startsWith("/dashboard") ? "nav-link active" : "nav-link"} onClick={() => navigate("/dashboard")}>Dashboard</button>}
      </nav>

      <div className="nav-account">
        {account ? (
          <button className="wallet-pill" onClick={() => navigate("/account")}>
            <span className="status-dot" />
            <span className="wallet-pill-address">{shortAddr(account)}</span>
            <span className="wallet-pill-balance">{balance !== null ? Number(formatEther(balance)).toFixed(3) : "..."} ETH</span>
          </button>
        ) : (
          <button className="button button-primary button-small" onClick={onConnect}>Connect wallet <span aria-hidden="true">-&gt;</span></button>
        )}
      </div>
    </header>
  );
}

export default Navbar;
