"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { HOSPITAL_NAME } from "@/lib/config/hospital";

interface IntelligenceItem {
  id: string;
  department: string;
  impact: string;
  severity: "Critical" | "High Impact" | "Medium Impact" | "Info";
  problem: string;
  evidence: string;
  recommendation: string;
  actionText: string;
  actionHref: string;
  timestamp: string;
  resolved?: boolean;
}

const INITIAL_INSIGHTS: IntelligenceItem[] = [
  {
    id: "INS-001",
    department: "OT 2 — Surgical Workflow",
    impact: "20 min above baseline",
    severity: "High Impact",
    problem: "Turnover delay between Knee Replacement and Hernia Repair cases",
    evidence: "Sterilization tray STZ-0809-B dispatch delayed by 18 minutes from CSSD Wash bay.",
    recommendation: "Pre-reserve Sterilization Batch STZ-0809-B for afternoon cases and alert OT lead.",
    actionText: "Reserve STZ-0809-B Batch",
    actionHref: "/cssd/sterilization",
    timestamp: "12 min ago",
  },
  {
    id: "INS-002",
    department: "Ward A — Inpatient Wards",
    impact: "82% occupancy threshold breached",
    severity: "Medium Impact",
    problem: "Ward A bed capacity reaching critical threshold with 2 pending transfers",
    evidence: "2 patient intake transfer requests pending in Admissions queue while Bed A-02 pending discharge cleaning.",
    recommendation: "Expedite bed cleaning on A-2 to clear transfer queue before 14:00 intake shift.",
    actionText: "Expedite Bed Cleaning",
    actionHref: "/wards",
    timestamp: "25 min ago",
  },
  {
    id: "INS-003",
    department: "CSSD — Sterile Inventory",
    impact: "Surgical block risk",
    severity: "Critical",
    problem: "Instrument pack GEN-SET-09 expired and blocked from surgical assignment",
    evidence: "Expiration timestamp reached at 11:50 AM while pack was reserved for upcoming 14:00 OT 3 procedure.",
    recommendation: "Initiate immediate reprocessing cycle for pack GEN-SET-09 before afternoon surgery.",
    actionText: "Schedule Reprocessing",
    actionHref: "/cssd/instrument-packs",
    timestamp: "40 min ago",
  },
  {
    id: "INS-004",
    department: "Emergency — Intake Triage",
    impact: "35 min avg wait time",
    severity: "High Impact",
    problem: "Surge in emergency intake registrations causing lobby queue overflow",
    evidence: "Emergency Department intake reached 100% capacity following multi-vehicle accident triage.",
    recommendation: "Activate Level 2 Triage surge protocol and assign 2 step-down nurses to intake desk.",
    actionText: "Activate Surge Protocol",
    actionHref: "/alerts",
    timestamp: "1 hr ago",
  },
];

