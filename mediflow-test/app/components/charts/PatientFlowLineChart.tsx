"use client";

import React, { useState, useRef, useId } from "react";
import { TimeSeriesPoint } from "@/lib/data/operational-context";

interface PatientFlowLineChartProps {
  series: TimeSeriesPoint[];
  height?: number;
}

export function PatientFlowLineChart({ series, height = 320 }: PatientFlowLineChartProps) {
  const chartId = useId();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoveredSeries, setHoveredSeries] = useState<string | null>(null);
  const [visibleSeries, setVisibleSeries] = useState<{ s1: boolean; s2: boolean; s3: boolean }>({
    s1: true,
    s2: true,
    s3: true,
  });

  const svgRef = useRef<SVGSVGElement>(null);

  // Dynamic series labels & value keys
  const s1Label = series[0]?.series1Label || "Admissions Queue";
  const s2Label = series[0]?.series2Label || "Discharges Completed";
  const s3Label = series[0]?.series3Label || "Patient Transfers";

  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 40;

  const chartWidth = 700;
  const chartHeight = height;

  const drawWidth = chartWidth - paddingLeft - paddingRight;
  const drawHeight = chartHeight - paddingTop - paddingBottom;

  const getVal = (pt: TimeSeriesPoint, key: 1 | 2 | 3) => {
    if (key === 1) return pt.series1Val ?? pt.admissions;
    if (key === 2) return pt.series2Val ?? pt.discharges;
    return pt.series3Val ?? pt.transfers;
  };

  // Max Y value across active series for dynamic scaling
  const maxVal = Math.max(
    ...series.flatMap((s) => [getVal(s, 1), getVal(s, 2), getVal(s, 3)]),
    35
  );

  const getX = (idx: number) => {
    if (series.length <= 1) return paddingLeft;
    return paddingLeft + (idx / (series.length - 1)) * drawWidth;
  };

  const getY = (val: number) => {
    return paddingTop + drawHeight - (val / maxVal) * drawHeight;
  };

  // Build SVG Path Commands
  const buildPathD = (key: 1 | 2 | 3) => {
    return series.reduce((acc, pt, idx) => {
      const x = getX(idx);
      const y = getY(getVal(pt, key));
      return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, "");
  };

  // Build SVG Area Gradient Path
  const buildAreaD = (key: 1 | 2 | 3) => {
    const lineD = buildPathD(key);
    const lastX = getX(series.length - 1);
    const firstX = getX(0);
    const bottomY = paddingTop + drawHeight;
    return `${lineD} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  };

  // Canvas Mouse Move Handler: maps cursor X coordinate to nearest point
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;

    const relX = Math.max(paddingLeft, Math.min(chartWidth - paddingRight, (mouseX / rect.width) * chartWidth));
    const normalizedRatio = (relX - paddingLeft) / drawWidth;
    const nearestIdx = Math.round(normalizedRatio * (series.length - 1));

    if (nearestIdx >= 0 && nearestIdx < series.length) {
      setActiveIndex(nearestIdx);
    }
  };

  const toggleSeries = (key: "s1" | "s2" | "s3") => {
    setVisibleSeries((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const activePoint = activeIndex !== null ? series[activeIndex] : null;
  const activeX = activeIndex !== null ? getX(activeIndex) : null;

  return (
    <div className="w-full flex flex-col space-y-4 font-sans">
      {/* Interactive Legend Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-5 font-semibold">
          {/* Series 1 Button (Blue) */}
          <button
            onClick={() => toggleSeries("s1")}
            onMouseEnter={() => setHoveredSeries("s1")}
            onMouseLeave={() => setHoveredSeries(null)}
            className={`flex items-center space-x-2 transition-all cursor-pointer ${
              !visibleSeries.s1 ? "opacity-35 line-through" : "opacity-100"
            }`}
          >
            <span className="w-3 h-3 rounded-full bg-blue-600 shadow-sm" />
            <span className="text-slate-800">{s1Label}</span>
          </button>

          {/* Series 2 Button (Green) */}
          <button
            onClick={() => toggleSeries("s2")}
            onMouseEnter={() => setHoveredSeries("s2")}
            onMouseLeave={() => setHoveredSeries(null)}
            className={`flex items-center space-x-2 transition-all cursor-pointer ${
              !visibleSeries.s2 ? "opacity-35 line-through" : "opacity-100"
            }`}
          >
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm" />
            <span className="text-slate-800">{s2Label}</span>
          </button>

          {/* Series 3 Button (Purple) */}
          <button
            onClick={() => toggleSeries("s3")}
            onMouseEnter={() => setHoveredSeries("s3")}
            onMouseLeave={() => setHoveredSeries(null)}
            className={`flex items-center space-x-2 transition-all cursor-pointer ${
              !visibleSeries.s3 ? "opacity-35 line-through" : "opacity-100"
            }`}
          >
            <span className="w-3 h-3 rounded-full bg-purple-600 shadow-sm" />
            <span className="text-slate-800">{s3Label}</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-400 font-medium hidden sm:block">
          ● Hover canvas for crosshair & exact values
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative w-full overflow-hidden rounded-2xl bg-white">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto overflow-visible cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setActiveIndex(null)}
        >
          <defs>
            <linearGradient id={`grad_s1_${chartId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1677FF" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#1677FF" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id={`grad_s2_${chartId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id={`grad_s3_${chartId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
            const y = paddingTop + drawHeight * pct;
            const val = Math.round(maxVal * (1 - pct));
            return (
              <g key={pct}>
                <line x1={paddingLeft} y1={y} x2={chartWidth - paddingRight} y2={y} stroke="#F1F5F9" strokeWidth="1" />
                <text x={paddingLeft - 8} y={y + 4} textAnchor="end" fill="#94A3B8" fontSize="10" fontWeight="600">
                  {val}
                </text>
              </g>
            );
          })}

          {/* Area Fills */}
          {visibleSeries.s1 && (
            <path d={buildAreaD(1)} fill={`url(#grad_s1_${chartId})`} className="transition-all duration-300" />
          )}
          {visibleSeries.s2 && (
            <path d={buildAreaD(2)} fill={`url(#grad_s2_${chartId})`} className="transition-all duration-300" />
          )}
          {visibleSeries.s3 && (
            <path d={buildAreaD(3)} fill={`url(#grad_s3_${chartId})`} className="transition-all duration-300" />
          )}

          {/* Vertical Dashed Crosshair Line */}
          {activeX !== null && (
            <line
              x1={activeX}
              y1={paddingTop}
              x2={activeX}
              y2={chartHeight - paddingBottom}
              stroke="#94A3B8"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              opacity="0.6"
              className="animate-in fade-in duration-150"
            />
          )}

          {/* Series Lines */}
          {visibleSeries.s1 && (
            <path
              d={buildPathD(1)}
              fill="none"
              stroke="#1677FF"
              strokeWidth={hoveredSeries === "s1" ? "4" : "2.5"}
              opacity={hoveredSeries && hoveredSeries !== "s1" ? 0.25 : 1}
              className="transition-all duration-300"
            />
          )}
          {visibleSeries.s2 && (
            <path
              d={buildPathD(2)}
              fill="none"
              stroke="#10B981"
              strokeWidth={hoveredSeries === "s2" ? "4" : "2.5"}
              opacity={hoveredSeries && hoveredSeries !== "s2" ? 0.25 : 1}
              className="transition-all duration-300"
            />
          )}
          {visibleSeries.s3 && (
            <path
              d={buildPathD(3)}
              fill="none"
              stroke="#8B5CF6"
              strokeWidth={hoveredSeries === "s3" ? "4" : "2.5"}
              strokeDasharray="5 3"
              opacity={hoveredSeries && hoveredSeries !== "s3" ? 0.25 : 1}
              className="transition-all duration-300"
            />
          )}

          {/* Data Points */}
          {series.map((pt, idx) => {
            const x = getX(idx);
            const isActive = activeIndex === idx;

            return (
              <g key={pt.label}>
                {/* X Axis Labels */}
                <text
                  x={x}
                  y={chartHeight - 12}
                  textAnchor="middle"
                  fill={isActive ? "#0F172A" : "#64748B"}
                  fontSize={isActive ? "11" : "10"}
                  fontWeight={isActive ? "700" : "500"}
                >
                  {pt.label}
                </text>

                {/* Series 1 Point */}
                {visibleSeries.s1 && (
                  <circle
                    cx={x}
                    cy={getY(getVal(pt, 1))}
                    r={isActive ? "7" : "3.5"}
                    fill="#1677FF"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="transition-all duration-150"
                  />
                )}

                {/* Series 2 Point */}
                {visibleSeries.s2 && (
                  <circle
                    cx={x}
                    cy={getY(getVal(pt, 2))}
                    r={isActive ? "7" : "3.5"}
                    fill="#10B981"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="transition-all duration-150"
                  />
                )}

                {/* Series 3 Point */}
                {visibleSeries.s3 && (
                  <circle
                    cx={x}
                    cy={getY(getVal(pt, 3))}
                    r={isActive ? "7" : "3.5"}
                    fill="#8B5CF6"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="transition-all duration-150"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Custom Floating Glass Tooltip Card */}
        {activePoint && (
          <div className="absolute top-3 right-3 z-30 p-4 rounded-2xl bg-[#071B34] text-white shadow-2xl border border-white/20 text-xs space-y-2 animate-in fade-in zoom-in-95 duration-150 min-w-[210px]">
            <div className="font-extrabold text-cyan-300 text-sm border-b border-white/10 pb-1.5 flex items-center justify-between">
              <span>{activePoint.label}</span>
              <span className="text-[10px] font-semibold text-slate-400">Department Snapshot</span>
            </div>

            <div className="space-y-1.5 pt-0.5">
              {visibleSeries.s1 && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 font-medium flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>{s1Label}</span>
                  </span>
                  <span className="font-extrabold text-white">{getVal(activePoint, 1)}</span>
                </div>
              )}

              {visibleSeries.s2 && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 font-medium flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>{s2Label}</span>
                  </span>
                  <span className="font-extrabold text-emerald-400">{getVal(activePoint, 2)}</span>
                </div>
              )}

              {visibleSeries.s3 && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 font-medium flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                    <span>{s3Label}</span>
                  </span>
                  <span className="font-extrabold text-purple-300">{getVal(activePoint, 3)}</span>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-white/10 flex justify-between items-center text-[11px]">
              <span className="text-slate-400">Net Flow / Variance:</span>
              <span className="font-bold text-cyan-300">+{activePoint.netFlow}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
