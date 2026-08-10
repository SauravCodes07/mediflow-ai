const DEMO_HOSPITALS = ["City Care Hospital", "HealthFirst", "LifeLine Hospitals", "CareMax", "MediTrust"];

export function TrustSection() {
  return (
    <section style={{ background: "var(--color-navy-2)", color: "#fff" }}>
      <div className="container" style={{ padding: "var(--space-10) var(--space-6)" }}>
        <p style={{ textAlign: "center", fontSize: "var(--fs-sm)", color: "rgba(255,255,255,0.55)", marginBottom: "var(--space-5)" }}>
          Trusted by forward-thinking hospitals <span style={{ opacity: 0.7 }}>(demo names for illustration)</span>
        </p>
        <div className="row" style={{ justifyContent: "center", gap: "var(--space-8)", flexWrap: "wrap" }}>
          {DEMO_HOSPITALS.map((h) => (
            <div key={h} className="row" style={{ gap: "var(--space-2)", color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: "var(--fs-sm)" }}>
              <span aria-hidden style={{ width: 20, height: 20, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.4)" }} />
              {h}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
