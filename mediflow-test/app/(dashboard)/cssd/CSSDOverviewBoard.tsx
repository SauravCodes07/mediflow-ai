"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { HOSPITAL_NAME } from "@/lib/config/hospital";
import { INITIAL_PACKS, INITIAL_BATCHES, INITIAL_AUTOCLAVES } from "@/lib/data/cssd-data";

export function CSSDOverviewBoard() {
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d">("7d");
  const [activeStageHover, setActiveStageHover] = useState<string | null>(null);

  // Dynamic series based on timeRange
  const getSeriesData = () => {
    if (timeRange === "24h") {
      return [
        { label: "00:00", success: 2, failed: 0, reprocessed: 0 },
        { label: "04:00", success: 4, failed: 0, reprocessed: 1 },
        { label: "08:00", success: 6, failed: 1, reprocessed: 0 },
        { label: "12:00", success: 8, failed: 0, reprocessed: 1 },
        { label: "16:00", success: 5, failed: 0, reprocessed: 0 },
        { label: "20:00", success: 7, failed: 0, reprocessed: 1 },
      ];
    }
    if (timeRange === "30d") {
      return Array.from({ length: 15 }, (_, i) => ({
        label: `Day ${i * 2 + 1}`,
        success: Math.round(10 + Math.sin(i) * 4),
        failed: i % 5 === 0 ? 1 : 0,
        reprocessed: Math.round(2 + Math.cos(i) * 1.5),
      }));
    }
    return [
      { label: "Mon", success: 12, failed: 0, reprocessed: 1 },
      { label: "Tue", success: 14, failed: 1, reprocessed: 2 },
      { label: "Wed", success: 11, failed: 0, reprocessed: 1 },
      { label: "Thu", success: 16, failed: 0, reprocessed: 0 },
      { label: "Fri", success: 18, failed: 1, reprocessed: 3 },
      { label: "Sat", success: 15, failed: 0, reprocessed: 1 },
      { label: "Sun", success: 10, failed: 0, reprocessed: 0 },
    ];
  };

  const chartData = getSeriesData();
  const maxVal = Math.max(...chartData.map((d) => d.success + d.failed + d.reprocessed), 10);

  // SVG Donut Math: R = 44, Circumference = 276.46
  const R = 44;
  const CIRCUMFERENCE = 2 * Math.PI * R;
  const readyPct = 75;

  const PIPELINE_STAGES = [
    { id: "col", name: "COLLECTION", count: 6, status: "completed", color: "bg-emerald-500", duration: "18 min avg" },
    { id: "dec", name: "DECONTAMINATION", count: 4, status: "completed", color: "bg-emerald-500", duration: "32 min avg" },
    { id: "pkg", name: "PACKAGING", count: 3, status: "completed", color: "bg-emerald-500", duration: "25 min avg" },
    { id: "stz", name: "STERILIZATION", count: 3, status: "active", color: "bg-blue-600 animate-pulse", duration: "112 min avg" },
    { id: "qc", name: "QUALITY CHECK", count: 2, status: "pending", color: "bg-purple-500", duration: "10 min avg" },
    { id: "rdy", name: "READY", count: 18, status: "ready", color: "bg-emerald-500", duration: "Available" },
  ];

  return (
    <div className="space-y-6 font-sans select-none pb-24 text-slate-800 dark:text-slate-100">
      
      {/* Page Header */}
      <PageHeader
        title="CSSD Operations Center"
        category="CSSD / COMMAND CENTER"
        description={`Sterile inventory, sterilization cycles and pack readiness in one view for ${HOSPITAL_NAME}.`}
        actions={
          <div className="flex items-center space-x-2">
            <Link
              href="/cssd/instrument-packs"
              className="px-4 py-2.5 rounded-xl bg-[#0B2545] hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition-all"
            >
              📦 Instrument Packs
            </Link>
            <Link
              href="/cssd/sterilization"
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md transition-all"
            >
              🧪 Sterilization Control
            </Link>
          </div>
        }
      />

      {/* Top Status Strip */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs font-semibold">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-extrabold text-slate-900 dark:text-white">● CSSD Operational</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-slate-500 dark:text-slate-400 font-mono">
          <span>Last Sync: <strong className="text-slate-900 dark:text-white">10:42 PM</strong></span>
          <span>Active Autoclaves: <strong className="text-blue-600 dark:text-cyan-400">2 / 3</strong></span>
          <span>Packs Ready: <strong className="text-emerald-600">75%</strong></span>
          <span>Next Batch: <strong className="text-purple-600 dark:text-purple-400">11:15 PM</strong></span>
        </div>
      </div>

      {/* 6 Premium KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Card 1 */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-400 hover:-translate-y-0.5 transition-all">
          <div className="flex justify-between items-center text-xs font-extrabold text-slate-500 uppercase tracking-wider">
            <span>Total Packs</span>
            <span className="text-base">📦</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-blue-600 dark:text-cyan-400 mt-1">24</div>
          <div className="text-[11px] font-semibold text-emerald-600 mt-1">+8.3% vs 7 days</div>
        </div>

        {/* Card 2 */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-400 hover:-translate-y-0.5 transition-all">
          <div className="flex justify-between items-center text-xs font-extrabold text-slate-500 uppercase tracking-wider">
            <span>Ready for Use</span>
            <span className="text-base">✓</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-600 mt-1">18</div>
          <div className="text-[11px] font-semibold text-emerald-600 mt-1">75% ready rate</div>
        </div>

        {/* Card 3 */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-400 hover:-translate-y-0.5 transition-all">
          <div className="flex justify-between items-center text-xs font-extrabold text-slate-500 uppercase tracking-wider">
            <span>In Processing</span>
            <span className="text-base">🔄</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-blue-600 dark:text-cyan-400 mt-1">3</div>
          <div className="text-[11px] font-semibold text-blue-600 dark:text-cyan-400 mt-1">2 autoclaves active</div>
        </div>

        {/* Card 4 */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-slate-800 shadow-xs hover:border-amber-400 hover:-translate-y-0.5 transition-all">
          <div className="flex justify-between items-center text-xs font-extrabold text-slate-500 uppercase tracking-wider">
            <span>Expiring Soon</span>
            <span className="text-base">⚠️</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-600 mt-1">2</div>
          <div className="text-[11px] font-semibold text-amber-600 mt-1">Within 72 hours</div>
        </div>

        {/* Card 5 */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-slate-800 shadow-xs hover:border-rose-400 hover:-translate-y-0.5 transition-all">
          <div className="flex justify-between items-center text-xs font-extrabold text-slate-500 uppercase tracking-wider">
            <span>Held / Blocked</span>
            <span className="text-base">🚫</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-rose-600 mt-1">1</div>
          <div className="text-[11px] font-semibold text-rose-600 mt-1">Requires review</div>
        </div>

        {/* Card 6 */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-slate-800 shadow-xs hover:border-purple-400 hover:-translate-y-0.5 transition-all">
          <div className="flex justify-between items-center text-xs font-extrabold text-slate-500 uppercase tracking-wider">
            <span>Success Rate</span>
            <span className="text-base">⭐</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-purple-600 dark:text-purple-400 mt-1">97.4%</div>
          <div className="text-[11px] font-semibold text-emerald-600 mt-1">+2.1% this week</div>
        </div>
      </div>

      {/* Main Dashboard Grid: Left Sterilization Throughput Chart | Right Pack Readiness Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Left 2 Cols: Sterilization Throughput */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Sterilization Throughput</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Successful batches, reprocessing cycles and failed holds</p>
            </div>
            
            {/* 24H / 7D / 30D Time Range Controls */}
            <div className="flex items-center space-x-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              {(["24h", "7d", "30d"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setTimeRange(r)}
                  className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                    timeRange === r
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {r.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Visual Bar Chart */}
          <div className="relative w-full h-[240px] flex items-end justify-between pt-6 px-2 gap-2">
            {chartData.map((d, i) => {
              const successH = (d.success / maxVal) * 180;
              const reprocH = (d.reprocessed / maxVal) * 180;
              const failedH = (d.failed / maxVal) * 180;

              return (
                <div key={i} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                  <div className="w-full max-w-[28px] flex flex-col justify-end gap-0.5 rounded-t-lg overflow-hidden">
                    {d.failed > 0 && <div style={{ height: `${failedH}px` }} className="bg-rose-500 w-full" />}
                    {d.reprocessed > 0 && <div style={{ height: `${reprocH}px` }} className="bg-amber-500 w-full" />}
                    <div style={{ height: `${successH}px` }} className="bg-blue-600 dark:bg-cyan-500 w-full" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 mt-2 font-mono">{d.label}</span>

                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 hidden group-hover:block z-30 p-2.5 rounded-xl bg-slate-900 text-white text-[11px] shadow-xl whitespace-nowrap font-mono pointer-events-none">
                    <div className="font-bold text-cyan-300 border-b border-white/10 pb-1 mb-1">{d.label} Summary</div>
                    <div>Success: {d.success}</div>
                    <div>Reprocessed: {d.reprocessed}</div>
                    <div>Failed: {d.failed}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center space-x-6 text-xs font-semibold pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="flex items-center space-x-1.5"><span className="w-3 h-3 rounded-full bg-blue-600" /><span>Successful</span></span>
            <span className="flex items-center space-x-1.5"><span className="w-3 h-3 rounded-full bg-amber-500" /><span>Reprocessing</span></span>
            <span className="flex items-center space-x-1.5"><span className="w-3 h-3 rounded-full bg-rose-500" /><span>Failed</span></span>
          </div>
        </div>

        {/* Right 1 Col: Pack Readiness Donut */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Pack Readiness</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Lifecycle state distribution across inventory</p>
          </div>

          {/* Centered Donut Overlay */}
          <div className="relative w-[180px] h-[180px] mx-auto flex items-center justify-center">
            <svg viewBox="0 0 120 120" className="w-full h-full transform -rotate-90">
              <circle cx="60" cy="60" r={R} fill="none" stroke="#F1F5F9" strokeWidth="10" className="dark:stroke-slate-800" />
              <circle
                cx="60"
                cy="60"
                r={R}
                fill="none"
                stroke="#10B981"
                strokeWidth="10"
                strokeDasharray={`${(readyPct / 100) * CIRCUMFERENCE} ${CIRCUMFERENCE}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white leading-none">{readyPct}%</span>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mt-1">PACK READY</span>
            </div>
          </div>

          <div className="space-y-2 text-xs font-semibold">
            <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="flex items-center space-x-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /><span>Ready</span></span>
              <span className="font-mono font-bold">18 packs (75%)</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="flex items-center space-x-2"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /><span>In Processing</span></span>
              <span className="font-mono font-bold">3 packs (12%)</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="flex items-center space-x-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /><span>Expiring / Held</span></span>
              <span className="font-mono font-bold">2 packs (8%)</span>
            </div>
          </div>
        </div>

      </div>

      {/* CSSD Process Pipeline Flow */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">CSSD Sterilization Process Pipeline</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Real-time stage tracking from decontamination to sterile dispatch</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 pt-1">
          {PIPELINE_STAGES.map((stg) => (
            <div
              key={stg.id}
              onMouseEnter={() => setActiveStageHover(stg.id)}
              onMouseLeave={() => setActiveStageHover(null)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                stg.status === "active"
                  ? "bg-blue-50 dark:bg-blue-950/60 border-blue-400 shadow-md scale-105"
                  : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-blue-300"
              }`}
            >
              <div className="flex items-center space-x-2 mb-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${stg.color}`} />
                <span className="text-[10px] font-extrabold tracking-wider uppercase text-slate-500 dark:text-slate-400">{stg.name}</span>
              </div>
              <div className="text-lg font-extrabold font-mono text-slate-900 dark:text-white">{stg.count} items</div>
              <div className="text-[10px] font-medium text-slate-400 mt-0.5">{stg.duration}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Autoclaves & Expiry Watch Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* 3 Live Autoclave Cards (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Active Autoclave Telemetry</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Sterilization chamber status, pressure, temperature and cycle times</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {INITIAL_AUTOCLAVES.map((m) => (
              <div key={m.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-xs text-slate-900 dark:text-white">{m.name}</span>
                  <span className={`px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-full ${
                    m.status === "active" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                  }`}>
                    {m.status}
                  </span>
                </div>

                {m.status === "active" ? (
                  <>
                    <div className="text-xs font-mono font-bold text-blue-600 dark:text-cyan-400">{m.currentBatch}</div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div className="h-full bg-blue-600 dark:bg-cyan-500 rounded-full animate-pulse" style={{ width: `${m.progressPct}%` }} />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-500">
                      <div>Temp: <strong className="text-slate-900 dark:text-white">{m.temperature}°C</strong></div>
                      <div>Press: <strong className="text-slate-900 dark:text-white">{m.pressure} bar</strong></div>
                      <div>Elapsed: <strong>{m.elapsedMin}m</strong></div>
                      <div>Rem: <strong className="text-blue-600 dark:text-cyan-400">{m.remainingMin}m</strong></div>
                    </div>
                  </>
                ) : (
                  <div className="text-xs text-slate-400 font-medium py-4 text-center">
                    Maintenance scheduled · Service due 12 Aug
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Expiry Watch & Readiness Score (1 col) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">CSSD Readiness Score</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Composite compliance rating across sterile supply</p>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-200 block">System Score</span>
                <span className="text-3xl font-extrabold font-mono">92 / 100</span>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-white/20 text-xs font-extrabold">EXCELLENT</span>
            </div>

            <div className="space-y-2 text-xs font-semibold">
              <div className="flex justify-between text-slate-500"><span>Pack Availability</span><span className="font-mono text-slate-900 dark:text-white font-bold">94%</span></div>
              <div className="flex justify-between text-slate-500"><span>Sterilization Reliability</span><span className="font-mono text-slate-900 dark:text-white font-bold">97%</span></div>
              <div className="flex justify-between text-slate-500"><span>Expiry Control</span><span className="font-mono text-slate-900 dark:text-white font-bold">88%</span></div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-300 flex items-center space-x-2">
            <span className="text-base">⚠️</span>
            <span className="font-medium">2 packs require action within 72 hours to prevent surgical holds.</span>
          </div>
        </div>

      </div>

    </div>
  );
}
