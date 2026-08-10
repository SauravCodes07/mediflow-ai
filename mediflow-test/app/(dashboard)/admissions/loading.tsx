import { PageHeader } from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
import { Skeleton } from "../../components/ui/Skeleton";

export default function AdmissionsLoading() {
  return (
    <div className="stack" style={{ gap: "var(--space-6)" }}>
      <PageHeader
        title="Admissions"
        description="Incoming patients, readiness status and the transfer queue."
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

      <Card>
        <Skeleton height={40} />
      </Card>

      <div className="table-wrap">
        <div className="card-pad stack" style={{ gap: "var(--space-3)" }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} height={20} />
          ))}
        </div>
      </div>
    </div>
  );
}
