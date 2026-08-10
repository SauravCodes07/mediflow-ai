"use client";

import { useEffect } from "react";
import { Card } from "../../../components/ui/Card";
import { EmptyState } from "../../../components/ui/EmptyState";

export default function InstrumentPacksError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Instrument packs route error:", error.digest ?? error.message);
  }, [error]);

  return (
    <Card>
      <EmptyState
        icon="!"
        title="Couldn't load instrument packs"
        description="Something went wrong while loading pack inventory."
        action={
          <button type="button" className="btn btn-primary btn-sm" onClick={() => reset()}>
            Try again
          </button>
        }
      />
    </Card>
  );
}
