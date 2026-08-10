"use client";

import { useEffect } from "react";
import { Card } from "../../components/ui/Card";
import { EmptyState } from "../../components/ui/EmptyState";

export default function PatientWorkflowError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Patient workflow route error:", error.digest ?? error.message);
  }, [error]);

  return (
    <Card>
      <EmptyState
        icon="!"
        title="Couldn't load the workflow timeline"
        description="Something went wrong while loading patient workflow events. This has not affected any patient data."
        action={
          <button type="button" className="btn btn-primary btn-sm" onClick={() => reset()}>
            Try again
          </button>
        }
      />
    </Card>
  );
}
