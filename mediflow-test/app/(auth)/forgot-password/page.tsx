"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err: any) {
      setError(err?.message || "Failed to send password reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stack auth-dark" style={{ gap: "var(--space-4)" }}>
      <div className="stack" style={{ gap: "var(--space-1)" }}>
        <h1 className="text-section-title">Reset Password</h1>
        <p className="text-meta">Enter your work email to receive a password reset link.</p>
      </div>

      {sent ? (
        <div className="badge badge-success py-3 px-4 text-xs">
          Password reset link sent to {email}. Please check your inbox.
        </div>
      ) : (
        <>
          {error && <div className="badge badge-critical py-2 px-3 text-xs">{error}</div>}
          <div className="field">
            <label className="text-label" htmlFor="email">Work Email</label>
            <input
              id="email"
              type="email"
              className="input"
              placeholder="you@hospital.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </>
      )}

      <p className="text-meta" style={{ textAlign: "center" }}>
        Remembered password? <Link href="/login" className="auth-link">Sign in</Link>
      </p>
    </form>
  );
}
