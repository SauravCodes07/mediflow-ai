import { ReactNode } from "react";
import { PageHeader } from "./PageHeader";
import { EmptyState } from "./EmptyState";

/**
 * Shared shell for route-skeleton pages (contract Step 9).
 * Gives every stubbed route the same final layout conventions,
 * spacing and responsive behavior before real data is wired in.
 */
export function PageShell({
  title,
  description,
  children,
  comingSoonNote,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
  comingSoonNote?: string;
}) {
  return (
    <div className="stack" style={{ gap: "var(--space-6)" }}>
      <PageHeader title={title} description={description} />
      {children ?? (
        <div className="card">
          <EmptyState
            icon="ℹ"
            title="Operational Module Active"
            description={comingSoonNote ?? "All systems connected and running for Mediflow General Hospital."}
          />
        </div>
      )}
    </div>
  );
}
