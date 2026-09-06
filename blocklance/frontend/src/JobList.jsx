import { useCallback, useEffect, useState } from "react";
import { useWeb3 } from "./Web3Context";
import JobCard from "./components/JobCard";
import EmptyState from "./components/EmptyState";

function JobList({ account, mode, onViewDetails, onPostJob, notify }) {
  const { contract, refreshBalance } = useWeb3();
  const [jobs, setJobs] = useState([]);
  const [tab, setTab] = useState(mode === "dashboard-client" ? "posted" : mode === "dashboard-freelancer" ? "working" : "all");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const loadJobs = useCallback(async () => {
    if (!contract) return;
    setLoading(true);
    setError("");
    try {
      refreshBalance();
      const count = await contract.jobCount();
      const loaded = [];
      for (let index = 1; index <= Number(count); index += 1) {
        loaded.push(await contract.getJob(index));
      }
      setJobs(loaded.reverse());
    } catch (loadError) {
      console.error(loadError);
      setError(loadError.shortMessage || loadError.message || "Could not load jobs from the network.");
    } finally {
      setLoading(false);
    }
  }, [contract, refreshBalance]);

  useEffect(() => {
    if (!contract) return undefined;
    const scheduleLoad = window.setTimeout(() => { void loadJobs(); }, 0);
    const handleContractChange = () => { void loadJobs(); };
    contract.on("JobPosted", handleContractChange);
    contract.on("JobAccepted", handleContractChange);
    contract.on("WorkCompleted", handleContractChange);
    contract.on("PaymentReleased", handleContractChange);
    return () => {
      window.clearTimeout(scheduleLoad);
      contract.off("JobPosted", handleContractChange);
      contract.off("JobAccepted", handleContractChange);
      contract.off("WorkCompleted", handleContractChange);
      contract.off("PaymentReleased", handleContractChange);
    };
  }, [contract, loadJobs]);

  async function runJobAction(id, method, successMessage) {
    setActionLoading(Number(id));
    try {
      const tx = await contract[method](id);
      await tx.wait();
      notify(successMessage);
      await loadJobs();
    } catch (actionError) {
      const message = actionError.reason || actionError.shortMessage || actionError.info?.error?.message || actionError.message || "Transaction failed.";
      notify(message, "error");
    } finally {
      setActionLoading(null);
    }
  }

  const myAddress = account?.toLowerCase();
  const scopedJobs = jobs.filter((job) => {
    if (tab === "posted") return job.client.toLowerCase() === myAddress;
    if (tab === "working") return job.freelancer.toLowerCase() === myAddress;
    if (tab === "completed") return Number(job.status) >= 2 && (job.client.toLowerCase() === myAddress || job.freelancer.toLowerCase() === myAddress);
    return true;
  });
  const visibleJobs = scopedJobs.filter((job) => {
    const matchesQuery = `${job.title} ${job.description}`.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === "all" || Number(job.status) === Number(statusFilter);
    return matchesQuery && matchesStatus;
  }).sort((first, second) => sort === "budget" ? Number(second.budget) - Number(first.budget) : sort === "low-budget" ? Number(first.budget) - Number(second.budget) : Number(second.createdAt) - Number(first.createdAt));

  const openCount = jobs.filter((job) => Number(job.status) === 0).length;
  const activeCount = jobs.filter((job) => Number(job.status) === 1).length;
  if (loading && jobs.length === 0) return <main className="market-page page-shell"><div className="loading-state"><span className="loading-mark">//</span><h2>Reading the job layer<span className="blink">_</span></h2><p>Fetching current state from the connected network.</p></div></main>;

  return (
    <main className="market-page page-shell">
      <div className="market-header"><div><div className="eyebrow"><span className="eyebrow-line" /> {mode === "workspace" ? "My workspace" : mode === "dashboard-client" ? "Client dashboard" : mode === "dashboard-freelancer" ? "Freelancer dashboard" : "Open marketplace"}</div><h1>{mode === "workspace" ? "Your work, on-chain." : mode === "dashboard-client" ? "Good to see you." : mode === "dashboard-freelancer" ? "Your freelance workspace." : "Find work worth doing."}</h1><p>{mode === "workspace" ? "Track the jobs connected to your wallet and take the next permitted action." : mode.startsWith("dashboard") ? "Manage real contract states from one place." : "Clear briefs, visible budgets, and work that settles through code."}</p></div>{(mode === "workspace" || mode === "dashboard-client") && <button className="button button-primary" onClick={onPostJob}>Post a job <span aria-hidden="true">+</span></button>}</div>
      <div className="market-stats"><div><span>{mode === "dashboard-freelancer" ? "AVAILABLE" : "POSTED"}</span><strong>{mode === "dashboard-freelancer" ? openCount : jobs.filter((job) => job.client.toLowerCase() === myAddress).length}</strong></div><div><span>ACTIVE</span><strong>{activeCount}</strong></div><div><span>COMPLETED</span><strong>{jobs.filter((job) => Number(job.status) >= 2 && (mode === "dashboard-freelancer" ? job.freelancer.toLowerCase() === myAddress : mode === "dashboard-client" ? job.client.toLowerCase() === myAddress : true)).length}</strong></div><div className="stats-note"><span>NETWORK READ</span><strong className="live-value"><i /> LIVE</strong></div></div>
      <div className="market-toolbar"><div className="view-tabs">{mode === "workspace" && <><button className={tab === "all" ? "active" : ""} onClick={() => setTab("all")}>Overview</button><button className={tab === "posted" ? "active" : ""} onClick={() => setTab("posted")}>My jobs</button><button className={tab === "working" ? "active" : ""} onClick={() => setTab("working")}>Active work</button><button className={tab === "completed" ? "active" : ""} onClick={() => setTab("completed")}>Completed</button></>}{mode !== "workspace" && <><button className={tab === "all" ? "active" : ""} onClick={() => setTab("all")}>All jobs</button><button className={tab === "posted" ? "active" : ""} onClick={() => setTab("posted")}>My postings</button><button className={tab === "working" ? "active" : ""} onClick={() => setTab("working")}>My work</button></>}</div><div className="filter-controls"><label className="search-field"><span>/</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search jobs..." /></label><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter jobs by status"><option value="all">All statuses</option><option value="0">Open</option><option value="1">Assigned</option><option value="2">Completed</option><option value="4">Cancelled</option></select><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort jobs"><option value="newest">Newest</option><option value="budget">Budget: high to low</option><option value="low-budget">Budget: low to high</option></select></div></div>
      {error && <div className="inline-error"><strong>Network read failed.</strong> {error}<button className="text-button" onClick={() => void loadJobs()}>Retry</button></div>}
      {visibleJobs.length === 0 && !error && <EmptyState title={query || statusFilter !== "all" ? "No matching jobs" : tab === "posted" ? "No jobs posted yet" : tab === "working" ? "No assigned work yet" : "No jobs on-chain yet"} message={query || statusFilter !== "all" ? "Try clearing your search or filters." : "This view only shows real jobs read from the connected blockchain."} />}
      <div className="job-grid">{visibleJobs.map((job) => <JobCard key={Number(job.id)} job={job} account={account} onView={() => onViewDetails(job)} onAccept={(id) => runJobAction(id, Number(job.status) === 0 ? "acceptJob" : "markCompleted", Number(job.status) === 0 ? "Job accepted on-chain." : "Work marked completed on-chain.")} actionLoading={actionLoading} />)}</div>
      {loading && jobs.length > 0 && <div className="refresh-line">Updating from the network...</div>}
    </main>
  );
}

export default JobList;