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
        reply: "I am Mediflow-AI, a clinical workflow assistant. I am scoped to operational hospital analytics and workflow guidance only.",
      });
    }

    // Read API keys safely from environment variables (server-only)
    const groqApiKey = process.env.GROQ_API_KEY;
    const gcpApiKey = process.env.GCP_API_KEY || process.env.GEMINI_API_KEY;

    // Fetch real operational context from data layer
    const otData = await getOTDashboard("org_meridian");
    const admissionsData = await getAdmissionsStats("org_meridian");
    const cssdData = await getCSSDOverview("org_meridian");
    const alertsData = await getAlerts("org_meridian");

    const systemPrompt = `You are Mediflow-AI, an expert hospital operations & clinical workflow AI assistant for Meridian General Hospital.
Answer operational questions accurately based strictly on the provided real-time hospital context.
Do NOT invent fake patient diagnoses or medical treatments.
Label responses clearly as operational guidance.

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
            max_tokens: 600,
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
      reply = `**Operating Theatre Summary**:\n• Active Procedures: ${otData.stats.activeProcedures}\n• Upcoming Cases Today: ${otData.stats.upcomingToday}\n• Room Utilization: ${otData.stats.roomUtilizationPct}%\n• Critical Delays: ${otData.stats.criticalDelays} (${otData.delayed.map((d) => d.name + " in " + d.roomName).join(", ") || "None"}).`;
    } else if (lower.includes("admission") || lower.includes("patient") || lower.includes("queue")) {
      reply = `**Admissions & Readiness Summary**:\n• Total Active Admissions: ${admissionsData.totalActive}\n• Ready for Procedure/Ward: ${admissionsData.readyNow}\n• Blocked Admissions: ${admissionsData.blocked} (Awaiting cardiology/consent clearance)\n• Pending Consent: ${admissionsData.pendingConsent}.`;
    } else if (lower.includes("cssd") || lower.includes("pack") || lower.includes("steril")) {
      reply = `**CSSD & Instrument Pack Status**:\n• Total Packs: ${cssdData.stats.totalPacks}\n• Available Packs: ${cssdData.stats.availablePacks}\n• Problem/Expired Packs: ${cssdData.stats.problemPacks} (${cssdData.problemPacks.map((p) => p.code).join(", ")}).`;
    } else if (lower.includes("alert") || lower.includes("emergency") || lower.includes("critical")) {
      reply = `**Active Critical Alerts**:\n${alertsData.filter((a) => a.severity === "critical").map((a) => `• [${a.status.toUpperCase()}] ${a.title}: ${a.description}`).join("\n") || "No active critical alerts."}`;
    } else {
      reply = `**Mediflow-AI Operational Status Overview**:\n• OT Room Utilization: ${otData.stats.roomUtilizationPct}%\n• Active Admissions: ${admissionsData.totalActive} (${admissionsData.readyNow} ready)\n• CSSD Pack Availability: ${cssdData.stats.availablePacks}/${cssdData.stats.totalPacks} packs ready\n• Active Critical Alerts: ${alertsData.filter((a) => a.severity === "critical" && a.status !== "resolved").length}\n\nAsk me specific questions regarding OT turnover, admissions bottlenecks, CSSD pack expiry, or emergency alerts.`;
    }

    return NextResponse.json({ reply, provider: "context-engine" });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to process AI response" }, { status: 500 });
  }
}
