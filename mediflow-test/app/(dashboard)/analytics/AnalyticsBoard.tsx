"use client";

import { useState } from "react";
import { useOperationalData, TimeRange, DepartmentFilter } from "@/lib/data/operational-context";
import { PatientFlowLineChart } from "@/app/components/charts/PatientFlowLineChart";
import { WardCapacityDonut } from "@/app/components/charts/WardCapacityDonut";
import { ReportPreviewModal } from "@/app/components/reports/ReportPreviewModal";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { HOSPITAL_NAME } from "@/lib/config/hospital";

export function AnalyticsBoard() {
  const {
    timeRange,
    setTimeRange,
    deptFilter,
    setDeptFilter,
    getTimeSeries,
    secondsSinceUpdate,
    occupiedBeds,
    totalBeds,
    bedOccupancyPct,
    otUtilizationPct,
    cssdAvailabilityPct,
    admissionsToday,
  } = useOperationalData();

  const [reportModalOpen, setReportModalOpen] = useState(false);

  const series = getTimeSeries();

  // Dynamically compute totals and averages based on active time range & series data
  const totalVal1 = series.reduce((sum, p) => sum + (p.series1Val ?? p.admissions), 0);
  const totalVal2 = series.reduce((sum, p) => sum + (p.series2Val ?? p.discharges), 0);
  const totalVal3 = series.reduce((sum, p) => sum + (p.series3Val ?? p.transfers), 0);

  // Dynamic Chart Header Title by Department
  const getChartTitle = () => {
    if (deptFilter === "Admissions") return "Admissions Intake Throughput & Consent Clearance";
    if (deptFilter === "Wards") return "Ward Bed Occupancy & Inter-Unit Patient Transfers";
    if (deptFilter === "OT") return "Operating Theatre Utilization & Turnover Latency";
    if (deptFilter === "CSSD") return "CSSD Pack Readiness & Sterilization Batches";
    return "Hospital-Wide Throughput & Patient Flow";
  };

  // Dynamic Data-Driven Footer Insight
  const getFooterInsight = () => {
    if (deptFilter === "Admissions") {
      return "↑ Intake rate increased 14.2% during shift change. Fast-track consent forms to clear ER bottleneck.";
    }
    if (deptFilter === "Wards") {
      return "↑ Ward bed occupancy peaked at 93% in High Dependency (Ward C). 5 discharges scheduled for afternoon.";
    }
    if (deptFilter === "OT") {
      return "↓ OT turnover latency improved by 4.2 mins compared to yesterday's baseline. OT Room 02 turnover active.";
    }
    if (deptFilter === "CSSD") {
      return "↑ Instrument pack availability at 96% with 42 sterile sets ready for surgical dispatch.";
    }
    return "↑ Hospital-wide admissions increased 12.4% during peak morning intake. Net patient flow remains positive (+6).";
  };

  return (
    <div className="space-y-6 font-sans select-none pb-24 text-slate-800 dark:text-slate-100">
      
      {/* Page Header */}
      <PageHeader
        title="Analytics & Operational Intelligence"
        category="INTELLIGENCE"
        description={`Hospital throughput, capacity, utilization and bottleneck intelligence for ${HOSPITAL_NAME}.`}
        actions={
          <button
            onClick={() => setReportModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center space-x-2 active:scale-95"
          >
            <span>📊 Export Report</span>
          </button>
        }
      />

      {/* Filter Bar Toolbar */}
      <div className="p-5 rounded-3xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          {/* Filter Group 1: Time Range */}
          <div className="flex items-center space-x-3">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Time Range:</span>
            <div className="flex items-center space-x-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              {[
                { id: "24h", label: "24 Hours" },
                { id: "7d", label: "7 Days" },
                { id: "30d", label: "30 Days" },
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => setTimeRange(r.id as TimeRange)}
                  aria-label={`Select ${r.label} time range`}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                    timeRange === r.id
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Group 2: Department */}
          <div className="flex items-center space-x-3">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Department:</span>
            <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              {(["all", "Admissions", "Wards", "OT", "CSSD"] as const).map((dept) => (
                <button
                  key={dept}
                  onClick={() => setDeptFilter(dept as DepartmentFilter)}
                  aria-label={`Filter analytics by ${dept}`}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                    deptFilter === dept
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {dept === "all" ? "All Departments" : dept}
                </button>
              ))}
            </div>
          </div>

          {/* Live Indicator */}
          <div className="inline-flex items-center space-x-2 text-[11px] font-bold text-cyan-600 dark:text-cyan-400 self-end md:self-center">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>● LIVE · Updated {secondsSinceUpdate}s ago</span>
          </div>

        </div>
      </div>

      {/* 6 High Quality KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {/* KPI 1: Total Admissions */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-400 hover:-translate-y-0.5 transition-all">
          <div className="flex justify-between items-center text-xs font-extrabold text-slate-500 uppercase tracking-wider">
            <span>Admissions</span>
            <span className="text-base">🏥</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-blue-600 dark:text-cyan-400 mt-1">
            {deptFilter === "all" ? 143 : totalVal1}
          </div>
          <div className="text-[11px] font-semibold text-emerald-600 mt-1">
            +8.4% vs previous
          </div>
        </div>

        {/* KPI 2: Discharges Completed */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-400 hover:-translate-y-0.5 transition-all">
          <div className="flex justify-between items-center text-xs font-extrabold text-slate-500 uppercase tracking-wider">
            <span>Discharges</span>
            <span className="text-base">🚪</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-600 mt-1">
            {deptFilter === "all" ? 98 : totalVal2}
          </div>
          <div className="text-[11px] font-semibold text-emerald-600 mt-1">
            +5.2% vs previous
          </div>
        </div>

        {/* KPI 3: Avg Bed Occupancy */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-slate-800 shadow-xs hover:border-amber-400 hover:-translate-y-0.5 transition-all">
          <div className="flex justify-between items-center text-xs font-extrabold text-slate-500 uppercase tracking-wider">
            <span>Bed Occupancy</span>
            <span className="text-base">🛏️</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-600 mt-1">
            {bedOccupancyPct}%
          </div>
          <div className="text-[11px] font-semibold text-amber-600 mt-1">
            {occupiedBeds}/{totalBeds} beds
          </div>
        </div>

        {/* KPI 4: OT Utilization */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-slate-800 shadow-xs hover:border-purple-400 hover:-translate-y-0.5 transition-all">
          <div className="flex justify-between items-center text-xs font-extrabold text-slate-500 uppercase tracking-wider">
            <span>OT Utilization</span>
            <span className="text-base">🔬</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-purple-600 dark:text-purple-400 mt-1">
            {otUtilizationPct}%
          </div>
          <div className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 mt-1">
            +6.7% vs target
          </div>
        </div>

        {/* KPI 5: CSSD Readiness */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-slate-800 shadow-xs hover:border-cyan-400 hover:-translate-y-0.5 transition-all">
          <div className="flex justify-between items-center text-xs font-extrabold text-slate-500 uppercase tracking-wider">
            <span>CSSD Readiness</span>
            <span className="text-base">🧪</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-cyan-600 dark:text-cyan-400 mt-1">
            {cssdAvailabilityPct}%
          </div>
          <div className="text-[11px] font-semibold text-emerald-600 mt-1">
            42 packs ready
          </div>
        </div>

        {/* KPI 6: Avg Length of Stay */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-400 hover:-translate-y-0.5 transition-all">
          <div className="flex justify-between items-center text-xs font-extrabold text-slate-500 uppercase tracking-wider">
            <span>Avg Stay</span>
            <span className="text-base">⏱️</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-indigo-600 mt-1">
            4.6d
          </div>
          <div className="text-[11px] font-semibold text-emerald-600 mt-1">
            -0.3d vs baseline
          </div>
        </div>
      </div>

      {/* Main Patient Flow Throughput Chart Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <PatientFlowLineChart
          series={series}
          height={340}
          timeRange={timeRange}
          onTimeRangeChange={(r) => setTimeRange(r)}
        />

        {/* Dynamic Insight Banner */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center text-xs">
          <div className="flex items-center space-x-2 text-blue-700 dark:text-cyan-300 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 px-3.5 py-2.5 rounded-xl w-full">
            <span className="font-extrabold">💡 Operational Insight:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">{getFooterInsight()}</span>
          </div>
        </div>
      </div>

      {/* Ward Capacity Donut & Department Latency Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        
        {/* Left: Ward Capacity Component */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <WardCapacityDonut />
        </div>

        {/* Right: Department Handoff Efficiency */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Department Handoff Efficiency</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Average turnaround duration and latency delays across units</p>
            </div>

            <div className="space-y-3.5 text-xs">
              {[
                { name: "General Wards", throughput: 24, delay: 35, color: "bg-blue-600" },
                { name: "Operating Theatre", throughput: 12, delay: 20, color: "bg-emerald-500" },
                { name: "Admissions Intake", throughput: 30, delay: 45, color: "bg-amber-500" },
                { name: "CSSD Sterilization", throughput: 18, delay: 15, color: "bg-purple-600" },
              ].map((dept) => (
                <div key={dept.name} className="space-y-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between items-center font-semibold">
                    <span className="text-slate-900 dark:text-white font-extrabold">{dept.name}</span>
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">{dept.throughput} cases processed · {dept.delay} min avg delay</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div className={`h-full rounded-full ${dept.color}`} style={{ width: `${(dept.throughput / 35) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-slate-200 text-xs flex items-center justify-between font-semibold">
            <span>Overall Handoff Latency: <b className="text-slate-900 dark:text-white">28 mins</b></span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">↓ 14% Faster than benchmark</span>
          </div>
        </div>

      </div>

      {/* Executive Report Preview Modal */}
      <ReportPreviewModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        department={deptFilter === "all" ? "All Departments" : deptFilter}
        timeframe={timeRange}
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
