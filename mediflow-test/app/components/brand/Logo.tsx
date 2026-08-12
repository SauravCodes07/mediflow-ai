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
    sm: { box: 32, icon: 28, text: "text-base", sub: "text-[10px]" },
    md: { box: 40, icon: 36, text: "text-xl", sub: "text-[11px]" },
    lg: { box: 48, icon: 44, text: "text-2xl", sub: "text-xs" },
  };

  const current = iconSizes[size] || iconSizes.md;
  const isDarkBg = variant === "dark";

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Brand Heart + ECG Icon Box */}
      <div
        className="relative flex items-center justify-center shrink-0 rounded-xl bg-[#06152B] p-0.5 border border-cyan-400/40 shadow-sm overflow-hidden"
        style={{ width: current.box, height: current.box, minWidth: current.box, minHeight: current.box }}
      >
        <img
          src="/icons/logo-icon.png"
          alt="Mediflow-AI"
          style={{ width: current.icon, height: current.icon }}
          className="object-contain shrink-0 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]"
        />
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
