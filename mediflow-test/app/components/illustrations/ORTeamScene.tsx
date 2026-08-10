/**
 * Original vector illustration — abstract operating-theatre scene
 * (overhead lights, monitor, gowned team as simplified silhouettes).
 */
export function ORTeamScene({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 700 500" className={className} preserveAspectRatio="xMidYMid slice" role="img" aria-label="Illustration of an operating theatre team at work">
      <defs>
        <linearGradient id="orBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d223f" />
          <stop offset="100%" stopColor="#05132a" />
        </linearGradient>
        <radialGradient id="lightGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#eaf6ff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#eaf6ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="700" height="500" fill="url(#orBg)" />

      {/* overhead surgical light */}
      <circle cx="350" cy="70" r="130" fill="url(#lightGlow)" opacity="0.5" />
      <g transform="translate(350,60)">
        <circle r="60" fill="#132c52" stroke="#2c4b7c" strokeWidth="3" />
        <circle r="42" fill="#0d223f" />
        {Array.from({ length: 10 }).map((_, i) => {
          const a = (i / 10) * Math.PI * 2;
          return <circle key={i} cx={Math.cos(a) * 30} cy={Math.sin(a) * 30} r="6" fill="#eaf6ff" opacity="0.9" />;
        })}
      </g>

      {/* monitor */}
      <g transform="translate(90,180)">
        <rect width="120" height="90" rx="6" fill="#0a1c3a" stroke="#274672" strokeWidth="2" />
        <rect x="10" y="10" width="100" height="55" fill="#04101f" />
        <polyline points="14,45 30,45 38,20 46,55 56,30 64,45 106,45" fill="none" stroke="#12b8c4" strokeWidth="2" />
        <text x="60" y="80" textAnchor="middle" fontFamily="Arial" fontSize="10" fill="#7fe0e6">98 · 68</text>
        <rect x="50" y="90" width="20" height="16" fill="#132c52" />
      </g>

      {/* three gowned figures, simplified */}
      {[
        { x: 300, tone: "#1c3f70" },
        { x: 400, tone: "#173863" },
        { x: 480, tone: "#1c3f70" },
      ].map((p, i) => (
        <g key={i} transform={`translate(${p.x},220)`}>
          <ellipse cx="0" cy="120" rx="46" ry="14" fill="#020a17" opacity="0.4" />
          <rect x="-34" y="10" width="68" height="110" rx="20" fill={p.tone} />
          <circle cx="0" cy="-6" r="26" fill="#dfe9f5" />
          <path d="M -26 -6 a26 26 0 0 1 52 0 z" fill="#e8f0fd" />
          <rect x="-10" y="-16" width="20" height="8" rx="4" fill="#0e2a52" />
        </g>
      ))}

      {/* patient table */}
      <rect x="270" y="330" width="160" height="18" rx="6" fill="#132c52" />
      <rect x="290" y="348" width="10" height="40" fill="#0d223f" />
      <rect x="410" y="348" width="10" height="40" fill="#0d223f" />
    </svg>
  );
}
