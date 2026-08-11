"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useOperationalData } from "@/lib/data/operational-context";
import { PatientFlowLineChart } from "@/app/components/charts/PatientFlowLineChart";
import { WardCapacityDonut } from "@/app/components/charts/WardCapacityDonut";
import { HOSPITAL_NAME } from "@/lib/config/hospital";

export default function CommandCenterDashboard() {
  const { user, profile } = useAuth();
  const {
    admissionsToday,
    occupiedBeds,
    totalBeds,
    bedOccupancyPct,
    otUtilizationPct,
    otActiveCases,
    otCriticalDelays,
    criticalAlertsCount,
    secondsSinceUpdate,
    timeRange,
    setTimeRange,
    getTimeSeries,
  } = useOperationalData();

  const [hoveredOT, setHoveredOT] = useState<string | null>(null);

  const chartSectionRef = useRef<HTMLDivElement>(null);
  const wardSectionRef = useRef<HTMLDivElement>(null);
  const otSectionRef = useRef<HTMLDivElement>(null);

  const displayName = profile?.name || user?.displayName || "Dr. Anika Rao";
  const series = getTimeSeries();

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const OT_ROOMS = [
    {
      id: "ot_01",
      name: "OT Room 01",
      department: "Cardiology",
      procedure: "CABG Surgical Procedure",
      surgeon: "Dr. Rajesh Kumar",
      status: "active",
      statusLabel: "In Progress",
      duration: "08:30 - 12:45",
      color: "bg-emerald-500 border-emerald-400 text-white",
    },
    {
      id: "ot_02",
      name: "OT Room 02",
      department: "Orthopedics",
      procedure: "Total Knee Replacement",
      surgeon: "Dr. Vikram Seth",
      status: "delayed",
      statusLabel: "Delayed (24m)",
      duration: "10:15 - 13:30",
      color: "bg-rose-500 border-rose-400 text-white animate-pulse",
    },
    {
      id: "ot_03",
      name: "OT Room 03",
      department: "General Surgery",
      procedure: "Laparoscopic Cholecystectomy",
      surgeon: "Dr. Ananya Roy",
      status: "cleaning",
      statusLabel: "Sterilization / Cleaning",
      duration: "11:45 - 12:30",
      color: "bg-amber-500 border-amber-400 text-white",
    },
    {
      id: "ot_04",
      name: "OT Room 04",
      department: "Neurology",
      procedure: "Craniotomy Preparation",
      surgeon: "Dr. S. Mukherjee",
      status: "scheduled",
      statusLabel: "Scheduled Next",
      duration: "13:00 - 16:30",
      color: "bg-blue-500 border-blue-400 text-white",
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Welcome Banner Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#071B34] via-[#0B2545] to-[#0F325C] text-white border border-white/10 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-semibold mb-3">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Real-time Operational Command Center · Live Simulation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Good morning, {displayName}
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            {HOSPITAL_NAME} is running at {bedOccupancyPct}% bed capacity with {otActiveCases} active surgeries. {criticalAlertsCount} critical operational alerts require supervisor review.
          </p>
          <div className="text-[11px] text-slate-400 mt-2 font-medium">
            ● Updated {secondsSinceUpdate} seconds ago · Live operational feed
          </div>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <Link
            href="/ai-assistant"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg border border-purple-400/30 flex items-center space-x-2 transition-all transform hover:-translate-y-0.5"
          >
            <span>✨ Ask AI Assistant</span>
          </Link>
          <Link
            href="/alerts"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/20 flex items-center space-x-2 transition-all"
          >
            <span>View Alerts ({criticalAlertsCount})</span>
          </Link>
        </div>
      </div>

      {/* Top 4 Enterprise KPI Cards (Connected to Visualizations) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1 */}
        <div
          onClick={() => scrollToSection(chartSectionRef)}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-400 transition-all transform hover:-translate-y-1 cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Active Admissions</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-bold">↑ 12% today</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">{admissionsToday}</span>
            <span className="text-xs text-slate-500">patients in queue</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>22 Ready Now</span>
            <span className="font-semibold text-amber-600">4 Blocked</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div
          onClick={() => scrollToSection(wardSectionRef)}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-400 transition-all transform hover:-translate-y-1 cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Ward Bed Occupancy</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">{bedOccupancyPct}% Occupied</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900 group-hover:text-amber-600 transition-colors">{occupiedBeds} / {totalBeds}</span>
            <span className="text-xs text-slate-500">beds occupied</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span className="text-emerald-600 font-semibold">{totalBeds - occupiedBeds} Beds Free</span>
            <span>Ward A & C high</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div
          onClick={() => scrollToSection(otSectionRef)}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-400 transition-all transform hover:-translate-y-1 cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>OT Utilization</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold">{otUtilizationPct}% Active</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">{otActiveCases} Cases</span>
            <span className="text-xs text-slate-500">active surgeries</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>8 Upcoming Today</span>
            <span className="font-semibold text-rose-600">{otCriticalDelays} Critical Delay</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div
          onClick={() => scrollToSection(otSectionRef)}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-rose-400 transition-all transform hover:-translate-y-1 cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Active Alerts</span>
            <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[11px] font-bold">{criticalAlertsCount} Critical</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900 group-hover:text-rose-600 transition-colors">{criticalAlertsCount} Alerts</span>
            <span className="text-xs text-slate-500">requiring action</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>OT-02 Delay</span>
            <span className="font-semibold text-rose-600">Consent Block</span>
          </div>
        </div>
      </div>

      {/* Row 1: Interactive Patient Flow Line Chart + Ward Capacity Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Flow Line Chart Component */}
        <div ref={chartSectionRef} className="lg:col-span-2 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Patient Flow Analytics</h2>
              <p className="text-xs text-slate-500">Admissions, discharges and ward transfers over time</p>
            </div>
            <div className="flex items-center space-x-1 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
              {(["24h", "7d", "30d"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeRange(t)}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    timeRange === t ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <PatientFlowLineChart series={series} height={240} />
        </div>

        {/* Multi-Segment Ward Capacity Donut Component */}
        <div ref={wardSectionRef} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-0.5">Ward Capacity</h2>
            <p className="text-xs text-slate-500">Two-way interactive donut & bed occupancy sync</p>
          </div>

          <WardCapacityDonut />
        </div>
      </div>

      {/* Row 2: Real-time OT Procedure Visual Timeline */}
      <div ref={otSectionRef} className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Operating Theatre Real-Time Timeline</h2>
            <p className="text-xs text-slate-500">Live procedure schedules, turnover status, and room delays</p>
          </div>
          <Link href="/ot" className="text-xs font-semibold text-blue-600 hover:underline">
            Manage All OTs →
          </Link>
        </div>

        {/* OT Timeline Rows */}
        <div className="space-y-4">
          {OT_ROOMS.map((ot) => (
            <div
              key={ot.id}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 relative group transition-all hover:border-blue-400/50 hover:bg-slate-100/80"
              onMouseEnter={() => setHoveredOT(ot.id)}
              onMouseLeave={() => setHoveredOT(null)}
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-2">
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-sm text-slate-900">{ot.name}</span>
                  <span className="text-xs text-slate-500 font-medium">({ot.department})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-600 font-semibold">{ot.duration}</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${ot.color}`}>
                    {ot.statusLabel}
                  </span>
                </div>
              </div>

              <div className="text-xs font-medium text-slate-700 mb-2">
                <span className="font-bold text-slate-900">{ot.procedure}</span> — Surgeon: {ot.surgeon}
              </div>

              {/* Visual Progress Bar */}
              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    ot.status === "active"
                      ? "bg-emerald-500 w-3/4 animate-pulse"
                      : ot.status === "delayed"
                      ? "bg-rose-500 w-1/2"
                      : ot.status === "cleaning"
                      ? "bg-amber-500 w-1/4"
                      : "bg-blue-500 w-1/5"
                  }`}
                />
              </div>

              {/* Rich Custom Hover Tooltip */}
              {hoveredOT === ot.id && (
                <div className="absolute left-6 bottom-full mb-2 z-30 w-72 p-4 rounded-2xl bg-[#071B34] text-white shadow-2xl border border-white/20 text-xs space-y-2 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                  <div className="font-bold text-sm text-cyan-300">{ot.name} — Detailed Status</div>
                  <div><span className="text-slate-400">Procedure:</span> {ot.procedure}</div>
                  <div><span className="text-slate-400">Lead Surgeon:</span> {ot.surgeon}</div>
                  <div><span className="text-slate-400">Time Window:</span> {ot.duration}</div>
                  <div><span className="text-slate-400">Sterilization Status:</span> CSSD Pack STZ-0809 Ready</div>
                  <div className="pt-2 border-t border-white/10 text-[10px] text-cyan-400 font-semibold">
                    Click to open OT Detail Drawer
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
