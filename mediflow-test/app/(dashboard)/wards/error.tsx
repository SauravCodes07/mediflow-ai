"use client";

import { useEffect } from "react";
import { Card } from "../../components/ui/Card";
import { EmptyState } from "../../components/ui/EmptyState";

export default function WardsError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Wards route error:", error.digest ?? error.message);
  }, [error]);

  return (
    <Card>
      <EmptyState
        icon="!"
        title="Couldn't load ward data"
        description="Something went wrong while loading bed occupancy and transfers. This has not affected any patient data."
        action={
          <button type="button" className="btn btn-primary btn-sm" onClick={() => reset()}>
            Try again
          </button>
        }
      />
    </Card>
  );
}
