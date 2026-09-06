import { formatEther } from "ethers";
import { useState } from "react";
import { shortAddress, statusLabel, statusClass, ZERO_ADDRESS } from "../utils/job";

function JobDetails({ job, account, contract, onBack, onUpdated, notify }) {
  const status = Number(job.status);
  const isClient = job.client.toLowerCase() === account?.toLowerCase();
  const isFreelancer = job.freelancer.toLowerCase() === account?.toLowerCase();
  const [loading, setLoading] = useState(false);
  const [transactionState, setTransactionState] = useState("");

  async function runAction(method, label) {
    setLoading(true);
    setTransactionState("Preparing transaction...");
    try {
      setTransactionState("Waiting for wallet...");
      const tx = await contract[method](job.id);
      setTransactionState("Confirming on-chain...");
      await tx.wait();
      setTransactionState("Transaction successful");
      notify(`${label} confirmed on-chain.`, "success");
      const updated = await contract.getJob(job.id);
      onUpdated(updated);
    } catch (error) {
      const message = error.reason || error.shortMessage || error.info?.error?.message || error.message || "Transaction failed";
      setTransactionState("Transaction failed");
      notify(message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="detail-page page-shell"><button className="back-button" onClick={onBack}>&lt;- Back to jobs</button><div className="detail-layout"><article className="detail-main"><div className="detail-kicker"><span className={`status-badge status-${statusClass(status)}`}>{statusLabel(status)}</span><span>JOB-{String(Number(job.id)).padStart(3, "0")}</span></div><h1>{job.title}</h1><p className="detail-description">{job.description || "No description provided."}</p><div className="detail-divider" /><div className="detail-section-label">Job state</div><div className="detail-timeline"><div className={`timeline-step ${status >= 0 ? "done" : ""}`}><span>01</span><strong>Posted</strong></div><div className={`timeline-line ${status >= 1 ? "done" : ""}`} /><div className={`timeline-step ${status >= 1 ? "done" : ""}`}><span>02</span><strong>In progress</strong></div><div className={`timeline-line ${status >= 2 ? "done" : ""}`} /><div className={`timeline-step ${status >= 2 ? "done" : ""}`}><span>03</span><strong>Settled</strong></div></div></article><aside className="detail-aside"><div className="budget-panel"><span>LOCKED BUDGET</span><strong>{formatEther(job.budget)} <small>ETH</small></strong><p>Held by the job contract</p></div><div className="detail-facts"><div><span>CLIENT WALLET</span><strong>{shortAddress(job.client)}{isClient && <b className="you-tag">YOU</b>}</strong></div><div><span>FREELANCER WALLET</span><strong>{job.freelancer === ZERO_ADDRESS ? "Not assigned" : shortAddress(job.freelancer)}{isFreelancer && <b className="you-tag">YOU</b>}</strong></div><div><span>CREATED</span><strong>Block timestamp {job.createdAt ? Number(job.createdAt) : "unavailable"}</strong></div></div><div className="detail-action"><ActionButton status={status} isClient={isClient} isFreelancer={isFreelancer} loading={loading} transactionState={transactionState} onAction={runAction} /></div></aside></div></main>
  );
}

function ActionButton({ status, isClient, isFreelancer, loading, transactionState, onAction }) {
  if (status === 0 && !isClient) return <><button className="button button-primary button-wide" disabled={loading} onClick={() => onAction("acceptJob", "Job accepted")}>{loading ? transactionState : "Accept this job ->"}</button>{loading && <div className="transaction-state">{transactionState}</div>}</>;
  if (status === 0 && isClient) return <><button className="button button-danger button-wide" disabled={loading} onClick={() => onAction("cancelJob", "Job cancelled and refunded")}>{loading ? transactionState : "Cancel job"}</button>{loading && <div className="transaction-state">{transactionState}</div>}</>;
  if (status === 1 && isFreelancer) return <><button className="button button-cyan button-wide" disabled={loading} onClick={() => onAction("markCompleted", "Work marked completed")}>{loading ? transactionState : "Mark work completed ->"}</button>{loading && <div className="transaction-state">{transactionState}</div>}</>;
  if (status === 2 && isClient) return <><button className="button button-primary button-wide" disabled={loading} onClick={() => onAction("approveAndPay", "Payment released")}>{loading ? transactionState : "Approve and pay ->"}</button>{loading && <div className="transaction-state">{transactionState}</div>}</>;
  if (status === 3) return <div className="action-complete">Payment released on-chain.</div>;
  if (status === 4) return <div className="action-cancelled">This job was cancelled.</div>;
  return <div className="action-muted">No action available for this wallet.</div>;
}

export default JobDetails;
