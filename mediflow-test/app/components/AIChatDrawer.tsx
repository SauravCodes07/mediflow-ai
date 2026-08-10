"use client";

import { useState } from "react";

interface Message {
  sender: "user" | "assistant";
  text: string;
  provider?: string;
}

export function AIChatDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "assistant",
      text: "Hello! I am Mediflow-AI, your hospital operational assistant. How can I assist with OT schedules, admissions bottlenecks, or CSSD pack availability?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = { sender: "user", text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend }),
      });
      const data = await res.json();
      const assistantMsg: Message = {
        sender: "assistant",
        text: data.reply || "Sorry, I could not process your request.",
        provider: data.provider,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "assistant", text: "Network error connecting to Mediflow-AI engine." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          height: "48px",
          padding: "0 20px",
          borderRadius: "24px",
          background: "var(--color-navy)",
          color: "#fff",
          border: "none",
          boxShadow: "0 8px 24px rgba(11, 31, 58, 0.3)",
          fontWeight: 600,
          cursor: "pointer",
          zIndex: 999,
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
        aria-label="Mediflow AI Assistant"
      >
        <span>✨</span> Mediflow AI Assistant
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div
          className="card shadow-lg"
          style={{
            position: "fixed",
            bottom: "84px",
            right: "24px",
            width: "380px",
            height: "520px",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            className="row row-between px-4 py-3"
            style={{ background: "var(--color-navy)", color: "#fff" }}
          >
            <div className="row" style={{ gap: "8px" }}>
              <span>✨</span>
              <span className="font-bold text-sm">Mediflow-AI Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: "16px" }}
            >
              ✕
            </button>
          </div>

          {/* Preset Buttons */}
          <div
            className="px-3 py-2 row flex-wrap"
            style={{ gap: "6px", background: "var(--color-bg)", borderBottom: "1px solid var(--color-border)" }}
          >
            {[
              "Summarize OT Status",
              "Show Critical Alerts",
              "Check Admissions Queue",
              "CSSD Pack Expiry",
            ].map((preset) => (
              <button
                key={preset}
                className="btn btn-sm btn-outline"
                style={{ fontSize: "10px", padding: "2px 8px", height: "24px" }}
                onClick={() => handleSend(preset)}
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Messages Feed */}
          <div
            style={{
              flex: 1,
              padding: "var(--space-3)",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-3)",
            }}
          >
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: m.sender === "user" ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                  padding: "var(--space-2) var(--space-3)",
                  borderRadius: "var(--radius-sm)",
                  background: m.sender === "user" ? "var(--color-primary)" : "var(--color-bg)",
                  color: m.sender === "user" ? "#fff" : "var(--color-text)",
                  fontSize: "12px",
                  whiteSpace: "pre-wrap",
                }}
              >
                {m.text}
                {m.sender === "assistant" && (
                  <div className="text-muted" style={{ fontSize: "9px", marginTop: "4px", opacity: 0.7 }}>
                    AI-Generated Operational Guidance
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="text-xs text-muted py-2" style={{ alignSelf: "flex-start" }}>
                Mediflow-AI is analyzing hospital context...
              </div>
            )}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="row p-2"
            style={{ borderTop: "1px solid var(--color-border)", gap: "8px" }}
          >
            <input
              className="input"
              style={{ flex: 1, fontSize: "12px" }}
              placeholder="Ask Mediflow-AI about operations..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
