import { PageHeader } from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
import { Skeleton } from "../../components/ui/Skeleton";

export default function WardsLoading() {
  return (
    <div className="stack" style={{ gap: "var(--space-6)" }}>
      <PageHeader
        title="Wards"
        description="Live bed occupancy, transfers and patient assignment by ward."
      />

      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "var(--space-4)" }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <Skeleton height={12} width="60%" />
            <div style={{ marginTop: "var(--space-3)" }}>
              <Skeleton height={28} width="40%" />
            </div>
          </Card>
        ))}
      </div>

      {Array.from({ length: 2 }).map((_, i) => (
        <Card key={i}>
          <Skeleton height={16} width="30%" />
          <div className="bed-grid" style={{ marginTop: "var(--space-4)" }}>
            {Array.from({ length: 4 }).map((_, j) => (
              <Skeleton key={j} height={72} />
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
