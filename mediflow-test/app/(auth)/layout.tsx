import { ReactNode } from "react";
import Link from "next/link";
import { AuthCorridorScene } from "../components/illustrations/AuthCorridorScene";
import { Logo } from "../components/brand/Logo";

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
        <Link href="/" className="row justify-center mb-6" aria-label="Mediflow-AI home">
          <Logo size="md" showTagline={false} />
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
