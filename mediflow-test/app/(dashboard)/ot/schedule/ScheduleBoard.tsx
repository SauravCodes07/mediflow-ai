"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Badge } from "../../../components/ui/Badge";
import { Card } from "../../../components/ui/Card";
import { EmptyState } from "../../../components/ui/EmptyState";
import type { ProcedureRow } from "../../../../lib/data/queries";

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

export function ScheduleBoard({ procedures }: { procedures: ProcedureRow[] }) {
  const [roomFilter, setRoomFilter] = useState("all");
  const rooms = useMemo(() => Array.from(new Set(procedures.map((p) => p.roomName))), [procedures]);
  const filtered = roomFilter === "all" ? procedures : procedures.filter((p) => p.roomName === roomFilter);

  return (
    <div className="stack" style={{ gap: "var(--space-4)" }}>
      <Card>
        <select className="select" style={{ maxWidth: 220 }} value={roomFilter} onChange={(e) => setRoomFilter(e.target.value)} aria-label="Filter by room">
          <option value="all">All rooms</option>
          {rooms.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState icon="⌕" title="No procedures scheduled" description="Scheduled procedures will appear here." />
        </Card>
      ) : (
        <div className="table-wrap">
          <table className="dt">
            <thead>
              <tr>
                <th>Procedure</th>
                <th>Patient</th>
                <th>Room</th>
                <th>Surgeon</th>
                <th>Stage</th>
                <th>Scheduled</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} style={p.isDelayed ? { background: "var(--color-critical-bg)" } : undefined}>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td className="text-meta">{p.patientName}</td>
                  <td className="text-meta">{p.roomName}</td>
                  <td className="text-meta">{p.surgeon}</td>
                  <td>
                    <Badge tone={p.isDelayed ? "critical" : "neutral"}>{p.stage.replace("_", " ")}</Badge>
                  </td>
                  <td className="text-meta">{formatTime(p.scheduledStart)}</td>
                  <td>
                    <Link href={`/ot/${p.id}`} className="btn btn-ghost btn-sm">
                      View →
                    </Link>
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
