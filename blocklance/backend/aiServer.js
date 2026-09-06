require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const GROQ_API_KEY = process.env.GROQ_API_KEY;

async function callGroq(systemPrompt, userMessage) {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`,
    },
body: JSON.stringify({
  model: "openai/gpt-oss-20b",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: userMessage },
  ],
  max_tokens: 300,
}),
  });

  const data = await response.json();
  console.log("Groq raw response:", JSON.stringify(data, null, 2));

  if (!response.ok) {
    const errMsg = data?.error?.message || `Groq API returned status ${response.status}`;
    throw new Error(errMsg);
  }

  if (!data.choices || !data.choices[0]) {
    throw new Error("Unexpected response shape from Groq (no choices array)");
  }

  return data.choices[0].message.content.trim();
}

// --- Budget suggestion endpoint ---
app.post("/api/suggest-budget", async (req, res) => {
  try {
    const { title, description } = req.body;
    const systemPrompt = `You are a pricing assistant for a freelance job marketplace that pays in ETH.
Given a job title and description, suggest a fair budget RANGE in ETH (e.g. "0.3 - 0.6 ETH").
Consider typical freelance rates for similar work, converted roughly to ETH.
Respond with ONLY the range and one short sentence of reasoning. No preamble.`;

    const userMessage = `Job title: ${title}\nDescription: ${description}`;
    const result = await callGroq(systemPrompt, userMessage);
    res.json({ suggestion: result });
  } catch (err) {
    console.error("Budget suggestion error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// --- Chat assistant endpoint ---
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    const systemPrompt = `You are a helpful assistant embedded in BlockLance, a decentralised freelance platform.
Explain how the platform works when asked: clients post jobs and deposit ETH into a smart contract escrow,
freelancers accept open jobs, mark work completed, and the client approves to release payment automatically.
Jobs can be Open, In Progress, Completed, Approved, or Cancelled. Only the client who posted a job can cancel
it (only while still Open) or approve payment. Only the assigned freelancer can mark work completed.
Keep answers short, clear, and friendly. If asked something unrelated to the platform, gently redirect.`;

    const result = await callGroq(systemPrompt, message);
    res.json({ reply: result });
  } catch (err) {
    console.error("Chat error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT || 4000, () => {
  console.log(`AI server running on http://localhost:${process.env.PORT || 4000}`);
});