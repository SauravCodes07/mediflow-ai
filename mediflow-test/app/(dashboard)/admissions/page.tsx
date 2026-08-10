import { PageHeader } from "../../components/ui/PageHeader";
import { StatCard } from "../../components/ui/StatCard";
import { AdmissionsBoard } from "./AdmissionsBoard";
import { getAdmissionsBoard, getAdmissionsStats, getCurrentOrgId } from "../../../lib/data/queries";

export default async function AdmissionsPage() {
  const orgId = await getCurrentOrgId();
  const [rows, stats] = await Promise.all([getAdmissionsBoard(orgId), getAdmissionsStats(orgId)]);

  return (
    <div className="stack" style={{ gap: "var(--space-6)" }}>
      <PageHeader
        title="Admissions"
        description="Incoming patients, readiness status and the transfer queue."
      />

      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "var(--space-4)" }}>
        <StatCard label="Active admissions" value={String(stats.totalActive)} />
        <StatCard label="Ready now" value={String(stats.readyNow)} tone="success" />
        <StatCard
          label="Blocked"
          value={String(stats.blocked)}
          tone={stats.blocked > 0 ? "critical" : "neutral"}
          delta={stats.blocked > 0 ? "Needs attention" : undefined}
        />
        <StatCard label="Consent pending" value={String(stats.pendingConsent)} tone={stats.pendingConsent > 0 ? "warning" : "neutral"} />
      </div>

      <AdmissionsBoard rows={rows} />
    </div>
  );
}
