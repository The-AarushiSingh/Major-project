import { useEffect, useState } from "react";
import { formatEther } from "ethers";
import { useWeb3 } from "./Web3Context";

const STATUS_LABELS = ["Open", "In Progress", "Completed", "Approved", "Cancelled"];
const STATUS_CLASSES = ["badge-open", "badge-inprogress", "badge-completed", "badge-approved", "badge-cancelled"];
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

function shortAddr(addr) {
  if (!addr) return "";
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

function AddressChip({ addr, account }) {
  const isYou = addr && account && addr.toLowerCase() === account.toLowerCase();
  return (
    <span>
      <span className="addr-chip">{shortAddr(addr)}</span>
      {isYou && <span className="you-tag">YOU</span>}
    </span>
  );
}

function JobList({ account }) {
  const { contract, refreshBalance } = useWeb3();
  const [jobs, setJobs] = useState([]);
  const [tab, setTab] = useState("all"); // all | posted | working

  async function loadJobs() {
    if (refreshBalance) refreshBalance();
    const count = await contract.jobCount();
    const loaded = [];
    for (let i = 1; i <= Number(count); i++) {
      const job = await contract.getJob(i);
      loaded.push(job);
    }
    setJobs(loaded.reverse()); // newest first
  }

  useEffect(() => {
    if (!contract) return;
    loadJobs();

    contract.on("JobPosted", loadJobs);
    contract.on("JobAccepted", loadJobs);
    contract.on("WorkCompleted", loadJobs);
    contract.on("PaymentReleased", loadJobs);

    return () => {
      contract.removeAllListeners();
    };
  }, [contract]);

  async function acceptJob(id) {
    const tx = await contract.acceptJob(id);
    await tx.wait();
  }

  async function markCompleted(id) {
    const tx = await contract.markCompleted(id);
    await tx.wait();
  }

  async function approveAndPay(id) {
    const tx = await contract.approveAndPay(id);
    await tx.wait();
  }

  const filteredJobs = jobs.filter((job) => {
    if (tab === "posted") return job.client.toLowerCase() === account?.toLowerCase();
    if (tab === "working") return job.freelancer.toLowerCase() === account?.toLowerCase();
    return true;
  });

  return (
    <div>
      <div className="tabs">
        <div className={`tab ${tab === "all" ? "active" : ""}`} onClick={() => setTab("all")}>
          All Jobs
        </div>
        <div className={`tab ${tab === "posted" ? "active" : ""}`} onClick={() => setTab("posted")}>
          My Postings (Client)
        </div>
        <div className={`tab ${tab === "working" ? "active" : ""}`} onClick={() => setTab("working")}>
          My Work (Freelancer)
        </div>
      </div>

      {filteredJobs.length === 0 && (
        <div className="empty-state">
          {tab === "all" && "No jobs posted yet."}
          {tab === "posted" && "You haven't posted any jobs yet."}
          {tab === "working" && "You haven't accepted any jobs yet — check the 'All Jobs' tab to find work."}
        </div>
      )}

      {filteredJobs.map((job) => (
        <div key={Number(job.id)} className="job-card">
          <div className="job-card-top">
            <div>
              <div className="job-title">{job.title}</div>
              <span className={`badge ${STATUS_CLASSES[Number(job.status)]}`}>
                {STATUS_LABELS[Number(job.status)]}
              </span>
            </div>
            <div className="job-budget">{formatEther(job.budget)} ETH</div>
          </div>

          <div className="job-desc">{job.description}</div>

          <div className="parties">
            <span>
              <strong>Client:</strong> <AddressChip addr={job.client} account={account} />
            </span>
            <span>
              <strong>Freelancer:</strong>{" "}
              {job.freelancer === ZERO_ADDRESS ? (
                "Not assigned yet"
              ) : (
                <AddressChip addr={job.freelancer} account={account} />
              )}
            </span>
          </div>

          {Number(job.status) === 0 && job.client.toLowerCase() !== account?.toLowerCase() && (
            <button onClick={() => acceptJob(job.id)}>Accept This Job</button>
          )}
          {Number(job.status) === 1 && job.freelancer.toLowerCase() === account?.toLowerCase() && (
            <button onClick={() => markCompleted(job.id)}>Mark Work Completed</button>
          )}
          {Number(job.status) === 2 && job.client.toLowerCase() === account?.toLowerCase() && (
            <button onClick={() => approveAndPay(job.id)}>Approve &amp; Release Payment</button>
          )}
        </div>
      ))}
    </div>
  );
}

export default JobList;