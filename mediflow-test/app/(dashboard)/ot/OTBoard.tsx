"use client";

import Link from "next/link";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { EmptyState } from "../../components/ui/EmptyState";
import type { OTRoomRow } from "../../../lib/data/queries";

const STATUS_TONE: Record<string, "success" | "warning" | "critical" | "info" | "neutral"> = {
  available: "success",
  preparation: "info",
  in_procedure: "critical",
  turnover: "warning",
  closed: "neutral",
};

export function OTBoard({ rooms }: { rooms: OTRoomRow[] }) {
  if (rooms.length === 0) {
    return (
      <Card>
        <EmptyState icon="⌗" title="No operating rooms configured" description="Rooms will appear here once set up in Hospital Administration." />
      </Card>
    );
  }

  return (
    <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "var(--space-4)" }}>
      {rooms.map((room) => (
        <Card key={room.id}>
          <div className="row" style={{ justifyContent: "space-between", marginBottom: "var(--space-3)" }}>
            <strong style={{ color: "var(--color-navy)", fontSize: "var(--fs-lg)" }}>{room.name}</strong>
            <Badge tone={STATUS_TONE[room.status] ?? "neutral"}>{room.status.replace("_", " ")}</Badge>
          </div>
          {room.currentProcedure ? (
            <div className="stack" style={{ gap: "var(--space-1)" }}>
              <span style={{ fontWeight: 600 }}>{room.currentProcedure.name}</span>
              <span className="text-meta">{room.currentProcedure.patientName}</span>
              <span className="text-meta">Surgeon: {room.currentProcedure.surgeon}</span>
              <span className="text-meta">Stage: {room.currentProcedure.stage.replace("_", " ")}</span>
              {room.currentProcedure.delayReason && (
                <span className="text-meta" style={{ color: "var(--color-critical)" }}>
                  ⚠ {room.currentProcedure.delayReason}
                </span>
              )}
              <Link href={`/ot/${room.currentProcedure.id}`} className="btn btn-ghost btn-sm" style={{ alignSelf: "flex-start", marginTop: "var(--space-2)" }}>
                View case →
              </Link>
            </div>
          ) : (
            <span className="text-meta">No active case.</span>
          )}
        </Card>
      ))}
    </div>
  );
}
