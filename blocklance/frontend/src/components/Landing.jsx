import FeaturedJobs from "./FeaturedJobs";

function Landing({ account, onNavigate }) {
  return (
    <main className="landing-page">
      <section className="hero-section page-shell">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line" /> Open work protocol</div>
          <h1>Freelancing,<br /><em>without the middleman.</em></h1>
          <p className="hero-text">Find work, hire talent, and manage projects through transparent blockchain-powered agreements.</p>
          <div className="hero-actions">
            <button className="button button-primary" onClick={() => onNavigate("/jobs")}>Find work <span aria-hidden="true">-&gt;</span></button>
            <button className="button button-ghost" onClick={() => onNavigate("/post-job")}>Post a job <span aria-hidden="true">+</span></button>
          </div>
          <div className="hero-note"><span className="terminal-prompt">$</span> Powered by smart contracts</div>
        </div>
        <div className="hero-visual" aria-label="Blocklance escrow flow">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="hero-terminal">
            <div className="terminal-top"><span>blocklance / escrow.sol</span><span className="terminal-live">LIVE</span></div>
            <div className="terminal-body">
              <p><span className="code-muted">01</span> CLIENT <span className="code-cyan">POSTS</span></p>
              <p><span className="code-muted">02</span>&nbsp;&nbsp; <span className="code-green">↓ SMART CONTRACT</span></p>
              <p><span className="code-muted">03</span>&nbsp;&nbsp; PAYMENT = <span className="code-purple">LOCKED</span></p>
              <p><span className="code-muted">04</span>&nbsp;&nbsp; FREELANCER <span className="code-green">WORKS</span></p>
              <p><span className="code-muted">05</span> PAYMENT = <span className="code-green">RELEASED</span></p>
              <div className="terminal-cursor" />
            </div>
          </div>
          <div className="hero-stamp"><span>ON-CHAIN</span><strong>WORK</strong><span>MARKETPLACE</span></div>
        </div>
      </section>

      <section className="signal-strip page-shell">
        <div><span className="signal-label">01</span><strong>Direct terms</strong><span>Every brief is visible before you commit.</span></div>
        <div><span className="signal-label">02</span><strong>Escrow by code</strong><span>Budgets stay in the contract until approval.</span></div>
        <div><span className="signal-label">03</span><strong>Wallet-native</strong><span>Your address is your identity here.</span></div>
      </section>

      <section className="section-block page-shell" id="how-it-works">
        <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> The protocol</div><h2>Work without<br /><span>the middle layer.</span></h2></div><p>Blocklance keeps the important parts of freelance work simple: a clear scope, an assigned person, and payment that follows completion.</p></div>
        <div className="steps-grid">
          <article className="step-card"><span className="step-number">01</span><h3>Connect wallet</h3><p>Your wallet is your decentralized identity. No separate account database.</p><div className="step-mark">[ IDENTITY ]</div></article>
          <article className="step-card step-card-highlight"><span className="step-number">02</span><h3>Find or post work</h3><p>Clients publish funded briefs. Freelancers browse real opportunities.</p><div className="step-mark">[ MATCH ]</div></article>
          <article className="step-card"><span className="step-number">03</span><h3>Complete and settle</h3><p>Work moves through explicit contract states until payment is approved.</p><div className="step-mark">[ SETTLE ]</div></article>
        </div>
        <div className="section-actions"><button className="button button-ghost button-small" onClick={() => onNavigate("/how-it-works")}>For clients -&gt;</button><button className="button button-ghost button-small" onClick={() => onNavigate("/jobs")}>For freelancers -&gt;</button></div>
      </section>

      <FeaturedJobs account={account} onView={onNavigate} onPostJob={() => onNavigate("/post-job")} />

      <section className="transparency-section page-shell">
        <div className="transparency-copy"><div className="eyebrow"><span className="eyebrow-line" /> Why Blocklance</div><h2>Trust is a<br /><em>readable state.</em></h2><p>Every job moves through explicit stages on-chain. See who posted it, who accepted it, and when payment was released.</p></div>
        <div className="state-map"><div className="state-node"><span>01</span><strong>OPEN</strong><small>Budget deposited</small></div><div className="state-connector" /><div className="state-node"><span>02</span><strong>IN PROGRESS</strong><small>Freelancer assigned</small></div><div className="state-connector" /><div className="state-node"><span>03</span><strong>APPROVED</strong><small>Payment released</small></div></div>
      </section>
      <section className="final-cta page-shell"><h2>Ready to work differently?</h2><div><button className="button button-primary" onClick={() => onNavigate("/jobs")}>Find jobs</button><button className="button button-ghost" onClick={() => onNavigate("/post-job")}>Post a job</button></div></section>
      <footer className="site-footer page-shell"><button className="brand footer-brand" onClick={() => onNavigate("/")}><span className="brand-mark">BL</span><span>blocklance<span className="brand-dot">.</span></span></button><nav><button onClick={() => onNavigate("/")}>Home</button><button onClick={() => onNavigate("/jobs")}>Browse jobs</button><button onClick={() => onNavigate("/workspace")}>My workspace</button><button onClick={() => onNavigate("/how-it-works")}>How it works</button><button onClick={() => onNavigate("/account")}>Account</button></nav><span className="footer-code">STATUS: <b>ONLINE</b></span></footer>
    </main>
  );
}

export default Landing;
