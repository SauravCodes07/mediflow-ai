"use client";

import React, { useState } from "react";

export interface WardInfo {
  id: string;
  name: string;
  department: string;
  occupancyPct: number;
  occupiedBeds: number;
  totalBeds: number;
  availableBeds: number;
  color: string;
  hexColor: string;
  trend: string;
}

const WARDS_DATA: WardInfo[] = [
  {
    id: "ward_a",
    name: "Ward A",
    department: "General Medicine",
    occupancyPct: 82,
    occupiedBeds: 39,
    totalBeds: 48,
    availableBeds: 9,
    color: "text-blue-600 bg-blue-50 border-blue-200",
    hexColor: "#1677FF",
    trend: "+4.2%",
  },
  {
    id: "ward_b",
    name: "Ward B",
    department: "Surgical ICU",
    occupancyPct: 61,
    occupiedBeds: 29,
    totalBeds: 48,
    availableBeds: 19,
    color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    hexColor: "#10B981",
    trend: "-2.1%",
  },
  {
    id: "ward_c",
    name: "Ward C",
    department: "High Dependency",
    occupancyPct: 91,
    occupiedBeds: 44,
    totalBeds: 48,
    availableBeds: 4,
    color: "text-amber-600 bg-amber-50 border-amber-200",
    hexColor: "#F59E0B",
    trend: "+6.8%",
  },
  {
    id: "ward_d",
    name: "Ward D",
    department: "Pediatric Care",
    occupancyPct: 74,
    occupiedBeds: 35,
    totalBeds: 48,
    availableBeds: 13,
    color: "text-purple-600 bg-purple-50 border-purple-200",
    hexColor: "#8B5CF6",
    trend: "+1.4%",
  },
];

export function WardCapacityDonut() {
  const [hoveredWard, setHoveredWard] = useState<WardInfo | null>(null);

  const totalOccupancy = Math.round(
    WARDS_DATA.reduce((acc, w) => acc + w.occupancyPct, 0) / WARDS_DATA.length
  );

  // SVG Donut Math: radius = 44, circumference = 2 * PI * 44 = 276.46
  const R = 44;
  const CIRCUMFERENCE = 2 * Math.PI * R;

  return (
    <div className="flex flex-col space-y-6 font-sans select-none">
      {/* 2 & 3. Circular Visualization Container with Aspect-Ratio 1/1 */}
      <div className="relative flex items-center justify-center my-2 w-full max-w-[200px] mx-auto aspect-square">
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full transform -rotate-90 overflow-visible transition-transform duration-200"
        >
          {/* Background Track Circle */}
          <circle
            cx="60"
            cy="60"
            r={R}
            fill="none"
            stroke="#F1F5F9"
            strokeWidth="10"
            className="dark:stroke-slate-800"
          />

          {/* Multi-Segment Ward Arcs */}
          {WARDS_DATA.map((ward, idx) => {
            const isHovered = hoveredWard?.id === ward.id;
            const segmentLength = (ward.occupancyPct / 100) * (CIRCUMFERENCE / 4);
            const strokeDasharray = `${segmentLength} ${CIRCUMFERENCE - segmentLength}`;
            const strokeDashoffset = -idx * (CIRCUMFERENCE / 4);

            return (
              <circle
                key={ward.id}
                cx="60"
                cy="60"
                r={R}
                fill="none"
                stroke={ward.hexColor}
                strokeWidth={isHovered ? "13" : "10"}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                opacity={hoveredWard && !isHovered ? 0.35 : 1}
                className="transition-all duration-200 cursor-pointer"
                onMouseEnter={() => setHoveredWard(ward)}
                onMouseLeave={() => setHoveredWard(null)}
              />
            );
          })}

          {/* SVG Centered Text Elements (Prevents layout shift or truncation) */}
          <text
            x="60"
            y="54"
            textAnchor="middle"
            dominantBaseline="middle"
            transform="rotate(90 60 60)"
            className="text-2xl font-extrabold fill-slate-900 dark:fill-white transition-all duration-200"
            style={{ fontSize: "24px", fontWeight: "800" }}
          >
            {hoveredWard ? `${hoveredWard.occupancyPct}%` : `${totalOccupancy}%`}
          </text>
          <text
            x="60"
            y="74"
            textAnchor="middle"
            dominantBaseline="middle"
            transform="rotate(90 60 60)"
            className="text-[9px] font-bold fill-slate-400 dark:fill-slate-400 uppercase tracking-widest"
            style={{ fontSize: "9px", fontWeight: "700" }}
          >
            {hoveredWard ? hoveredWard.name.toUpperCase() : "TOTAL OCCUPANCY"}
          </text>
        </svg>

        {/* Floating Tooltip readout on hover */}
        {hoveredWard && (
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-900/95 text-white text-[11px] font-medium px-3 py-1.5 rounded-xl border border-white/20 shadow-xl whitespace-nowrap z-20 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
            <span className="font-bold text-cyan-300">{hoveredWard.name}</span>: {hoveredWard.occupiedBeds}/{hoveredWard.totalBeds} beds ({hoveredWard.trend})
          </div>
        )}
      </div>

      {/* Interactive Ward Rows Table */}
      <div className="space-y-2 pt-2">
        {WARDS_DATA.map((ward) => {
          const isHovered = hoveredWard?.id === ward.id;
          return (
            <div
              key={ward.id}
              onMouseEnter={() => setHoveredWard(ward)}
              onMouseLeave={() => setHoveredWard(null)}
              className={`p-3 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                isHovered
                  ? "border-blue-400 bg-blue-50/60 dark:bg-blue-900/30 dark:border-blue-500 shadow-md translate-x-1"
                  : "border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100/80 dark:hover:bg-slate-800/80"
              }`}
            >
              <div className="flex items-center space-x-3">
                <span
                  className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                  style={{ backgroundColor: ward.hexColor }}
                />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{ward.name}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{ward.department}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-extrabold text-slate-900 dark:text-white">{ward.occupancyPct}%</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  {ward.occupiedBeds} / {ward.totalBeds} beds ({ward.availableBeds} free)
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
