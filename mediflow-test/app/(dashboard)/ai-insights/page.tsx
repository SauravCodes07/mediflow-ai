"use client";

import { PageShell } from "../../components/ui/PageShell";

const INSIGHTS = [
  {
    title: "OT 2 Turnover Overrun Bottleneck",
    category: "Surgical Workflow",
    severity: "High Impact",
    summary: "Turnover between Knee Replacement and Hernia Repair exceeded baseline by 20 minutes due to instrument pack delay from CSSD.",
    recommendation: "Pre-reserve Sterilization Batch STZ-0809-B for afternoon cases.",
  },
  {
    title: "Ward A Bed Capacity Warning",
    category: "Inpatient Wards",
    severity: "Medium Impact",
    summary: "Ward A occupancy reached 75% with 2 patient transfer requests pending from Admissions.",
    recommendation: "Expedite bed cleaning on A-2 to clear transfer queue.",
  },
  {
    title: "CSSD Expired Pack Replacement Required",
    category: "Sterile Inventory",
    severity: "Critical",
    summary: "Pack GEN-SET-09 expired on 2026-08-07 and cannot be assigned to upcoming OT 3 cases.",
    recommendation: "Process reprocessing cycle immediately before 14:00 surgery.",
  },
];

export default function AIInsightsPage() {
  return (
    <PageShell title="AI Insights & Automated Bottleneck Summaries" description="Real-time clinical intelligence automatically extracted from hospital workflow telemetry.">
      <div className="grid grid-3">
        {INSIGHTS.map((item, idx) => (
          <div key={idx} className="card">
            <div className="row row-between mb-2">
              <span className="badge badge-neutral" style={{ fontSize: "10px" }}>{item.category}</span>
              <span className={`badge ${item.severity === "Critical" ? "badge-critical" : "badge-warning"}`} style={{ fontSize: "10px" }}>
                {item.severity}
              </span>
            </div>
            <h3 className="font-bold text-sm mb-2">{item.title}</h3>
            <p className="text-xs text-muted mb-3">{item.summary}</p>
            <div style={{ background: "var(--color-bg)", padding: "var(--space-2) var(--space-3)", borderRadius: "var(--radius-sm)" }}>
              <span className="text-xs font-semibold text-primary block mb-1">💡 AI Recommendation:</span>
              <span className="text-xs text-muted">{item.recommendation}</span>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
