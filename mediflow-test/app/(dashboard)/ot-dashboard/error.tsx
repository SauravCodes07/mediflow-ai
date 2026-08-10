"use client";

import { useEffect } from "react";
import { Card } from "../../components/ui/Card";
import { EmptyState } from "../../components/ui/EmptyState";

export default function OTDashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("OT dashboard route error:", error.digest ?? error.message);
  }, [error]);

  return (
    <Card>
      <EmptyState
        icon="!"
        title="Couldn't load the OT command dashboard"
        description="Something went wrong while loading OT metrics. Individual OT rooms and cases are still reachable directly."
        action={
          <button type="button" className="btn btn-primary btn-sm" onClick={() => reset()}>
            Try again
          </button>
        }
      />
    </Card>
  );
}
