"use client";

import Link from "next/link";

export function AboutSection() {
  return (
    <section id="about" className="py-24 bg-[#0B2545] border-t border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl group">
              <img
                src="/images/mediflow-hospital-hero.jpg"
                alt="Mediflow Clinical Operations Team"
                className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071B34] via-[#071B34]/60 to-transparent flex items-end p-8">
                <div>
                  <div className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-1">OUR MISSION</div>
                  <div className="text-xl font-bold text-white">Empowering Clinical Teams With Real-Time Intelligence</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              ABOUT MEDIFLOW-AI
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Transforming Hospital Operations Across India & Beyond
            </h2>
            <p className="text-base text-slate-300 leading-relaxed">
              Mediflow-AI was engineered by healthcare operational experts and clinical technology pioneers to eliminate administrative latency, streamline surgical turnover, and improve patient care continuity.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#071B34] border border-white/10">
                <div className="text-2xl font-extrabold text-white">50+</div>
                <div className="text-xs text-slate-400">Hospitals Connected</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#071B34] border border-white/10">
                <div className="text-2xl font-extrabold text-cyan-400">300,000+</div>
                <div className="text-xs text-slate-400">Patient Journeys Managed</div>
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
      </div>
    </section>
  );
}