export default function AIInsightsPage() {
  const [insights, setInsights] = useState<IntelligenceItem[]>(INITIAL_INSIGHTS);
  const [deptFilter, setDeptFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [actionToast, setActionToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setActionToast(msg);
    setTimeout(() => setActionToast(null), 3500);
  };

  const handleExecuteAction = (id: string, actionText: string) => {
    setInsights((prev) =>
      prev.map((item) => (item.id === id ? { ...item, resolved: true } : item))
    );
    triggerToast(`✓ Executed: ${actionText}`);
  };

  const filtered = insights.filter((item) => {
    const matchDept = deptFilter === "all" || item.department.toLowerCase().includes(deptFilter.toLowerCase());
    const matchSev = severityFilter === "all" || item.severity.toLowerCase().includes(severityFilter.toLowerCase());
    return matchDept && matchSev;
  });

  return (
    <div className="space-y-6 font-sans select-none pb-24 text-slate-800 dark:text-slate-100">
      
      {/* Toast Notification */}
      {actionToast && (
        <div className="fixed top-20 right-6 z-50 px-4 py-3 rounded-2xl bg-[#0B2545] text-white font-bold text-xs shadow-2xl border border-cyan-400/40 flex items-center space-x-2 animate-in slide-in-from-top-4 duration-200">
          <span className="text-cyan-400 font-bold">✨</span>
          <span>{actionToast}</span>
        </div>
      )}

      {/* Page Header */}
      <PageHeader
        title="AI Operational Intelligence & Insights"
        category="CLINICAL AI / BOTTLENECK DIGEST"
        description={`Real-time clinical intelligence automatically extracted from hospital workflow telemetry at ${HOSPITAL_NAME}.`}
        actions={
          <div className="flex items-center space-x-2">
            <button
              onClick={() => triggerToast("AI Intelligence Model re-scanned operational telemetry.")}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <span>✨ Re-analyze Telemetry</span>
            </button>
          </div>
        }
      />

      {/* Top Intelligence Status Strip */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs font-semibold">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-pulse" />
          <span className="font-extrabold text-slate-900 dark:text-white">● Mediflow AI Telemetry Engine Online</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-slate-500 dark:text-slate-400 font-mono">
          <span>Active Insights: <strong className="text-purple-600 dark:text-purple-400">{insights.filter(i => !i.resolved).length} Active</strong></span>
          <span>Confidence Score: <strong className="text-emerald-600">98.4%</strong></span>
          <span>Last Intelligence Scan: <strong className="text-slate-900 dark:text-white">Just now</strong></span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Filter Insights:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
          >
            <option value="all">Severity: All</option>
            <option value="critical">Critical</option>
            <option value="high">High Impact</option>
            <option value="medium">Medium Impact</option>
          </select>

          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
          >
            <option value="all">Department: All</option>
            <option value="ot">Operating Theatre</option>
            <option value="ward">Inpatient Wards</option>
            <option value="cssd">CSSD Sterile Inventory</option>
            <option value="emergency">Emergency Department</option>
          </select>
        </div>
      </div>

      {/* Insights Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((item) => {
          const isCritical = item.severity === "Critical";
          const isHigh = item.severity === "High Impact";

          return (
            <div
              key={item.id}
              className={`p-6 rounded-3xl bg-white dark:bg-[#0B2545] border shadow-xs transition-all relative space-y-4 flex flex-col justify-between ${
                item.resolved
                  ? "opacity-60 border-slate-200 dark:border-slate-800"
                  : isCritical
                  ? "border-rose-500/50 dark:border-rose-500/40"
                  : isHigh
                  ? "border-amber-500/50 dark:border-amber-500/40"
                  : "border-slate-200 dark:border-slate-800"
              }`}
            >
              {/* Header Badges */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-extrabold uppercase text-slate-500 dark:text-slate-400">
                      {item.department}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono text-slate-400">{item.timestamp}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        isCritical
                          ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                          : isHigh
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                      }`}
                    >
                      {item.severity}
                    </span>
                  </div>
                </div>

                {/* Problem Statement & Impact */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                      {item.problem}
                    </h3>
                  </div>
                  <div className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono font-bold">
                    Impact: <span className="text-rose-600 dark:text-rose-400">{item.impact}</span>
                  </div>
                </div>

                {/* Evidence Section */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                  <span className="font-extrabold text-slate-500 dark:text-slate-400 uppercase text-[10px] block">
                    Telemetry Evidence
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    {item.evidence}
                  </p>
                </div>

                {/* AI Recommendation Card */}
                <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs space-y-1">
                  <div className="flex items-center space-x-1.5 text-purple-700 dark:text-purple-300 font-extrabold text-[11px] uppercase tracking-wider">
                    <span>✨ AI Recommendation</span>
                  </div>
                  <p className="text-purple-900 dark:text-purple-200 font-semibold leading-relaxed">
                    {item.recommendation}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
                <Link
                  href={item.actionHref}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors"
                >
                  View Module →
                </Link>

                <button
                  type="button"
                  disabled={item.resolved}
                  onClick={() => handleExecuteAction(item.id, item.actionText)}
                  className={`px-5 py-2.5 rounded-xl font-extrabold text-xs shadow-md transition-all cursor-pointer ${
                    item.resolved
                      ? "bg-emerald-600 text-white cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-500 text-white"
                  }`}
                >
                  {item.resolved ? "✓ Action Executed" : `✨ ${item.actionText}`}
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
