function AuthPage({ mode, account, onConnect, onNavigate }) {
  const isSignup = mode === "signup";

  if (account) {
    return (
      <main className="auth-page page-shell"><div className="auth-card"><span className="auth-mark">BL</span><div className="eyebrow"><span className="eyebrow-line" /> Wallet detected</div><h1>You're already<br /><em>connected.</em></h1><p>Your wallet is the identity used by Blocklance. Continue to your workspace or choose a different frontend role.</p><button className="button button-primary button-wide" onClick={() => onNavigate("/dashboard")}>Go to dashboard -&gt;</button><button className="button button-ghost button-wide" onClick={() => onNavigate("/role-selection")}>Choose role</button></div></main>
    );
  }

  return (
    <main className="auth-page page-shell"><div className="auth-card"><span className="auth-mark">BL</span><div className="eyebrow"><span className="eyebrow-line" /> {isSignup ? "New wallet onboarding" : "Return to the protocol"}</div><h1>{isSignup ? <>Create your<br /><em>Blocklance account.</em></> : <>Welcome<br /><em>back.</em></>}</h1><p>{isSignup ? "There is no separate password or profile database here. Connect a wallet, choose a working mode, and start using the marketplace." : "Connect your wallet to continue. Your wallet acts as your decentralized identity."}</p>{isSignup && <div className="auth-steps"><span className="active">01 Connect wallet</span><span>02 Choose role</span><span>03 Start working</span></div>}<button className="button button-primary button-wide" onClick={onConnect}>Connect wallet -&gt;</button><div className="auth-switch">{isSignup ? "Already have a wallet session?" : "New to Blocklance?"} <button className="text-button" onClick={() => onNavigate(isSignup ? "/login" : "/signup")}>{isSignup ? "Log in" : "Create your account"}</button></div></div></main>
  );
}

export default AuthPage;
