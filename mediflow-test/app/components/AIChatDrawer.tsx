"use client";

import { useState, useRef, useEffect } from "react";
import { MarkdownRenderer } from "./ui/MarkdownRenderer";
import Link from "next/link";

interface StructuredData {
  type?: "ot" | "alerts" | "wards" | "cssd";
  items?: { label: string; value: string | number; subtext?: string; status?: "normal" | "warning" | "critical" }[];
  actionHref?: string;
  actionText?: string;
}

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  provider?: string;
  timestamp: string;
  structured?: StructuredData;
}

const INITIAL_WELCOME_MESSAGE: Message = {
  id: "msg_welcome_drawer",
  sender: "assistant",
  text: "Good evening. What would you like to investigate across Mediflow General Hospital operations?",
  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
};

const COMMAND_CARDS = [
  { id: "ot", tag: "OT STATUS", metric: "67%", prompt: "Summarize OT room utilization" },
  { id: "alerts", tag: "CRITICAL ALERTS", metric: "2 active", prompt: "Show critical alerts" },
  { id: "wards", tag: "WARD CAPACITY", metric: "82%", prompt: "Which wards are near capacity?" },
  { id: "cssd", tag: "CSSD STATUS", metric: "4 flagged", prompt: "Show CSSD issues" },
];

