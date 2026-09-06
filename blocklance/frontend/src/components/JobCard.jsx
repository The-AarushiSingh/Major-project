import { formatEther } from "ethers";
import { shortAddress, statusLabel, statusClass, ZERO_ADDRESS } from "../utils/job";

function JobCard({ job, account, onView, onAccept, actionLoading }) {
  const status = Number(job.status);
  const isOwner = job.client.toLowerCase() === account?.toLowerCase();
  const isFreelancer = job.freelancer.toLowerCase() === account?.toLowerCase();
  const canAccept = status === 0 && !isOwner;
  const canComplete = status === 1 && isFreelancer;

  return (
    <article className="job-card">
      <div className="job-card-meta"><span className={`status-badge status-${statusClass(status)}`}>{statusLabel(status)}</span><span className="job-id">JOB-{String(Number(job.id)).padStart(3, "0")}</span></div>
      <div className="job-card-heading"><h3>{job.title}</h3><strong>{formatEther(job.budget)} <small>ETH</small></strong></div>
      <p className="job-card-description">{job.description || "No description provided."}</p>
      <div className="job-card-details"><span><small>CLIENT</small>{shortAddress(job.client)}{isOwner && <b className="you-tag">YOU</b>}</span><span><small>ASSIGNED TO</small>{job.freelancer === ZERO_ADDRESS ? "Open to the network" : shortAddress(job.freelancer)}{isFreelancer && <b className="you-tag">YOU</b>}</span></div>
      <div className="job-card-actions"><button className="button button-ghost button-small" onClick={() => onView(job)}>View details <span aria-hidden="true">-&gt;</span></button>{canAccept && onAccept && <button className="button button-primary button-small" onClick={() => onAccept(job.id)} disabled={actionLoading === Number(job.id)}>{actionLoading === Number(job.id) ? "Accepting..." : "Accept job"}</button>}{canComplete && onAccept && <button className="button button-cyan button-small" onClick={() => onAccept(job.id)} disabled={actionLoading === Number(job.id)}>{actionLoading === Number(job.id) ? "Updating..." : "Mark completed"}</button>}</div>
    </article>
  );
}

export default JobCard;
