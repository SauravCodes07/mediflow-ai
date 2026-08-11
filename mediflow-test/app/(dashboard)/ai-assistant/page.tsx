"use client";

import { useState, useRef, useEffect } from "react";
import { PageHeader } from "../../components/ui/PageHeader";
import { MarkdownRenderer } from "../../components/ui/MarkdownRenderer";
import { HOSPITAL_NAME } from "@/lib/config/hospital";
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

const INITIAL_MESSAGES: Message[] = [
  {
    id: "msg_welcome",
    sender: "assistant",
    text: "Good evening. What would you like to investigate across Mediflow General Hospital operations?",
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  },
];

const COMMAND_CARDS = [
  {
    id: "ot",
    tag: "OT STATUS",
    metric: "67%",
    label: "Overall utilization",
    prompt: "Summarize OT room utilization and turnover delays",
    color: "border-blue-500/40 text-blue-600 dark:text-cyan-400 bg-blue-50/50 dark:bg-blue-950/30",
  },
  {
    id: "alerts",
    tag: "CRITICAL ALERTS",
    metric: "2 active",
    label: "Immediate action required",
    prompt: "Show active critical alerts and escalation status",
    color: "border-rose-500/40 text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/30",
  },
  {
    id: "wards",
    tag: "WARD CAPACITY",
    metric: "82%",
    label: "Ward A near capacity limit",
    prompt: "Which wards are near maximum bed capacity?",
    color: "border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/30",
  },
  {
    id: "cssd",
    tag: "CSSD STATUS",
    metric: "4 flagged",
    label: "Instrument packs expiring",
    prompt: "Show CSSD sterilization batch and pack availability",
    color: "border-purple-500/40 text-purple-600 dark:text-purple-400 bg-purple-50/50 dark:bg-purple-950/30",
  },
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
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

      // Build mock structured card data based on query keywords
      let structuredCard: StructuredData | undefined = undefined;
      const qLower = query.toLowerCase();
      if (qLower.includes("ot") || qLower.includes("room") || qLower.includes("turnover")) {
        structuredCard = {
          type: "ot",
          items: [
            { label: "OT 01", value: "82%", subtext: "14 cases today · In Operation", status: "warning" },
            { label: "OT 02", value: "67%", subtext: "11 cases today · Preparing", status: "normal" },
            { label: "OT 03", value: "54%", subtext: "9 cases today · Cleaning", status: "normal" },
          ],
          actionHref: "/ot-dashboard",
          actionText: "Open OT Dashboard →",
        };
      } else if (qLower.includes("alert") || qLower.includes("critical") || qLower.includes("emergency")) {
        structuredCard = {
          type: "alerts",
          items: [
            { label: "ALT-001", value: "OT Room 01 Delay", subtext: "Turnover time exceeded by 28 min", status: "critical" },
            { label: "ALT-002", value: "CSSD Sterile Pack Expired", subtext: "Pack GEN-SET-09 reached expiration", status: "critical" },
          ],
          actionHref: "/alerts",
          actionText: "Manage Alerts →",
        };
      } else if (qLower.includes("ward") || qLower.includes("capacity") || qLower.includes("bed")) {
        structuredCard = {
          type: "wards",
          items: [
            { label: "Ward A", value: "82%", subtext: "39 of 48 beds occupied", status: "warning" },
            { label: "Ward B", value: "61%", subtext: "22 of 36 beds occupied", status: "normal" },
            { label: "Ward C", value: "90%", subtext: "38 of 42 beds occupied", status: "critical" },
          ],
          actionHref: "/settings",
          actionText: "View Capacity Rules →",
        };
      } else if (qLower.includes("cssd") || qLower.includes("pack") || qLower.includes("steril")) {
        structuredCard = {
          type: "cssd",
          items: [
            { label: "Available Packs", value: "1,420", subtext: "Ready for surgery", status: "normal" },
            { label: "In Processing", value: "18", subtext: "Autoclave batch active", status: "normal" },
            { label: "Flagged Packs", value: "4", subtext: "Expires < 3 days", status: "warning" },
          ],
          actionHref: "/settings",
          actionText: "Open CSSD Configuration →",
        };
      }

      const botMsg: Message = {
        id: `bot_${Date.now()}`,
        sender: "assistant",
        text: data.reply || "Operations telemetry updated.",
        provider: data.provider,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        structured: structuredCard,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error connecting to AI service";
      const errorMsg: Message = {
        id: `err_${Date.now()}`,
        sender: "assistant",
        text: `⚠️ **Operational Notice**: ${msg}. Please re-try your query.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages(INITIAL_MESSAGES);
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto font-sans select-none pb-24 text-slate-800 dark:text-slate-100">
      
      {/* Page Header */}
      <PageHeader
        title="AI Assistant"
        category="INTELLIGENCE"
        description={`Clinical operations assistant for ${HOSPITAL_NAME}.`}
        actions={
          <button
            type="button"
            onClick={handleClearChat}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-extrabold text-xs transition-colors cursor-pointer"
          >
            Clear Chat
          </button>
        }
      />

      {/* Visual Command Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {COMMAND_CARDS.map((card) => (
          <div
            key={card.id}
            onClick={() => handleSend(card.prompt)}
            className={`p-4 rounded-2xl border ${card.color} hover:-translate-y-0.5 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between`}
          >
            <div>
              <div className="text-[10px] font-extrabold tracking-wider uppercase mb-1">{card.tag}</div>
              <div className="text-2xl font-extrabold font-mono tracking-tight group-hover:scale-105 transition-transform">
                {card.metric}
              </div>
            </div>
            <div className="text-[11px] font-medium opacity-80 mt-2 flex items-center justify-between">
              <span>{card.label}</span>
              <span className="font-bold text-xs">→</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Chat Interface Container */}
      <div className="bg-white dark:bg-[#0B2545] rounded-3xl border border-slate-200 dark:border-white/10 shadow-xs overflow-hidden flex flex-col h-[calc(100vh-320px)] min-h-[500px]">
        
        {/* Chat Header Bar */}
        <div className="p-4 px-6 bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
              ✨
            </div>
            <div>
              <div className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                <span>Mediflow AI</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">● Online</span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Clinical Operations Assistant
              </div>
            </div>
          </div>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {messages.map((msg) => {
            const isUser = msg.sender === "user";
            return (
              <div key={msg.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[90%] sm:max-w-[78%] space-y-2`}>
                  
                  {!isUser && (
                    <div className="flex items-center space-x-2 text-[11px] font-bold text-purple-600 dark:text-purple-400">
                      <span className="w-4 h-4 rounded-full bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-[10px]">✨</span>
                      <span>Mediflow AI</span>
                      <span className="text-slate-400 font-normal">{msg.timestamp}</span>
                    </div>
                  )}

                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm font-medium ${
                      isUser
                        ? "bg-blue-600 text-white rounded-tr-xs shadow-xs"
                        : "bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-tl-xs"
                    }`}
                  >
                    {isUser ? (
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                    ) : (
                      <MarkdownRenderer content={msg.text} />
                    )}

                    {isUser && (
                      <div className="text-[10px] text-blue-200 text-right mt-1 font-mono">
                        {msg.timestamp}
                      </div>
                    )}
                  </div>

                  {/* Structured Operational Response Cards */}
                  {!isUser && msg.structured && (
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3 animate-in fade-in">
                      <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                        <span>Operational Breakdown</span>
                        <span className="text-cyan-600 dark:text-cyan-400">● Live Data</span>
                      </div>

                      <div className="space-y-2">
                        {msg.structured.items?.map((item, i) => (
                          <div key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold">
                            <div>
                              <span className="text-slate-900 dark:text-white font-bold block">{item.label}</span>
                              <span className="text-[11px] text-slate-500 font-normal">{item.subtext}</span>
                            </div>
                            <span
                              className={`font-mono font-extrabold text-sm px-2.5 py-1 rounded-lg ${
                                item.status === "critical"
                                  ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                                  : item.status === "warning"
                                  ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                                  : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                              }`}
                            >
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>

                      {msg.structured.actionHref && (
                        <div className="pt-1">
                          <Link
                            href={msg.structured.actionHref}
                            className="inline-flex items-center text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline"
                          >
                            <span>{msg.structured.actionText || "Open Module →"}</span>
                          </Link>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex justify-start">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping" />
                <span className="font-semibold">Analyzing hospital metrics...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-50/80 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about operations..."
              className="flex-1 px-4 py-3 text-xs sm:text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50 cursor-pointer shrink-0"
            >
              Send
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
