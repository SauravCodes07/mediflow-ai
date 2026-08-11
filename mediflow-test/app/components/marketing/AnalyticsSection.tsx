"use client";

import Link from "next/link";
import { HOSPITAL_NAME } from "@/lib/config/hospital";

export function AnalyticsSection() {
  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold">
              <span>⚡ Real-Time Clinical Intelligence</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Turn raw hospital data into real-time operational decisions.
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Mediflow-AI centralizes live telemetry from admissions queues, surgical turnover logs, ward bed capacity, and CSSD sterilization batches into one command center dashboard.
            </p>

            <div className="space-y-3 pt-2">
              {[
                "Predict bed bottlenecks before ER delays occur",
                "Automate consent form clearance for surgical intake",
                "Monitor instrument sterilization cycle readiness",
                "Streamline inter-unit patient transfers with live tracking",
              ].map((feat) => (
                <div key={feat} className="flex items-center space-x-3 text-xs sm:text-sm font-semibold text-slate-200">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">✓</span>
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link
                href="/analytics"
                className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-lg transition-all"
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
                  <div className="text-lg font-bold text-white">{HOSPITAL_NAME}</div>
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
                    <span>Operating Theatre Utilization</span>
                    <span className="font-bold text-white">82% Active Utilization</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-400 w-[82%]" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-300 font-medium">
                    <span>CSSD Instrument Pack Readiness</span>
                    <span className="font-bold text-white">96% Sterilization Ready</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 w-[96%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
