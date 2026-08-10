import React from "react";

interface LogoProps {
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Logo({ showTagline = true, size = "md", className = "" }: LogoProps) {
  const iconSizes = {
    sm: { w: 28, h: 28, text: "text-base", sub: "text-[9px]" },
    md: { w: 36, h: 36, text: "text-xl", sub: "text-[11px]" },
    lg: { w: 44, h: 44, text: "text-2xl", sub: "text-xs" },
  };

  const current = iconSizes[size] || iconSizes.md;

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Brand Heart+ECG Icon */}
      <div
        className="relative flex items-center justify-center shrink-0 rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-purple-600/20 p-2 border border-cyan-400/30 shadow-[0_0_15px_rgba(24,216,232,0.25)]"
        style={{ width: current.w, height: current.h }}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-cyan-400 drop-shadow-[0_0_8px_rgba(24,216,232,0.6)]"
        >
          {/* Heart path */}
          <path
            d="M16 27.5C16 27.5 4 20.2 4 12.2C4 8.2 7.2 5 11.2 5C13.6 5 15.7 6.2 16 8C16.3 6.2 18.4 5 20.8 5C24.8 5 28 8.2 28 12.2C28 20.2 16 27.5 16 27.5Z"
            stroke="url(#logo_grad)"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* ECG Pulse line across heart */}
          <path
            d="M7 14.5H11.5L13.5 10.5L16.5 19L19.5 13L21 14.5H25"
            stroke="#18D8E8"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Medical Plus Accent */}
          <path
            d="M23 21.5V25.5M21 23.5H25"
            stroke="#2EA8FF"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="logo_grad" x1="4" y1="5" x2="28" y2="27.5" gradientUnits="userSpaceOnUse">
              <stop stopColor="#18D8E8" />
              <stop offset="0.5" stopColor="#1677FF" />
              <stop offset="1" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Text & Tagline */}
      <div className="flex flex-col justify-center leading-none">
        <span className={`${current.text} font-extrabold tracking-tight text-white font-sans`}>
          Mediflow<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">-AI</span>
        </span>
        {showTagline && (
          <span className={`${current.sub} text-slate-400 font-medium tracking-normal mt-0.5`}>
            Smarter Healthcare. Better Outcomes.
          </span>
        )}
      </div>
    </div>
  );
}
