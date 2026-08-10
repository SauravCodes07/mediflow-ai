/**
 * Original vector illustration — hospital corridor / monitoring scene,
 * used as the auth pages' full-bleed background beneath a navy overlay.
 */
export function AuthCorridorScene({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 900 1200" className={className} preserveAspectRatio="xMidYMid slice" role="img" aria-label="Illustration of a hospital corridor with monitoring equipment">
      <defs>
        <linearGradient id="corrBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0a1a33" />
          <stop offset="100%" stopColor="#0d2a52" />
        </linearGradient>
        <linearGradient id="floorGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0c2144" />
          <stop offset="100%" stopColor="#05101f" />
        </linearGradient>
      </defs>
      <rect width="900" height="1200" fill="url(#corrBg)" />

      {/* perspective corridor */}
      <polygon points="0,1200 900,1200 620,520 280,520" fill="url(#floorGrad)" />
      <polygon points="0,1200 280,520 280,0 0,0" fill="#0e2447" opacity="0.7" />
      <polygon points="900,1200 620,520 620,0 900,0" fill="#0e2447" opacity="0.5" />

      {/* ceiling lights */}
      {[220, 420, 620, 820, 1020].map((y, i) => (
        <rect key={i} x={330 + i * 4} y={y * 0.001 + 40 + i * 0} width="60" height="8" rx="4" fill="#eaf6ff" opacity={0.5 - i * 0.06} />
      ))}

      {/* monitor stack (right) */}
      <g transform="translate(700,650)">
        <rect width="90" height="70" rx="6" fill="#0a1c3a" stroke="#2c4b7c" strokeWidth="2" />
        <rect x="8" y="8" width="74" height="40" fill="#04101f" />
        <polyline points="12,30 24,30 30,14 38,42 46,20 54,30 78,30" fill="none" stroke="#12b8c4" strokeWidth="2" />
        <rect x="30" y="70" width="30" height="16" fill="#132c52" />
      </g>

      {/* clinician silhouette (left) */}
      <g transform="translate(150,720)" opacity="0.9">
        <ellipse cx="0" cy="330" rx="70" ry="16" fill="#020a17" opacity="0.4" />
        <rect x="-52" y="60" width="104" height="270" rx="30" fill="#183a68" />
        <circle cx="0" cy="10" r="42" fill="#e6eefb" />
        <rect x="-16" y="-6" width="32" height="14" rx="6" fill="#0e2a52" />
      </g>

      {/* soft glow accents */}
      <circle cx="450" cy="300" r="220" fill="#5ec8ff" opacity="0.06" />
    </svg>
  );
}
