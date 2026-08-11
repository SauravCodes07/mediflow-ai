"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "../brand/Logo";
import { useAuth } from "@/lib/auth-context";
import { InstallAppButton } from "../ui/InstallAppButton";

const LINKS = [
  { label: "Home", href: "#hero" },
  { label: "Features", href: "#features" },
  { label: "Departments", href: "#departments" },
  { label: "Solutions", href: "#solutions" },
  { label: "Resources", href: "#resources" },
  { label: "Pricing", href: "#pricing" },
  { label: "About Us", href: "#about" },
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

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header
      className={`sticky top-0 left-0 right-0 z-50 h-20 w-full shrink-0 transition-all duration-300 ${
        scrolled
          ? "bg-[#071B34]/95 backdrop-blur-md border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
          : "bg-[#071B34] border-b border-white/10"
      }`}
    >
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Branded Logo */}
        <Link href="/" className="inline-flex items-center shrink-0 group" aria-label="Mediflow-AI Home">
          <Logo size="md" variant="dark" showTagline={true} />
        </Link>

        {/* Center: Desktop Navigation Links */}
        <nav aria-label="Primary Navigation" className="hidden xl:flex items-center space-x-6">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => handleNavClick(e, l.href)}
              className="text-xs lg:text-sm font-medium text-slate-200 hover:text-cyan-400 transition-colors py-1 relative font-sans"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Right: CTA Actions */}
        <div className="hidden md:flex items-center space-x-3 shrink-0">
          {/* Install App Button */}
          <InstallAppButton variant="navbar" />

          {user ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center space-x-2 px-5 py-2.5 text-xs lg:text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 rounded-xl shadow-[0_4px_20px_rgba(22,119,255,0.3)] transition-all transform hover:-translate-y-0.5"
            >
              <span>Go to Dashboard</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex items-center space-x-2 px-4 py-2.5 text-xs lg:text-sm font-medium text-slate-200 bg-white/5 hover:bg-white/10 border border-white/15 rounded-xl transition-all hover:border-cyan-400/40"
              >
                <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Sign in</span>
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center space-x-2 px-5 py-2.5 text-xs lg:text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 rounded-xl shadow-[0_4px_20px_rgba(22,119,255,0.3)] transition-all transform hover:-translate-y-0.5"
              >
                <span>Get Started →</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile / Tablet Actions */}
        <div className="flex md:hidden items-center space-x-2">
          {/* Install App Button (always visible on mobile) */}
          <InstallAppButton variant="compact" />
          <button
            className="p-2.5 rounded-xl bg-white/10 text-white hover:bg-white/15 border border-white/15"
            aria-label="Open Navigation Menu"
            onClick={() => setDrawerOpen(true)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Animated Drawer Menu */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm xl:hidden flex justify-end"
          onClick={() => setDrawerOpen(false)}
        >
          <div
            className="w-4/5 max-w-sm h-full bg-[#071B34] border-l border-white/10 p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <Logo size="sm" variant="dark" showTagline={false} />
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-2 rounded-lg bg-white/5 text-slate-300 hover:text-white"
                  aria-label="Close menu"
                >
                  ✕
                </button>
              </div>

              <div className="flex flex-col space-y-3 mt-6">
                {LINKS.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={(e) => {
                      setDrawerOpen(false);
                      handleNavClick(e, l.href);
                    }}
                    className="text-sm font-semibold text-slate-200 hover:text-cyan-400 transition-colors py-2 border-b border-white/5"
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="flex flex-col space-y-3 pt-6 border-t border-white/10">
              {/* Install App Button in mobile drawer */}
              <div className="flex justify-center">
                <InstallAppButton variant="full" />
              </div>

              {user ? (
                <Link
                  href="/dashboard"
                  onClick={() => setDrawerOpen(false)}
                  className="w-full text-center py-3 text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl font-bold shadow-lg text-sm"
                >
                  Go to Dashboard →
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setDrawerOpen(false)}
                    className="w-full text-center py-3 text-slate-200 bg-white/5 rounded-xl font-semibold border border-white/10 text-sm"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setDrawerOpen(false)}
                    className="w-full text-center py-3 text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl font-bold shadow-lg text-sm"
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
