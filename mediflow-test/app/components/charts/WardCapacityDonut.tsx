"use client";

import React, { useState } from "react";

export interface WardInfo {
  id: string;
  name: string;
  department: string;
  occupiedBeds: number;
  totalBeds: number;
  color: string;
  hexColor: string;
  admissionsToday: number;
  dischargesToday: number;
  avgStayDays: number;
  criticalPatients: number;
}

const WARDS_DATA: WardInfo[] = [
  {
    id: "ward_a",
    name: "Ward A",
    department: "General Medicine",
    occupiedBeds: 39,
    totalBeds: 48,
    color: "text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:border-blue-800",
    hexColor: "#1677FF",
    admissionsToday: 8,
    dischargesToday: 5,
    avgStayDays: 3.4,
    criticalPatients: 2,
  },
  {
    id: "ward_b",
    name: "Ward B",
    department: "Surgical ICU",
    occupiedBeds: 29,
    totalBeds: 48,
    color: "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800",
    hexColor: "#10B981",
    admissionsToday: 4,
    dischargesToday: 6,
    avgStayDays: 4.1,
    criticalPatients: 4,
  },
  {
    id: "ward_c",
    name: "Ward C",
    department: "High Dependency",
    occupiedBeds: 44,
    totalBeds: 48,
    color: "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-800",
    hexColor: "#F59E0B",
    admissionsToday: 11,
    dischargesToday: 3,
    avgStayDays: 5.2,
    criticalPatients: 7,
  },
  {
    id: "ward_d",
    name: "Ward D",
    department: "Pediatric Care",
    occupiedBeds: 35,
    totalBeds: 48,
    color: "text-purple-600 bg-purple-50 border-purple-200 dark:bg-purple-950/40 dark:border-purple-800",
    hexColor: "#8B5CF6",
    admissionsToday: 5,
    dischargesToday: 4,
    avgStayDays: 2.8,
    criticalPatients: 1,
  },
];

export function WardCapacityDonut() {
  const [hoveredWard, setHoveredWard] = useState<WardInfo | null>(null);
  const [selectedWardModal, setSelectedWardModal] = useState<WardInfo | null>(null);

  // Dynamic calculations from single data source
  const totalOccupiedBeds = WARDS_DATA.reduce((acc, w) => acc + w.occupiedBeds, 0);
  const totalBedsCount = WARDS_DATA.reduce((acc, w) => acc + w.totalBeds, 0);
  const totalOccupancyPct = Math.round((totalOccupiedBeds / totalBedsCount) * 100);

  // SVG Donut Math: Radius = 44, Circumference = 2 * PI * 44 = 276.46
  const R = 44;
  const CIRCUMFERENCE = 2 * Math.PI * R;

  return (
    <div className="flex flex-col space-y-4 font-sans select-none h-full justify-between">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 shrink-0">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
            Ward Capacity
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Hospital bed occupancy breakdown
          </p>
        </div>
        <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 font-bold px-2 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-950">
          ● Live Beds
        </span>
      </div>

      {/* Donut Visualization Container with Centered HTML Overlay */}
      <div className="relative flex items-center justify-center my-1 w-full max-w-[180px] sm:max-w-[200px] mx-auto aspect-square shrink-0">
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full transform -rotate-90 overflow-visible transition-transform duration-200"
        >
          {/* Track Circle */}
          <circle
            cx="60"
            cy="60"
            r={R}
            fill="none"
            stroke="#F1F5F9"
            strokeWidth="10"
            className="dark:stroke-slate-800"
          />

          {/* 4 Clean Ward Segments with Gaps */}
          {WARDS_DATA.map((ward, idx) => {
            const wardPct = (ward.occupiedBeds / ward.totalBeds) * 100;
            const isHovered = hoveredWard?.id === ward.id;
            // 4 equal quadrants (1/4 of CIRCUMFERENCE each)
            const gap = 4; // gap pixels
            const segmentLength = (wardPct / 100) * (CIRCUMFERENCE / 4) - gap;
            const strokeDasharray = `${Math.max(0, segmentLength)} ${CIRCUMFERENCE - Math.max(0, segmentLength)}`;
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
                onClick={() => setSelectedWardModal(ward)}
              />
            );
          })}
        </svg>

        {/* Center Text Overlay: Mathematically centered inside donut */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight leading-none">
            {hoveredWard
              ? `${Math.round((hoveredWard.occupiedBeds / hoveredWard.totalBeds) * 100)}%`
              : `${totalOccupancyPct}%`}
          </span>
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">
            {hoveredWard ? hoveredWard.name : "Total Occupancy"}
          </span>
        </div>
      </div>

      {/* Ward Cards List */}
      <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[300px] no-scrollbar pt-1">
        {WARDS_DATA.map((ward) => {
          const occPct = Math.round((ward.occupiedBeds / ward.totalBeds) * 100);
          const availableBeds = ward.totalBeds - ward.occupiedBeds;
          const isHovered = hoveredWard?.id === ward.id;

          const statusTag = occPct >= 90 ? "Critical" : occPct >= 80 ? "Warning" : "Normal";
          const statusStyle =
            statusTag === "Critical"
              ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
              : statusTag === "Warning"
              ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
              : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300";

          return (
            <div
              key={ward.id}
              onClick={() => setSelectedWardModal(ward)}
              onMouseEnter={() => setHoveredWard(ward)}
              onMouseLeave={() => setHoveredWard(null)}
              className={`p-3 sm:p-3.5 rounded-2xl border bg-white dark:bg-slate-900 transition-all duration-200 cursor-pointer flex items-center justify-between ${
                isHovered
                  ? "border-blue-500 shadow-md -translate-y-0.5"
                  : "border-slate-200 dark:border-slate-800 hover:border-blue-300"
              }`}
            >
              <div className="flex items-center space-x-3">
                <span
                  className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                  style={{ backgroundColor: ward.hexColor }}
                />
                <div>
                  <div className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                    <span>{ward.name}</span>
                    <span className={`px-1.5 py-0.2 text-[9px] font-extrabold uppercase rounded ${statusStyle}`}>
                      {statusTag}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    {ward.department}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {ward.occupiedBeds} / {ward.totalBeds} beds · {availableBeds} available
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-base font-extrabold font-mono text-slate-900 dark:text-white">
                  {occPct}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ward Details Modal */}
      {selectedWardModal && (
        <div className="fixed inset-0 z-[85] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: selectedWardModal.hexColor }} />
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {selectedWardModal.name} Telemetry
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedWardModal(null)}
                className="text-slate-400 font-bold hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 text-[11px] block">Department</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedWardModal.department}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 text-[11px] block">Occupancy Rate</span>
                <span className="font-mono font-extrabold text-blue-600 dark:text-cyan-400 text-sm">
                  {Math.round((selectedWardModal.occupiedBeds / selectedWardModal.totalBeds) * 100)}%
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 text-[11px] block">Beds Breakdown</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {selectedWardModal.occupiedBeds} / {selectedWardModal.totalBeds} ({selectedWardModal.totalBeds - selectedWardModal.occupiedBeds} free)
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 text-[11px] block">Admissions Today</span>
                <span className="font-mono font-bold text-emerald-600">{selectedWardModal.admissionsToday} patients</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 text-[11px] block">Discharges Today</span>
                <span className="font-mono font-bold text-purple-600">{selectedWardModal.dischargesToday} patients</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 text-[11px] block">Avg Stay Length</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedWardModal.avgStayDays} days</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedWardModal(null)}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
