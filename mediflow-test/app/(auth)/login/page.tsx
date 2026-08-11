"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Logo } from "@/app/components/brand/Logo";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function formatFirebaseError(code: string, fallback: string): string {
  if (code.includes("auth/unauthorized-domain")) {
    return "Domain not authorized in Firebase Auth settings. Please add your domain to Firebase console.";
  }
  if (code.includes("auth/invalid-credential") || code.includes("auth/wrong-password") || code.includes("auth/user-not-found")) {
    return "Incorrect email or password. Please verify your credentials.";
  }
  if (code.includes("auth/email-already-in-use")) {
    return "This email is already registered. Please sign in instead.";
  }
  if (code.includes("auth/network-request-failed")) {
    return "Unable to connect. Please check your internet connection.";
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
  const [rememberMe, setRememberMe] = useState(true);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (val.length > 0 && !EMAIL_REGEX.test(val)) {
      setEmailError("Enter a valid email address.");
    } else {
      setEmailError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_REGEX.test(email)) {
      setEmailError("Enter a valid email address.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      router.push(redirectTarget);
    } catch (err: unknown) {
      const e = err as { code?: string; message?: string };
      setError(formatFirebaseError(e?.code || "", e?.message || "Incorrect email or password."));
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginWithGoogle();
      router.push(redirectTarget);
    } catch (err: unknown) {
      const e = err as { code?: string; message?: string };
      setError(formatFirebaseError(e?.code || "", e?.message || "Google Sign-In failed."));
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Form Header */}
      <div className="space-y-2">
        <div className="mb-4">
          <Logo size="sm" variant="light" showTagline={false} />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Sign in to Mediflow-AI</h2>
        <p className="text-xs text-slate-500 font-medium">Connect your hospital operations to one intelligent platform.</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start space-x-2">
          <span className="font-bold shrink-0">⚠</span>
          <span>{error}</span>
        </div>
      )}

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider" htmlFor="email">
              Work Email
            </label>
            {emailError && <span className="text-[11px] font-bold text-rose-600">{emailError}</span>}
          </div>
          <input
            id="email"
            type="email"
            className={`auth-input ${emailError ? "border-rose-500 focus:border-rose-500" : ""}`}
            placeholder="you@hospital.org"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider" htmlFor="password">
              Password
            </label>
            <Link href="/forgot-password" className="text-xs font-semibold text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            className="auth-input"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center space-x-2 pt-1">
          <input
            id="remember"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="remember" className="text-xs font-medium text-slate-600 cursor-pointer">
            Remember me on this device
          </label>
        </div>

        <button
          type="submit"
          disabled={loading || Boolean(emailError)}
          className="w-full h-13 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          <span>{loading ? "Signing in..." : "Sign In"}</span>
          {!loading && <span>→</span>}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center space-x-3 my-4">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-xs text-slate-400 font-semibold uppercase">Or</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      {/* Google Login */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full h-13 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm shadow-sm transition-all flex items-center justify-center space-x-3 disabled:opacity-50"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
        <span>Continue with Google</span>
      </button>

      {/* Switch to Signup */}
      <div className="text-center text-xs text-slate-500 font-medium pt-2">
        Don&apos;t have an account?{" "}
        <Link href={`/signup?redirect=${encodeURIComponent(redirectTarget)}`} className="font-bold text-blue-600 hover:underline">
          Create one now
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-slate-400 text-xs text-center py-8">Loading sign-in...</div>}>
      <LoginForm />
    </Suspense>
  );
}
