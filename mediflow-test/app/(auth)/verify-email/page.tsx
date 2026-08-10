"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function VerifyEmailPage() {
  const { user, sendVerification } = useAuth();
  const [sent, setSent] = useState(false);

  const handleResend = async () => {
    await sendVerification();
    setSent(true);
  };

  return (
    <div className="stack auth-dark" style={{ gap: "var(--space-4)" }}>
      <h1 className="text-section-title">Verify your Email</h1>
      <p className="text-meta">
        A verification link has been sent to {user?.email || "your email address"}. Please verify your email before accessing full hospital controls.
      </p>

      {sent && (
        <div className="badge badge-success py-2 px-3 text-xs">
          Verification email resent. Please check your inbox.
        </div>
      )}

      <button className="btn btn-primary btn-block" onClick={handleResend}>
        Resend Verification Email
      </button>

      <p className="text-meta" style={{ textAlign: "center" }}>
        Back to <Link href="/command-center" className="auth-link">Dashboard</Link>
      </p>
    </div>
  );
}
