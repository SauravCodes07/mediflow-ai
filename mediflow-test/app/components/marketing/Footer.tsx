"use client";

import Link from "next/link";
import { Logo } from "../brand/Logo";

export function Footer() {
  return (
    <footer className="bg-[#030E22] border-t border-white/10 pt-16 pb-12 text-slate-400 text-sm font-sans select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Info */}
          <div className="lg:col-span-1 space-y-4">
            <Link href="/" aria-label="Mediflow-AI Home" className="inline-block">
              <Logo size="md" showTagline={true} />
            </Link>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Clinical operational command center & AI workflow intelligence platform.
            </p>
            <div className="flex items-center space-x-3 pt-1">
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-cyan-400 hover:border-cyan-400/40 transition-colors" aria-label="Facebook">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-cyan-400 hover:border-cyan-400/40 transition-colors" aria-label="Twitter">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-cyan-400 hover:border-cyan-400/40 transition-colors" aria-label="LinkedIn">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.74a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z"/></svg>
              </a>
            </div>
          </div>

          {/* Col 1: Platform */}
          <div className="space-y-3">
            <div className="text-white font-extrabold text-sm tracking-tight">Platform</div>
            <ul className="space-y-2 text-xs font-semibold">
              <li><a href="#features" className="hover:text-cyan-400 transition-colors">Features</a></li>
              <li><a href="#departments" className="hover:text-cyan-400 transition-colors">Departments</a></li>
              <li><a href="#solutions" className="hover:text-cyan-400 transition-colors">Solutions</a></li>
              <li><a href="#pricing" className="hover:text-cyan-400 transition-colors">Pricing</a></li>
            </ul>
          </div>

          {/* Col 2: Resources */}
          <div className="space-y-3">
            <div className="text-white font-extrabold text-sm tracking-tight">Resources</div>
            <ul className="space-y-2 text-xs font-semibold">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Case Studies</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Webinars</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Documentation</a></li>
            </ul>
          </div>

          {/* Col 3: Company */}
          <div className="space-y-3">
            <div className="text-white font-extrabold text-sm tracking-tight">Company</div>
            <ul className="space-y-2 text-xs font-semibold">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Contact Support</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Col 4: Demo Notice */}
          <div className="space-y-3">
            <div className="text-white font-extrabold text-sm tracking-tight">Demo Environment</div>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Synthetic data only. AI serves as operational decision support for hospital administrative teams.
            </p>
            <div className="inline-block px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 text-[10px] font-bold">
              ● Mediflow General Hospital
            </div>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <div>
            © {new Date().getFullYear()} Mediflow-AI. All rights reserved.
          </div>
          <div className="text-slate-400 font-mono text-[11px]">
            Demo environment — synthetic data only
          </div>
        </div>
      </div>
    </footer>
  );
}
