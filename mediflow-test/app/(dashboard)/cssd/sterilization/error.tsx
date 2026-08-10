"use client";

import { useEffect } from "react";
import { Card } from "../../../components/ui/Card";
import { EmptyState } from "../../../components/ui/EmptyState";

export default function SterilizationError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Sterilization route error:", error.digest ?? error.message);
  }, [error]);

  return (
    <Card>
      <EmptyState
        icon="!"
        title="Couldn't load sterilization batches"
        description="Something went wrong while loading batch status."
        action={
          <button type="button" className="btn btn-primary btn-sm" onClick={() => reset()}>
            Try again
          </button>
        }
      />
    </Card>
  );
}
