import { ReactNode } from "react";
import Link from "next/link";
import { AuthCorridorScene } from "../components/illustrations/AuthCorridorScene";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "flex-end", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0 }}>
        <AuthCorridorScene className="illustration-fill" />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(100deg, rgba(8,20,40,0.35) 0%, rgba(8,20,40,0.72) 55%, rgba(8,20,40,0.92) 100%)",
          }}
        />
      </div>

      <div style={{ position: "relative", width: "100%", maxWidth: 440, margin: "var(--space-6)" }}>
        <Link href="/" className="row" style={{ gap: "var(--space-2)", justifyContent: "center", marginBottom: "var(--space-5)" }}>
          <span
            aria-hidden
            style={{ width: 32, height: 32, borderRadius: 9, background: "var(--color-primary)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800 }}
          >
            M
          </span>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: "var(--fs-lg)" }}>Mediflow-AI</span>
        </Link>

        <div
          style={{
            background: "rgba(18,38,70,0.72)",
            border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: "var(--radius-lg)",
            padding: "var(--space-8)",
            backdropFilter: "blur(14px)",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
