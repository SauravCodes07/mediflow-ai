"use client";

import { useState, useRef, useEffect } from "react";
import { MarkdownRenderer } from "./ui/MarkdownRenderer";

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  provider?: string;
  timestamp: string;
}

const INITIAL_WELCOME_MESSAGE: Message = {
  id: "msg_welcome",
  sender: "assistant",
  text: `### ✨ Welcome to Mediflow-AI\n\nYour real-time hospital operations assistant. I can help you monitor:\n\n- **Operating Theatre** schedules & turnover\n- **Admissions** bottlenecks & consent status\n- **CSSD** instrument pack availability\n- **Critical Alerts** & emergency operations\n\nHow can I assist your operational team today?`,
  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
};

const PRESET_CHIPS = [
  "Summarize OT Status",
  "Critical Alerts",
  "Admissions Queue",
  "CSSD Availability",
  "Today's Operations",
];

export function AIChatDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userScrolledUp, setUserScrolledUp] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

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
    setShowScrollBtn(isUp);
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
      const assistantMsg: Message = {
        id: `ast_${Date.now()}`,
        sender: "assistant",
        text: data.reply || "Sorry, I could not process your request.",
        provider: data.provider,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: "assistant",
          text: "⚠ **Unable to generate response**\n\nSomething went wrong while contacting Mediflow-AI engine. Please check your connection and try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
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
        className="fixed bottom-5 right-5 z-50 h-13 px-5 rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold shadow-[0_0_30px_rgba(24,216,232,0.4)] border border-cyan-300/30 flex items-center space-x-2.5 transition-all transform hover:scale-105 active:scale-95"
        aria-label="Toggle Mediflow-AI Assistant"
      >
        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 text-cyan-200" viewBox="0 0 32 32" fill="none">
            <path d="M16 27.5C16 27.5 4 20.2 4 12.2C4 8.2 7.2 5 11.2 5C13.6 5 15.7 6.2 16 8C16.3 6.2 18.4 5 20.8 5C24.8 5 28 8.2 28 12.2C28 20.2 16 27.5 16 27.5Z" stroke="currentColor" strokeWidth="2.5" />
            <path d="M7 14.5H11.5L13.5 10.5L16.5 19L19.5 13L21 14.5H25" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
        <span className="text-sm tracking-tight font-bold">Mediflow-AI Assistant</span>
      </button>

      {/* Chat Window Drawer */}
      {isOpen && (
        <div
          className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-50 w-full sm:w-[440px] h-[92vh] sm:h-[660px] bg-[#07152D] border border-white/15 rounded-t-3xl sm:rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.7)] flex flex-col overflow-hidden backdrop-blur-xl transition-all"
          role="dialog"
          aria-label="Mediflow-AI Chat Interface"
        >
          {/* Header */}
          <div className="px-5 py-4 bg-[#03122D] border-b border-white/10 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-400/40 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 32 32" fill="none">
                  <path d="M16 27.5C16 27.5 4 20.2 4 12.2C4 8.2 7.2 5 11.2 5C13.6 5 15.7 6.2 16 8C16.3 6.2 18.4 5 20.8 5C24.8 5 28 8.2 28 12.2C28 20.2 16 27.5 16 27.5Z" stroke="currentColor" strokeWidth="2.2" />
                  <path d="M7 14.5H11.5L13.5 10.5L16.5 19L19.5 13L21 14.5H25" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sm text-white tracking-tight">Mediflow-AI Assistant</span>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-medium">Hospital Operations Intelligence</div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center border border-white/10 transition-colors"
              aria-label="Close assistant"
            >
              ✕
            </button>
          </div>

          {/* Quick Action Preset Chips */}
          <div className="px-4 py-2.5 bg-[#051024] border-b border-white/5 flex items-center space-x-2 overflow-x-auto scrollbar-none shrink-0">
            {PRESET_CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => handleSend(chip)}
                className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-cyan-500/15 border border-white/10 hover:border-cyan-400/40 text-slate-300 hover:text-cyan-300 text-xs font-medium whitespace-nowrap transition-all shrink-0"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Messages Feed */}
          <div
            ref={chatContainerRef}
            onScroll={handleScroll}
            className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 relative"
          >
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
                    <span className="text-[11px] font-semibold text-cyan-400">Mediflow-AI</span>
                    <span className="text-[10px] text-slate-500">{m.timestamp}</span>
                  </div>
                )}

                <div
                  className={`p-4 rounded-2xl ${
                    m.sender === "user"
                      ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-tr-xs shadow-md max-w-[85%] text-xs sm:text-sm font-medium"
                      : "bg-[#0A1B35]/90 border border-white/10 text-slate-200 rounded-tl-xs shadow-lg max-w-[90%] text-xs sm:text-sm"
                  }`}
                >
                  {m.sender === "assistant" ? (
                    <div>
                      <MarkdownRenderer content={m.text} />
                      <div className="mt-3 pt-2 border-t border-white/10 text-[10px] text-slate-400 flex items-center justify-between">
                        <span>AI-Generated Operational Guidance</span>
                        {m.provider && (
                          <span className="uppercase tracking-wider text-[9px] text-cyan-400/80">
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
              <div className="flex items-center space-x-3 p-3.5 rounded-2xl bg-[#0A1B35]/90 border border-white/10 max-w-[75%]">
                <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px]">
                  ✨
                </div>
                <div className="flex items-center space-x-1.5 text-xs text-slate-300 font-medium">
                  <span>Analyzing hospital operations</span>
                  <div className="flex space-x-1 pl-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Floating Scroll to Bottom Button */}
          {showScrollBtn && (
            <button
              onClick={() => {
                setUserScrolledUp(false);
                scrollToBottom();
              }}
              className="absolute bottom-20 right-6 px-3 py-1.5 rounded-full bg-blue-600 text-white text-xs font-semibold shadow-lg border border-white/20 flex items-center space-x-1 hover:bg-blue-500 transition-all z-20"
            >
              <span>↓ New response</span>
            </button>
          )}

          {/* Fixed Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-[#03122D] border-t border-white/10 flex items-center space-x-2 shrink-0"
          >
            <input
              type="text"
              className="flex-1 px-4 py-3 text-xs sm:text-sm rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400/60 transition-colors"
              placeholder="Ask Mediflow-AI about operations..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="h-10 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-xs sm:text-sm shadow-md hover:from-blue-500 hover:to-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0 flex items-center justify-center space-x-1"
            >
              <span>Send</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
