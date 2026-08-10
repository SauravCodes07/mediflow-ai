import { Card } from "./Card";

export function StatCard({
  label,
  value,
  delta,
  tone = "neutral",
}: {
  label: string;
  value: string;
  delta?: string;
  tone?: "success" | "warning" | "critical" | "neutral";
}) {
  const deltaColor =
    tone === "success" ? "var(--color-success)" : tone === "warning" ? "var(--color-warning)" : tone === "critical" ? "var(--color-critical)" : "var(--color-text-muted)";
  return (
    <Card>
      <div className="text-label">{label}</div>
      <div style={{ fontSize: "var(--fs-2xl)", fontWeight: 700, color: "var(--color-navy)", marginTop: "var(--space-2)" }}>{value}</div>
      {delta && (
        <div className="text-meta" style={{ color: deltaColor, marginTop: "var(--space-1)" }}>
          {delta}
        </div>
      )}
    </Card>
  );
}
