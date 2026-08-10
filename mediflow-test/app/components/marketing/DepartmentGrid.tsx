"use client";

import Link from "next/link";

const DEPARTMENTS = [
  {
    title: "Admissions",
    description: "Patient intake and consent management made simple.",
    href: "/admissions",
    color: "blue",
    iconBg: "bg-blue-500/20 text-blue-400 border-blue-400/30",
    hoverBorder: "hover:border-blue-500/50 hover:shadow-[0_0_25px_rgba(22,119,255,0.2)]",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
    ),
  },
  {
    title: "Wards",
    description: "Bed management and patient flow, in real-time.",
    href: "/wards",
    color: "teal",
    iconBg: "bg-teal-500/20 text-teal-400 border-teal-400/30",
    hoverBorder: "hover:border-teal-500/50 hover:shadow-[0_0_25px_rgba(20,217,181,0.2)]",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    title: "OPD",
    description: "Streamline consultations and reduce waiting times.",
    href: "/patients",
    color: "purple",
    iconBg: "bg-purple-500/20 text-purple-400 border-purple-400/30",
    hoverBorder: "hover:border-purple-500/50 hover:shadow-[0_0_25px_rgba(139,92,246,0.2)]",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    title: "Operating Theatre",
    description: "Real-time OT scheduling and workflows.",
    href: "/ot",
    color: "orange",
    iconBg: "bg-orange-500/20 text-orange-400 border-orange-400/30",
    hoverBorder: "hover:border-orange-500/50 hover:shadow-[0_0_25px_rgba(255,159,67,0.2)]",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "Analytics",
    description: "Operational dashboards and insights that matter.",
    href: "/analytics",
    color: "cyan",
    iconBg: "bg-cyan-500/20 text-cyan-400 border-cyan-400/30",
    hoverBorder: "hover:border-cyan-500/50 hover:shadow-[0_0_25px_rgba(24,216,232,0.2)]",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: "Emergency",
    description: "Alerts and critical event management.",
    href: "/alerts",
    color: "red",
    iconBg: "bg-rose-500/20 text-rose-400 border-rose-400/30",
    hoverBorder: "hover:border-rose-500/50 hover:shadow-[0_0_25px_rgba(255,77,94,0.2)]",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
  },
];

export function DepartmentGrid() {
  return (
    <section id="departments" className="py-24 bg-[#020B1C] relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-3">
            ONE PLATFORM
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            One Platform. Every Department.
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Unify your entire hospital operations in one intelligent platform.
          </p>
        </div>

        {/* 6 Department Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {DEPARTMENTS.map((dept) => (
            <Link
              key={dept.title}
              href={dept.href}
              className={`p-6 sm:p-7 rounded-3xl bg-[#0A1B35] border border-white/10 ${dept.hoverBorder} transition-all transform hover:-translate-y-1 group flex items-start justify-between space-x-4`}
            >
              <div className="flex items-start space-x-4">
                <div
                  className={`w-12 h-12 rounded-2xl ${dept.iconBg} border flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}
                >
                  {dept.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors mb-1.5">
                    {dept.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {dept.description}
                  </p>
                </div>
              </div>

              {/* Arrow Icon */}
              <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 group-hover:bg-cyan-500/20 group-hover:border-cyan-400/40 shrink-0 transition-all">
                <svg className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
