"use client";

import Link from "next/link";

const TIMELINE_STEPS = [
  { step: "Problem", title: "Fragmented Data & Delays", desc: "Siloed department tools lead to communication gaps and patient wait times." },
  { step: "Intelligence", title: "Real-time Operations Layer", desc: "Mediflow-AI unifies admissions, wards, OT, and CSSD into a single source of truth." },
  { step: "Automation", title: "AI-Driven Workflows", desc: "Automated bed assignments, OT turnover alerts, and consent tracking." },
  { step: "Better Outcomes", title: "Streamlined Care Delivery", desc: "Reduced length of stay, faster turnaround, and higher patient satisfaction." },
];

export function AboutSection() {
  return (
    <section id="about" className="py-24 bg-[#0B2545] border-t border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          
          {/* LEFT: Hospital Interior Visual */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl group">
              <img
                src="/images/mediflow-hospital-interior.jpg"
                alt="Mediflow Hospital Interior Corridor and Staff"
                className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071B34] via-[#071B34]/60 to-transparent flex items-end p-8">
                <div>
                  <div className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-1">CLINICAL COLLABORATION</div>
                  <div className="text-xl font-bold text-white">Modern Hospital Architecture Built for Speed & Efficiency</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: About Copy & Counter Badges */}
          <div className="lg:col-span-6 space-y-6">
            <div className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              ABOUT MEDIFLOW-AI
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Transforming Hospital Operations Across Healthcare Systems
            </h2>
            <p className="text-base text-slate-300 leading-relaxed">
              Mediflow-AI was engineered by healthcare operational experts and clinical technology pioneers to eliminate administrative latency, streamline surgical turnover, and improve patient care continuity.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#071B34] border border-white/10">
                <div className="text-3xl font-extrabold text-white">50+</div>
                <div className="text-xs text-slate-400 font-semibold mt-1">Hospitals Connected</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#071B34] border border-white/10">
                <div className="text-3xl font-extrabold text-cyan-400">300,000+</div>
                <div className="text-xs text-slate-400 font-semibold mt-1">Patient Journeys Managed</div>
              </div>
            </div>

            <div className="pt-4 flex items-center space-x-4">
              <Link
                href="/signup"
                className="px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-md transition-all"
              >
                Join Mediflow Network →
              </Link>
              <Link
                href="/login"
                className="px-6 py-3 rounded-xl text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
              >
                Sign In to Platform
              </Link>
            </div>
          </div>

        </div>

        {/* Operational Transformation Timeline */}
        <div className="pt-8 border-t border-white/10">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-1">THE MEDIFLOW JOURNEY</div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">Operational Transformation Timeline</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {TIMELINE_STEPS.map((t, idx) => (
              <div key={t.step} className="p-5 rounded-2xl bg-[#071B34] border border-white/10 space-y-2 relative">
                <div className="flex items-center justify-between text-xs font-bold text-cyan-400">
                  <span>Step 0{idx + 1}</span>
                  <span className="uppercase tracking-widest">{t.step}</span>
                </div>
                <div className="text-base font-bold text-white">{t.title}</div>
                <div className="text-xs text-slate-400 leading-relaxed">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
