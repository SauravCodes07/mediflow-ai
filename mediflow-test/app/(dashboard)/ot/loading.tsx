import { PageHeader } from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
import { Skeleton } from "../../components/ui/Skeleton";

export default function OTLoading() {
  return (
    <div className="stack" style={{ gap: "var(--space-6)" }}>
      <PageHeader title="Operating Theatre" description="Real-time visibility into operating room utilization, procedures, turnover and surgical delays for Mediflow General Hospital." />
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "var(--space-4)" }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <Skeleton height={20} width="50%" />
            <div style={{ marginTop: "var(--space-3)" }}>
              <Skeleton height={60} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
