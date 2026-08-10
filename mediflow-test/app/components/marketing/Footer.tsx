import Link from "next/link";

export function Footer() {
  return (
    <footer style={{ background: "#081428", color: "rgba(255,255,255,0.6)" }}>
      <div className="container" style={{ padding: "var(--space-8) var(--space-6)" }}>
        <div className="row" style={{ justifyContent: "space-between", flexWrap: "wrap", gap: "var(--space-4)" }}>
          <div className="row" style={{ gap: "var(--space-2)" }}>
            <span aria-hidden style={{ width: 26, height: 26, borderRadius: 7, background: "var(--color-primary)", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12 }}>M</span>
            <span style={{ color: "#fff", fontWeight: 700 }}>Mediflow-AI</span>
          </div>
          <span>© {new Date().getFullYear()} Mediflow-AI. All rights reserved.</span>
          <div className="row" style={{ gap: "var(--space-5)" }}>
            <Link href="/login" style={{ color: "rgba(255,255,255,0.6)" }}>Sign in</Link>
            <Link href="/signup" style={{ color: "rgba(255,255,255,0.6)" }}>Sign up</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
