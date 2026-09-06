import { useCallback, useEffect, useState } from "react";
import { useWeb3 } from "../Web3Context";
import JobCard from "./JobCard";
import EmptyState from "./EmptyState";

function FeaturedJobs({ account, onView, onPostJob }) {
  const { contract } = useWeb3();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(Boolean(contract));
  const [error, setError] = useState("");

  const loadJobs = useCallback(async () => {
    if (!contract) return;
    setLoading(true);
    try {
      const count = await contract.jobCount();
      const loaded = [];
      for (let index = Math.max(1, Number(count) - 2); index <= Number(count); index += 1) loaded.push(await contract.getJob(index));
      setJobs(loaded.reverse());
    } catch (loadError) {
      setError(loadError.shortMessage || loadError.message || "Unable to load jobs.");
    } finally {
      setLoading(false);
    }
  }, [contract]);

  useEffect(() => {
    const loadTimer = window.setTimeout(() => { void loadJobs(); }, 0);
    return () => window.clearTimeout(loadTimer);
  }, [loadJobs]);

  return <section className="featured-section page-shell"><div className="section-heading compact"><div><div className="eyebrow"><span className="eyebrow-line" /> On-chain feed</div><h2>Opportunities waiting for you.</h2></div><button className="text-button" onClick={() => onView("/jobs")}>View all jobs -&gt;</button></div>{loading && <div className="landing-empty"><span className="loading-mark">//</span><div><strong>Loading jobs from the blockchain...</strong><p>Reading the latest public job state.</p></div></div>}{error && <div className="landing-empty"><span className="empty-icon">!</span><div><strong>Unable to load jobs.</strong><p>{error}</p><button className="text-button" onClick={() => void loadJobs()}>Retry -&gt;</button></div></div>}{!loading && !error && jobs.length === 0 && <EmptyState title="No opportunities yet." message="Be the first client to create a job." action="Post a job" onAction={onPostJob} />}{!loading && !error && jobs.length > 0 && <div className="job-grid">{jobs.map((job) => <JobCard key={Number(job.id)} job={job} account={account} onView={() => onView(`/jobs/${Number(job.id)}`)} />)}</div>}</section>;
}

export default FeaturedJobs;
