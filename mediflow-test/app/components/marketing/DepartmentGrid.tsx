import Link from "next/link";

const DEPARTMENTS = [
  { icon: "🩺", title: "Admissions", copy: "Patient intake and consent.", href: "/admissions" },
  { icon: "🛏", title: "Wards", copy: "Bed management and patient flow.", href: "/wards" },
  { icon: "⚕", title: "Operating Theatre", copy: "Real-time OT scheduling and workflow.", href: "/ot" },
  { icon: "🧴", title: "CSSD", copy: "Sterile instrument lifecycle.", href: "/cssd" },
  { icon: "📈", title: "Analytics", copy: "Operational dashboards and reports.", href: "/analytics" },
  { icon: "🚨", title: "Emergency", copy: "Alerts and critical-event management.", href: "/alerts" },
];

export function DepartmentGrid() {
  return (
    <section id="departments" style={{ background: "var(--color-navy)", color: "#fff" }}>
      <div className="container" style={{ padding: "0 var(--space-6) var(--space-16)" }}>
        <div style={{ textAlign: "center", marginBottom: "var(--space-8)" }}>
          <h2 style={{ fontSize: "var(--fs-2xl)", fontWeight: 800 }}>One Platform. Every Department.</h2>
          <p style={{ color: "rgba(255,255,255,0.6)", marginTop: "var(--space-2)" }}>
            Unify your entire hospital operations in one intelligent platform.
          </p>
        </div>
        <div className="grid grid-3" style={{ gap: "var(--space-4)" }}>
          {DEPARTMENTS.map((d) => (
            <Link
              key={d.title}
              href={d.href}
              className="hover-lift"
              style={{
                display: "block",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-5)",
              }}
            >
              <span
                aria-hidden
                style={{ width: 40, height: 40, borderRadius: "var(--radius-sm)", background: "rgba(23,105,224,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, marginBottom: "var(--space-3)" }}
              >
                {d.icon}
              </span>
              <div style={{ fontWeight: 700, marginBottom: "var(--space-1)" }}>{d.title}</div>
              <p style={{ fontSize: "var(--fs-sm)", color: "rgba(255,255,255,0.6)" }}>{d.copy}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
