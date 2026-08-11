"use client";

import { useState, useRef, useEffect } from "react";
import { PageShell } from "../../components/ui/PageShell";
import { MarkdownRenderer } from "../../components/ui/MarkdownRenderer";
import { HOSPITAL_NAME } from "@/lib/config/hospital";

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
  text: `### ✨ Welcome to Mediflow-AI Operational Assistant\n\nFull-screen intelligent clinical intelligence engine for ${HOSPITAL_NAME}. I can assist your team with:\n\n- **Operating Theatre**: Room utilization, surgical procedure delays & turnover\n- **Admissions**: Intake bottlenecks, cardiology clearance & pending consent forms\n- **CSSD**: Autoclave batch sterilization & instrument pack availability\n- **Emergency Alerts**: Real-time operational triage & critical alert escalation\n\nHow can I help you today?`,
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

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      sender: "user",
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch response");

      const botMsg: Message = {
        id: `bot_${Date.now()}`,
        sender: "assistant",
        text: data.reply || "No response received.",
        provider: data.provider,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error connecting to AI service";
      const errorMsg: Message = {
        id: `err_${Date.now()}`,
        sender: "assistant",
        text: `### ⚠️ Connection Notice\n\n${msg}. Please try asking again.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell title="AI Assistant" description={`Interactive Clinical Workflow & Operational AI for ${HOSPITAL_NAME}`}>
      <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-220px)] bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden font-sans">
        {/* Chat Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
              ✨
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">Mediflow-AI Operational Assistant</h2>
              <div className="flex items-center space-x-2 text-[11px] text-slate-500 font-medium">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>Active · {HOSPITAL_NAME} Context Connected</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Scroll Log */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === "user";
            return (
              <div key={msg.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm shadow-xs ${
                    isUser
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-slate-50 border border-slate-200 text-slate-900 rounded-tl-none"
                  }`}
                >
                  {!isUser && (
                    <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-200/60 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <span>✨ Mediflow-AI</span>
                      {msg.provider && (
                        <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-extrabold">
                          {msg.provider}
                        </span>
                      )}
                    </div>
                  )}

                  {isUser ? (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  ) : (
                    <MarkdownRenderer content={msg.text} />
                  )}

                  <div className={`text-[10px] mt-2 font-medium ${isUser ? "text-blue-200 text-right" : "text-slate-400"}`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex justify-start">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping" />
                <span>Mediflow-AI is analyzing hospital metrics...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Preset Chips Bar */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 overflow-x-auto flex space-x-2 no-scrollbar">
          {PRESET_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => handleSend(chip)}
              className="px-3 py-1 rounded-full bg-white border border-slate-200 hover:border-purple-300 hover:bg-purple-50 text-slate-700 text-xs font-medium whitespace-nowrap transition-all shadow-2xs shrink-0 cursor-pointer"
            >
              ✨ {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Mediflow-AI about OT status, admissions queue, CSSD sterilization..."
              className="flex-1 px-4 py-3 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-medium"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50 flex items-center space-x-1 shrink-0 cursor-pointer"
            >
              <span>Send</span>
              <span>→</span>
            </button>
          </form>
        </div>
      </div>
    </PageShell>
  );
}
