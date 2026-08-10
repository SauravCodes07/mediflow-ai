import { PageHeader } from "../../../components/ui/PageHeader";
import { Card } from "../../../components/ui/Card";
import { Skeleton } from "../../../components/ui/Skeleton";

export default function InstrumentPacksLoading() {
  return (
    <div className="stack" style={{ gap: "var(--space-6)" }}>
      <PageHeader title="Instrument Packs" description="Pack inventory, identifiers and lifecycle state." />
      <Card>
        <Skeleton height={40} width="30%" />
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
