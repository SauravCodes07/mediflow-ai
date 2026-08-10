"use client";

import Link from "next/link";

export function WhySection() {
  return (
    <section id="solutions" className="py-24 bg-[#07152D] relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT COLUMN: Connected Healthcare Ecosystem Interactive Node Visual */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md aspect-square rounded-3xl bg-[#0A1B35] border border-white/15 p-8 flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden group">
              
              {/* Outer Orbit Rings */}
              <div className="absolute inset-8 rounded-full border border-cyan-500/20 border-dashed animate-[spin_60s_linear_infinite]" />
              <div className="absolute inset-16 rounded-full border border-purple-500/20 animate-[spin_40s_linear_infinite_reverse]" />

              {/* Center Node: Mediflow Heart Logo */}
              <div className="relative z-10 w-24 h-24 rounded-3xl bg-gradient-to-br from-cyan-500/30 via-blue-600/30 to-purple-600/30 border-2 border-cyan-400 p-4 shadow-[0_0_40px_rgba(24,216,232,0.5)] flex items-center justify-center transform group-hover:scale-105 transition-transform duration-500">
                <svg className="w-12 h-12 text-cyan-300 drop-shadow-[0_0_10px_#18D8E8]" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 27.5C16 27.5 4 20.2 4 12.2C4 8.2 7.2 5 11.2 5C13.6 5 15.7 6.2 16 8C16.3 6.2 18.4 5 20.8 5C24.8 5 28 8.2 28 12.2C28 20.2 16 27.5 16 27.5Z" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M7 14.5H11.5L13.5 10.5L16.5 19L19.5 13L21 14.5H25" stroke="#18D8E8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M23 21.5V25.5M21 23.5H25" stroke="#2EA8FF" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>

              {/* Orbital Connected Department Nodes */}
              {/* Node 1: Top (Wards) */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-2xl bg-[#07152D] border border-teal-400/50 text-teal-400 flex items-center justify-center shadow-[0_0_15px_rgba(20,217,181,0.3)]">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>

              {/* Node 2: Top Right (Admissions) */}
              <div className="absolute top-20 right-8 w-12 h-12 rounded-2xl bg-[#07152D] border border-purple-400/50 text-purple-400 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>

              {/* Node 3: Bottom Right (Security) */}
              <div className="absolute bottom-20 right-8 w-12 h-12 rounded-2xl bg-[#07152D] border border-blue-400/50 text-blue-400 flex items-center justify-center shadow-[0_0_15px_rgba(22,119,255,0.3)]">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>

              {/* Node 4: Bottom (Emergency) */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-2xl bg-[#07152D] border border-rose-400/50 text-rose-400 flex items-center justify-center shadow-[0_0_15px_rgba(255,77,94,0.3)]">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>

              {/* Node 5: Bottom Left (Staff/Users) */}
              <div className="absolute bottom-20 left-8 w-12 h-12 rounded-2xl bg-[#07152D] border border-purple-400/50 text-purple-400 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>

              {/* Node 6: Top Left (OPD/Stethoscope) */}
              <div className="absolute top-20 left-8 w-12 h-12 rounded-2xl bg-[#07152D] border border-cyan-400/50 text-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(24,216,232,0.3)]">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>

            </div>
          </div>

          {/* RIGHT COLUMN: Content + Checklist + Testimonial Card */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
                AI-Powered Hospital Operations
              </h2>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-6">
                Mediflow-AI brings all your departments together into one intelligent ecosystem. Automate workflows, reduce errors and deliver exceptional patient care.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 border border-blue-400/30 transition-all"
              >
                <span>Explore Features</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>

            {/* Checklist items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {[
                "End-to-end visibility across departments",
                "AI-powered automation",
                "Reduced delays and wait times",
                "Better patient outcomes",
                "Secure architecture & data protection",
                "Scalable and future-ready platform",
              ].map((item) => (
                <div key={item} className="flex items-center space-x-3 text-slate-200 text-sm font-medium">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-400 flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Testimonial Glass Card */}
            <div className="p-6 rounded-2xl bg-[#0A1B35]/90 border border-white/10 backdrop-blur-md relative shadow-xl">
              <div className="text-3xl text-cyan-400 font-serif leading-none mb-2">“</div>
              <p className="text-sm text-slate-300 italic mb-4 leading-relaxed">
                Mediflow-AI has transformed the way we manage our hospital workflows. Delays are down, efficiency is up, and our teams love the clarity.
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 p-0.5 shrink-0">
                  <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-white">
                    AS
                  </div>
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Dr. Anika Sharma</div>
                  <div className="text-xs text-slate-400">Chief Medical Officer (Demo Preview)</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
