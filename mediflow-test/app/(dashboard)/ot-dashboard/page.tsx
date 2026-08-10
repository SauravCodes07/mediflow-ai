import Link from "next/link";
import { PageHeader } from "../../components/ui/PageHeader";
import { StatCard } from "../../components/ui/StatCard";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { EmptyState } from "../../components/ui/EmptyState";
import { getOTDashboard, getCurrentOrgId } from "../../../lib/data/queries";
import type { ProcedureRow } from "../../../lib/data/queries";

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

function ProcedureList({ items, emptyLabel }: { items: ProcedureRow[]; emptyLabel: string }) {
  if (items.length === 0) {
    return <span className="text-meta">{emptyLabel}</span>;
  }
  return (
    <div className="stack" style={{ gap: "var(--space-3)" }}>
      {items.map((p) => (
        <Link
          key={p.id}
          href={`/ot/${p.id}`}
          className="card card-pad"
          style={{ display: "block", background: p.isDelayed ? "var(--color-critical-bg)" : "var(--color-surface-2)", border: "1px solid var(--color-border)" }}
        >
          <div className="row" style={{ justifyContent: "space-between" }}>
            <strong style={{ color: "var(--color-navy)" }}>{p.name}</strong>
            <Badge tone={p.isDelayed ? "critical" : "neutral"}>{p.stage.replace("_", " ")}</Badge>
          </div>
          <div className="text-meta">
            {p.patientName} · {p.roomName} · {formatTime(p.scheduledStart)}
          </div>
          {p.delayReason && (
            <div className="text-meta" style={{ color: "var(--color-critical)" }}>
              ⚠ {p.delayReason}
            </div>
          )}
        </Link>
      ))}
    </div>
  );
}

export default async function OTDashboardPage() {
  const orgId = await getCurrentOrgId();
  const { stats, active, upcoming, delayed } = await getOTDashboard(orgId);

  return (
    <div className="stack" style={{ gap: "var(--space-6)" }}>
      <PageHeader title="OT Command Dashboard" description="Active procedures, delays and room utilization at a glance." />

      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "var(--space-4)" }}>
        <StatCard label="Active procedures" value={String(stats.activeProcedures)} />
        <StatCard label="Upcoming today" value={String(stats.upcomingToday)} />
        <StatCard
          label="Critical delays"
          value={String(stats.criticalDelays)}
          tone={stats.criticalDelays > 0 ? "critical" : "neutral"}
          delta={stats.criticalDelays > 0 ? "Needs attention" : undefined}
        />
        <StatCard label="Room utilization" value={`${stats.roomUtilizationPct}%`} delta={`${stats.roomsAvailable} / ${stats.roomsTotal} available`} />
      </div>

      <div className="grid grid-3" style={{ alignItems: "start" }}>
        <Card>
          <div className="text-label" style={{ marginBottom: "var(--space-3)" }}>
            Current active procedures
          </div>
          <ProcedureList items={active} emptyLabel="No procedures currently in progress." />
        </Card>
        <Card>
          <div className="text-label" style={{ marginBottom: "var(--space-3)" }}>
            Upcoming procedures
          </div>
          <ProcedureList items={upcoming} emptyLabel="Nothing else scheduled right now." />
        </Card>
        <Card>
          <div className="text-label" style={{ marginBottom: "var(--space-3)" }}>
            Critical delays
          </div>
          {delayed.length === 0 ? (
            <EmptyState icon="✓" title="No delays" description="All tracked procedures are on schedule." />
          ) : (
            <ProcedureList items={delayed} emptyLabel="" />
          )}
        </Card>
      </div>
    </div>
  );
}
