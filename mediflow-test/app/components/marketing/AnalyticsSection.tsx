"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { HOSPITAL_NAME } from "@/lib/config/hospital";

interface TooltipData {
  title: string;
  detail: string;
  badge: string;
  updated: string;
}

const METRIC_TOOLTIPS: Record<string, TooltipData> = {
  admissions: {
    title: "Admissions Throughput",
    detail: "94% of daily admissions target achieved",
    badge: "+8% vs previous period",
    updated: "Last updated: 12 seconds ago",
  },
  ot: {
    title: "Operating Theatre Utilization",
    detail: "82% active utilization across operating rooms",
    badge: "14 of 17 ORs currently in active surgery",
    updated: "Last updated: 12 seconds ago",
  },
  cssd: {
    title: "CSSD Instrument Pack Readiness",
    detail: "96% instrument packs currently ready for use",
    badge: "48 sterilization cycles completed today",
    updated: "Last updated: 12 seconds ago",
  },
};

export function AnalyticsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const leftContentRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const bgGlowRef = useRef<HTMLDivElement>(null);
  const cardShineRef = useRef<HTMLDivElement>(null);

  // Viewport entrance for progress bars
  const [isVisible, setIsVisible] = useState(false);
  const [, setActiveMetric] = useState<string | null>(null);

  // Touch device check
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Check touch capabilities
    if (typeof window !== "undefined") {
      setIsTouch(!window.matchMedia("(hover: hover)").matches);
    }

    // Intersection observer for section entrance progress animation
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Smooth Mouse Parallax & Tilt loop via requestAnimationFrame
  useEffect(() => {
    let animationFrameId: number;

    // Target values
    let targetSectionX = 0;
    let targetSectionY = 0;
    let targetPixelX = 0;
    let targetPixelY = 0;

    let targetCardX = 0;
    let targetCardY = 0;
    let targetCardPixelX = 0;
    let targetCardPixelY = 0;

    // Current smooth (lerped) values
    let currentSectionX = 0;
    let currentSectionY = 0;
    let currentPixelX = 0;
    let currentPixelY = 0;

    let currentCardX = 0;
    let currentCardY = 0;
    let currentCardPixelX = 0;
    let currentCardPixelY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current || isTouch) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const relativeY = e.clientY - rect.top;

      // Normalized coordinates from -0.5 to 0.5
      targetSectionX = relativeX / rect.width - 0.5;
      targetSectionY = relativeY / rect.height - 0.5;

      targetPixelX = relativeX;
      targetPixelY = relativeY;

      // Card-specific coordinates if hovering section
      if (cardRef.current) {
        const cardRect = cardRef.current.getBoundingClientRect();
        const cardRelX = e.clientX - cardRect.left;
        const cardRelY = e.clientY - cardRect.top;

        targetCardX = Math.max(-0.5, Math.min(0.5, cardRelX / cardRect.width - 0.5));
        targetCardY = Math.max(-0.5, Math.min(0.5, cardRelY / cardRect.height - 0.5));

        targetCardPixelX = cardRelX;
        targetCardPixelY = cardRelY;
      }
    };

    const handleMouseLeave = () => {
      targetSectionX = 0;
      targetSectionY = 0;
      targetCardX = 0;
      targetCardY = 0;
    };

    const sectionEl = sectionRef.current;
    if (sectionEl) {
      sectionEl.addEventListener("mousemove", handleMouseMove);
      sectionEl.addEventListener("mouseleave", handleMouseLeave);
    }

    const animate = () => {
      if (isTouch) return;

      // Lerp factor for smooth SaaS-grade spring transitions
      const lerp = 0.08;

      currentSectionX += (targetSectionX - currentSectionX) * lerp;
      currentSectionY += (targetSectionY - currentSectionY) * lerp;

      currentPixelX += (targetPixelX - currentPixelX) * lerp;
      currentPixelY += (targetPixelY - currentPixelY) * lerp;

      currentCardX += (targetCardX - currentCardX) * lerp;
      currentCardY += (targetCardY - currentCardY) * lerp;

      currentCardPixelX += (targetCardPixelX - currentCardPixelX) * lerp;
      currentCardPixelY += (targetCardPixelY - currentCardPixelY) * lerp;

      // Apply background parallax (approx ±8px)
      if (backgroundRef.current) {
        backgroundRef.current.style.transform = `translate3d(${currentSectionX * -16}px, ${currentSectionY * -16}px, 0)`;
      }

      // Apply left content parallax (approx ±3px)
      if (leftContentRef.current) {
        leftContentRef.current.style.transform = `translate3d(${currentSectionX * 6}px, ${currentSectionY * 6}px, 0)`;
      }

      // Apply right card parallax (approx ±6px) & subtle 3D tilt (max ±2deg)
      if (cardRef.current) {
        const tiltX = Math.max(-2, Math.min(2, -currentCardY * 4));
        const tiltY = Math.max(-2, Math.min(2, currentCardX * 4));
        const translateX = currentSectionX * 12;
        const translateY = currentSectionY * 12;

        cardRef.current.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      }

      // Update background mouse glow
      if (bgGlowRef.current) {
        bgGlowRef.current.style.background = `radial-gradient(450px circle at ${currentPixelX}px ${currentPixelY}px, rgba(37, 99, 235, 0.12), transparent 70%)`;
      }

      // Update card cursor shine highlight
      if (cardShineRef.current) {
        cardShineRef.current.style.background = `radial-gradient(300px circle at ${currentCardPixelX}px ${currentCardPixelY}px, rgba(59, 130, 246, 0.14), transparent 60%)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (sectionEl) {
        sectionEl.removeEventListener("mousemove", handleMouseMove);
        sectionEl.removeEventListener("mouseleave", handleMouseLeave);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [isTouch]);

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-[#071B34] text-white relative overflow-hidden font-sans select-none [perspective:1000px]"
    >
      {/* 2. Mouse Radial Glow Layer */}
      <div
        ref={bgGlowRef}
        className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-500"
      />

      {/* 12. Animated Telemetry Background Particles */}
      <div
        ref={backgroundRef}
        className="absolute inset-0 z-0 pointer-events-none transition-transform duration-75 ease-out"
      >
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-35" />

        {/* Telemetry Particles */}
        <div className="absolute top-[15%] left-[10%] w-2 h-2 rounded-full bg-cyan-400/40 shadow-[0_0_8px_rgba(34,211,238,0.5)] animate-telemetry-particle" style={{ animationDelay: "0s" }} />
        <div className="absolute top-[35%] left-[45%] w-1.5 h-1.5 rounded-full bg-blue-400/40 shadow-[0_0_6px_rgba(96,165,250,0.5)] animate-telemetry-particle" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-[70%] left-[20%] w-2 h-2 rounded-full bg-indigo-400/30 shadow-[0_0_8px_rgba(129,140,248,0.4)] animate-telemetry-particle" style={{ animationDelay: "3s" }} />
        <div className="absolute top-[20%] right-[15%] w-2.5 h-2.5 rounded-full bg-emerald-400/40 shadow-[0_0_10px_rgba(52,211,153,0.5)] animate-telemetry-particle" style={{ animationDelay: "2s" }} />
        <div className="absolute top-[60%] right-[30%] w-1.5 h-1.5 rounded-full bg-cyan-300/40 shadow-[0_0_6px_rgba(103,232,249,0.5)] animate-telemetry-particle" style={{ animationDelay: "4.5s" }} />
        <div className="absolute top-[80%] right-[10%] w-2 h-2 rounded-full bg-purple-400/30 shadow-[0_0_8px_rgba(192,132,252,0.4)] animate-telemetry-particle" style={{ animationDelay: "1s" }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT CONTENT AREA */}
          <div ref={leftContentRef} className="lg:col-span-6 space-y-6 transition-transform duration-75 ease-out">
            
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold tracking-wide shadow-[0_0_15px_rgba(37,99,235,0.2)]">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>⚡ Real-Time Clinical Intelligence</span>
            </div>

            {/* 8. Hero / Section Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold tracking-tight leading-tight">
              Turn raw hospital data into{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 relative inline-block">
                real-time operational decisions.
              </span>
            </h2>

            {/* Subtitle */}
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
              Mediflow-AI centralizes live telemetry from admissions queues, surgical turnover logs, ward bed capacity, and CSSD sterilization batches into one command center dashboard.
            </p>

            {/* 7. Left Bullet Points with Interactions */}
            <div className="space-y-2.5 pt-2">
              {[
                "Predict bed bottlenecks before ER delays occur",
                "Automate consent form clearance for surgical intake",
                "Monitor instrument sterilization cycle readiness",
                "Streamline inter-unit patient transfers with live tracking",
              ].map((bullet) => (
                <div
                  key={bullet}
                  className="group flex items-center space-x-3.5 p-2 rounded-xl border border-transparent hover:border-emerald-500/20 hover:bg-emerald-500/[0.06] transition-all duration-200 ease-out cursor-default"
                >
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/30 group-hover:text-emerald-300 group-hover:shadow-[0_0_12px_rgba(16,185,129,0.5)] group-hover:scale-110 flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-200">
                    ✓
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-white group-hover:translate-x-[3px] transition-transform duration-200">
                    {bullet}
                  </span>
                </div>
              ))}
            </div>

            {/* 9. Interactive CTA Button */}
            <div className="pt-4">
              <Link
                href="/analytics"
                className="group relative inline-flex items-center space-x-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:via-blue-400 hover:to-cyan-400 text-white text-xs sm:text-sm font-bold shadow-[0_4px_25px_rgba(37,99,235,0.35)] hover:shadow-[0_6px_30px_rgba(37,99,235,0.5)] transition-all duration-200 hover:-translate-y-[2px] active:translate-y-0"
              >
                <span>View Operational Analytics</span>
                <span className="group-hover:translate-x-1.5 transition-transform duration-200 text-base leading-none">
                  →
                </span>
              </Link>
            </div>
          </div>

          {/* RIGHT OPERATIONAL SUMMARY CARD */}
          <div className="lg:col-span-6 [perspective:1000px]">
            <div
              ref={cardRef}
              className="relative p-6 sm:p-8 rounded-3xl bg-[#071B34]/90 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:border-cyan-400/40 hover:shadow-[0_25px_60px_rgba(0,0,0,0.65),0_0_35px_rgba(59,130,246,0.25)] transition-all duration-300 ease-out space-y-6 overflow-hidden transform-gpu"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* 10. Card Cursor Shine Layer */}
              <div
                ref={cardShineRef}
                className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-300"
              />

              {/* Card Header & 6. Live Data Indicator */}
              <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-cyan-400">
                    Live Hospital Operational Summary
                  </div>
                  <div className="text-lg font-bold text-white tracking-tight mt-0.5">
                    {HOSPITAL_NAME}
                  </div>
                </div>

                {/* Live Data Badge with Pulse & Tooltip */}
                <div className="relative group/badge">
                  <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-400 text-xs font-bold cursor-help transition-all duration-200 group-hover/badge:bg-emerald-500/25 group-hover/badge:border-emerald-400/50">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-dot-pulse" />
                    <span>LIVE DATA</span>
                  </span>

                  {/* Badge Hover Tooltip */}
                  <div className="absolute right-0 top-full mt-2 w-56 p-3 rounded-xl bg-slate-900/95 border border-emerald-500/30 backdrop-blur-md shadow-xl text-left opacity-0 scale-95 pointer-events-none group-hover/badge:opacity-100 group-hover/badge:scale-100 group-hover/badge:pointer-events-auto transition-all duration-200 z-30">
                    <div className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5 mb-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>LIVE DATA STREAM</span>
                    </div>
                    <div className="text-[11px] text-slate-300 leading-snug">
                      Operational metrics updated 12 seconds ago.
                    </div>
                  </div>
                </div>
              </div>

              {/* 4 & 5. Interactive Metric Rows with Viewport Progress Animation */}
              <div className="relative z-10 space-y-5">
                
                {/* Metric 1: Admissions Throughput */}
                <div
                  className="group/metric relative p-3 -mx-3 rounded-2xl hover:bg-white/[0.04] hover:border hover:border-white/10 transition-all duration-200 cursor-default"
                  onMouseEnter={() => setActiveMetric("admissions")}
                  onMouseLeave={() => setActiveMetric(null)}
                >
                  <div className="flex justify-between text-xs text-slate-300 font-medium mb-2">
                    <span className="group-hover/metric:text-white font-semibold transition-colors">
                      Admissions Throughput
                    </span>
                    <span className="font-extrabold text-white group-hover/metric:text-cyan-300 transition-colors">
                      94% Target Achieved
                    </span>
                  </div>

                  <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden relative group-hover/metric:h-3.5 transition-all duration-200 shadow-inner">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 relative overflow-hidden group-hover/metric:shadow-[0_0_15px_rgba(59,130,246,0.8)] transition-all duration-300"
                      style={{
                        width: isVisible ? "94%" : "0%",
                        transition: "width 1100ms cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    >
                      <div className="absolute inset-0 bg-white/25 animate-bar-shimmer opacity-0 group-hover/metric:opacity-100 transition-opacity" />
                    </div>
                  </div>

                  {/* Tooltip 1 */}
                  <div className="absolute left-0 bottom-full mb-2 w-full sm:w-72 p-3.5 rounded-2xl bg-slate-900/95 border border-cyan-500/30 backdrop-blur-xl shadow-2xl opacity-0 scale-95 pointer-events-none group-hover/metric:opacity-100 group-hover/metric:scale-100 transition-all duration-200 z-30">
                    <div className="text-xs font-extrabold text-cyan-300 mb-1">
                      {METRIC_TOOLTIPS.admissions.title}
                    </div>
                    <div className="text-xs text-slate-200 font-medium leading-tight">
                      {METRIC_TOOLTIPS.admissions.detail}
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px] pt-1.5 border-t border-white/10">
                      <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                        {METRIC_TOOLTIPS.admissions.badge}
                      </span>
                      <span className="text-slate-400">
                        {METRIC_TOOLTIPS.admissions.updated}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Metric 2: Operating Theatre Utilization */}
                <div
                  className="group/metric relative p-3 -mx-3 rounded-2xl hover:bg-white/[0.04] hover:border hover:border-white/10 transition-all duration-200 cursor-default"
                  onMouseEnter={() => setActiveMetric("ot")}
                  onMouseLeave={() => setActiveMetric(null)}
                >
                  <div className="flex justify-between text-xs text-slate-300 font-medium mb-2">
                    <span className="group-hover/metric:text-white font-semibold transition-colors">
                      Operating Theatre Utilization
                    </span>
                    <span className="font-extrabold text-white group-hover/metric:text-purple-300 transition-colors">
                      82% Active Utilization
                    </span>
                  </div>

                  <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden relative group-hover/metric:h-3.5 transition-all duration-200 shadow-inner">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-400 relative overflow-hidden group-hover/metric:shadow-[0_0_15px_rgba(168,85,247,0.8)] transition-all duration-300"
                      style={{
                        width: isVisible ? "82%" : "0%",
                        transition: "width 1100ms cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    >
                      <div className="absolute inset-0 bg-white/25 animate-bar-shimmer opacity-0 group-hover/metric:opacity-100 transition-opacity" />
                    </div>
                  </div>

                  {/* Tooltip 2 */}
                  <div className="absolute left-0 bottom-full mb-2 w-full sm:w-72 p-3.5 rounded-2xl bg-slate-900/95 border border-purple-500/30 backdrop-blur-xl shadow-2xl opacity-0 scale-95 pointer-events-none group-hover/metric:opacity-100 group-hover/metric:scale-100 transition-all duration-200 z-30">
                    <div className="text-xs font-extrabold text-purple-300 mb-1">
                      {METRIC_TOOLTIPS.ot.title}
                    </div>
                    <div className="text-xs text-slate-200 font-medium leading-tight">
                      {METRIC_TOOLTIPS.ot.detail}
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px] pt-1.5 border-t border-white/10">
                      <span className="text-indigo-300 font-bold bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                        {METRIC_TOOLTIPS.ot.badge}
                      </span>
                      <span className="text-slate-400">
                        {METRIC_TOOLTIPS.ot.updated}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Metric 3: CSSD Instrument Pack Readiness */}
                <div
                  className="group/metric relative p-3 -mx-3 rounded-2xl hover:bg-white/[0.04] hover:border hover:border-white/10 transition-all duration-200 cursor-default"
                  onMouseEnter={() => setActiveMetric("cssd")}
                  onMouseLeave={() => setActiveMetric(null)}
                >
                  <div className="flex justify-between text-xs text-slate-300 font-medium mb-2">
                    <span className="group-hover/metric:text-white font-semibold transition-colors">
                      CSSD Instrument Pack Readiness
                    </span>
                    <span className="font-extrabold text-white group-hover/metric:text-emerald-300 transition-colors">
                      96% Sterilization Ready
                    </span>
                  </div>

                  <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden relative group-hover/metric:h-3.5 transition-all duration-200 shadow-inner">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 relative overflow-hidden group-hover/metric:shadow-[0_0_15px_rgba(16,185,129,0.8)] transition-all duration-300"
                      style={{
                        width: isVisible ? "96%" : "0%",
                        transition: "width 1100ms cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    >
                      <div className="absolute inset-0 bg-white/25 animate-bar-shimmer opacity-0 group-hover/metric:opacity-100 transition-opacity" />
                    </div>
                  </div>

                  {/* Tooltip 3 */}
                  <div className="absolute left-0 bottom-full mb-2 w-full sm:w-72 p-3.5 rounded-2xl bg-slate-900/95 border border-emerald-500/30 backdrop-blur-xl shadow-2xl opacity-0 scale-95 pointer-events-none group-hover/metric:opacity-100 group-hover/metric:scale-100 transition-all duration-200 z-30">
                    <div className="text-xs font-extrabold text-emerald-300 mb-1">
                      {METRIC_TOOLTIPS.cssd.title}
                    </div>
                    <div className="text-xs text-slate-200 font-medium leading-tight">
                      {METRIC_TOOLTIPS.cssd.detail}
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px] pt-1.5 border-t border-white/10">
                      <span className="text-teal-300 font-bold bg-teal-500/10 px-2 py-0.5 rounded-md border border-teal-500/20">
                        {METRIC_TOOLTIPS.cssd.badge}
                      </span>
                      <span className="text-slate-400">
                        {METRIC_TOOLTIPS.cssd.updated}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
