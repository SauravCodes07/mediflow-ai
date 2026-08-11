import React from "react";

interface LogoProps {
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "dark" | "light"; // "dark" for dark navy backgrounds, "light" for white/light backgrounds
  className?: string;
}

export function Logo({
  showTagline = true,
  size = "md",
  variant = "dark",
  className = "",
}: LogoProps) {
  const iconSizes = {
    sm: { box: 32, icon: 20, text: "text-base", sub: "text-[10px]" },
    md: { box: 40, icon: 24, text: "text-xl", sub: "text-[11px]" },
    lg: { box: 48, icon: 30, text: "text-2xl", sub: "text-xs" },
  };

  const current = iconSizes[size] || iconSizes.md;
  const isDarkBg = variant === "dark";

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Brand Heart + ECG Icon Box */}
      <div
        className="relative flex items-center justify-center shrink-0 rounded-xl bg-gradient-to-br from-blue-600/20 via-cyan-500/20 to-blue-700/30 p-1.5 border border-cyan-400/40 shadow-sm"
        style={{ width: current.box, height: current.box, minWidth: current.box, minHeight: current.box }}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: current.icon, height: current.icon }}
          className="text-cyan-400 shrink-0"
        >
          {/* Heart Outline */}
          <path
            d="M16 27.5C16 27.5 4 20.2 4 12.2C4 8.2 7.2 5 11.2 5C13.6 5 15.7 6.2 16 8C16.3 6.2 18.4 5 20.8 5C24.8 5 28 8.2 28 12.2C28 20.2 16 27.5 16 27.5Z"
            stroke="url(#logo_grad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Pulse ECG */}
          <path
            d="M7 14.5H11L13 10.5L16 18.5L19 12.5L20.5 14.5H25"
            stroke="#2F80ED"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Plus symbol */}
          <path
            d="M23 21.5V25.5M21 23.5H25"
            stroke="#1677FF"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="logo_grad" x1="4" y1="5" x2="28" y2="27.5" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2F80ED" />
              <stop offset="0.5" stopColor="#1677FF" />
              <stop offset="1" stopColor="#071B34" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col justify-center leading-none">
        <span
          className={`${current.text} font-extrabold tracking-tight font-sans ${
            isDarkBg ? "text-white" : "text-[#0B1F3A]"
          }`}
        >
          Mediflow
          <span className="text-[#1677FF] font-black">-AI</span>
        </span>
        {showTagline && (
          <span
            className={`${current.sub} font-medium tracking-normal mt-0.5 ${
              isDarkBg ? "text-slate-300" : "text-slate-500"
            }`}
          >
            Smarter Healthcare. Better Outcomes.
          </span>
        )}
      </div>
    </div>
  );
}
