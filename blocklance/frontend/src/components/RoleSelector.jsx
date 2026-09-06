function RoleSelector({ account, onSelect }) {
  return (
    <main className="role-page page-shell">
      <div className="role-intro"><div className="eyebrow"><span className="eyebrow-line" /> Session initialized</div><h1>Choose your<br /><em>working mode.</em></h1><p>Both paths use the same connected wallet. This choice only shapes your workspace; permissions always come from the job contract.</p><div className="account-line"><span className="status-dot" /> {account.slice(0, 6)}...{account.slice(-4)} connected</div></div>
      <div className="role-grid">
        <button className="role-card role-client" onClick={() => onSelect("client")}><span className="role-index">01 / CLIENT</span><span className="role-symbol">+</span><h2>Post work.<br /><em>Find talent.</em></h2><p>Put a clear brief in motion and fund it with an on-chain budget.</p><span className="role-cta">Continue as client -&gt;</span></button>
        <button className="role-card role-freelancer" onClick={() => onSelect("freelancer")}><span className="role-index">02 / FREELANCER</span><span className="role-symbol">//</span><h2>Find work.<br /><em>Build trust.</em></h2><p>Browse open jobs, own your delivery, and get paid when the work lands.</p><span className="role-cta">Continue as freelancer -&gt;</span></button>
      </div>
    </main>
  );
}

export default RoleSelector;
