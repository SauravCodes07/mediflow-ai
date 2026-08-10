"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function SignupPage() {
  const router = useRouter();
  const { signup, loginWithGoogle } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signup(email, password, name);
      router.push("/command-center");
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e?.message || "Failed to create account.");
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      router.push("/command-center");
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e?.message || "Google Sign-In failed.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stack auth-dark" style={{ gap: "var(--space-4)" }}>
      <div className="stack" style={{ gap: "var(--space-1)" }}>
        <h1 className="text-section-title">Create an account</h1>
        <p className="text-meta">Register your clinical user account on Mediflow-AI.</p>
      </div>

      {error && <div className="badge badge-critical py-2 px-3 text-xs">{error}</div>}

      <div className="field">
        <label className="text-label" htmlFor="name">Full Name</label>
        <input id="name" className="input" placeholder="Dr. Anika Rao" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div className="field">
        <label className="text-label" htmlFor="email">Work Email</label>
        <input id="email" type="email" className="input" placeholder="you@hospital.org" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>

      <div className="field">
        <label className="text-label" htmlFor="password">Password</label>
        <input id="password" type="password" className="input" placeholder="••••••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>

      <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
        {loading ? "Creating Account..." : "Create Account"}
      </button>

      <button type="button" className="btn btn-secondary btn-block" onClick={handleGoogle} disabled={loading}>
        <span aria-hidden>G</span> Sign up with Google
      </button>

      <p className="text-meta" style={{ textAlign: "center" }}>
        Already have an account? <Link href="/login" className="auth-link">Sign in</Link>
      </p>
    </form>
  );
}
