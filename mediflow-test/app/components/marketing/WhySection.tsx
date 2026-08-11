"use client";

import { useState } from "react";
import Link from "next/link";

const FLOATING_CARDS = [
  {
    id: "icu",
    title: "ICU Occupancy",
    value: "78%",
    badge: "+4.2%",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-400/30",
    pos: "top-4 left-4 sm:top-6 sm:left-6",
    icon: "🏥",
  },
  {
    id: "beds",
    title: "Beds Available",
    value: "24",
    badge: "Live",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-400/30",
    pos: "top-8 right-4 sm:top-10 sm:right-6",
    icon: "🛏️",
  },
  {
    id: "ot",
    title: "OT Utilization",
    value: "82%",
    badge: "Optimal",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-400/30",
    pos: "bottom-24 left-4 sm:bottom-28 sm:left-6",
    icon: "🔬",
  },
  {
    id: "alerts",
    title: "Critical Alerts",
    value: "03",
    badge: "2 High Priority",
    badgeColor: "bg-rose-500/20 text-rose-300 border-rose-400/30",
    pos: "bottom-6 right-4 sm:bottom-8 sm:right-6",
    icon: "⚠️",
  },
  {
    id: "admissions",
    title: "Admissions",
    value: "18",
    badge: "Today",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-400/30",
    pos: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    icon: "📋",
  },
];

export function WhySection() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <section id="solutions" className="py-24 bg-[#071B34] relative overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT COLUMN: Rich Visual Composition with Clinical Team Image + Floating Operational Data Cards */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-lg aspect-[4/3] rounded-3xl overflow-hidden border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6)] group">
              {/* Clinical Team Background Image */}
              <img
                src="/images/mediflow-clinical-team.jpg"
                alt="Clinical Team Monitoring Hospital Operations"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />

              {/* Subtle Navy Glass Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#071B34] via-[#071B34]/65 to-[#071B34]/30" />

              {/* Animated Live Pulse Header Badge */}
              <div className="absolute top-4 left-4 z-20 inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#071B34]/90 border border-cyan-400/40 text-cyan-300 text-xs font-semibold backdrop-blur-md shadow-lg">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>Live Hospital Operational Intelligence</span>
              </div>

              {/* 5 Floating Operational Data Cards */}
              {FLOATING_CARDS.map((card) => {
                const isHovered = hoveredCard === card.id;
                return (
                  <div
                    key={card.id}
                    onMouseEnter={() => setHoveredCard(card.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    className={`absolute ${card.pos} z-20 p-3 sm:p-3.5 rounded-2xl bg-[#0B2545]/90 border backdrop-blur-md transition-all duration-300 transform cursor-pointer shadow-xl ${
                      isHovered
                        ? "border-cyan-400 shadow-[0_0_25px_rgba(24,216,232,0.4)] -translate-y-1 scale-105"
                        : "border-white/15 hover:border-cyan-400/60"
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs">{card.icon}</span>
                      <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">{card.title}</span>
                    </div>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">{card.value}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${card.badgeColor}`}>
                        {card.badge}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: AI-Powered Hospital Operations Narrative */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-400/30 text-purple-300 text-xs font-bold uppercase tracking-wider mb-4">
                <span>CLINICAL INTELLIGENCE ECOSYSTEM</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
                AI-Powered Hospital Operations
              </h2>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-6">
                Mediflow-AI connects your admissions, wards, operating theatres, and clinical teams into one intelligent ecosystem. Automate workflows, reduce delays, and deliver exceptional patient care.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-[0_4px_20px_rgba(22,119,255,0.35)] transition-all transform hover:-translate-y-0.5"
              >
                <span>Explore Operational Platform →</span>
              </Link>
            </div>

            {/* Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {[
                "End-to-end visibility across departments",
                "AI-powered workflow automation",
                "Reduced delays and wait times",
                "Better patient outcomes",
                "Secure architecture & data protection",
                "Scalable and future-ready platform",
              ].map((item) => (
                <div key={item} className="flex items-center space-x-3 text-slate-200 text-sm font-medium">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-400 flex items-center justify-center shrink-0">
                    ✓
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Clinical CMO Testimonial Card */}
            <div className="p-6 rounded-2xl bg-[#0B2545]/90 border border-white/10 backdrop-blur-md relative shadow-xl">
              <div className="text-3xl text-cyan-400 font-serif leading-none mb-2">“</div>
              <p className="text-sm text-slate-300 italic mb-4 leading-relaxed">
                Mediflow-AI has transformed the way we manage our hospital workflows. Delays are down, efficiency is up, and our clinical teams love the clarity.
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 p-0.5 shrink-0">
                  <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-white">
                    AS
                  </div>
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Dr. Anika Sharma</div>
                  <div className="text-xs text-slate-400">Chief Medical Officer (Demo Preview)</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
