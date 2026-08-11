"use client";

import Link from "next/link";

export function AnalyticsSection() {
  return (
    <section id="resources" className="py-24 bg-[#0B2545] border-t border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              RESOURCES & ANALYTICS
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Turn Clinical Bottlenecks Into High-Performance Outcomes
            </h2>
            <p className="text-base text-slate-300 leading-relaxed">
              Mediflow-AI gathers continuous data across admissions throughput, ward bed turnaround times, and OT scheduling delays — giving hospital administrators instant executive visibility.
            </p>

            <div className="space-y-3 pt-2">
              {[
                { title: "Live Patient Throughput Metrics", desc: "Monitor intake velocity and readiness status in real time." },
                { title: "OT Room Utilization Heatmaps", desc: "Identify surgical turnover delays and optimize staff allocation." },
                { title: "Executive Operations Reporting", desc: "Automated daily operational summaries delivered directly to department leads." },
              ].map((item) => (
                <div key={item.title} className="p-4 rounded-2xl bg-[#071B34] border border-white/10 flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{item.title}</div>
                    <div className="text-xs text-slate-400">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-lg transition-all"
              >
                <span>View Operational Analytics →</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#071B34] border border-white/15 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-cyan-400">Live Hospital Operational Summary</div>
                  <div className="text-lg font-bold text-white">Meridian General Hospital</div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 text-xs font-bold">
                  ● LIVE DATA
                </span>
              </div>

              {/* Sample Analytics Chart Preview */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-300 font-medium">
                    <span>Admissions Throughput</span>
                    <span className="font-bold text-white">94% Target Achieved</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 w-[94%]" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-300 font-medium">
                    <span>OT Room Utilization</span>
                    <span className="font-bold text-white">82% Capacity</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400 w-[82%]" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-300 font-medium">
                    <span>CSSD Pack Availability</span>
                    <span className="font-bold text-white">96% Available</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-400 w-[96%]" />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#0B2545] border border-white/10 flex items-center justify-between text-xs text-slate-300">
                <span>Average Patient Transfer Time: <strong className="text-white">18 mins</strong></span>
                <span className="text-emerald-400 font-bold">↓ 32% Faster</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
