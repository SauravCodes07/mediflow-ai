"use client";

import { useState } from "react";
import { PageShell } from "../../components/ui/PageShell";

interface Message {
  sender: "user" | "assistant";
  text: string;
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "assistant",
      text: "Welcome to the Mediflow-AI Operational Assistant. Ask any question regarding OT turnover, admissions bottlenecks, CSSD pack availability, or critical alerts.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (queryText?: string) => {
    const text = queryText || input;
    if (!text.trim() || loading) return;

    setMessages((prev) => [...prev, { sender: "user", text }]);
    if (!queryText) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { sender: "assistant", text: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "assistant", text: "Error connecting to AI service." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell title="Mediflow AI Operational Assistant" description="Full-screen intelligent chat interface powered by Groq & Gemini for hospital workflow guidance.">
      <div className="card" style={{ display: "flex", flexDirection: "column", height: "600px", padding: 0, overflow: "hidden" }}>
        {/* Chat Header */}
        <div className="px-4 py-3 row row-between" style={{ background: "var(--color-navy)", color: "#fff" }}>
          <div className="row" style={{ gap: "8px" }}>
            <span style={{ fontSize: "1.2rem" }}>🤖</span>
            <div>
              <div className="font-bold text-sm">Mediflow-AI Clinical Intelligence Engine</div>
              <div style={{ fontSize: "10px", opacity: 0.8 }}>Groq Llama-3.3 + Gemini Dual Provider Active</div>
            </div>
          </div>
          <button className="btn btn-sm btn-outline" style={{ color: "#fff", borderColor: "rgba(255,255,255,0.3)" }} onClick={() => setMessages([])}>
            Clear History
          </button>
        </div>

        {/* Preset Prompt Pills */}
        <div className="px-4 py-2 row flex-wrap" style={{ gap: "8px", background: "var(--color-bg)", borderBottom: "1px solid var(--color-border)" }}>
          {[
            "Summarize OT Room Utilization",
            "Show Critical Hospital Alerts",
            "Why is Patient Consent Pending?",
            "CSSD Pack Expiry Status",
          ].map((preset) => (
            <button key={preset} className="btn btn-sm btn-outline text-xs" onClick={() => handleSend(preset)}>
              {preset}
            </button>
          ))}
        </div>

        {/* Message feed */}
        <div style={{ flex: 1, padding: "var(--space-4)", overflowY: "auto", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                alignSelf: m.sender === "user" ? "flex-end" : "flex-start",
                maxWidth: "75%",
                padding: "var(--space-3) var(--space-4)",
                borderRadius: "var(--radius-md)",
                background: m.sender === "user" ? "var(--color-primary)" : "var(--color-bg)",
                color: m.sender === "user" ? "#fff" : "var(--color-text)",
                fontSize: "13px",
                whiteSpace: "pre-wrap",
                lineHeight: 1.5,
              }}
            >
              {m.text}
              {m.sender === "assistant" && (
                <div className="text-muted" style={{ fontSize: "10px", marginTop: "6px", opacity: 0.7 }}>
                  AI-Generated Response • Domain Guardrails Active
                </div>
              )}
            </div>
          ))}
          {loading && <div className="text-xs text-muted py-2">Analyzing hospital operational context...</div>}
        </div>

        {/* Input box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 row"
          style={{ borderTop: "1px solid var(--color-border)", gap: "8px" }}
        >
          <input
            className="input"
            style={{ flex: 1 }}
            placeholder="Type your operational query (e.g. 'Explain OT delays', 'Check admissions queue')..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            Send Question
          </button>
        </form>
      </div>
    </PageShell>
  );
}
