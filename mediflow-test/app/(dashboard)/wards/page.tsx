import { PageHeader } from "../../components/ui/PageHeader";
import { StatCard } from "../../components/ui/StatCard";
import { WardsBoard } from "./WardsBoard";
import { getWardsOverview, getTransferQueue, getCurrentOrgId } from "../../../lib/data/queries";

export default async function WardsPage() {
  const orgId = await getCurrentOrgId();
  const [wards, transferQueue] = await Promise.all([
    getWardsOverview(orgId),
    getTransferQueue(orgId),
  ]);

  const totalBeds = wards.reduce((sum, w) => sum + w.totalBeds, 0);
  const totalOccupied = wards.reduce((sum, w) => sum + w.occupied, 0);
  const totalAvailable = wards.reduce((sum, w) => sum + w.available, 0);
  const totalBlockedBeds = wards.reduce((sum, w) => sum + w.blocked, 0);
  const overallOccupancyPct = totalBeds === 0 ? 0 : Math.round((totalOccupied / totalBeds) * 100);

  return (
    <div className="stack" style={{ gap: "var(--space-6)" }}>
      <PageHeader
        title="Wards"
        description="Live bed occupancy, transfers and patient assignment by ward."
      />

      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "var(--space-4)" }}>
        <StatCard label="Overall occupancy" value={`${overallOccupancyPct}%`} />
        <StatCard label="Beds available" value={String(totalAvailable)} tone={totalAvailable === 0 ? "warning" : "success"} />
        <StatCard label="In transfer" value={String(transferQueue.length)} tone={transferQueue.length > 0 ? "warning" : "neutral"} />
        <StatCard
          label="Blocked beds"
          value={String(totalBlockedBeds)}
          tone={totalBlockedBeds > 0 ? "critical" : "neutral"}
          delta={totalBlockedBeds > 0 ? "Needs attention" : undefined}
        />
      </div>

      <WardsBoard wards={wards} transferQueue={transferQueue} />
    </div>
  );
}
