"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export function Hero() {
  const { user } = useAuth();

  return (
    <section id="hero" className="relative min-h-[88vh] pt-12 pb-20 overflow-hidden flex flex-col justify-between bg-[#071B34]">
      {/* Hospital Facility Background Visual with Layered Navy Gradients */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/mediflow-hospital-hero.jpg"
          alt="Mediflow Hospital Facility"
          className="w-full h-full object-cover object-center lg:object-[center_35%] transition-transform duration-1000 scale-105"
        />
        {/* Layered Gradient Overlays ensuring high text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#071B34] via-[#071B34]/90 to-[#071B34]/50 md:to-transparent" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#071B34]/95 via-[#071B34]/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-[#071B34] via-[#071B34]/80 to-transparent" />
      </div>

      {/* Hero Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 w-full flex-grow flex flex-col justify-center">
        <div className="max-w-2xl text-left">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-cyan-300 text-xs sm:text-sm font-extrabold tracking-wide shadow-[0_0_15px_rgba(22,119,255,0.25)] mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>AI-Powered Hospital Operations Platform</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] mb-6 max-w-full break-words">
            AI-powered Hospital Operations <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300">
              Command Center
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-200 font-medium leading-relaxed mb-8 max-w-xl">
            Connect admissions, wards, operating theatres and CSSD into one intelligent operational command center. Real-time visibility, automation, and bottleneck intelligence for Mediflow General Hospital.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 mb-12">
            <Link
              href={user ? "/dashboard" : "/signup"}
              className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-xl text-base font-extrabold text-white bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-[0_4px_25px_rgba(22,119,255,0.45)] transition-all transform hover:-translate-y-1 active:translate-y-0 cursor-pointer"
            >
              <span>{user ? "Go to Dashboard" : "Launch Command Center"}</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>

            <Link
              href={user ? "/dashboard" : "/login"}
              className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl text-base font-bold text-white bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur-md transition-all hover:border-cyan-400/40 hover:-translate-y-0.5 cursor-pointer"
            >
              <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" strokeWidth="2" strokeLinejoin="round" />
              </svg>
              <span>Explore Live Telemetry</span>
            </Link>
          </div>

          {/* 4 Hero Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2">
            <div className="p-3.5 rounded-2xl bg-[#0B2545]/80 border border-white/10 backdrop-blur-md hover:border-blue-400/50 hover:shadow-[0_8px_20px_rgba(22,119,255,0.25)] transition-all group">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 mb-2 group-hover:scale-110 transition-transform font-bold text-sm">
                🏥
              </div>
              <div className="text-xs font-extrabold text-white">Admissions & Wards</div>
              <div className="text-[11px] text-slate-300 font-medium">Live bed occupancy</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0B2545]/80 border border-white/10 backdrop-blur-md hover:border-indigo-400/50 hover:shadow-[0_8px_20px_rgba(99,102,241,0.25)] transition-all group">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-2 group-hover:scale-110 transition-transform font-bold text-sm">
                🔬
              </div>
              <div className="text-xs font-extrabold text-white">Operating Theatre</div>
              <div className="text-[11px] text-slate-300 font-medium">Turnover & delays</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0B2545]/80 border border-white/10 backdrop-blur-md hover:border-teal-400/50 hover:shadow-[0_8px_20px_rgba(20,184,166,0.25)] transition-all group">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-400 mb-2 group-hover:scale-110 transition-transform font-bold text-sm">
                🧪
              </div>
              <div className="text-xs font-extrabold text-white">CSSD Sterilization</div>
              <div className="text-[11px] text-slate-300 font-medium">Pack readiness logs</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0B2545]/80 border border-white/10 backdrop-blur-md hover:border-purple-400/50 hover:shadow-[0_8px_20px_rgba(168,85,247,0.25)] transition-all group">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 mb-2 group-hover:scale-110 transition-transform font-bold text-sm">
                ✨
              </div>
              <div className="text-xs font-extrabold text-white">AI Bottleneck Copilot</div>
              <div className="text-[11px] text-slate-300 font-medium">Predictive intelligence</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
