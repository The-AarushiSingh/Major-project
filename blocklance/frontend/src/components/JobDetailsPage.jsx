import { useCallback, useEffect, useState } from "react";
import { useWeb3 } from "../Web3Context";
import JobDetails from "./JobDetails";

function JobDetailsPage({ jobId, account, notify, onBack, onNavigate }) {
  const { contract } = useWeb3();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadJob = useCallback(async () => {
    if (!contract) return;
    setLoading(true);
    try {
      const loadedJob = await contract.getJob(jobId);
      if (!loadedJob || Number(loadedJob.id) === 0) throw new Error("This job does not exist on-chain.");
      setJob(loadedJob);
    } catch (loadError) {
      setError(loadError.shortMessage || loadError.message || "Unable to load this job.");
    } finally {
      setLoading(false);
    }
  }, [contract, jobId]);

  useEffect(() => {
    const loadTimer = window.setTimeout(() => { void loadJob(); }, 0);
    return () => window.clearTimeout(loadTimer);
  }, [loadJob]);

  if (loading) return <main className="detail-page page-shell"><div className="loading-state"><span className="loading-mark">//</span><h2>Loading job from the blockchain<span className="blink">_</span></h2><p>Reading contract state for job {jobId}.</p></div></main>;
  if (error) return <main className="detail-page page-shell"><button className="back-button" onClick={onBack}>&lt;- Back to jobs</button><div className="inline-error"><strong>Unable to load job.</strong> {error}<button className="text-button" onClick={() => void loadJob()}>Retry</button></div></main>;
  return <JobDetails job={job} account={account} contract={contract} onBack={onBack} onUpdated={setJob} notify={notify} onNavigate={onNavigate} />;
}

export default JobDetailsPage;