export function AIChatDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userScrolledUp, setUserScrolledUp] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
  };

  useEffect(() => {
    if (!userScrolledUp && isOpen) {
      scrollToBottom();
    }
  }, [messages, loading, isOpen, userScrolledUp]);

  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isUp = scrollHeight - scrollTop - clientHeight > 100;
    setUserScrolledUp(isUp);
  };

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      sender: "user",
      text: textToSend.trim(),
      timestamp: timeStr,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput("");
    setLoading(true);
    setUserScrolledUp(false);

    try {
      const res = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend }),
      });
      const data = await res.json();

      let structuredCard: StructuredData | undefined = undefined;
      const qLower = textToSend.toLowerCase();
      if (qLower.includes("ot") || qLower.includes("room")) {
        structuredCard = {
          type: "ot",
          items: [
            { label: "OT 01", value: "82%", subtext: "14 cases · In Operation", status: "warning" },
            { label: "OT 02", value: "67%", subtext: "11 cases · Preparing", status: "normal" },
            { label: "OT 03", value: "54%", subtext: "9 cases · Cleaning", status: "normal" },
          ],
          actionHref: "/ot-dashboard",
          actionText: "Open OT Dashboard",
        };
      } else if (qLower.includes("alert") || qLower.includes("critical")) {
        structuredCard = {
          type: "alerts",
          items: [
            { label: "ALT-001", value: "OT Room 01 Delay", subtext: "Turnover time exceeded by 28 min", status: "critical" },
            { label: "ALT-002", value: "CSSD Pack Expired", subtext: "Pack GEN-SET-09 reached expiration", status: "critical" },
          ],
          actionHref: "/alerts",
          actionText: "Manage Alerts",
        };
      } else if (qLower.includes("ward") || qLower.includes("capacity")) {
        structuredCard = {
          type: "wards",
          items: [
            { label: "Ward A", value: "82%", subtext: "39 of 48 beds occupied", status: "warning" },
            { label: "Ward C", value: "90%", subtext: "38 of 42 beds occupied", status: "critical" },
          ],
          actionHref: "/settings",
          actionText: "View Ward Rules",
        };
      } else if (qLower.includes("cssd") || qLower.includes("pack")) {
        structuredCard = {
          type: "cssd",
          items: [
            { label: "Available Packs", value: "1,420", subtext: "Ready for surgery", status: "normal" },
            { label: "Flagged Packs", value: "4", subtext: "Expires < 3 days", status: "warning" },
          ],
          actionHref: "/settings",
          actionText: "CSSD Configuration",
        };
      }

      const assistantMsg: Message = {
        id: `ast_${Date.now()}`,
        sender: "assistant",
        text: data.reply || "Operations data processed.",
        provider: data.provider,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        structured: structuredCard,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: "assistant",
          text: "⚠️ **Notice**: Unable to connect to Mediflow-AI server.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 z-50 h-12 px-4 rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold shadow-[0_0_25px_rgba(22,119,255,0.4)] border border-cyan-300/30 flex items-center space-x-2 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
        aria-label="Toggle Mediflow-AI Assistant"
      >
        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 text-xs">
          ✨
        </div>
        <span className="text-xs tracking-tight">Mediflow-AI Assistant</span>
      </button>

      {/* Floating Chat Window Drawer */}
      {isOpen && (
        <div
          className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-[60] w-full sm:w-[420px] h-[90vh] sm:h-[620px] bg-[#07152D] border border-white/15 rounded-t-3xl sm:rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.7)] flex flex-col overflow-hidden backdrop-blur-xl transition-all"
          role="dialog"
          aria-label="Mediflow-AI Chat Interface"
        >
          {/* Header */}
          <div className="px-5 py-3.5 bg-[#03122D] border-b border-white/10 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center shrink-0 text-sm">
                ✨
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-xs text-white tracking-tight">Mediflow AI</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-emerald-400 font-bold">● Online</span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium">Clinical Operations Assistant</div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center border border-white/10 transition-colors cursor-pointer text-xs font-bold"
              aria-label="Close assistant"
            >
              ✕
            </button>
          </div>

          {/* Quick Action Visual Command Cards */}
          <div className="p-3 bg-[#051024] border-b border-white/5 grid grid-cols-2 gap-2 shrink-0">
            {COMMAND_CARDS.map((card) => (
              <button
                key={card.id}
                onClick={() => handleSend(card.prompt)}
                className="p-2 rounded-xl bg-white/5 hover:bg-cyan-500/15 border border-white/10 text-left transition-all cursor-pointer group"
              >
                <div className="text-[9px] font-extrabold uppercase text-slate-400">{card.tag}</div>
                <div className="text-sm font-extrabold font-mono text-cyan-300 group-hover:scale-105 transition-transform">
                  {card.metric}
                </div>
              </button>
            ))}
          </div>

          {/* Messages Feed */}
          <div
            ref={chatContainerRef}
            onScroll={handleScroll}
            className="flex-1 p-4 overflow-y-auto space-y-4 relative text-xs"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"} space-y-1`}
              >
                {m.sender === "assistant" && (
                  <div className="flex items-center space-x-1.5 mb-1">
                    <span className="text-purple-400 text-[10px]">✨</span>
                    <span className="text-[10px] font-bold text-purple-300">Mediflow AI</span>
                    <span className="text-[10px] text-slate-500">{m.timestamp}</span>
                  </div>
                )}

                <div
                  className={`p-3.5 rounded-2xl ${
                    m.sender === "user"
                      ? "bg-blue-600 text-white rounded-tr-xs shadow-md max-w-[85%] font-semibold"
                      : "bg-[#0A1B35]/90 border border-white/10 text-slate-200 rounded-tl-xs shadow-lg max-w-[90%]"
                  }`}
                >
                  {m.sender === "assistant" ? (
                    <MarkdownRenderer content={m.text} />
                  ) : (
                    <p className="whitespace-pre-wrap">{m.text}</p>
                  )}
                </div>

                {/* Structured Cards inside Drawer */}
                {!m.sender && m.structured && (
                  <div className="p-3 rounded-xl bg-[#03122D] border border-white/10 text-xs space-y-2 w-[90%]">
                    <div className="text-[10px] font-bold text-cyan-400 uppercase">Telemetry Breakdown</div>
                    {m.structured.items?.map((item, i) => (
                      <div key={i} className="flex justify-between items-center text-[11px] font-medium text-slate-200">
                        <span>{item.label}</span>
                        <span className="font-mono font-bold text-cyan-300">{item.value}</span>
                      </div>
                    ))}
                    {m.structured.actionHref && (
                      <Link
                        href={m.structured.actionHref}
                        onClick={() => setIsOpen(false)}
                        className="inline-block text-[11px] font-bold text-blue-400 hover:underline pt-1"
                      >
                        {m.structured.actionText} →
                      </Link>
                    )}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="p-3 rounded-xl bg-white/5 text-slate-400 text-xs flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                <span>Analyzing metrics...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-[#03122D] border-t border-white/10 shrink-0">
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
                placeholder="Ask about operations..."
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-white/15 bg-white/5 text-white placeholder-slate-400 text-xs font-semibold focus:outline-none focus:border-purple-400"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs disabled:opacity-50 cursor-pointer"
              >
                Send
              </button>
            </form>
          </div>

        </div>
      )}
    </>
  );
}
