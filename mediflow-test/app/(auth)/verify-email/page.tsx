import Link from "next/link";
import { Button } from "../../components/ui/Button";

export default function VerifyEmailPage() {
  return (
    <div className="stack auth-dark" style={{ gap: "var(--space-5)", textAlign: "center" }}>
      <div
        aria-hidden
        style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(23,105,224,0.2)", color: "#8fc0ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto" }}
      >
        ✉
      </div>
      <div className="stack" style={{ gap: "var(--space-1)" }}>
        <h1 className="text-section-title">Check your inbox</h1>
        <p className="text-meta">We&apos;ve sent a verification link to your email.</p>
      </div>
      <Button type="button" variant="secondary" block disabled>Resend email</Button>
      <p className="text-meta">
        <Link href="/login" className="auth-link">Back to login</Link>
      </p>
    </div>
  );
}
