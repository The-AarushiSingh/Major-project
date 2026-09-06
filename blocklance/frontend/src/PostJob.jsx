import { useState } from "react";
import { parseEther } from "ethers";
import { useWeb3 } from "./Web3Context";

function PostJob({ onBack, onSuccess, onViewJobs, onWorkspace, notify }) {
  const { contract } = useWeb3();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [published, setPublished] = useState(false);

  async function handlePostJob(e) {
    e.preventDefault();
    const nextErrors = {};
    if (!title.trim()) nextErrors.title = "Add a clear job title.";
    if (description.length > 1000) nextErrors.description = "Keep the brief under 1000 characters.";
    if (!budget || Number(budget) <= 0) nextErrors.budget = "Enter a budget greater than 0 ETH.";
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    try {
      const tx = await contract.postJob(title, description, {
        value: parseEther(budget),
      });
      await tx.wait();

      setTitle("");
      setDescription("");
      setBudget("");
      setPublished(true);
      onSuccess();
    } catch (err) {
      console.error(err);
      const message =
        err.reason ||
        err.shortMessage ||
        err.info?.error?.message ||
        err.message ||
        "Unknown error";
      notify("Failed to post job: " + message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="post-page page-shell"><div className="post-intro"><button className="back-button" onClick={onBack}>&lt;- Back</button><div className="eyebrow"><span className="eyebrow-line" /> Client workspace</div><h1>Put good work<br /><em>in motion.</em></h1><p>Describe the outcome, set the budget, and let the contract hold payment until the work is approved.</p></div>{published ? <div className="post-form success-panel"><span className="success-mark">OK</span><div className="eyebrow"><span className="eyebrow-line" /> Contract confirmed</div><h2>Job published<br /><em>successfully.</em></h2><p>Your brief and budget are now recorded on-chain. No job ID was invented by the interface; view it from the live jobs feed.</p><div className="success-actions"><button className="button button-primary" onClick={onViewJobs}>View jobs -&gt;</button><button className="button button-ghost" onClick={onWorkspace}>Go to workspace</button><button className="text-button" onClick={() => setPublished(false)}>Post another</button></div></div> : <form className="post-form" onSubmit={handlePostJob}><div className="form-header"><span>NEW JOB CONTRACT</span><span>STEP 01 / 01</span></div><label>Job title<span className="required">*</span><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Build a conversion-focused landing page" maxLength={120} aria-invalid={Boolean(errors.title)} />{errors.title && <small className="field-error">{errors.title}</small>}</label><label>Job description<textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What needs to be built? Include the outcome, scope, and anything a freelancer should know." maxLength={1000} /><span className="character-count">{description.length} / 1000</span>{errors.description && <small className="field-error">{errors.description}</small>}</label><label>Budget in ETH<span className="required">*</span><div className="eth-input"><input type="number" min="0" step="0.0001" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="0.00" aria-invalid={Boolean(errors.budget)} /><span>ETH</span></div>{errors.budget && <small className="field-error">{errors.budget}</small>}<span className="field-help">This amount is deposited into the job contract when you publish.</span></label><div className="form-submit"><div><span className="lock-mark">[ LOCKED ]</span><p>Funds release only after client approval.</p></div><button className="button button-primary" type="submit" disabled={loading}>{loading ? "Publishing to chain..." : "Publish job ->"}</button></div></form>}</main>
  );
}

export default PostJob;