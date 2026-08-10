"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

function formatFirebaseError(code: string, fallback: string): string {
  if (code.includes("auth/unauthorized-domain")) {
    return "Domain not authorized in Firebase Auth settings. Please add your domain to Firebase console.";
  }
  if (code.includes("auth/invalid-credential") || code.includes("auth/wrong-password") || code.includes("auth/user-not-found")) {
    return "Invalid work email or password. Please verify your credentials.";
  }
  if (code.includes("auth/email-already-in-use")) {
    return "This email is already registered. Please sign in instead.";
  }
  if (code.includes("auth/network-request-failed")) {
    return "Network error. Please check your internet connection.";
  }
  return fallback;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/dashboard";

  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      router.push(redirectTarget);
    } catch (err: any) {
      setError(formatFirebaseError(err?.code || "", err?.message || "Failed to sign in. Please check your credentials."));
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginWithGoogle();
      router.push(redirectTarget);
    } catch (err: any) {
      setError(formatFirebaseError(err?.code || "", err?.message || "Google Sign-In failed."));
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stack auth-dark" style={{ gap: "var(--space-5)" }}>
      <div className="stack" style={{ gap: "var(--space-1)" }}>
        <h1 className="text-section-title">Welcome back</h1>
        <p className="text-meta">Sign in to access your hospital operations dashboard.</p>
      </div>

      {error && (
        <div className="badge badge-critical py-2 px-3 text-xs" style={{ borderRadius: "var(--radius-sm)" }}>
          {error}
        </div>
      )}

      <div className="field">
        <label className="text-label" htmlFor="email">Work Email</label>
        <input
          id="email"
          name="email"
          type="email"
          className="input"
          placeholder="you@hospital.org"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="field">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <label className="text-label" htmlFor="password">Password</label>
          <Link href="/forgot-password" className="auth-link text-meta">Forgot password?</Link>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          className="input"
          placeholder="••••••••••••"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
        {loading ? "Signing in..." : "Sign in"}
      </button>

      <div className="row" style={{ gap: "var(--space-3)" }}>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.15)" }} />
        <span className="text-meta">or</span>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.15)" }} />
      </div>

      <button type="button" className="btn btn-secondary btn-block" onClick={handleGoogleSignIn} disabled={loading}>
        <span aria-hidden>G</span> Continue with Google
      </button>

      <div className="text-center text-xs text-slate-400 mt-2">
        Don&apos;t have an account?{" "}
        <Link href={`/signup?redirect=${encodeURIComponent(redirectTarget)}`} className="text-cyan-400 font-semibold hover:underline">
          Register account
        </Link>
      </div>
    </form>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-slate-400 text-sm text-center py-8">Loading authentication...</div>}>
      <LoginForm />
    </Suspense>
  );
}
