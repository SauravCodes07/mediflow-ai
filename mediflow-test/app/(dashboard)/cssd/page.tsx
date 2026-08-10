import Link from "next/link";
import { PageHeader } from "../../components/ui/PageHeader";
import { StatCard } from "../../components/ui/StatCard";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { EmptyState } from "../../components/ui/EmptyState";
import { getCSSDOverview, getCurrentOrgId } from "../../../lib/data/queries";

export default async function CSSDPage() {
  const orgId = await getCurrentOrgId();
  const { stats, problemPacks } = await getCSSDOverview(orgId);

  return (
    <div className="stack" style={{ gap: "var(--space-6)" }}>
      <PageHeader
        title="CSSD Overview"
        description="Sterile supply status across the department."
        actions={
          <>
            <Link href="/cssd/instrument-packs" className="btn btn-secondary btn-sm">
              Instrument packs
            </Link>
            <Link href="/cssd/sterilization" className="btn btn-secondary btn-sm">
              Sterilization
            </Link>
          </>
        }
      />

      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "var(--space-4)" }}>
        <StatCard label="Total packs" value={String(stats.totalPacks)} />
        <StatCard label="Available" value={String(stats.availablePacks)} tone="success" />
        <StatCard label="In use" value={String(stats.inUsePacks)} />
        <StatCard
          label="Flagged problems"
          value={String(stats.problemPacks)}
          tone={stats.problemPacks > 0 ? "critical" : "neutral"}
          delta={stats.problemPacks > 0 ? "Needs attention" : undefined}
        />
        <StatCard label="Batches in cycle" value={String(stats.batchesInCycle)} />
        <StatCard label="Held / failed batches" value={String(stats.batchesHeldOrFailed)} tone={stats.batchesHeldOrFailed > 0 ? "warning" : "neutral"} />
      </div>

      <Card>
        <div className="text-label" style={{ marginBottom: "var(--space-3)" }}>
          Packs needing attention
        </div>
        {problemPacks.length === 0 ? (
          <EmptyState icon="✓" title="No flagged packs" description="Every pack is within its lifecycle and expiry window." />
        ) : (
          <div className="table-wrap" style={{ border: "none" }}>
            <table className="dt">
              <thead>
                <tr>
                  <th>Pack</th>
                  <th>Lifecycle</th>
                  <th>Expires</th>
                  <th aria-label="Reason" />
                </tr>
              </thead>
              <tbody>
                {problemPacks.map((p) => (
                  <tr key={p.id} style={{ background: "var(--color-critical-bg)" }}>
                    <td style={{ fontWeight: 600 }}>
                      {p.code} · {p.name}
                    </td>
                    <td>
                      <Badge tone="critical">{p.lifecycle.replace("_", " ")}</Badge>
                    </td>
                    <td className="text-meta">{new Date(p.expiresAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</td>
                    <td className="text-meta">
                      {p.isExpired ? "⚠ Expired — blocked from use" : p.expiringSoon ? "⚠ Expiring within 72h" : "⚠ Blocked from use"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
