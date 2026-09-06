import { useState } from "react";

const AI_SERVER_URL = "http://localhost:4000";

function BudgetSuggester({ title, description }) {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const [error, setError] = useState("");

  async function getSuggestion() {
    if (!title || !description) {
      setError("Fill in job title and description first");
      return;
    }
    setError("");
    setLoading(true);
    setSuggestion("");
    try {
      const res = await fetch(`${AI_SERVER_URL}/api/suggest-budget`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSuggestion(data.suggestion);
    } catch (err) {
      setError("Couldn't get a suggestion. Is the AI server running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="budget-suggester">
      <button type="button" onClick={getSuggestion} disabled={loading}>
        {loading ? "Thinking..." : "✨ Suggest Budget with AI"}
      </button>
      {suggestion && <div className="budget-suggestion-text">{suggestion}</div>}
      {error && <div className="budget-suggestion-error">{error}</div>}
    </div>
  );
}

export default BudgetSuggester;