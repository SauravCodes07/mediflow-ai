"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "../brand/Logo";
import { useAuth } from "@/lib/auth-context";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/#features" },
  { label: "Departments", href: "/#departments" },
  { label: "Solutions", href: "/#solutions" },
  { label: "Resources", href: "/#resources" },
  { label: "Pricing", href: "/#pricing" },
  { label: "About Us", href: "/#about" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#03122D]/90 backdrop-blur-md border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] py-3"
          : "bg-transparent border-b border-white/5 py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="inline-flex items-center group" aria-label="Mediflow-AI Home">
          <Logo size="md" showTagline={true} />
        </Link>

        {/* Center: Desktop Navigation Links */}
        <nav aria-label="Primary Navigation" className="hidden lg:flex items-center space-x-7">
          {LINKS.map((l, index) => (
            <a
              key={l.href}
              href={l.href}
              className={`text-sm font-medium transition-colors hover:text-cyan-400 relative py-1 ${
                index === 0 ? "text-cyan-400 font-semibold" : "text-slate-300"
              }`}
            >
              {l.label}
              {index === 0 && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full shadow-[0_0_8px_#18D8E8]" />
              )}
            </a>
          ))}
        </nav>

        {/* Right: CTA Actions */}
        <div className="hidden sm:flex items-center space-x-4">
          {user ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center space-x-2 px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 rounded-xl shadow-[0_0_20px_rgba(24,216,232,0.3)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Dashboard</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-slate-200 bg-white/5 hover:bg-white/10 border border-white/15 rounded-xl transition-all hover:border-cyan-400/40"
              >
                <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Sign in</span>
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center space-x-2 px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 rounded-xl shadow-[0_0_20px_rgba(24,216,232,0.3)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Get Started</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="lg:hidden p-2.5 rounded-xl bg-white/5 text-slate-200 hover:bg-white/10 border border-white/10"
          aria-label="Open Navigation Menu"
          onClick={() => setDrawerOpen(true)}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden flex justify-end"
          onClick={() => setDrawerOpen(false)}
        >
          <div
            className="w-4/5 max-w-sm h-full bg-[#07152D] border-l border-white/10 p-6 flex flex-col justify-between shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <Logo size="sm" showTagline={false} />
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white"
                  aria-label="Close menu"
                >
                  ✕
                </button>
              </div>

              <div className="flex flex-col space-y-4 mt-6">
                {LINKS.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setDrawerOpen(false)}
                    className="text-base font-medium text-slate-200 hover:text-cyan-400 transition-colors py-2 border-b border-white/5"
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="flex flex-col space-y-3 pt-6 border-t border-white/10">
              {user ? (
                <Link
                  href="/dashboard"
                  onClick={() => setDrawerOpen(false)}
                  className="w-full text-center py-2.5 text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl font-semibold shadow-lg"
                >
                  Dashboard →
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setDrawerOpen(false)}
                    className="w-full text-center py-2.5 text-slate-200 bg-white/5 rounded-xl font-medium border border-white/10"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setDrawerOpen(false)}
                    className="w-full text-center py-2.5 text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl font-semibold shadow-lg"
                  >
                    Get Started →
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
