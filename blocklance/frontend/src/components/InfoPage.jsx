function InfoPage({ onNavigate }) {
  return (
    <main className="info-page page-shell">
      <div className="eyebrow"><span className="eyebrow-line" /> The Blocklance protocol</div>
      <h1>Work moves<br /><em>in the open.</em></h1>
      <p className="info-lede">Blocklance connects clients and freelancers through transparent blockchain-powered job agreements. Your wallet is your identity; the contract holds the job state.</p>
      <section className="lifecycle-grid">
        <article><span>01</span><h2>Connect wallet</h2><p>Use the existing wallet connection to enter the marketplace. No email account or separate profile database is required.</p></article>
        <article><span>02</span><h2>Find or post work</h2><p>Clients publish a brief and deposit ETH. Freelancers browse real jobs read from the active contract.</p></article>
        <article><span>03</span><h2>Complete the job</h2><p>A freelancer accepts an open job and marks the work complete when delivery is ready.</p></article>
        <article><span>04</span><h2>Settle payment</h2><p>The client approves completed work and the existing contract releases the locked budget.</p></article>
      </section>
      <section className="roles-explainer">
        <div><div className="eyebrow"><span className="eyebrow-line" /> For clients</div><h2>Turn a brief into<br /><em>finished work.</em></h2><p>Publish a job with a budget, see its current contract state, and approve payment after completion.</p><button className="button button-primary" onClick={() => onNavigate("/post-job")}>Post a job -&gt;</button></div>
        <div><div className="eyebrow cyan-eyebrow"><span className="eyebrow-line" /> For freelancers</div><h2>Find work worth<br /><em>owning.</em></h2><p>Browse open opportunities, accept a fit, mark it complete, and receive payment after client approval.</p><button className="button button-cyan" onClick={() => onNavigate("/jobs")}>Browse jobs -&gt;</button></div>
      </section>
      <section className="info-cta"><h2>Ready to work differently?</h2><div><button className="button button-primary" onClick={() => onNavigate("/jobs")}>Find jobs</button><button className="button button-ghost" onClick={() => onNavigate("/post-job")}>Post a job</button></div></section>
    </main>
  );
}

export default InfoPage;
