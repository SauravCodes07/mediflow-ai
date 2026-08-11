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

  return (
    <div className="flex flex-col space-y-6 font-sans">
      {/* Donut Visualization Center */}
      <div className="relative flex items-center justify-center my-2">
        <svg className="w-48 h-48 transform -rotate-90 overflow-visible" viewBox="0 0 100 100">
          {/* Background Track Circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#F1F5F9"
            strokeWidth="10"
          />

          {/* 4 Multi-Segment Ward Arcs */}
          {WARDS_DATA.map((ward, idx) => {
            const isHovered = hoveredWard?.id === ward.id;
            const segmentLength = (ward.occupancyPct / 100) * 62.8; // slice calculation for r=40 (2*pi*r * scale)
            const strokeDasharray = `${segmentLength} 251.2`;
            const strokeDashoffset = -idx * 62.8;

            return (
              <circle
                key={ward.id}
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={ward.hexColor}
                strokeWidth={isHovered ? "14" : "10"}
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
        </svg>

        {/* Dynamic Center Readout (Two-Way Sync) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none transition-all duration-200">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {hoveredWard ? `${hoveredWard.occupancyPct}%` : `${totalOccupancy}%`}
          </span>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5 max-w-[110px] truncate">
            {hoveredWard ? `${hoveredWard.name}` : "Total Occupancy"}
          </span>
        </div>
      </div>

      {/* Two-Way Interactive Ward Rows Table */}
      <div className="space-y-2">
        {WARDS_DATA.map((ward) => {
          const isHovered = hoveredWard?.id === ward.id;
          return (
            <div
              key={ward.id}
              onMouseEnter={() => setHoveredWard(ward)}
              onMouseLeave={() => setHoveredWard(null)}
              className={`p-3 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                isHovered
                  ? "border-blue-400 bg-blue-50/60 shadow-md translate-x-1"
                  : "border-slate-100 bg-slate-50/50 hover:bg-slate-100/80"
              }`}
            >
              <div className="flex items-center space-x-3">
                <span
                  className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                  style={{ backgroundColor: ward.hexColor }}
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">{ward.name}</div>
                  <div className="text-[11px] text-slate-500 font-medium">{ward.department}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-extrabold text-slate-900">{ward.occupancyPct}%</div>
                <div className="text-[10px] text-slate-500 font-medium">
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
