"use client";

import { useState } from "react";
import { HOSPITAL_NAME } from "@/lib/config/hospital";
import { useOperationalData } from "@/lib/data/operational-context";
import { ReportPreviewModal } from "@/app/components/reports/ReportPreviewModal";

export interface ReportItem {
  id: string;
  title: string;
  kind: string;
  description: string;
  icon: string;
}

const REPORTS: ReportItem[] = [
  {
    id: "rep_daily",
    title: "Daily Hospital Operations Report",
    kind: "daily_operations",
    description: "Summary of admissions, OT utilization, CSSD pack throughput, and active alerts.",
    icon: "📋",
  },
  {
    id: "rep_ot",
    title: "OT Utilization & Turnover Report",
    kind: "ot_utilization",
    description: "Detailed room schedule performance, turnover delays, and surgeon case logs.",
    icon: "🏥",
  },
  {
    id: "rep_cssd",
    title: "CSSD Sterilization & Pack Report",
    kind: "cssd_sterilization",
    description: "Sterilization batch cycle logs, held/failed batches, and pack expiry audit.",
    icon: "📦",
  },
  {
    id: "rep_adm",
    title: "Admissions & Patient Readiness Report",
    kind: "admissions_readiness",
    description: "Admissions queue latency, consent bottleneck breakdown, and ward transfers.",
    icon: "🛌",
  },
  {
    id: "rep_alerts",
    title: "Alerts & Bottleneck Analysis Report",
    kind: "alerts_bottleneck",
    description: "Critical alert resolution times, overdue escalations, and department friction.",
    icon: "⚠️",
  },
  {
    id: "rep_exec",
    title: "Executive Monthly Summary",
    kind: "executive_monthly",
    description: "High-level operational metrics, capacity utilization trends, and compliance metrics.",
    icon: "📊",
  },
];

export function ReportsBoard() {
  const {
    admissionsToday,
    bedOccupancyPct,
    otUtilizationPct,
    cssdAvailabilityPct,
    patientTransfers,
    getTimeSeries,
  } = useOperationalData();

  const [selectedReport, setSelectedReport] = useState<ReportItem>(REPORTS[0]);
  const [dateRange, setDateRange] = useState("today");
  const [dept, setDept] = useState("all");
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const series = getTimeSeries();
  const totalVal1 = series.reduce((sum, p) => sum + (p.series1Val ?? p.admissions), 0);
  const totalVal2 = series.reduce((sum, p) => sum + (p.series2Val ?? p.discharges), 0);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setReportModalOpen(true);
    }, 600);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Report Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {REPORTS.map((rep) => {
          const active = selectedReport.id === rep.id;
          return (
            <div
              key={rep.id}
              onClick={() => setSelectedReport(rep)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                active
                  ? "bg-blue-50/70 border-blue-400 shadow-md translate-y-[-2px]"
                  : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
              }`}
            >
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-2xl">{rep.icon}</span>
                  <h3 className="text-sm font-extrabold text-slate-900 leading-snug">{rep.title}</h3>
                </div>
                <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">
                  {rep.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-semibold">
                <span className={active ? "text-blue-700 font-bold" : "text-slate-500"}>
                  {active ? "● Selected Report" : "Click to Select"}
                </span>
                <span className="text-blue-600">Configure →</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Report Configuration & Action Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-lg font-extrabold text-slate-900">{selectedReport.title} Configuration</h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Configure reporting filters for {HOSPITAL_NAME}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
              Time Horizon
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:border-blue-500"
            >
              <option value="today">Today (24 Hours)</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="month">Current Month</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
              Department Target
            </label>
            <select
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Departments (Hospital Wide)</option>
              <option value="Admissions">Admissions Intake</option>
              <option value="Wards">General & ICU Wards</option>
              <option value="OT">Operating Theatre</option>
              <option value="CSSD">CSSD Sterilization</option>
            </select>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50 flex items-center space-x-2 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Generating Executive Report...</span>
              </>
            ) : (
              <span>📊 Generate Executive Report Preview</span>
            )}
          </button>
        </div>
      </div>

      {/* Executive Report Preview Modal */}
      <ReportPreviewModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        department={dept === "all" ? "All Departments" : dept}
        timeframe={dateRange === "today" ? "24h" : dateRange}
        series={series}
        kpis={{
          total1: totalVal1,
          total2: totalVal2,
          occupancy: bedOccupancyPct,
          otUtil: otUtilizationPct,
          cssdPct: cssdAvailabilityPct,
        }}
      />
    </div>
  );
}
