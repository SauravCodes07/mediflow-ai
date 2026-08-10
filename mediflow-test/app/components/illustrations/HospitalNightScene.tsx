/**
 * Original vector illustration — night hospital exterior with a lit
 * cross sign and ambulance silhouette. Built entirely from shapes/paths,
 * not a reproduction of any photo or existing artwork.
 */
export function HospitalNightScene({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 900 600"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Illustration of a modern hospital building at night"
    >
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a1a33" />
          <stop offset="60%" stopColor="#0b2145" />
          <stop offset="100%" stopColor="#123566" />
        </linearGradient>
        <linearGradient id="towerGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#16305c" />
          <stop offset="100%" stopColor="#0d2247" />
        </linearGradient>
        <radialGradient id="crossGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#5ec8ff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#5ec8ff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="900" height="600" fill="url(#skyGrad)" />

      {/* distant skyline */}
      <g opacity="0.35">
        <rect x="10" y="420" width="40" height="180" fill="#0d2247" />
        <rect x="60" y="380" width="34" height="220" fill="#0d2247" />
        <rect x="820" y="400" width="46" height="200" fill="#0d2247" />
        <rect x="760" y="440" width="36" height="160" fill="#0d2247" />
      </g>

      {/* main tower */}
      <rect x="230" y="120" width="330" height="440" rx="6" fill="url(#towerGrad)" stroke="#1c3d70" strokeWidth="2" />

      {/* window grid, some lit */}
      <g>
        {Array.from({ length: 9 }).map((_, row) =>
          Array.from({ length: 7 }).map((_, col) => {
            const lit = (row * 7 + col) % 3 !== 0;
            return (
              <rect
                key={`${row}-${col}`}
                x={250 + col * 42}
                y={145 + row * 44}
                width="26"
                height="30"
                rx="2"
                fill={lit ? "#ffd57a" : "#0a1c3a"}
                opacity={lit ? 0.85 : 0.6}
              />
            );
          })
        )}
      </g>

      {/* left wing */}
      <rect x="120" y="300" width="110" height="260" fill="#123361" stroke="#1c3d70" strokeWidth="2" />
      <g>
        {Array.from({ length: 5 }).map((_, row) =>
          Array.from({ length: 2 }).map((_, col) => (
            <rect
              key={`l-${row}-${col}`}
              x={140 + col * 42}
              y={320 + row * 42}
              width="24"
              height="26"
              rx="2"
              fill={(row + col) % 2 === 0 ? "#ffd57a" : "#0a1c3a"}
              opacity="0.8"
            />
          ))
        )}
      </g>

      {/* right wing */}
      <rect x="560" y="260" width="130" height="300" fill="#123361" stroke="#1c3d70" strokeWidth="2" />
      <g>
        {Array.from({ length: 6 }).map((_, row) =>
          Array.from({ length: 2 }).map((_, col) => (
            <rect
              key={`r-${row}-${col}`}
              x={580 + col * 46}
              y={280 + row * 40}
              width="26"
              height="26"
              rx="2"
              fill={(row + col) % 2 === 1 ? "#ffd57a" : "#0a1c3a"}
              opacity="0.8"
            />
          ))
        )}
      </g>

      {/* glowing medical cross on tower */}
      <circle cx="395" cy="95" r="46" fill="url(#crossGlow)" />
      <g transform="translate(395,95)">
        <rect x="-6" y="-24" width="12" height="48" rx="3" fill="#8fe1ff" />
        <rect x="-24" y="-6" width="48" height="12" rx="3" fill="#8fe1ff" />
      </g>

      {/* signage */}
      <rect x="255" y="150" width="230" height="30" rx="6" fill="#0a1c3a" opacity="0.55" />
      <text x="370" y="171" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="700" fill="#eaf4ff" letterSpacing="1">
        CITY CARE HOSPITAL
      </text>

      {/* emergency entrance */}
      <rect x="330" y="500" width="170" height="60" fill="#0a1c3a" />
      <rect x="345" y="512" width="60" height="48" fill="#ffd57a" opacity="0.85" />
      <rect x="415" y="512" width="60" height="48" fill="#ffd57a" opacity="0.85" />
      <rect x="330" y="494" width="170" height="10" fill="#dc2626" opacity="0.9" />
      <text x="415" y="502" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="9" fontWeight="700" fill="#fff" letterSpacing="1">
        EMERGENCY
      </text>

      {/* ground */}
      <rect x="0" y="560" width="900" height="40" fill="#081729" />

      {/* ambulance silhouette */}
      <g transform="translate(600,520)">
        <rect x="0" y="0" width="110" height="34" rx="4" fill="#0e2a52" />
        <rect x="0" y="-18" width="46" height="20" rx="4" fill="#0e2a52" />
        <rect x="6" y="-13" width="16" height="10" fill="#8fe1ff" opacity="0.5" />
        <circle cx="22" cy="36" r="9" fill="#040c1c" />
        <circle cx="88" cy="36" r="9" fill="#040c1c" />
        <rect x="52" y="-2" width="14" height="14" fill="#dc2626" opacity="0.85" />
        <rect x="56" y="2" width="6" height="6" fill="#fff" opacity="0.9" />
      </g>

      {/* trees */}
      <g opacity="0.5" fill="#0d2b1f">
        <circle cx="170" cy="470" r="26" />
        <rect x="165" y="470" width="10" height="30" />
        <circle cx="720" cy="460" r="30" />
        <rect x="714" y="460" width="12" height="40" />
      </g>
    </svg>
  );
}
