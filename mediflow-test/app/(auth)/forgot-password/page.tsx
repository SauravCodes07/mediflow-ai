import Link from "next/link";
import { Button } from "../../components/ui/Button";

export default function ForgotPasswordPage() {
  return (
    <form className="stack auth-dark" style={{ gap: "var(--space-5)" }}>
      <div className="stack" style={{ gap: "var(--space-1)" }}>
        <h1 className="text-section-title">Reset your password</h1>
        <p className="text-meta">We&apos;ll send a reset link to your work email.</p>
      </div>

      <div className="field">
        <label className="text-label" htmlFor="email">Work email</label>
        <input id="email" type="email" className="input" placeholder="you@hospital.org" autoComplete="email" />
      </div>

      <Button type="submit" block disabled>Send reset link</Button>

      <p className="text-meta" style={{ textAlign: "center" }}>
        <Link href="/login" className="auth-link">Back to sign in</Link>
      </p>
    </form>
  );
}
