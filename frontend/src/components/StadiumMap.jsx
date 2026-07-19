import React from "react";

function riskColor(occ) {
  if (occ > 85) return "#FF5468";
  if (occ >= 60) return "#FFB53D";
  return "#39D98A";
}

export default function StadiumMap({ zones }) {
  return (
    <div>
      <svg viewBox="0 0 520 340" className="w-full h-auto">
        <defs>
          <radialGradient id="pitchGrad" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#123322" />
            <stop offset="100%" stopColor="#0c2419" />
          </radialGradient>
        </defs>
        <ellipse cx="260" cy="170" rx="230" ry="150" fill="none" stroke="#232E3D" strokeWidth="26" />
        <ellipse cx="260" cy="170" rx="140" ry="85" fill="url(#pitchGrad)" stroke="#2E6B49" strokeWidth="2" />
        <line x1="260" y1="85" x2="260" y2="255" stroke="#2E6B49" strokeWidth="1.5" />
        <circle cx="260" cy="170" r="26" fill="none" stroke="#2E6B49" strokeWidth="1.5" />

        {zones.map((z) => {
          const c = riskColor(z.occupancy_pct);
          return (
            <g key={z.id}>
              <circle cx={z.cx} cy={z.cy} r="21" fill={c} fillOpacity="0.22" stroke={c} strokeWidth="2">
                {z.occupancy_pct > 85 && (
                  <animate attributeName="r" values="21;25;21" dur="1.4s" repeatCount="indefinite" />
                )}
              </circle>
              <circle cx={z.cx} cy={z.cy} r="8" fill={c} />
              <text x={z.cx} y={z.cy + 4} textAnchor="middle" fontSize="9" fill="#04140D" fontFamily="JetBrains Mono" fontWeight="600">
                {z.id}
              </text>
              <text x={z.cx} y={z.cy + 34} textAnchor="middle" fontSize="10" fill="#8394A6" fontFamily="JetBrains Mono">
                {Math.round(z.occupancy_pct)}%
              </text>
            </g>
          );
        })}
      </svg>
      <div className="flex gap-4 mt-3 text-[11.5px] text-muted flex-wrap">
        <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm inline-block bg-pitch" />Low (&lt;60%)</span>
        <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm inline-block bg-amber" />Moderate (60–85%)</span>
        <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm inline-block bg-red" />Critical (&gt;85%)</span>
      </div>
    </div>
  );
}
