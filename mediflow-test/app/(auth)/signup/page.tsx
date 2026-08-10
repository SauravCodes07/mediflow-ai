import Link from "next/link";
import { Button } from "../../components/ui/Button";

export default function SignupPage() {
  return (
    <form className="stack auth-dark" style={{ gap: "var(--space-5)" }}>
      <div className="stack" style={{ gap: "var(--space-1)" }}>
        <h1 className="text-section-title">Create account</h1>
        <p className="text-meta">Set up secure access for your hospital team.</p>
      </div>

      <div className="grid grid-2" style={{ gap: "var(--space-4)" }}>
        <div className="field">
          <label className="text-label" htmlFor="firstName">First name</label>
          <input id="firstName" className="input" placeholder="Ada" />
        </div>
        <div className="field">
          <label className="text-label" htmlFor="lastName">Last name</label>
          <input id="lastName" className="input" placeholder="Lovelace" />
        </div>
      </div>

      <div className="field">
        <label className="text-label" htmlFor="hospital">Hospital / organization</label>
        <input id="hospital" className="input" placeholder="Demo General Hospital" />
      </div>

      <div className="field">
        <label className="text-label" htmlFor="email">Work email</label>
        <input id="email" type="email" className="input" placeholder="you@hospital.org" autoComplete="email" />
      </div>

      <div className="grid grid-2" style={{ gap: "var(--space-4)" }}>
        <div className="field">
          <label className="text-label" htmlFor="password">Password</label>
          <input id="password" type="password" className="input" placeholder="At least 8 characters" autoComplete="new-password" />
        </div>
        <div className="field">
          <label className="text-label" htmlFor="confirmPassword">Confirm password</label>
          <input id="confirmPassword" type="password" className="input" placeholder="Repeat password" autoComplete="new-password" />
        </div>
      </div>

      <label className="checkbox-row">
        <input type="checkbox" /> I agree to the terms of service and privacy policy
      </label>

      <Button type="submit" block disabled>Create account</Button>

      <div className="row" style={{ gap: "var(--space-3)" }}>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.15)" }} />
        <span className="text-meta">or</span>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.15)" }} />
      </div>

      <Button type="button" variant="secondary" block disabled title="Enabled in the final Google Sign-In integration step">
        <span aria-hidden>G</span> Continue with Google
      </Button>

      <p className="text-meta" style={{ textAlign: "center" }}>
        Already have an account? <Link href="/login" className="auth-link">Sign in</Link>
      </p>
    </form>
  );
}
