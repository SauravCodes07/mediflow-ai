"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export function Hero() {
  const { user } = useAuth();

  return (
    <section className="relative min-h-[92vh] pt-28 pb-20 overflow-hidden flex flex-col justify-between bg-[#071B34]">
      {/* Background Hospital Visual with Responsive Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/mediflow-hospital-hero.jpg"
          alt="Mediflow Hospital Facility"
          className="w-full h-full object-cover object-center lg:object-[center_30%] transition-transform duration-1000 scale-105"
        />
        {/* Layered Gradient Overlays to make text pop while keeping hospital recognizable */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#071B34] via-[#071B34]/85 to-[#071B34]/40 md:to-transparent" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#071B34]/95 via-[#071B34]/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-[#071B34] via-[#071B34]/80 to-transparent" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 w-full flex-grow flex flex-col justify-center">
        <div className="max-w-2xl text-left">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs sm:text-sm font-semibold tracking-wide shadow-[0_0_15px_rgba(22,119,255,0.25)] mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>AI-Powered Hospital Management System</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] mb-6">
            Smarter workflows. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300">
              Better patient care.
            </span>
          </h1>

          {/* Supporting Subtext */}
          <p className="text-base sm:text-lg text-slate-200 font-normal leading-relaxed mb-8 max-w-xl">
            Mediflow-AI connects Admissions, Wards, OT, OPD and more in a single platform — giving you real-time visibility, automation and intelligent insights to save time, reduce delays and improve outcomes.
          </p>

          {/* CTA Button Group */}
          <div className="flex flex-wrap items-center gap-4 mb-12">
            <Link
              href={user ? "/dashboard" : "/signup"}
              className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-[0_4px_25px_rgba(22,119,255,0.45)] transition-all transform hover:-translate-y-1 active:translate-y-0"
            >
              <span>{user ? "Go to Dashboard" : "Request a Demo"}</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>

            <Link
              href={user ? "/dashboard" : "/login"}
              className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl text-base font-medium text-white bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur-md transition-all hover:border-cyan-400/40 hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" strokeWidth="2" strokeLinejoin="round" />
              </svg>
              <span>{user ? "Explore Live Dashboard" : "Watch Overview"}</span>
            </Link>
          </div>

          {/* 4 Feature Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2">
            <div className="p-3.5 rounded-2xl bg-[#0B2545]/80 border border-white/10 backdrop-blur-md hover:border-blue-400/50 hover:shadow-[0_8px_20px_rgba(22,119,255,0.25)] transition-all group">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 mb-2 group-hover:scale-110 transition-transform">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div className="text-xs font-bold text-white">Real-time Tracking</div>
              <div className="text-[11px] text-slate-300">Every patient. Every step.</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0B2545]/80 border border-white/10 backdrop-blur-md hover:border-indigo-400/50 hover:shadow-[0_8px_20px_rgba(99,102,241,0.25)] transition-all group">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-2 group-hover:scale-110 transition-transform">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="text-xs font-bold text-white">AI-Powered Insights</div>
              <div className="text-[11px] text-slate-300">Smarter decisions. Better care.</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0B2545]/80 border border-white/10 backdrop-blur-md hover:border-teal-400/50 hover:shadow-[0_8px_20px_rgba(20,184,166,0.25)] transition-all group">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-400 mb-2 group-hover:scale-110 transition-transform">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div className="text-xs font-bold text-white">Smart Automation</div>
              <div className="text-[11px] text-slate-300">Reduce manual work. Save time.</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0B2545]/80 border border-white/10 backdrop-blur-md hover:border-amber-400/50 hover:shadow-[0_8px_20px_rgba(245,158,11,0.25)] transition-all group">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 mb-2 group-hover:scale-110 transition-transform">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="text-xs font-bold text-white">Secure & Compliant</div>
              <div className="text-[11px] text-slate-300">Built for healthcare standards.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Glass Statistical Metrics Bar */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 w-full">
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0B2545]/85 border border-white/15 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-white/10">
          <div className="flex items-center space-x-4 pt-4 md:pt-0 md:pl-4 first:pl-0 first:pt-0 group cursor-default">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 shrink-0 group-hover:scale-110 group-hover:bg-blue-500/30 transition-all">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight group-hover:text-blue-300 transition-colors">98%</div>
              <div className="text-xs sm:text-sm font-medium text-slate-300 mt-0.5">Workflow Accuracy</div>
            </div>
          </div>

          <div className="flex items-center space-x-4 pt-4 md:pt-0 md:pl-8 group cursor-default">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-400 shrink-0 group-hover:scale-110 group-hover:bg-teal-500/30 transition-all">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight group-hover:text-teal-300 transition-colors">45%</div>
              <div className="text-xs sm:text-sm font-medium text-slate-300 mt-0.5">Reduction in Delays</div>
            </div>
          </div>

          <div className="flex items-center space-x-4 pt-4 md:pt-0 md:pl-8 group cursor-default">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400 shrink-0 group-hover:scale-110 group-hover:bg-indigo-500/30 transition-all">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight group-hover:text-indigo-300 transition-colors">300+</div>
              <div className="text-xs sm:text-sm font-medium text-slate-300 mt-0.5">Surgeries Managed</div>
            </div>
          </div>

          <div className="flex items-center space-x-4 pt-4 md:pt-0 md:pl-8 group cursor-default">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-110 group-hover:bg-amber-500/30 transition-all">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight group-hover:text-amber-300 transition-colors">24/7</div>
              <div className="text-xs sm:text-sm font-medium text-slate-300 mt-0.5">Real-time Monitoring</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
