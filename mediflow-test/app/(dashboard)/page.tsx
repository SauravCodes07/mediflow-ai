import { PageHeader } from "../components/ui/PageHeader";
import { StatCard } from "../components/ui/StatCard";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { EmptyState } from "../components/ui/EmptyState";

export default function DashboardHome() {
  return (
    <div className="stack" style={{ gap: "var(--space-6)" }}>
      <PageHeader title="Dashboard" description="Hospital-wide snapshot — demo data, source-of-truth wiring lands in Step 10+." />

      <div className="grid grid-4">
        <StatCard label="OT Utilization" value="82%" tone="success" delta="Demo metric" />
        <StatCard label="Ward Occupancy" value="91%" tone="warning" delta="Demo metric" />
        <StatCard label="Pack Availability" value="96%" tone="success" delta="Demo metric" />
        <StatCard label="Active Alerts" value="3" tone="critical" delta="1 critical · 2 warning" />
      </div>

      <div className="grid" style={{ gridTemplateColumns: "2fr 1fr", gap: "var(--space-5)" }}>
        <Card>
          <div className="panel-header">
            <h2 className="text-section-title" style={{ fontSize: "var(--fs-lg)" }}>Today&apos;s workflow</h2>
            <Badge tone="neutral">Demo data</Badge>
          </div>
          <EmptyState
            icon="📊"
            title="Live workflow chart connects in Step 16"
            description="This panel keeps its final layout; the source-of-truth calculation is wired in a later step."
          />
        </Card>
        <Card>
          <div className="panel-header">
            <h2 className="text-section-title" style={{ fontSize: "var(--fs-lg)" }}>Recent alerts</h2>
            <Badge tone="critical">3</Badge>
          </div>
          <EmptyState icon="⚠" title="Alert feed connects in Step 15" />
        </Card>
      </div>
    </div>
  );
}
