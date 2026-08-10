"use client";

import { useState } from "react";
import { PageShell } from "../../components/ui/PageShell";

export default function SettingsPage() {
  const [turnoverThreshold, setTurnoverThreshold] = useState("30");
  const [wardOccupancyThreshold, setWardOccupancyThreshold] = useState("80");
  const [packExpiryLeadDays, setPackExpiryLeadDays] = useState("3");
  const [autoEscalateMinutes, setAutoEscalateMinutes] = useState("15");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <PageShell title="Operational Settings & Thresholds" description="Configure hospital warning thresholds, turnover alert limits, and escalation rules.">
      <div className="card" style={{ maxWidth: "680px" }}>
        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <h3 className="font-bold text-sm" style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: "var(--space-2)" }}>
            Operational Alert Thresholds
          </h3>

          <div>
            <label className="text-xs font-semibold text-muted block mb-1">OT Turnover Alert Threshold (Minutes)</label>
            <input
              type="number"
              className="input"
              style={{ width: "100%" }}
              value={turnoverThreshold}
              onChange={(e) => setTurnoverThreshold(e.target.value)}
            />
            <span className="text-muted" style={{ fontSize: "11px" }}>
              Triggers a warning alert when room turnover between procedures exceeds this duration.
            </span>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted block mb-1">Ward High Occupancy Alert Threshold (%)</label>
            <input
              type="number"
              className="input"
              style={{ width: "100%" }}
              value={wardOccupancyThreshold}
              onChange={(e) => setWardOccupancyThreshold(e.target.value)}
            />
            <span className="text-muted" style={{ fontSize: "11px" }}>
              Triggers a capacity warning alert when ward occupancy reaches or exceeds this percentage.
            </span>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted block mb-1">CSSD Instrument Pack Expiry Warning (Days)</label>
            <input
              type="number"
              className="input"
              style={{ width: "100%" }}
              value={packExpiryLeadDays}
              onChange={(e) => setPackExpiryLeadDays(e.target.value)}
            />
            <span className="text-muted" style={{ fontSize: "11px" }}>
              Flags instrument packs as &quot;Expiring Soon&quot; when expiry date is within this lead window.
            </span>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted block mb-1">Unacknowledged Alert Auto-Escalation (Minutes)</label>
            <input
              type="number"
              className="input"
              style={{ width: "100%" }}
              value={autoEscalateMinutes}
              onChange={(e) => setAutoEscalateMinutes(e.target.value)}
            />
            <span className="text-muted" style={{ fontSize: "11px" }}>
              Escalates open critical alerts to department administrator if unacknowledged.
            </span>
          </div>

          <div className="row row-between pt-2">
            {saved ? <span className="text-xs text-success font-medium">✓ Operational thresholds saved</span> : <span></span>}
            <button type="submit" className="btn btn-primary">
              Save Thresholds
            </button>
          </div>
        </form>
      </div>
    </PageShell>
  );
}
