"use client";

import { useEffect, useState } from "react";
import { PageShell } from "../../components/ui/PageShell";
import { getAuditLogs, type AuditLogRow } from "@/lib/data/queries";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getAuditLogs("org_meridian").then((res) => {
      setLogs(res);
      setLoading(false);
    });
  }, []);

  const filtered = logs.filter((log) =>
    log.action.toLowerCase().includes(search.toLowerCase()) ||
    log.actorName.toLowerCase().includes(search.toLowerCase()) ||
    log.entityType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageShell title="Audit Trail & Security Logs" description="Immutable, timestamped audit records of system state changes, alert resolutions, and user actions.">
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        <div className="card">
          <div className="row row-between flex-wrap" style={{ gap: "var(--space-3)" }}>
            <input
              className="input"
              style={{ width: "300px" }}
              placeholder="Search audit logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="text-xs text-muted font-medium">{filtered.length} Audit Entries Recorded</span>
          </div>
        </div>

        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          {loading ? (
            <div className="py-6 text-center text-muted">Loading audit logs...</div>
          ) : (
            <table className="table" style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--color-bg)", borderBottom: "1px solid var(--color-border)" }}>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted">Log ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted">Timestamp (UTC)</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted">Actor</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted">Action Executed</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted">Target Entity</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-muted text-xs">
                      No audit log entries matching &quot;{search}&quot;.
                    </td>
                  </tr>
                ) : (
                  filtered.map((log) => (
                    <tr key={log.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                      <td className="px-4 py-3 text-xs font-mono">{log.id}</td>
                      <td className="px-4 py-3 text-xs text-muted">{new Date(log.occurredAt).toLocaleString()}</td>
                      <td className="px-4 py-3 text-xs font-semibold">{log.actorName}</td>
                      <td className="px-4 py-3 text-xs font-medium text-primary">{log.action}</td>
                      <td className="px-4 py-3 text-xs">
                        <span className="badge badge-neutral" style={{ textTransform: "uppercase", fontSize: "10px" }}>
                          {log.entityType}: {log.entityId}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </PageShell>
  );
}
