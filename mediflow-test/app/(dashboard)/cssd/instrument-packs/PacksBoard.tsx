"use client";

import { useMemo, useState } from "react";
import { Badge } from "../../../components/ui/Badge";
import { Card } from "../../../components/ui/Card";
import { EmptyState } from "../../../components/ui/EmptyState";
import type { InstrumentPackRow } from "../../../../lib/data/queries";

const LIFECYCLE_TONE: Record<string, "success" | "warning" | "critical" | "info" | "neutral"> = {
  available: "success",
  reserved: "info",
  in_use: "info",
  returned: "neutral",
  reprocessing: "warning",
  held: "warning",
  expired: "critical",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export function PacksBoard({ packs }: { packs: InstrumentPackRow[] }) {
  const [lifecycleFilter, setLifecycleFilter] = useState("all");
  const lifecycles = useMemo(() => Array.from(new Set(packs.map((p) => p.lifecycle))), [packs]);
  const filtered = lifecycleFilter === "all" ? packs : packs.filter((p) => p.lifecycle === lifecycleFilter);

  return (
    <div className="stack" style={{ gap: "var(--space-4)" }}>
      <Card>
        <select className="select" style={{ maxWidth: 220 }} value={lifecycleFilter} onChange={(e) => setLifecycleFilter(e.target.value)} aria-label="Filter by lifecycle state">
          <option value="all">All lifecycle states</option>
          {lifecycles.map((l) => (
            <option key={l} value={l}>
              {l.replace("_", " ")}
            </option>
          ))}
        </select>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState icon="⌕" title="No packs found" description="Try a different lifecycle filter." />
        </Card>
      ) : (
        <div className="table-wrap">
          <table className="dt">
            <thead>
              <tr>
                <th>Pack</th>
                <th>Lifecycle</th>
                <th>Expiry</th>
                <th>Assigned room</th>
                <th>Availability</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} style={p.blockedFromUse ? { background: "var(--color-critical-bg)" } : undefined}>
                  <td style={{ fontWeight: 600 }}>
                    {p.code} · {p.name}
                  </td>
                  <td>
                    <Badge tone={LIFECYCLE_TONE[p.lifecycle] ?? "neutral"}>{p.lifecycle.replace("_", " ")}</Badge>
                  </td>
                  <td className="text-meta">
                    {formatDate(p.expiresAt)}
                    {p.isExpired && (
                      <span style={{ color: "var(--color-critical)" }}> · expired</span>
                    )}
                    {!p.isExpired && p.expiringSoon && (
                      <span style={{ color: "var(--color-warning)" }}> · expiring soon</span>
                    )}
                  </td>
                  <td className="text-meta">{p.assignedRoomName ?? "Unassigned"}</td>
                  <td>
                    {p.blockedFromUse ? (
                      <Badge tone="critical">Blocked from use</Badge>
                    ) : (
                      <Badge tone="success">Available for assignment</Badge>
                    )}
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
