import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "../../../components/ui/PageHeader";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { EmptyState } from "../../../components/ui/EmptyState";
import { getProcedureDetail, getCurrentOrgId } from "../../../../lib/data/queries";

const STAGE_TONE: Record<string, "success" | "warning" | "critical" | "info" | "neutral"> = {
  preparation: "info",
  ready: "info",
  in_room: "warning",
  procedure: "critical",
  closing: "warning",
  turnover: "warning",
  available: "success",
};

function formatTime(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default async function OtCaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const orgId = await getCurrentOrgId();
  const procedure = await getProcedureDetail(orgId, id);

  if (!procedure) notFound();

  return (
    <div className="stack" style={{ gap: "var(--space-6)" }}>
      <PageHeader
        title={procedure.name}
        description={`${procedure.roomName} · Surgeon: ${procedure.surgeon}`}
        actions={
          <Link href="/ot" className="btn btn-secondary btn-sm">
            ← Back to OT overview
          </Link>
        }
      />

      <div className="grid grid-2" style={{ alignItems: "start" }}>
        <Card>
          <div className="text-label">Case status</div>
          <div className="stack" style={{ gap: "var(--space-2)", marginTop: "var(--space-3)" }}>
            <Badge tone={STAGE_TONE[procedure.stage] ?? "neutral"}>{procedure.stage.replace("_", " ")}</Badge>
            <Link href={`/patients/${procedure.patientId}`} className="text-meta" style={{ color: "var(--color-primary)", fontWeight: 600 }}>
              Patient: {procedure.patientName} →
            </Link>
            <span className="text-meta">
              Scheduled: {formatTime(procedure.scheduledStart)} – {formatTime(procedure.scheduledEnd)}
            </span>
            <span className="text-meta">Actual start: {formatTime(procedure.actualStart)}</span>
            <span className="text-meta">Actual end: {formatTime(procedure.actualEnd)}</span>
            {procedure.delayReason && (
              <span className="text-meta" style={{ color: "var(--color-critical)" }}>
                ⚠ {procedure.delayReason}
              </span>
            )}
          </div>
        </Card>

        <Card>
          <div className="text-label">Room</div>
          <div className="stack" style={{ gap: "var(--space-2)", marginTop: "var(--space-3)" }}>
            <strong style={{ color: "var(--color-navy)" }}>{procedure.roomName}</strong>
            <span className="text-meta">Instrument pack assignment for this case is tracked from CSSD.</span>
          </div>
        </Card>
      </div>

      <Card>
        <div className="text-label" style={{ marginBottom: "var(--space-4)" }}>
          Procedure timeline
        </div>
        {procedure.timeline.length === 0 ? (
          <EmptyState icon="⧗" title="No events yet" description="Timeline events will appear here as this case progresses through its stages." />
        ) : (
          <div className="stack" style={{ gap: "var(--space-4)" }}>
            {procedure.timeline.map((event) => (
              <div key={event.id} className="row" style={{ gap: "var(--space-4)", alignItems: "flex-start" }}>
                <span className="text-meta" style={{ minWidth: 120 }}>
                  {formatTime(event.occurredAt)}
                </span>
                <span>{event.message}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
