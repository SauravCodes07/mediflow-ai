"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "../ui/Button";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/#features" },
  { label: "Departments", href: "/#departments" },
  { label: "Solutions", href: "/#why" },
  { label: "Resources", href: "/#resources" },
  { label: "Pricing", href: "/#pricing" },
  { label: "About Us", href: "/#about" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        transition: "background-color .2s ease, border-color .2s ease, box-shadow .2s ease",
        background: scrolled ? "rgba(11,31,58,0.92)" : "transparent",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
        boxShadow: scrolled ? "var(--shadow-md)" : "none",
        backdropFilter: scrolled ? "blur(10px)" : "none",
      }}
    >
      <div className="container" style={{ height: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" className="row" style={{ gap: "var(--space-2)" }} aria-label="Mediflow-AI home">
          <span
            aria-hidden
            style={{ width: 34, height: 34, borderRadius: 9, background: "var(--color-primary)", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}
          >
            M
          </span>
          <span className="stack" style={{ gap: 0, lineHeight: 1.1 }}>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: "var(--fs-base)" }}>Mediflow-AI</span>
            <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 11 }}>Hospital Operations Platform</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="row" style={{ gap: "var(--space-6)" }}>
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="nav-link"
              style={{ color: "rgba(255,255,255,0.82)", fontSize: "var(--fs-sm)", fontWeight: 500 }}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="row navbar-actions" style={{ gap: "var(--space-3)" }}>
          <Link href="/login">
            <Button variant="ghost" style={{ color: "#fff" }}>Sign in</Button>
          </Link>
          <Link href="/signup">
            <Button variant="primary">Get Started</Button>
          </Link>
        </div>

        <button
          className="icon-btn navbar-burger"
          aria-label="Open navigation menu"
          aria-expanded={drawerOpen}
          onClick={() => setDrawerOpen(true)}
          style={{ background: "transparent", borderColor: "rgba(255,255,255,0.2)", color: "#fff" }}
        >
          ☰
        </button>
      </div>

      {drawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(5,12,24,0.6)" }}
          onClick={() => setDrawerOpen(false)}
        >
          <div
            className="stack"
            onClick={(e) => e.stopPropagation()}
            style={{ marginLeft: "auto", width: "min(320px, 84vw)", height: "100%", background: "var(--color-navy)", padding: "var(--space-6)", gap: "var(--space-2)" }}
          >
            <div className="row" style={{ justifyContent: "space-between", marginBottom: "var(--space-4)" }}>
              <span style={{ color: "#fff", fontWeight: 700 }}>Menu</span>
              <button className="icon-btn" onClick={() => setDrawerOpen(false)} aria-label="Close navigation menu" style={{ background: "transparent", borderColor: "rgba(255,255,255,0.2)", color: "#fff" }}>
                ✕
              </button>
            </div>
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setDrawerOpen(false)} style={{ color: "rgba(255,255,255,0.85)", padding: "var(--space-3) 0", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                {l.label}
              </a>
            ))}
            <div className="stack" style={{ gap: "var(--space-3)", marginTop: "var(--space-5)" }}>
              <Link href="/login" onClick={() => setDrawerOpen(false)}>
                <Button variant="secondary" block>Sign in</Button>
              </Link>
              <Link href="/signup" onClick={() => setDrawerOpen(false)}>
                <Button variant="primary" block>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
