import { PageHeader } from "../../../components/ui/PageHeader";
import { Card } from "../../../components/ui/Card";
import { Skeleton } from "../../../components/ui/Skeleton";

export default function OtCaseLoading() {
  return (
    <div className="stack" style={{ gap: "var(--space-6)" }}>
      <PageHeader title="Loading case…" description="" />
      <div className="grid grid-2">
        <Card>
          <Skeleton height={60} />
        </Card>
        <Card>
          <Skeleton height={60} />
        </Card>
      </div>
      <Card>
        <Skeleton height={80} />
      </Card>
    </div>
  );
}
