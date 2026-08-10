import { PageHeader } from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
import { Skeleton } from "../../components/ui/Skeleton";

export default function CSSDLoading() {
  return (
    <div className="stack" style={{ gap: "var(--space-6)" }}>
      <PageHeader title="CSSD Overview" description="Sterile supply status across the department." />
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "var(--space-4)" }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <Skeleton height={12} width="60%" />
            <div style={{ marginTop: "var(--space-3)" }}>
              <Skeleton height={28} width="40%" />
            </div>
          </Card>
        ))}
      </div>
      <Card>
        <Skeleton height={80} />
      </Card>
    </div>
  );
}
