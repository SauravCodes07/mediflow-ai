"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "../components/brand/Logo";
import { InstallAppButton } from "../components/ui/InstallAppButton";
import { useTheme } from "@/lib/theme-context";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { theme, setTheme, isDark } = useTheme();

  const toggleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  const isLoginPage = pathname === "/login";
  const isSignupPage = pathname === "/signup";

  return (
    <div className="min-h-screen w-full bg-[#071B34] flex flex-col font-sans relative">
      
      {/* AUTH NAVBAR */}
      <header className="w-full bg-[#071B34] border-b border-white/10 px-4 sm:px-8 py-3 flex items-center justify-between z-30 shrink-0 shadow-md">
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

      {/* MAIN AUTH BODY */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-x-hidden">
        {/* LEFT COLUMN: Hospital Showcase (55% Desktop) */}
        <div className="relative lg:w-[55%] min-h-[220px] lg:min-h-[calc(100vh-57px)] bg-[#071B34] flex flex-col justify-end p-6 sm:p-12 overflow-hidden shrink-0">
          {/* Background Hospital Image */}
          <div className="absolute inset-0 z-0">
            <img
              src="/images/mediflow-hospital-hero.jpg"
              alt="Mediflow Hospital Environment"
              className="w-full h-full object-cover object-center lg:object-[center_35%] scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#071B34] via-[#071B34]/85 to-[#071B34]/40" />
          </div>

          {/* Bottom Hero Overlay Content */}
          <div className="relative z-10 max-w-lg">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-semibold mb-4">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Enterprise Hospital SaaS Platform</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-3">
              Smarter hospital operations. <br />
              <span className="text-cyan-300">Better patient care.</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-6 hidden sm:block">
              Connect admissions, wards, operating theatres, and sterilization workflows into one unified clinical intelligence platform.
            </p>

            <div className="hidden sm:grid grid-cols-3 gap-3 pt-4 border-t border-white/10 text-xs">
              <div>
                <div className="font-extrabold text-white text-lg">98%</div>
                <div className="text-[11px] text-slate-300">Workflow Accuracy</div>
              </div>
              <div>
                <div className="font-extrabold text-cyan-300 text-lg">45%</div>
                <div className="text-[11px] text-slate-300">Delay Reduction</div>
              </div>
              <div>
                <div className="font-extrabold text-white text-lg">24/7</div>
                <div className="text-[11px] text-slate-300">Real-Time Monitoring</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: High-Contrast Auth Card Container (45% Desktop) */}
        <div className="flex-1 min-h-[calc(100vh-280px)] lg:min-h-[calc(100vh-57px)] bg-slate-50 dark:bg-[#041226] flex items-center justify-center p-4 sm:p-8 lg:p-12">
          <div className="w-full max-w-[430px] bg-white dark:bg-[#0B2545] rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-200 dark:border-slate-800">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
