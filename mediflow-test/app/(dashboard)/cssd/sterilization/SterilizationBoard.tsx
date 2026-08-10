"use client";

import { Badge } from "../../../components/ui/Badge";
import { Card } from "../../../components/ui/Card";
import { EmptyState } from "../../../components/ui/EmptyState";
import type { SterilizationBatchRow } from "../../../../lib/data/queries";

const STATUS_TONE: Record<string, "success" | "warning" | "critical" | "info" | "neutral"> = {
  in_cycle: "info",
  released: "success",
  held: "warning",
  failed: "critical",
};

function formatTime(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

export function SterilizationBoard({ batches }: { batches: SterilizationBatchRow[] }) {
  if (batches.length === 0) {
    return (
      <Card>
        <EmptyState icon="⌗" title="No sterilization batches yet" description="Batches will appear here once a cycle is started." />
      </Card>
    );
  }

  return (
    <div className="table-wrap">
      <table className="dt">
        <thead>
          <tr>
            <th>Batch</th>
            <th>Status</th>
            <th>Packs</th>
            <th>Started</th>
            <th>Completed</th>
            <th>Cycle time</th>
          </tr>
        </thead>
        <tbody>
          {batches.map((b) => (
            <tr key={b.id} style={b.status === "held" || b.status === "failed" ? { background: "var(--color-critical-bg)" } : undefined}>
              <td style={{ fontWeight: 600 }}>{b.batchCode}</td>
              <td>
                <Badge tone={STATUS_TONE[b.status] ?? "neutral"}>{b.status.replace("_", " ")}</Badge>
              </td>
              <td className="text-meta">{b.packCodes.join(", ")}</td>
              <td className="text-meta">{formatTime(b.startedAt)}</td>
              <td className="text-meta">{formatTime(b.completedAt)}</td>
              <td className="text-meta">{b.cycleMinutes !== null ? `${b.cycleMinutes} min` : "In progress"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
