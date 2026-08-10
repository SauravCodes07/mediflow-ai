import { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
  icon = "○",
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="state-block">
      <div className="state-icon" aria-hidden>{icon}</div>
      <div className="stack" style={{ gap: "var(--space-1)" }}>
        <strong style={{ color: "var(--color-navy)" }}>{title}</strong>
        {description && <span className="text-meta">{description}</span>}
      </div>
      {action}
    </div>
  );
}
