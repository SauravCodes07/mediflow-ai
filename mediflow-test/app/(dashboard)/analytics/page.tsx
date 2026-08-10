import { PageShell } from "../../components/ui/PageShell";
import { AnalyticsBoard } from "./AnalyticsBoard";

export default function Page() {
  return (
    <PageShell title="Analytics & Operational Insights" description="Executive KPIs, department turnover latency, throughput trends, and bottleneck insights.">
      <AnalyticsBoard />
    </PageShell>
  );
}
