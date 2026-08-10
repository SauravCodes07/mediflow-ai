import Link from "next/link";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { HospitalNightScene } from "../illustrations/HospitalNightScene";

const FEATURE_STRIP = [
  { icon: "📡", title: "Real-time Tracking", copy: "Every workflow. Every step." },
  { icon: "🧠", title: "AI-Powered Insights", copy: "Detect delays before they happen." },
  { icon: "⚡", title: "Smart Automation", copy: "Reduce manual work, save time." },
  { icon: "🔒", title: "Secure & Compliant", copy: "Built for healthcare standards." },
];

const METRICS = [
  { value: "98%", label: "Workflow Accuracy" },
  { value: "45%", label: "Reduction in Delays" },
  { value: "300+", label: "Surgeries Managed" },
  { value: "24/7", label: "Real-time Monitoring" },
];

export function Hero() {
  return (
    <section style={{ position: "relative", overflow: "hidden", background: "var(--color-navy)", color: "#fff" }}>
      <div style={{ position: "absolute", inset: 0 }}>
        <HospitalNightScene className="hero-scene" />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(100deg, rgba(11,31,58,0.97) 28%, rgba(11,31,58,0.75) 55%, rgba(11,31,58,0.35) 100%)",
          }}
        />
      </div>

      <div className="container" style={{ position: "relative", padding: "var(--space-16) var(--space-6) var(--space-12)" }}>
        <div className="grid" style={{ gridTemplateColumns: "1fr", gap: "var(--space-8)" }}>
          <div className="stack" style={{ gap: "var(--space-5)", maxWidth: 620 }}>
            <Badge tone="info">AI-Powered Hospital Operations</Badge>
            <h1 style={{ fontSize: "var(--fs-4xl)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-0.02em" }}>
              Smarter workflows.
              <br />
              <span style={{ color: "#5ea1f2" }}>Better patient care.</span>
            </h1>
            <p style={{ fontSize: "var(--fs-lg)", color: "rgba(255,255,255,0.78)", maxWidth: 540 }}>
              Mediflow-AI connects Admissions, Wards, OT, CSSD and more in a single platform —
              giving you real-time visibility, automation and intelligent insights to eliminate delays
              and improve outcomes.
            </p>
            <div className="row" style={{ gap: "var(--space-3)", flexWrap: "wrap" }}>
              <Link href="/signup"><Button size="lg">Request a Demo</Button></Link>
              <Link href="/login"><Button size="lg" variant="secondary">▶ Explore Live Dashboard</Button></Link>
            </div>

            <div className="row" style={{ gap: "var(--space-8)", flexWrap: "wrap", marginTop: "var(--space-4)" }}>
              {FEATURE_STRIP.map((f) => (
                <div key={f.title} className="row hover-lift" style={{ gap: "var(--space-2)", alignItems: "flex-start", border: "1px solid transparent", borderRadius: "var(--radius-md)", padding: "var(--space-2)" }}>
                  <span aria-hidden style={{ fontSize: 18 }}>{f.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "var(--fs-sm)" }}>{f.title}</div>
                    <div style={{ fontSize: "var(--fs-xs)", color: "rgba(255,255,255,0.6)" }}>{f.copy}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* metrics bar */}
        <div
          className="grid grid-4"
          style={{
            marginTop: "var(--space-10)",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: "var(--radius-lg)",
            padding: "var(--space-6)",
            backdropFilter: "blur(6px)",
          }}
        >
          {METRICS.map((m) => (
            <div key={m.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "var(--fs-3xl)", fontWeight: 800 }}>{m.value}</div>
              <div style={{ fontSize: "var(--fs-sm)", color: "rgba(255,255,255,0.65)" }}>{m.label}</div>
            </div>
          ))}
        </div>
        <p className="text-meta" style={{ color: "rgba(255,255,255,0.45)", marginTop: "var(--space-3)", textAlign: "center" }}>
          Demo / product-preview metrics — replace with verified figures before production use.
        </p>
      </div>
    </section>
  );
}
