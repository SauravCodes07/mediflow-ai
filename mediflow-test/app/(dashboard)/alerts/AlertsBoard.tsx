"use client";

import { useEffect, useState } from "react";
import { getAlerts, updateAlertStatus, type AlertRow } from "@/lib/data/queries";

export function AlertsBoard() {
  const [alerts, setAlerts] = useState<AlertRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [actionAlert, setActionAlert] = useState<{ alert: AlertRow; action: "acknowledged" | "resolved" } | null>(null);

  useEffect(() => {
    getAlerts("org_meridian").then((data) => {
      setAlerts(data);
      setLoading(false);
    });
  }, []);

  const handleConfirmAction = async () => {
    if (!actionAlert) return;
    const updated = await updateAlertStatus("org_meridian", actionAlert.alert.id, actionAlert.action);
    if (updated) {
      setAlerts((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    }
    setActionAlert(null);
  };

  const filtered = alerts.filter((a) => {
    if (severityFilter !== "all" && a.severity !== severityFilter) return false;
    if (statusFilter !== "all" && a.status !== statusFilter) return false;
    return true;
  });

  const criticalCount = alerts.filter((a) => a.severity === "critical" && a.status !== "resolved").length;
  const warningCount = alerts.filter((a) => a.severity === "warning" && a.status !== "resolved").length;
  const openCount = alerts.filter((a) => a.status === "open").length;

  if (loading) {
    return (
      <div className="py-8 text-center text-muted">
        <span className="spinner"></span> Loading alerts...
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      {/* Critical Emergency Banner */}
      {criticalCount > 0 && (
        <div
          className="card"
          style={{
            background: "rgba(220, 38, 38, 0.08)",
            borderLeft: "4px solid var(--color-critical)",
            padding: "var(--space-3) var(--space-4)",
          }}
        >
          <div className="row row-between">
            <div className="row" style={{ gap: "var(--space-2)" }}>
              <span style={{ color: "var(--color-critical)", fontSize: "1.2rem" }}>🚨</span>
              <div>
                <strong style={{ color: "var(--color-critical)" }}>
                  {criticalCount} Critical Emergency Alert{criticalCount > 1 ? "s" : ""} Active
                </strong>
                <p className="text-xs text-muted" style={{ margin: 0 }}>
                  Immediate clinical / operational intervention required.
                </p>
              </div>
            </div>
            <button className="btn btn-outline" style={{ borderColor: "var(--color-critical)", color: "var(--color-critical)" }}>
              View Critical Alerts
            </button>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-3">
        <div className="card">
          <span className="text-muted text-xs font-medium">Critical Alerts</span>
          <h2 className="text-2xl font-bold" style={{ color: "var(--color-critical)" }}>
            {criticalCount}
          </h2>
          <span className="text-muted text-xs">Requires immediate resolution</span>
        </div>

        <div className="card">
          <span className="text-muted text-xs font-medium">Warning Alerts</span>
          <h2 className="text-2xl font-bold" style={{ color: "var(--color-warning)" }}>
            {warningCount}
          </h2>
          <span className="text-muted text-xs">Needs attention</span>
        </div>

        <div className="card">
          <span className="text-muted text-xs font-medium">Unacknowledged Open</span>
          <h2 className="text-2xl font-bold">{openCount}</h2>
          <span className="text-muted text-xs">Total open alerts</span>
        </div>
      </div>

      {/* Controls */}
      <div className="card">
        <div className="row row-between flex-wrap" style={{ gap: "var(--space-3)" }}>
          <div className="row flex-wrap" style={{ gap: "var(--space-2)" }}>
            <span className="text-xs font-semibold text-muted">Severity:</span>
            {["all", "critical", "warning", "info"].map((sev) => (
              <button
                key={sev}
                className={`btn btn-sm ${severityFilter === sev ? "btn-primary" : "btn-outline"}`}
                onClick={() => setSeverityFilter(sev)}
                style={{ textTransform: "capitalize" }}
              >
                {sev}
              </button>
            ))}
          </div>

          <div className="row flex-wrap" style={{ gap: "var(--space-2)" }}>
            <span className="text-xs font-semibold text-muted">Status:</span>
            {["all", "open", "acknowledged", "resolved"].map((st) => (
              <button
                key={st}
                className={`btn btn-sm ${statusFilter === st ? "btn-primary" : "btn-outline"}`}
                onClick={() => setStatusFilter(st)}
                style={{ textTransform: "capitalize" }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts List Table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="table" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--color-bg)", borderBottom: "1px solid var(--color-border)" }}>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted">Severity</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted">Title & Description</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted">Assigned To</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted">Created</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-muted text-sm">
                  No alerts matching the selected filters.
                </td>
              </tr>
            ) : (
              filtered.map((alert) => (
                <tr key={alert.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                  <td className="px-4 py-3">
                    <span
                      className={`badge ${
                        alert.severity === "critical"
                          ? "badge-critical"
                          : alert.severity === "warning"
                          ? "badge-warning"
                          : "badge-info"
                      }`}
                      style={{ textTransform: "uppercase", fontSize: "10px" }}
                    >
                      {alert.severity === "critical" ? "🚨 Critical" : alert.severity === "warning" ? "⚠️ Warning" : "ℹ️ Info"}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="font-semibold text-sm">{alert.title}</div>
                    <p className="text-xs text-muted" style={{ margin: "2px 0 0 0" }}>
                      {alert.description}
                    </p>
                  </td>

                  <td className="px-4 py-3 text-xs">
                    {alert.assignedProfileName ? (
                      <span className="badge badge-neutral">{alert.assignedProfileName}</span>
                    ) : (
                      <span className="text-muted">Unassigned</span>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`badge ${
                        alert.status === "open"
                          ? "badge-warning"
                          : alert.status === "acknowledged"
                          ? "badge-info"
                          : "badge-success"
                      }`}
                      style={{ textTransform: "capitalize", fontSize: "11px" }}
                    >
                      {alert.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-xs text-muted">
                    {new Date(alert.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="row justify-end" style={{ gap: "var(--space-2)" }}>
                      {alert.status === "open" && (
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => setActionAlert({ alert, action: "acknowledged" })}
                        >
                          Acknowledge
                        </button>
                      )}
                      {alert.status !== "resolved" && (
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => setActionAlert({ alert, action: "resolved" })}
                        >
                          Resolve
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      {actionAlert && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div className="card shadow-lg" style={{ width: "400px", padding: "var(--space-4)" }}>
            <h3 className="font-bold text-lg mb-2" style={{ textTransform: "capitalize" }}>
              Confirm {actionAlert.action}
            </h3>
            <p className="text-xs text-muted mb-4">
              Are you sure you want to mark alert &quot;{actionAlert.alert.title}&quot; as {actionAlert.action}?
            </p>
            <div className="row justify-end" style={{ gap: "var(--space-2)" }}>
              <button className="btn btn-outline" onClick={() => setActionAlert(null)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleConfirmAction}>
                Confirm {actionAlert.action}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
