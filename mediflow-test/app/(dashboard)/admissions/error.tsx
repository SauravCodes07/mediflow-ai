"use client";

import { useEffect } from "react";
import { Card } from "../../components/ui/Card";
import { EmptyState } from "../../components/ui/EmptyState";

export default function AdmissionsError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Route-level error boundary: log for now. Wire to real telemetry once
    // an error-tracking provider is chosen — no PHI should ever be logged.
    console.error("Admissions route error:", error.digest ?? error.message);
  }, [error]);

  return (
    <Card>
      <EmptyState
        icon="!"
        title="Couldn't load admissions"
        description="Something went wrong while loading the admissions board. This has not affected any patient data."
        action={
          <button type="button" className="btn btn-primary btn-sm" onClick={() => reset()}>
            Try again
          </button>
        }
      />
    </Card>
  );
}
