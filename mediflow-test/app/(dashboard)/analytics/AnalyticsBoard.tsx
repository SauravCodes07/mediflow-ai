"use client";

import { useState } from "react";
import { useOperationalData, TimeRange, DepartmentFilter, TimeSeriesPoint } from "@/lib/data/operational-context";

export function AnalyticsBoard() {
  const {
    timeRange,
    setTimeRange,
    deptFilter,
    setDeptFilter,
    getTimeSeries,
    secondsSinceUpdate,
    admissionsToday,
    otUtilizationPct,
    cssdAvailabilityPct,
    bedOccupancyPct,
  } = useOperationalData();

  const [hoveredPoint, setHoveredPoint] = useState<TimeSeriesPoint | null>(null);

  const series = getTimeSeries();

  // Dynamically compute totals and averages based on active time range & series data
  const totalAdmissions = series.reduce((sum, p) => sum + p.admissions, 0);
  const totalDischarges = series.reduce((sum, p) => sum + p.discharges, 0);
  const avgOccupancy = Math.round(series.reduce((sum, p) => sum + p.occupancy, 0) / series.length);
  const avgOtUtil = Math.round(series.reduce((sum, p) => sum + p.otUtilization, 0) / series.length);

  return (
    <div className="space-y-6">
      {/* Analytics Command Center Header & Filter Bar */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Analytics & Operational Intelligence</h2>
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-xs font-semibold text-emerald-700">● LIVE</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Monitor hospital throughput, capacity, handoff efficiency, and bottleneck insights. Updated {secondsSinceUpdate} sec ago.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => alert("Generating Executive Operational PDF Report...")}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-all"
            >
              📊 Export Report
            </button>
          </div>
        </div>

        {/* Dynamic Filters Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Time Range Filter (24H, 7D, 30D) */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Time Range:</span>
            <div className="flex items-center space-x-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
              {[
                { id: "24h", label: "24 Hours (Hourly)" },
                { id: "7d", label: "7 Days (Daily)" },
                { id: "30d", label: "30 Days" },
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => setTimeRange(r.id as TimeRange)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    timeRange === r.id
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Department Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Department:</span>
            <div className="flex items-center space-x-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
              {(["all", "Admissions", "Wards", "OT", "CSSD"] as const).map((dept) => (
                <button
                  key={dept}
                  onClick={() => setDeptFilter(dept as DepartmentFilter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    deptFilter === dept
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {dept === "all" ? "All Departments" : dept}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Summary KPI Cards (Derived from active timeRange & deptFilter) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Total Admissions ({timeRange.toUpperCase()})
          </div>
          <div className="text-3xl font-extrabold text-blue-600">{totalAdmissions}</div>
          <div className="text-xs text-slate-500 mt-1">Discharges: {totalDischarges} patients</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Avg Ward Bed Occupancy
          </div>
          <div className="text-3xl font-extrabold text-emerald-600">{avgOccupancy}%</div>
          <div className="text-xs text-slate-500 mt-1">Current live: {bedOccupancyPct}% occupied</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Avg OT Utilization Rate
          </div>
          <div className="text-3xl font-extrabold text-indigo-600">{avgOtUtil}%</div>
          <div className="text-xs text-slate-500 mt-1">Current live: {otUtilizationPct}% utilization</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-300 transition-all">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            CSSD Instrument Pack Readiness
          </div>
          <div className="text-3xl font-extrabold text-amber-600">{cssdAvailabilityPct}%</div>
          <div className="text-xs text-slate-500 mt-1">Autoclaves running optimally</div>
        </div>
      </div>

      {/* Main Interactive Chart Box with Hover Tooltip */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Throughput & Patient Flow Trend ({timeRange.toUpperCase()} View)
            </h3>
            <p className="text-xs text-slate-500">
              Hover over data points to inspect admissions, discharges, net flow, and percentage change.
            </p>
          </div>

          <div className="flex items-center space-x-4 text-xs font-semibold">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-blue-600" />
              <span>Admissions</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span>Discharges</span>
            </div>
          </div>
        </div>

        {/* SVG Multi-Series Interactive Chart */}
        <div className="w-full h-64 relative my-4">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200">
            <defs>
              <linearGradient id="analytics_grad_adm" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1677FF" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#1677FF" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            <line x1="0" y1="40" x2="600" y2="40" stroke="#F1F5F9" strokeWidth="1" />
            <line x1="0" y1="100" x2="600" y2="100" stroke="#F1F5F9" strokeWidth="1" />
            <line x1="0" y1="160" x2="600" y2="160" stroke="#F1F5F9" strokeWidth="1" />

            {/* Vertical Guide Line on Hover */}
            {hoveredPoint && (
              <line
                x1={series.findIndex((p) => p.label === hoveredPoint.label) * (600 / (series.length - 1 || 1))}
                y1="0"
                x2={series.findIndex((p) => p.label === hoveredPoint.label) * (600 / (series.length - 1 || 1))}
                y2="180"
                stroke="#1677FF"
                strokeWidth="1.5"
                strokeDasharray="4,4"
              />
            )}

            {/* Admissions Bar & Dot series */}
            {series.map((pt, idx) => {
              const stepX = (600 / (series.length - 1 || 1)) * idx;
              const barHeight = (pt.admissions / 40) * 140;
              const isHovered = hoveredPoint?.label === pt.label;

              return (
                <g key={pt.label}>
                  {/* Bar Visual */}
                  <rect
                    x={stepX - 8}
                    y={180 - barHeight}
                    width="16"
                    height={barHeight}
                    rx="4"
                    fill={isHovered ? "#1677FF" : "#93C5FD"}
                    className="transition-all cursor-pointer"
                    onMouseEnter={() => setHoveredPoint(pt)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />

                  {/* Interactive Dot */}
                  <circle
                    cx={stepX}
                    cy={180 - barHeight}
                    r={isHovered ? "7" : "4"}
                    fill="#1677FF"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="cursor-pointer transition-all"
                    onMouseEnter={() => setHoveredPoint(pt)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />

                  {/* Label */}
                  <text
                    x={stepX}
                    y="196"
                    textAnchor="middle"
                    fill="#64748B"
                    fontSize="10"
                    fontWeight="600"
                  >
                    {pt.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Interactive Rich Tooltip Card */}
          {hoveredPoint && (
            <div className="absolute top-4 right-4 z-30 p-4 rounded-2xl bg-[#071B34] text-white shadow-2xl border border-white/20 text-xs space-y-1.5 animate-in fade-in duration-150">
              <div className="font-extrabold text-cyan-300 text-sm">{hoveredPoint.label} · Operational Snapshot</div>
              <div className="flex justify-between space-x-6">
                <span className="text-slate-400">Admissions:</span>
                <span className="font-bold text-white">{hoveredPoint.admissions} patients</span>
              </div>
              <div className="flex justify-between space-x-6">
                <span className="text-slate-400">Discharges:</span>
                <span className="font-bold text-emerald-400">{hoveredPoint.discharges} patients</span>
              </div>
              <div className="flex justify-between space-x-6">
                <span className="text-slate-400">Net Flow:</span>
                <span className="font-bold text-cyan-300">+{hoveredPoint.netFlow}</span>
              </div>
              <div className="flex justify-between space-x-6">
                <span className="text-slate-400">Occupancy:</span>
                <span className="font-bold text-amber-300">{hoveredPoint.occupancy}%</span>
              </div>
              <div className="pt-1.5 border-t border-white/10 text-[10px] text-slate-400">
                ● Updated {secondsSinceUpdate}s ago · Filter: {deptFilter.toUpperCase()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
