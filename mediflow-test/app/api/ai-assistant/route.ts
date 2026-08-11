import { NextResponse } from "next/server";
import { getOTDashboard, getAdmissionsStats, getCSSDOverview, getAlerts } from "@/lib/data/queries";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const lower = message.trim().toLowerCase();

    // Security guardrail check
    if (
      lower.includes("ignore previous instructions") ||
      lower.includes("disregard rules") ||
      lower.includes("system prompt")
    ) {
      return NextResponse.json({
        reply: "### Operational Security Guardrail\n\nI am Mediflow-AI, a clinical workflow assistant strictly scoped to hospital operational analytics.",
      });
    }

    // Read API keys safely from environment variables (server-only)
    const groqApiKey = process.env.GROQ_API_KEY;

    // Fetch operational metrics from data layer
    const otData = await getOTDashboard("org_meridian");
    const admissionsData = await getAdmissionsStats("org_meridian");
    const cssdData = await getCSSDOverview("org_meridian");
    const alertsData = await getAlerts("org_meridian");

    // =========================================================================
    // INTENT CONTROL ENGINE: Respond ONLY to the specific user query
    // =========================================================================

    // 1. Simple Greetings (Hello, Hi, Hey)
    if (lower === "hello" || lower === "hi" || lower === "hey" || lower.startsWith("hello ") || lower.startsWith("hi ")) {
      return NextResponse.json({
        reply: "Hello! I'm Mediflow-AI, your hospital operations and clinical workflow assistant. What would you like to check today?",
        provider: "intent-engine",
      });
    }

    // 2. OT Status Specific Query
    if (lower.includes("ot") || lower.includes("surgery") || lower.includes("operating")) {
      const reply = `### Operating Theatre Summary\n\nOperating Theatre is running at **${otData.stats.roomUtilizationPct}% utilization**.\n\n- 🟢 Active Procedures: **${otData.stats.activeProcedures} cases**\n- 🔵 Upcoming Cases Today: **${otData.stats.upcomingToday} surgeries**\n- 🔴 Critical Delays: **${otData.stats.criticalDelays} delayed case**\n\n### Priority Action\nReview OT Room 02 turnover schedule to clear surgical delay.`;
      return NextResponse.json({ reply, provider: "intent-engine" });
    }

    // 3. Admissions Specific Query
    if (lower.includes("admission") || lower.includes("queue") || lower.includes("intake")) {
      const reply = `### Admissions Status\n\nActive admissions queue stands at **${admissionsData.totalActive} patients**.\n\n- 🟢 Ready for Ward Placement: **${admissionsData.readyNow} patients**\n- 🟠 Blocked Admissions: **${admissionsData.blocked} patients** (Awaiting cardiology/consent clearance)\n- 🟠 Pending Signatures: **${admissionsData.pendingConsent} forms**\n\n### Priority Action\nFast-track consent clearance for ER intake patients.`;
      return NextResponse.json({ reply, provider: "intent-engine" });
    }

    // 4. CSSD / Instrument Sterilization Query
    if (lower.includes("cssd") || lower.includes("pack") || lower.includes("steril")) {
      const reply = `### CSSD & Instrument Sterilization Status\n\nSterilization department has **${cssdData.stats.availablePacks} out of ${cssdData.stats.totalPacks} instrument packs ready**.\n\n- 🟢 Available Packs: **${cssdData.stats.availablePacks}**\n- 🔵 In Use: **${cssdData.stats.inUsePacks}**\n- 🔴 Problem / Expired Packs: **${cssdData.stats.problemPacks}**\n\n### Priority Action\nVerify autoclave batch release code 9002 for afternoon surgeries.`;
      return NextResponse.json({ reply, provider: "intent-engine" });
    }

    // 5. Critical Alerts Query
    if (lower.includes("alert") || lower.includes("emergency") || lower.includes("critical")) {
      const activeCritical = alertsData.filter((a) => a.severity === "critical" && a.status !== "resolved");
      const reply = `### Active Critical Alerts\n\n${
        activeCritical.map((a) => `🔴 **[${a.status.toUpperCase()}] ${a.title}**\n${a.description}`).join("\n\n") || "🟢 No active critical alerts at this time."
      }`;
      return NextResponse.json({ reply, provider: "intent-engine" });
    }

    // 6. Ward Bed Availability Query
    if (lower.includes("bed") || lower.includes("ward") || lower.includes("capacity")) {
      const reply = `### Ward Bed Availability\n\nWard bed capacity is currently **91% occupied**.\n\n- 🔴 Occupied Beds: **45 / 48 beds**\n- 🟢 Available Beds: **3 beds free**\n- 🟠 Pending Discharges: **5 patients**\n\n### Priority Action\nExpedite discharge summary paperwork in Ward A to free up 2 beds.`;
      return NextResponse.json({ reply, provider: "intent-engine" });
    }

    // 7. General LLM Prompting via Groq API (if query doesn't match single topic)
    if (groqApiKey) {
      try {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${groqApiKey}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              {
                role: "system",
                content: `You are Mediflow-AI, a clinical workflow assistant for Meridian General Hospital. Answer ONLY what the user asks. Keep responses concise, structured, and focused strictly on the user's specific question. Current context: Active Admissions ${admissionsData.totalActive}, OT Util ${otData.stats.roomUtilizationPct}%, CSSD Packs ${cssdData.stats.availablePacks}/${cssdData.stats.totalPacks}.`,
              },
              { role: "user", content: message },
            ],
            temperature: 0.3,
            max_tokens: 450,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply) {
            return NextResponse.json({ reply, provider: "groq" });
          }
        }
      } catch (err) {
        console.warn("Groq API fallback failed:", err);
      }
    }

    // General Summary Fallback
    const fallbackReply = `### Mediflow-AI Operational Assistant\n\nI can help you check specific hospital metrics:\n- **OT Status**: Ask *"Summarize OT status"*\n- **Admissions Queue**: Ask *"Check admissions"*\n- **CSSD Sterilization**: Ask *"CSSD pack availability"*\n- **Critical Alerts**: Ask *"Show active alerts"*\n- **Bed Capacity**: Ask *"How many beds are free?"*`;

    return NextResponse.json({ reply: fallbackReply, provider: "context-engine" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to process AI response";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
