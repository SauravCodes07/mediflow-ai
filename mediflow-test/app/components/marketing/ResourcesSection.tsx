"use client";

import React, { useState } from "react";

const RESOURCE_ITEMS = [
  {
    id: "ops-guide",
    category: "OPERATIONS",
    title: "Hospital Command Center Playbook",
    desc: "Best practices for integrating admissions, ward bed allocations, and OT turnover into a single unified operational dashboard.",
    readTime: "8 min read",
    icon: "🏥",
    badge: "GUIDE",
  },
  {
    id: "clinical-insights",
    category: "CLINICAL",
    title: "Reducing Patient Bottlenecks & ED Latency",
    desc: "Data-driven strategies for streamlining triage, fast-tracking consent clearance, and optimizing discharge turnaround time.",
    readTime: "6 min read",
    icon: "⚡",
    badge: "WHITE PAPER",
  },
  {
    id: "ai-intel",
    category: "INTELLIGENCE",
    title: "Predictive Analytics in Surgical Scheduling",
    desc: "How AI automation detects turnover delays, predicts OT slot demand, and minimizes equipment starvation across surgical blocks.",
    readTime: "10 min read",
    icon: "🧠",
    badge: "CASE STUDY",
  },
  {
    id: "cssd-ops",
    category: "CSSD & STERILIZATION",
    title: "CSSD Sterilization Batch Compliance Standard",
    desc: "Complete operational manual for tracking autoclave cycles, pack expiry windows, and instrument set readiness for surgical suites.",
    readTime: "7 min read",
    icon: "🧪",
    badge: "COMPLIANCE",
  },
  {
    id: "ot-management",
    category: "SURGICAL SUITES",
    title: "Operating Theatre Capacity Optimization",
    desc: "Maximizing OT slot utilization with real-time status telemetry, sterile pack tracking, and dynamic emergency procedure insertion.",
    readTime: "9 min read",
    icon: "🔬",
    badge: "PLAYBOOK",
  },
  {
    id: "analytics-reporting",
    category: "ANALYTICS",
    title: "Executive Hospital Intelligence Metrics",
    desc: "A deep dive into key hospital KPIs: length of stay (LOS), bed occupancy percentage, handoff latency, and discharge throughput.",
    readTime: "5 min read",
    icon: "📊",
    badge: "REPORT",
  },
];

export function ResourcesSection() {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [selectedResource, setSelectedResource] = useState<typeof RESOURCE_ITEMS[0] | null>(null);

  const categories = ["ALL", "OPERATIONS", "CLINICAL", "INTELLIGENCE", "CSSD & STERILIZATION", "SURGICAL SUITES", "ANALYTICS"];

  const filteredItems = activeCategory === "ALL"
    ? RESOURCE_ITEMS
    : RESOURCE_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <section id="resources" className="py-24 bg-[#071B34] text-white relative overflow-hidden font-sans select-none">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-extrabold tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>KNOWLEDGE HUB & RESOURCES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Clinical Insights & <span className="text-cyan-300">Operational Excellence</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-medium max-w-2xl mx-auto">
            Explore guides, white papers, and operational standards designed by healthcare technology leaders to optimize hospital workflows.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md"
                  : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Resource Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-gradient-to-b from-[#0B2545]/90 to-[#071B34]/90 border border-white/10 hover:border-cyan-400/40 rounded-3xl p-6 flex flex-col justify-between shadow-xl transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-400/30 text-2xl flex items-center justify-center shrink-0">
                    {item.icon}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-white/10 text-[10px] font-extrabold text-cyan-300 uppercase tracking-wider">
                    {item.badge}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{item.category}</div>
                  <h3 className="text-lg font-extrabold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              </div>

              <div className="pt-5 mt-6 border-t border-white/10 flex items-center justify-between text-xs font-bold">
                <span className="text-slate-400">{item.readTime}</span>
                <button
                  onClick={() => setSelectedResource(item)}
                  className="text-cyan-400 hover:text-white flex items-center space-x-1 transition-colors cursor-pointer"
                >
                  <span>Explore Guide</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Resource Detail Modal Preview */}
      {selectedResource && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150"
          onClick={() => setSelectedResource(null)}
        >
          <div
            className="bg-[#0B2545] border border-cyan-400/30 rounded-3xl shadow-2xl max-w-lg w-full p-6 space-y-5 text-white relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedResource(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
            >
              ✕
            </button>

            <div className="flex items-center space-x-3.5 border-b border-white/10 pb-4">
              <span className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-2xl flex items-center justify-center">
                {selectedResource.icon}
              </span>
              <div>
                <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-widest">
                  {selectedResource.category} · {selectedResource.badge}
                </span>
                <h3 className="text-lg font-extrabold leading-tight">{selectedResource.title}</h3>
              </div>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-200">
              <p className="font-semibold text-cyan-300">Key Executive Takeaways:</p>
              <ul className="space-y-2 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 font-medium">
                <li className="flex items-start space-x-2">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>Centralize live queue status between emergency intake and general ward admissions.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>Automate surgical tray sterilization tracking for 100% infection control compliance.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>Eliminate OT room turnover delays with automated equipment availability signals.</span>
                </li>
              </ul>
              <p className="text-[11px] text-slate-400">
                This guide is accessible within the Mediflow-AI Command Center documentation platform.
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setSelectedResource(null)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-extrabold text-xs shadow-md cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
