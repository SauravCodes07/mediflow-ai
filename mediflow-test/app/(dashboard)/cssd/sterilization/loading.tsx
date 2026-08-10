import { PageHeader } from "../../../components/ui/PageHeader";
import { Card } from "../../../components/ui/Card";
import { Skeleton } from "../../../components/ui/Skeleton";

export default function SterilizationLoading() {
  return (
    <div className="stack" style={{ gap: "var(--space-6)" }}>
      <PageHeader title="Sterilization" description="Sterilization batch status and release tracking." />
      <div className="table-wrap">
        <div className="card-pad stack" style={{ gap: "var(--space-3)" }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} height={20} />
          ))}
        </div>
      </div>
    </div>
  );
}
