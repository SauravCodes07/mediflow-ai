import { NextResponse } from "next/server";

/**
 * Route reserved per the Final Route Inventory (/api/ai-assistant).
 * Real AI provider wiring is intentionally deferred to Step 23 of the
 * implementation contract, after auth and the full app are stable.
 */
export async function POST() {
  return NextResponse.json(
    { error: "AI assistant is not yet connected. This endpoint is reserved for Step 23." },
    { status: 501 }
  );
}
