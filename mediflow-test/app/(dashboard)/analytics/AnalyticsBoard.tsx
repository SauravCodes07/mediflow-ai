"use client";

import { useEffect, useState } from "react";
import { getAnalyticsSummary, type AnalyticsSummary } from "@/lib/data/queries";

export function AnalyticsBoard() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("7d");
  const [deptFilter, setDeptFilter] = useState("all");

  useEffect(() => {
    getAnalyticsSummary("org_meridian").then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading || !data) {
    return (
      <div className="py-8 text-center text-muted">
        <span className="spinner"></span> Loading analytics data...
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      {/* Filters Bar */}
      <div className="card">
        <div className="row row-between flex-wrap" style={{ gap: "var(--space-3)" }}>
          <div className="row flex-wrap" style={{ gap: "var(--space-2)" }}>
            <span className="text-xs font-semibold text-muted">Time Range:</span>
            {[
              { id: "today", label: "Today" },
              { id: "7d", label: "Last 7 Days" },
              { id: "30d", label: "Last 30 Days" },
            ].map((r) => (
              <button
                key={r.id}
                className={`btn btn-sm ${dateRange === r.id ? "btn-primary" : "btn-outline"}`}
                onClick={() => setDateRange(r.id)}
              >
                {r.label}
              </button>
            ))}
          </div>

          <div className="row flex-wrap" style={{ gap: "var(--space-2)" }}>
            <span className="text-xs font-semibold text-muted">Department:</span>
            {["all", "Wards", "OT", "Admissions", "CSSD"].map((dep) => (
              <button
                key={dep}
                className={`btn btn-sm ${deptFilter === dep ? "btn-primary" : "btn-outline"}`}
                onClick={() => setDeptFilter(dep)}
              >
                {dep === "all" ? "All Departments" : dep}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-4">
        <div className="card">
          <span className="text-muted text-xs font-medium">OT Utilization Rate</span>
          <h2 className="text-2xl font-bold text-primary">{data.otUtilizationPct}%</h2>
          <span className="text-muted text-xs">Target: &gt;75%</span>
        </div>

        <div className="card">
          <span className="text-muted text-xs font-medium">Avg Turnover Duration</span>
          <h2 className="text-2xl font-bold">{data.avgTurnoverMinutes} min</h2>
          <span className="text-muted text-xs">Between procedures</span>
        </div>

        <div className="card">
          <span className="text-muted text-xs font-medium">Admissions Throughput</span>
          <h2 className="text-2xl font-bold text-success">{data.admissionsThroughputToday}</h2>
          <span className="text-muted text-xs">Patients processed</span>
        </div>

        <div className="card">
          <span className="text-muted text-xs font-medium">CSSD Pack Availability</span>
          <h2 className="text-2xl font-bold text-teal">{data.cssdAvailabilityPct}%</h2>
          <span className="text-muted text-xs">Ready for OT use</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-2">
        {/* Weekly Admissions Bar Chart */}
        <div className="card">
          <h3 className="font-semibold text-sm mb-4">Admissions vs Discharges (Weekly)</h3>
          <div style={{ height: "200px", display: "flex", alignItems: "flex-end", gap: "var(--space-3)", paddingBottom: "20px" }}>
            {data.weeklyAdmissions.map((item) => (
              <div key={item.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                <div style={{ width: "100%", display: "flex", gap: "2px", alignItems: "flex-end", height: "160px" }}>
                  <div
                    style={{
                      flex: 1,
                      height: `${(item.admissions / 30) * 100}%`,
                      background: "var(--color-primary)",
                      borderRadius: "2px 2px 0 0",
                    }}
                    title={`Admissions: ${item.admissions}`}
                  ></div>
                  <div
                    style={{
                      flex: 1,
                      height: `${(item.discharges / 30) * 100}%`,
                      background: "var(--color-teal)",
                      borderRadius: "2px 2px 0 0",
                    }}
                    title={`Discharges: ${item.discharges}`}
                  ></div>
                </div>
                <span className="text-muted text-xs">{item.day}</span>
              </div>
            ))}
          </div>
          <div className="row justify-center" style={{ gap: "var(--space-4)" }}>
            <span className="row text-xs text-muted" style={{ gap: "6px" }}>
              <span style={{ width: "10px", height: "10px", background: "var(--color-primary)", borderRadius: "2px" }}></span> Admissions
            </span>
            <span className="row text-xs text-muted" style={{ gap: "6px" }}>
              <span style={{ width: "10px", height: "10px", background: "var(--color-teal)", borderRadius: "2px" }}></span> Discharges
            </span>
          </div>
        </div>

        {/* Department Latency / Handoff Breakdown */}
        <div className="card">
          <h3 className="font-semibold text-sm mb-4">Department Throughput & Handoff Delay</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            {data.departmentComparison.map((dept) => (
              <div key={dept.name}>
                <div className="row row-between mb-1 text-xs">
                  <span className="font-medium">{dept.name}</span>
                  <span className="text-muted">{dept.throughput} cases ({dept.delayMinutes} min avg delay)</span>
                </div>
                <div style={{ background: "var(--color-bg)", height: "8px", borderRadius: "4px", overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${(dept.throughput / 40) * 100}%`,
                      height: "100%",
                      background: dept.delayMinutes > 30 ? "var(--color-warning)" : "var(--color-primary)",
                      borderRadius: "4px",
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
