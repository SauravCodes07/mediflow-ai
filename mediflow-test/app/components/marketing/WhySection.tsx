import { ORTeamScene } from "../illustrations/ORTeamScene";

const BENEFITS = [
  "End-to-end visibility across departments",
  "AI-powered automation",
  "Reduced delays",
  "Better patient outcomes",
  "Secure architecture",
  "Scalable platform",
];

export function WhySection() {
  return (
    <section id="why" style={{ background: "var(--color-navy)", color: "#fff" }}>
      <div className="container" style={{ padding: "0 var(--space-6) var(--space-16)" }}>
        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "var(--space-8)", alignItems: "center" }}>
          <div style={{ borderRadius: "var(--radius-lg)", overflow: "hidden", border: "1px solid rgba(255,255,255,0.12)", aspectRatio: "7 / 5" }}>
            <ORTeamScene className="illustration-fill" />
          </div>
          <div className="stack" style={{ gap: "var(--space-4)" }}>
            <h2 style={{ fontSize: "var(--fs-2xl)", fontWeight: 800 }}>Why Hospitals Choose Mediflow-AI</h2>
            <ul className="stack" style={{ gap: "var(--space-3)", listStyle: "none", padding: 0, margin: 0 }}>
              {BENEFITS.map((b) => (
                <li key={b} className="row" style={{ gap: "var(--space-3)" }}>
                  <span
                    aria-hidden
                    style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(22,163,74,0.2)", color: "var(--color-success)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}
                  >
                    ✓
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.85)" }}>{b}</span>
                </li>
              ))}
            </ul>

            <div
              style={{
                marginTop: "var(--space-3)",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-5)",
              }}
            >
              <span aria-hidden style={{ color: "var(--color-primary)", fontSize: 22, lineHeight: 1 }}>&ldquo;</span>
              <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "var(--fs-sm)", margin: "var(--space-2) 0 var(--space-4)" }}>
                Mediflow-AI has transformed the way we manage our hospital workflows. Delays are
                down, efficiency is up, and our teams love the clarity.
              </p>
              <div className="row" style={{ gap: "var(--space-3)" }}>
                <span
                  aria-hidden
                  style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--color-primary-light)", color: "var(--color-primary-dark)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "var(--fs-sm)" }}
                >
                  AS
                </span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "var(--fs-sm)" }}>Dr. Anjali Sharma</div>
                  <div style={{ fontSize: "var(--fs-xs)", color: "rgba(255,255,255,0.55)" }}>Chief Medical Officer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
