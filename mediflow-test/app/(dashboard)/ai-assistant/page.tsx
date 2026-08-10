"use client";

import { useState, useRef, useEffect } from "react";
import { PageShell } from "../../components/ui/PageShell";
import { MarkdownRenderer } from "../../components/ui/MarkdownRenderer";

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  provider?: string;
  timestamp: string;
}

const INITIAL_WELCOME_MESSAGE: Message = {
  id: "msg_welcome_page",
  sender: "assistant",
  text: `### ✨ Welcome to Mediflow-AI Operational Assistant\n\nFull-screen intelligent clinical intelligence engine for Meridian General Hospital. I can assist your team with:\n\n- **Operating Theatre**: Room utilization, surgical procedure delays & turnover\n- **Admissions**: Intake bottlenecks, cardiology clearance & pending consent forms\n- **CSSD**: Autoclave batch sterilization & instrument pack availability\n- **Emergency Alerts**: Real-time operational triage & critical alert escalation\n\nHow can I help you today?`,
  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
};

const PRESET_CHIPS = [
  "Summarize OT Room Utilization",
  "Show Critical Hospital Alerts",
  "Why is Patient Consent Pending?",
  "CSSD Pack Expiry Status",
  "Admissions Queue Overview",
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (queryText?: string) => {
    const text = queryText || input;
    if (!text.trim() || loading) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages((prev) => [...prev, { id: `usr_${messages.length + 1}`, sender: "user", text: text.trim(), timestamp: timeStr }]);
    if (!queryText) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: `ast_${messages.length + 2}`,
          sender: "assistant",
          text: data.reply || "Sorry, I could not process your request.",
          provider: data.provider,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${messages.length + 2}`,
          sender: "assistant",
          text: "⚠ **Unable to generate response**\n\nFailed to connect to the Mediflow-AI engine. Please verify your network connection and retry.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell title="Mediflow AI Operational Assistant" description="Full-screen intelligent chat interface powered by Groq & Gemini for hospital workflow guidance.">
      <div className="rounded-3xl bg-[#07152D] border border-white/15 flex flex-col h-[700px] overflow-hidden shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="px-6 py-4 bg-[#03122D] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-purple-600/20 border border-cyan-400/40 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(24,216,232,0.3)]">
              <svg className="w-6 h-6 text-cyan-400" viewBox="0 0 32 32" fill="none">
                <path d="M16 27.5C16 27.5 4 20.2 4 12.2C4 8.2 7.2 5 11.2 5C13.6 5 15.7 6.2 16 8C16.3 6.2 18.4 5 20.8 5C24.8 5 28 8.2 28 12.2C28 20.2 16 27.5 16 27.5Z" stroke="currentColor" strokeWidth="2.2" />
                <path d="M7 14.5H11.5L13.5 10.5L16.5 19L19.5 13L21 14.5H25" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-bold text-base text-white tracking-tight">Mediflow-AI Clinical Intelligence Engine</h2>
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
              </div>
              <p className="text-xs text-slate-400">Groq Llama-3.3 + Gemini Dual Provider Engine Active</p>
            </div>
          </div>

          <button
            onClick={() => setMessages([INITIAL_WELCOME_MESSAGE])}
            className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold border border-white/10 transition-colors"
          >
            Reset Chat
          </button>
        </div>

        {/* Quick Presets */}
        <div className="px-6 py-3 bg-[#051024] border-b border-white/5 flex items-center space-x-2 overflow-x-auto no-scrollbar">
          {PRESET_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => handleSend(chip)}
              className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-cyan-500/15 border border-white/10 hover:border-cyan-400/40 text-slate-300 hover:text-cyan-300 text-xs font-medium whitespace-nowrap transition-all shrink-0"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Message Feed */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"} space-y-1`}
            >
              {m.sender === "assistant" && (
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-[10px] text-cyan-300">
                    ✨
                  </div>
                  <span className="text-xs font-semibold text-cyan-400">Mediflow-AI</span>
                  <span className="text-[10px] text-slate-500">{m.timestamp}</span>
                </div>
              )}

              <div
                className={`p-4 sm:p-5 rounded-2xl ${
                  m.sender === "user"
                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-tr-xs shadow-md max-w-[75%] text-sm font-medium"
                    : "bg-[#0A1B35]/90 border border-white/10 text-slate-200 rounded-tl-xs shadow-lg max-w-[85%] text-sm"
                }`}
              >
                {m.sender === "assistant" ? (
                  <div>
                    <MarkdownRenderer content={m.text} />
                    <div className="mt-3 pt-2.5 border-t border-white/10 text-xs text-slate-400 flex items-center justify-between">
                      <span>AI-Generated Operational Guidance</span>
                      {m.provider && (
                        <span className="uppercase tracking-wider text-[10px] text-cyan-400/80 font-bold">
                          {m.provider}
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>{m.text}</div>
                )}
              </div>

              {m.sender === "user" && (
                <span className="text-[10px] text-slate-500 pr-1">{m.timestamp}</span>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex items-center space-x-3 p-4 rounded-2xl bg-[#0A1B35]/90 border border-white/10 max-w-[60%]">
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs">
                ✨
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-300 font-medium">
                <span>Analyzing hospital operations</span>
                <div className="flex space-x-1 pl-1">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-4 bg-[#03122D] border-t border-white/10 flex items-center space-x-3"
        >
          <input
            type="text"
            className="flex-1 px-4 py-3.5 text-sm rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400/60 transition-colors"
            placeholder="Ask Mediflow-AI about hospital operations, OT schedules, or admissions..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="h-12 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-sm shadow-lg hover:from-blue-500 hover:to-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0 flex items-center justify-center space-x-2"
          >
            <span>Send Message</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </form>
      </div>
    </PageShell>
  );
}
