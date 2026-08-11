"use client";

import { useState } from "react";
import { useOperationalData, TimeRange, DepartmentFilter } from "@/lib/data/operational-context";
import { PatientFlowLineChart } from "@/app/components/charts/PatientFlowLineChart";
import { WardCapacityDonut } from "@/app/components/charts/WardCapacityDonut";
import { ReportPreviewModal } from "@/app/components/reports/ReportPreviewModal";
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
  } = useOperationalData();

  const [reportModalOpen, setReportModalOpen] = useState(false);

  const series = getTimeSeries();

  // Dynamically compute totals and averages based on active time range & series data
  const totalVal1 = series.reduce((sum, p) => sum + (p.series1Val ?? p.admissions), 0);
  const totalVal2 = series.reduce((sum, p) => sum + (p.series2Val ?? p.discharges), 0);

  // Dynamic Chart Header Title by Department
  const getChartTitle = () => {
    if (deptFilter === "Admissions") return "Admissions Intake Throughput & Consent Clearance";
    if (deptFilter === "Wards") return "Ward Occupancy & Inter-Unit Patient Transfers";
    if (deptFilter === "OT") return "Operating Theatre Utilization & Turnover Latency";
    if (deptFilter === "CSSD") return "CSSD Pack Readiness & Sterilization Batches";
    return "Hospital-Wide Throughput & Patient Flow Analytics";
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
    <div className="space-y-6 font-sans">
      {/* Analytics Command Center Header & Filter Bar */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight font-sans">
                Analytics & Operational Intelligence
              </h2>
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-xs font-semibold text-emerald-700">● LIVE</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Executive KPIs, department turnover latency, throughput trends, and bottleneck insights for {HOSPITAL_NAME}. Updated {secondsSinceUpdate} sec ago.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setReportModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center space-x-2"
            >
              <span>📊 Export Executive Report</span>
            </button>
          </div>
        </div>

        {/* Dynamic Controls Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Time Range Filter (24H, 7D, 30D) */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Time Range:</span>
            <div className="flex items-center space-x-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
              {[
                { id: "24h", label: "24 Hours" },
                { id: "7d", label: "7 Days" },
                { id: "30d", label: "30 Days" },
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => setTimeRange(r.id as TimeRange)}
                  aria-label={`Select ${r.label} time range`}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    timeRange === r.id
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
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
                  aria-label={`Filter analytics by ${dept}`}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    deptFilter === dept
                      ? "bg-slate-900 text-white shadow-sm font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                  }`}
                >
                  {dept === "all" ? "All Departments" : dept}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Department-Reactive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI Card 1 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 transform hover:-translate-y-0.5">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            {deptFilter === "Admissions"
              ? `Total Intake (${timeRange.toUpperCase()})`
              : deptFilter === "Wards"
              ? "Avg Ward Bed Occupancy"
              : deptFilter === "OT"
              ? "Avg OT Utilization"
              : deptFilter === "CSSD"
              ? "Pack Readiness Rate"
              : `Total Admissions (${timeRange.toUpperCase()})`}
          </div>
          <div className="text-3xl font-extrabold text-blue-600">
            {deptFilter === "Wards"
              ? `${bedOccupancyPct}%`
              : deptFilter === "OT"
              ? `${otUtilizationPct}%`
              : deptFilter === "CSSD"
              ? `${cssdAvailabilityPct}%`
              : totalVal1}
          </div>
          <div className="text-xs text-slate-500 mt-1 font-medium">
            {deptFilter === "Wards"
              ? `${occupiedBeds} of ${totalBeds} beds occupied`
              : deptFilter === "OT"
              ? "4 active surgical rooms"
              : deptFilter === "CSSD"
              ? "42 sterile packs available"
              : `Secondary total: ${totalVal2} processed`}
          </div>
        </div>

        {/* KPI Card 2 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all duration-200 transform hover:-translate-y-0.5">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            {deptFilter === "Wards"
              ? "Ward Patient Transfers"
              : deptFilter === "OT"
              ? "Active Procedures"
              : deptFilter === "CSSD"
              ? "Sterilization Batches"
              : "Discharges Completed"}
          </div>
          <div className="text-3xl font-extrabold text-emerald-600">
            {deptFilter === "Wards" ? "17" : deptFilter === "OT" ? "4 Cases" : deptFilter === "CSSD" ? "12 Batches" : totalVal2}
          </div>
          <div className="text-xs text-slate-500 mt-1 font-medium">
            {deptFilter === "Wards" ? "Between Ward A & C" : "Running on schedule"}
          </div>
        </div>

        {/* KPI Card 3 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-200 transform hover:-translate-y-0.5">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            {deptFilter === "OT" ? "Turnover Latency" : "Net Flow Variance"}
          </div>
          <div className="text-3xl font-extrabold text-indigo-600">
            {deptFilter === "OT" ? "22 mins" : `+${totalVal1 - totalVal2}`}
          </div>
          <div className="text-xs text-slate-500 mt-1 font-medium">
            {deptFilter === "OT" ? "↓ 4 mins faster" : "Positive operational balance"}
          </div>
        </div>

        {/* KPI Card 4 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-300 transition-all duration-200 transform hover:-translate-y-0.5">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            System Reliability
          </div>
          <div className="text-3xl font-extrabold text-amber-600">99.8%</div>
          <div className="text-xs text-slate-500 mt-1 font-medium">Zero data latency</div>
        </div>
      </div>

      {/* Main Interactive Multi-Series Chart Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">{getChartTitle()}</h3>
            <p className="text-xs text-slate-500 font-medium">
              Hover across canvas for vertical crosshair tracking & exact department values.
            </p>
          </div>
        </div>

        {/* Patient Flow Line Chart Component */}
        <PatientFlowLineChart series={series} height={320} />

        {/* Data-Driven Dynamic Footer Insight Bar */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-blue-700 bg-blue-50/70 border border-blue-200 px-3.5 py-2 rounded-xl w-full">
            <span className="font-bold text-blue-800">💡 Operational Insight:</span>
            <span className="font-semibold text-slate-700">{getFooterInsight()}</span>
          </div>
        </div>
      </div>

      {/* Ward Capacity Donut Visualization Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Ward Capacity Breakdown</h3>
            <p className="text-xs text-slate-500 font-medium">Two-way interactive donut & bed occupancy table sync</p>
          </div>
          <WardCapacityDonut />
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900">Department Handoff Efficiency</h3>
              <p className="text-xs text-slate-500 font-medium">Average turnarounds and latency delays across units</p>
            </div>

            <div className="space-y-4 text-xs">
              {[
                { name: "General Wards", throughput: 24, delay: 35, color: "bg-blue-600" },
                { name: "Operating Theatre", throughput: 12, delay: 20, color: "bg-emerald-500" },
                { name: "Admissions Intake", throughput: 30, delay: 45, color: "bg-amber-500" },
                { name: "CSSD Sterilization", throughput: 18, delay: 15, color: "bg-purple-600" },
              ].map((dept) => (
                <div key={dept.name} className="space-y-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex justify-between items-center font-semibold">
                    <span className="text-slate-900 font-bold">{dept.name}</span>
                    <span className="text-slate-500">{dept.throughput} cases processed · {dept.delay} min avg delay</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div className={`h-full rounded-full ${dept.color}`} style={{ width: `${(dept.throughput / 35) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center justify-between">
            <span className="font-semibold">Overall Handoff Latency: <strong className="text-blue-900">28 mins</strong></span>
            <span className="font-bold text-emerald-700">↓ 14% Faster than benchmark</span>
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
