import { PageHeader } from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
import { Skeleton } from "../../components/ui/Skeleton";

export default function PatientWorkflowLoading() {
  return (
    <div className="stack" style={{ gap: "var(--space-6)" }}>
      <PageHeader
        title="Patient Workflow"
        description="A single timeline from admission through discharge."
      />

      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "var(--space-4)" }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <Skeleton height={12} width="60%" />
            <div style={{ marginTop: "var(--space-3)" }}>
              <Skeleton height={28} width="40%" />
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div className="stack" style={{ gap: "var(--space-4)" }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} height={20} />
          ))}
        </div>
      </Card>
    </div>
  );
}
