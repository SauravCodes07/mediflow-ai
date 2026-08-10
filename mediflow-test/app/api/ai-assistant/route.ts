import { NextResponse } from "next/server";
import { getOTDashboard, getAdmissionsStats, getCSSDOverview, getAlerts } from "@/lib/data/queries";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Prompt injection defense check
    const lower = message.toLowerCase();
    if (
      lower.includes("ignore previous instructions") ||
      lower.includes("disregard rules") ||
      lower.includes("system prompt")
    ) {
      return NextResponse.json({
        reply: "### Operational Security Guardrail\n\nI am Mediflow-AI, a clinical workflow assistant. I am strictly scoped to operational hospital analytics and workflow guidance.",
      });
    }

    // Read API keys safely from environment variables (server-only)
    const groqApiKey = process.env.GROQ_API_KEY;

    // Fetch real operational context from data layer
    const otData = await getOTDashboard("org_meridian");
    const admissionsData = await getAdmissionsStats("org_meridian");
    const cssdData = await getCSSDOverview("org_meridian");
    const alertsData = await getAlerts("org_meridian");

    const systemPrompt = `You are Mediflow-AI, an expert hospital operations & clinical workflow AI assistant for Meridian General Hospital.
Answer operational questions accurately based strictly on the provided real-time hospital context.
Do NOT invent fake patient diagnoses or medical treatments.
Format responses with clean Markdown sections using headings like:
### Summary
### Critical Status
### Recommended Actions

Use status indicators:
🔴 Critical / Immediate Delay
🟠 Warning / Attention Required
🟢 Normal / Operational

CURRENT HOSPITAL OPERATIONAL CONTEXT:
- Operating Theatre (OT): ${otData.stats.activeProcedures} active cases, ${otData.stats.upcomingToday} upcoming, ${otData.stats.criticalDelays} critical delays. Room utilization: ${otData.stats.roomUtilizationPct}%.
- Admissions: ${admissionsData.totalActive} active admissions, ${admissionsData.readyNow} ready now, ${admissionsData.blocked} blocked, ${admissionsData.pendingConsent} pending consent.
- CSSD: ${cssdData.stats.totalPacks} total instrument packs (${cssdData.stats.availablePacks} available, ${cssdData.stats.inUsePacks} in use, ${cssdData.stats.problemPacks} problem packs).
- Active Critical Alerts: ${alertsData.filter((a) => a.severity === "critical" && a.status !== "resolved").map((a) => a.title).join("; ") || "None"}.`;

    // Attempt Groq API completion if environment variable exists
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
              { role: "system", content: systemPrompt },
              { role: "user", content: message },
            ],
            temperature: 0.3,
            max_tokens: 650,
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
        console.warn("Groq API request failed:", err);
      }
    }

    // Operational context engine fallback based on live metrics
    let reply = "";
    if (lower.includes("ot") || lower.includes("surgery") || lower.includes("operating")) {
      reply = `### Operating Theatre Summary\n\nOperating Theatre department is currently running at **${otData.stats.roomUtilizationPct}% room utilization**.\n\n### Operational Metrics\n- 🟢 Active Procedures: ${otData.stats.activeProcedures} cases\n- 🔵 Upcoming Cases Today: ${otData.stats.upcomingToday} surgeries\n- 🔴 Critical Delays: ${otData.stats.criticalDelays} (${otData.delayed.map((d) => d.name + " in " + d.roomName).join(", ") || "None"})\n\n### Recommended Actions\n1. Prioritize OT Room 02 turnover to resolve surgery delay.\n2. Review CSSD pack sterilization queue for upcoming afternoon cases.`;
    } else if (lower.includes("admission") || lower.includes("patient") || lower.includes("queue")) {
      reply = `### Admissions & Patient Flow Summary\n\nTotal active admissions queue stands at **${admissionsData.totalActive} patients**.\n\n### Queue Status\n- 🟢 Ready for Placement: ${admissionsData.readyNow} patients\n- 🟠 Blocked Admissions: ${admissionsData.blocked} (Awaiting cardiology/consent clearance)\n- 🟠 Pending Consent: ${admissionsData.pendingConsent} forms\n\n### Recommended Actions\n1. Fast-track cardiology clearance for ER intake 2.\n2. Dispatch mobile consent tablet to Ward 4B.`;
    } else if (lower.includes("cssd") || lower.includes("pack") || lower.includes("steril")) {
      reply = `### CSSD & Instrument Sterilization Status\n\nSterilization department has **${cssdData.stats.availablePacks} out of ${cssdData.stats.totalPacks} instrument packs ready**.\n\n### Pack Breakdown\n- 🟢 Available Packs: ${cssdData.stats.availablePacks}\n- 🔵 In Use Packs: ${cssdData.stats.inUsePacks}\n- 🔴 Problem / Expired Packs: ${cssdData.stats.problemPacks} (${cssdData.problemPacks.map((p) => p.code).join(", ")})\n\n### Recommended Actions\n1. Re-sterilize expired orthopedic pack STZ-0809-B.\n2. Verify autoclave batch 9002 release code.`;
    } else if (lower.includes("alert") || lower.includes("emergency") || lower.includes("critical")) {
      reply = `### Active Critical Alerts\n\n${alertsData.filter((a) => a.severity === "critical").map((a) => `🔴 **[${a.status.toUpperCase()}] ${a.title}**\n${a.description}`).join("\n\n") || "🟢 No active critical alerts."}\n\n### Recommended Actions\n1. Acknowledge active alerts on the Emergency Alerts Board.\n2. Dispatch duty nurse supervisor to ER triage.`;
    } else {
      reply = `### Mediflow-AI Operational Status\n\nReal-time hospital operations overview for Meridian General Hospital.\n\n### Department Overview\n- 🟢 **OT Room Utilization**: ${otData.stats.roomUtilizationPct}%\n- 🟢 **Active Admissions**: ${admissionsData.totalActive} (${admissionsData.readyNow} ready now)\n- 🟢 **CSSD Pack Availability**: ${cssdData.stats.availablePacks}/${cssdData.stats.totalPacks} packs ready\n- 🟠 **Active Critical Alerts**: ${alertsData.filter((a) => a.severity === "critical" && a.status !== "resolved").length} active\n\nAsk me specific questions regarding OT turnover, admissions bottlenecks, CSSD pack expiry, or emergency alerts.`;
    }

    return NextResponse.json({ reply, provider: "context-engine" });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to process AI response" }, { status: 500 });
  }
}
