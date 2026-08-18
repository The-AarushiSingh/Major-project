import { useState } from "react";
import { parseEther } from "ethers";
import { useWeb3 } from "./Web3Context";

function PostJob() {
  const { contract } = useWeb3();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);

  async function handlePostJob(e) {
    e.preventDefault();
    if (!title || !budget) return;

    setLoading(true);
    try {
      const tx = await contract.postJob(title, description, {
        value: parseEther(budget),
      });
      await tx.wait();

      setTitle("");
      setDescription("");
      setBudget("");
    } catch (err) {
      console.error(err);
      const message =
        err.reason ||
        err.shortMessage ||
        err.info?.error?.message ||
        err.message ||
        "Unknown error";
      alert("Failed to post job: " + message);
    }
    setLoading(false);
  }

  return (
    <div className="card">
      <h2>Post a Job</h2>
      <form onSubmit={handlePostJob}>
        <input
          placeholder="Job title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Job description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          placeholder="Budget in ETH (e.g. 0.5)"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Posting..." : "Post Job"}
        </button>
      </form>
    </div>
  );
}

export default PostJob;