"use client";

import { useState } from "react";

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
  const [selectedReport, setSelectedReport] = useState<ReportItem>(REPORTS[0]);
  const [dateRange, setDateRange] = useState("today");
  const [dept, setDept] = useState("all");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState<{
    title: string;
    generatedAt: string;
    metrics: { label: string; value: string | number }[];
    tableRows: { col1: string; col2: string; col3: string; col4: string }[];
  } | null>(null);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedData({
        title: selectedReport.title,
        generatedAt: new Date().toLocaleString(),
        metrics: [
          { label: "Total Cases Processed", value: 42 },
          { label: "OT Utilization Rate", value: "83%" },
          { label: "Avg Readiness Time", value: "35 min" },
          { label: "Alert Resolution Rate", value: "96%" },
        ],
        tableRows: [
          { col1: "ADM-1001", col2: "Ravi Deshmukh", col3: "Ward A", col4: "Completed" },
          { col1: "ADM-1002", col2: "Meera Joshi", col3: "Ward B", col4: "In Procedure" },
          { col1: "ADM-1003", col2: "Arjun Nair", col3: "Admissions", col4: "Blocked (Consent)" },
          { col1: "ADM-1005", col2: "Wei Chen", col3: "Ward A", col4: "In Transit" },
        ],
      });
      setIsGenerating(false);
    }, 400);
  };

  const handleDownloadCSV = () => {
    if (!generatedData) return;
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["ID,Patient Name,Department/Ward,Status", ...generatedData.tableRows.map((r) => `${r.col1},${r.col2},${r.col3},${r.col4}`)].join(
        "\n"
      );
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${selectedReport.kind}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      {/* Report Selection Grid */}
      <div className="grid grid-3">
        {REPORTS.map((rep) => (
          <div
            key={rep.id}
            className={`card ${selectedReport.id === rep.id ? "card-selected" : ""}`}
            style={{
              cursor: "pointer",
              border: selectedReport.id === rep.id ? "2px solid var(--color-primary)" : "1px solid var(--color-border)",
            }}
            onClick={() => setSelectedReport(rep)}
          >
            <div className="row" style={{ gap: "var(--space-3)", marginBottom: "var(--space-2)" }}>
              <span style={{ fontSize: "1.5rem" }}>{rep.icon}</span>
              <h3 className="font-semibold text-sm">{rep.title}</h3>
            </div>
            <p className="text-xs text-muted" style={{ margin: 0 }}>
              {rep.description}
            </p>
          </div>
        ))}
      </div>

      {/* Filter & Action Controls */}
      <div className="card">
        <div className="row row-between flex-wrap" style={{ gap: "var(--space-3)" }}>
          <div className="row flex-wrap" style={{ gap: "var(--space-3)" }}>
            <div>
              <label className="text-xs text-muted block mb-1 font-medium">Date Range</label>
              <select
                className="input"
                style={{ padding: "4px 8px", fontSize: "0.85rem" }}
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-muted block mb-1 font-medium">Department</label>
              <select
                className="input"
                style={{ padding: "4px 8px", fontSize: "0.85rem" }}
                value={dept}
                onChange={(e) => setDept(e.target.value)}
              >
                <option value="all">All Departments</option>
                <option value="wards">General Wards</option>
                <option value="ot">Operating Theatre</option>
                <option value="cssd">CSSD</option>
                <option value="admissions">Admissions</option>
              </select>
            </div>
          </div>

          <button className="btn btn-primary" onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? "Generating..." : "Generate Preview"}
          </button>
        </div>
      </div>

      {/* Generated Report Preview Screen */}
      {generatedData && (
        <div className="card" style={{ padding: "var(--space-5)", background: "#fff" }} id="printable-report">
          <div className="row row-between mb-4 pb-3" style={{ borderBottom: "2px solid var(--color-border)" }}>
            <div>
              <h2 className="text-xl font-bold">{generatedData.title}</h2>
              <span className="text-xs text-muted">Generated: {generatedData.generatedAt} | Meridian General Hospital</span>
            </div>
            <div className="row" style={{ gap: "var(--space-2)" }}>
              <button className="btn btn-sm btn-outline" onClick={handleDownloadCSV}>
                📄 Export CSV
              </button>
              <button className="btn btn-sm btn-primary" onClick={handlePrint}>
                🖨️ Print / Save PDF
              </button>
            </div>
          </div>

          {/* Metrics summary */}
          <div className="grid grid-4 mb-4">
            {generatedData.metrics.map((m, i) => (
              <div key={i} style={{ background: "var(--color-bg)", padding: "var(--space-3)", borderRadius: "var(--radius-sm)" }}>
                <span className="text-xs text-muted">{m.label}</span>
                <div className="text-lg font-bold text-primary">{m.value}</div>
              </div>
            ))}
          </div>

          {/* Table view */}
          <table className="table" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--color-bg)", borderBottom: "1px solid var(--color-border)" }}>
                <th className="px-3 py-2 text-left text-xs font-semibold">Record ID</th>
                <th className="px-3 py-2 text-left text-xs font-semibold">Patient / Subject</th>
                <th className="px-3 py-2 text-left text-xs font-semibold">Location / Dept</th>
                <th className="px-3 py-2 text-left text-xs font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {generatedData.tableRows.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid var(--color-border)" }}>
                  <td className="px-3 py-2 text-xs font-mono">{row.col1}</td>
                  <td className="px-3 py-2 text-xs font-medium">{row.col2}</td>
                  <td className="px-3 py-2 text-xs">{row.col3}</td>
                  <td className="px-3 py-2 text-xs">
                    <span className="badge badge-neutral">{row.col4}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
