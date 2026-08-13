"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "../components/brand/Logo";
import { useTheme } from "@/lib/theme-context";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const isLoginPage = pathname === "/login";
  const isSignupPage = pathname === "/signup";

  return (
    <div className="min-h-screen w-full bg-[#071B34] flex flex-col font-sans relative">
      
      {/* AUTH NAVBAR */}
      <header className="w-full bg-[#071B34]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3 flex items-center justify-between z-30 shrink-0 shadow-md">
        {/* Left: Mediflow-AI Logo */}
        <Link href="/" className="inline-flex items-center" aria-label="Mediflow-AI Home">
          <Logo size="sm" variant="dark" showTagline={false} />
        </Link>

        {/* Right: Clean Auth Action Link */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {isLoginPage ? (
            <Link
              href="/signup"
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition-all cursor-pointer whitespace-nowrap"
            >
              Sign Up
            </Link>
          ) : isSignupPage ? (
            <Link
              href="/login"
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition-all cursor-pointer whitespace-nowrap"
            >
              Sign In
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition-all cursor-pointer whitespace-nowrap"
            >
              Sign In
            </Link>
          )}
        </div>
      </header>

      {/* MAIN AUTH BODY WITH SINGLE FULL-PAGE BACKGROUND */}
      <div className="flex-1 flex flex-col lg:flex-row relative overflow-x-hidden">
        
        {/* SINGLE BACKGROUND IMAGE LAYER (Spans entire layout behind both sections) */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
          <img
            src="/images/mediflow-auth-bg.jpg"
            alt="Mediflow AI Background"
            className="w-full h-full object-cover object-center lg:object-center"
          />
          {/* Subtle Responsive Overlay to enhance legibility while preserving vibrant artwork */}
          <div className="absolute inset-0 bg-gradient-to-t via-[#071B34]/30 from-[#071B34]/80 to-[#071B34]/40 lg:bg-gradient-to-r lg:from-[#061325]/70 lg:via-[#061325]/20 lg:to-[#061325]/50" />
        </div>

        {/* LEFT COLUMN: Hospital Showcase (55% Desktop) */}
        <div className="relative z-10 lg:w-[55%] min-h-[200px] sm:min-h-[240px] lg:min-h-[calc(100vh-57px)] flex flex-col justify-end p-6 sm:p-12 overflow-hidden shrink-0">
          {/* Bottom Hero Overlay Content */}
          <div className="relative z-10 max-w-lg">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-semibold mb-4 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Enterprise Hospital SaaS Platform</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-3 drop-shadow-md">
              Smarter hospital operations. <br />
              <span className="text-cyan-300">Better patient care.</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-6 hidden sm:block drop-shadow-sm">
              Connect admissions, wards, operating theatres, and sterilization workflows into one unified clinical intelligence platform.
            </p>

            <div className="hidden sm:grid grid-cols-3 gap-3 pt-4 border-t border-white/15 text-xs backdrop-blur-xs rounded-xl p-2 bg-black/10">
              <div>
                <div className="font-extrabold text-white text-lg drop-shadow">98%</div>
                <div className="text-[11px] text-slate-200">Workflow Accuracy</div>
              </div>
              <div>
                <div className="font-extrabold text-cyan-300 text-lg drop-shadow">45%</div>
                <div className="text-[11px] text-slate-200">Delay Reduction</div>
              </div>
              <div>
                <div className="font-extrabold text-white text-lg drop-shadow">24/7</div>
                <div className="text-[11px] text-slate-200">Real-Time Monitoring</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: High-Contrast Auth Card Container (45% Desktop) */}
        <div className="flex-1 min-h-[calc(100vh-280px)] lg:min-h-[calc(100vh-57px)] flex items-center justify-center p-4 sm:p-8 lg:p-12 relative z-10">
          <div className="relative z-10 w-full max-w-[430px] bg-white/95 dark:bg-[#102B4D]/95 backdrop-blur-md rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-200/80 dark:border-[#1E406D]/80">
            {children}
          </div>
        </div>

      </div>
    </div>
  );
}
