import Link from "next/link";
import { Button } from "../../components/ui/Button";

export default function LoginPage() {
  return (
    <form className="stack auth-dark" style={{ gap: "var(--space-5)" }}>
      <div className="stack" style={{ gap: "var(--space-1)" }}>
        <h1 className="text-section-title">Welcome back</h1>
        <p className="text-meta">Sign in to access your hospital operations dashboard.</p>
      </div>

      <div className="field">
        <label className="text-label" htmlFor="email">Work Email</label>
        <input id="email" name="email" type="email" className="input" placeholder="you@hospital.org" autoComplete="email" />
      </div>

      <div className="field">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <label className="text-label" htmlFor="password">Password</label>
          <Link href="/forgot-password" className="auth-link text-meta">Forgot password?</Link>
        </div>
        <input id="password" name="password" type="password" className="input" placeholder="••••••••••••" autoComplete="current-password" />
      </div>

      <label className="checkbox-row">
        <input type="checkbox" /> Remember me
      </label>

      <Button type="submit" block disabled>Sign in</Button>

      <div className="row" style={{ gap: "var(--space-3)" }}>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.15)" }} />
        <span className="text-meta">or</span>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.15)" }} />
      </div>

      <Button type="button" variant="secondary" block disabled title="Enabled in the final Google Sign-In integration step">
        <span aria-hidden>G</span> Continue with Google
      </Button>

      <p className="text-meta" style={{ textAlign: "center" }}>
        Don&apos;t have an account? <Link href="/signup" className="auth-link">Create one</Link>
      </p>
    </form>
  );
}
