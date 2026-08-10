import { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-6)", gap: "var(--space-4)", flexWrap: "wrap" }}>
      <div className="stack" style={{ gap: "var(--space-1)" }}>
        <h1 className="text-page-title">{title}</h1>
        {description && <p className="text-meta">{description}</p>}
      </div>
      {actions && <div className="row" style={{ gap: "var(--space-3)" }}>{actions}</div>}
    </div>
  );
}
