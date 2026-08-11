"use client";

import Link from "next/link";

const FEATURES = [
  {
    title: "Real-time Patient Flow",
    description: "Track every step of patient care from admission through discharge with automated stage updates.",
    badge: "PATIENT TRACKING",
    iconBg: "bg-blue-500/20 text-blue-400 border-blue-400/30",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
  },
  {
    title: "Operating Theatre Intelligence",
    description: "Monitor room availability, turnover schedules, procedure delays, and surgeon allocations live.",
    badge: "OT WORKFLOW",
    iconBg: "bg-amber-500/20 text-amber-400 border-amber-400/30",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "CSSD & Pack Sterilization",
    description: "Track instrument pack lifecycles, autoclave batch releases, and prevent expired pack usage automatically.",
    badge: "STERILIZATION",
    iconBg: "bg-teal-500/20 text-teal-400 border-teal-400/30",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
  {
    title: "Clinical AI Assistant",
    description: "Query operational metrics, receive bottleneck alerts, and get actionable recommendations in seconds.",
    badge: "AI AUTOMATION",
    iconBg: "bg-purple-500/20 text-purple-400 border-purple-400/30",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-[#071B34] border-t border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-3">
            ENTERPRISE CAPABILITIES
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            Engineered for Modern Hospital Operations
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Mediflow-AI provides clinical leaders with the speed, clarity, and automation needed for high-volume healthcare delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feat) => (
            <div
              key={feat.title}
              className="p-7 rounded-3xl bg-[#0B2545] border border-white/10 hover:border-cyan-400/40 hover:shadow-[0_10px_30px_rgba(22,119,255,0.2)] transition-all transform hover:-translate-y-1.5 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-2xl ${feat.iconBg} border flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                    {feat.icon}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                    {feat.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                  {feat.description}
                </p>
              </div>

              <Link
                href="/signup"
                className="inline-flex items-center space-x-2 text-xs font-bold text-cyan-400 group-hover:text-cyan-300 transition-colors pt-4 border-t border-white/10"
              >
                <span>Learn more</span>
                <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
