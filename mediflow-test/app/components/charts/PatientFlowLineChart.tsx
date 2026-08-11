"use client";

import React, { useState, useRef, useId, useEffect } from "react";
import { TimeSeriesPoint } from "@/lib/data/operational-context";

interface PatientFlowLineChartProps {
  series: TimeSeriesPoint[];
  height?: number;
  timeRange?: "24h" | "7d" | "30d";
  onTimeRangeChange?: (range: "24h" | "7d" | "30d") => void;
}

export function PatientFlowLineChart({
  series,
  height = 320,
  timeRange = "7d",
  onTimeRangeChange,
}: PatientFlowLineChartProps) {
  const chartId = useId();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoveredSeries, setHoveredSeries] = useState<string | null>(null);
  const [visibleSeries, setVisibleSeries] = useState<{ s1: boolean; s2: boolean; s3: boolean }>({
    s1: true,
    s2: true,
    s3: true,
  });

  const [isTouch, setIsTouch] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsTouch(!window.matchMedia("(hover: hover)").matches);
    }
  }, []);

  const chartData: TimeSeriesPoint[] = series && series.length > 0 ? series : [
    { label: "Mon", admissions: 42, discharges: 31, transfers: 8, occupancy: 82, otUtilization: 80, netFlow: 11, changePct: 4.2 },
    { label: "Tue", admissions: 48, discharges: 36, transfers: 10, occupancy: 84, otUtilization: 82, netFlow: 12, changePct: 5.1 },
    { label: "Wed", admissions: 44, discharges: 39, transfers: 12, occupancy: 79, otUtilization: 78, netFlow: 5, changePct: 2.3 },
    { label: "Thu", admissions: 57, discharges: 41, transfers: 14, occupancy: 88, otUtilization: 85, netFlow: 16, changePct: 6.8 },
    { label: "Fri", admissions: 63, discharges: 48, transfers: 15, occupancy: 91, otUtilization: 89, netFlow: 15, changePct: 7.2 },
    { label: "Sat", admissions: 51, discharges: 45, transfers: 9, occupancy: 83, otUtilization: 76, netFlow: 6, changePct: 3.1 },
    { label: "Sun", admissions: 38, discharges: 34, transfers: 7, occupancy: 77, otUtilization: 70, netFlow: 4, changePct: 1.8 },
  ];

  const s1Label = chartData[0]?.series1Label || "Admissions Queue";
  const s2Label = chartData[0]?.series2Label || "Discharges Completed";
  const s3Label = chartData[0]?.series3Label || "Patient Transfers";

  const paddingLeft = 36;
  const paddingRight = 16;
  const paddingTop = 20;
  const paddingBottom = 32;

  const chartWidth = 700;
  const chartHeight = height;

  const drawWidth = chartWidth - paddingLeft - paddingRight;
  const drawHeight = chartHeight - paddingTop - paddingBottom;

  const getVal = (pt: TimeSeriesPoint, key: 1 | 2 | 3) => {
    if (key === 1) return pt.series1Val ?? pt.admissions ?? 0;
    if (key === 2) return pt.series2Val ?? pt.discharges ?? 0;
    return pt.series3Val ?? pt.transfers ?? 0;
  };

  const maxVal = Math.max(
    ...chartData.flatMap((s) => [getVal(s, 1), getVal(s, 2), getVal(s, 3)]),
    35
  );

  const getX = (idx: number) => {
    if (chartData.length <= 1) return paddingLeft;
    return paddingLeft + (idx / (chartData.length - 1)) * drawWidth;
  };

  const getY = (val: number) => {
    return paddingTop + drawHeight - (val / maxVal) * drawHeight;
  };

  const buildPathD = (key: 1 | 2 | 3) => {
    return chartData.reduce((acc, pt, idx) => {
      const x = getX(idx);
      const y = getY(getVal(pt, key));
      return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, "");
  };

  const buildAreaD = (key: 1 | 2 | 3) => {
    const lineD = buildPathD(key);
    const lastX = getX(chartData.length - 1);
    const firstX = getX(0);
    const bottomY = paddingTop + drawHeight;
    return `${lineD} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  };

  const updateHoverIndex = (clientX: number) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = clientX - rect.left;

    const relX = Math.max(paddingLeft, Math.min(chartWidth - paddingRight, (mouseX / rect.width) * chartWidth));
    const normalizedRatio = (relX - paddingLeft) / drawWidth;
    const nearestIdx = Math.round(normalizedRatio * (chartData.length - 1));

    if (nearestIdx >= 0 && nearestIdx < chartData.length) {
      setActiveIndex(nearestIdx);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isTouch) return;
    updateHoverIndex(e.clientX);
  };

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    updateHoverIndex(e.clientX);
  };

  const toggleSeries = (key: "s1" | "s2" | "s3") => {
    setVisibleSeries((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const activePoint = activeIndex !== null ? chartData[activeIndex] : null;
  const activeX = activeIndex !== null ? getX(activeIndex) : null;
  const isRightHalf = activeIndex !== null && activeIndex >= Math.floor(chartData.length / 2);

  return (
    <div ref={containerRef} className="w-full flex flex-col h-full font-sans select-none space-y-3">
      
      {/* Header Bar with Title & 24H/7D/30D Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
            Patient Flow Analytics
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Admissions, discharges and transfers over time
          </p>
        </div>

        {/* 24H / 7D / 30D Time Controls */}
        <div className="flex items-center space-x-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0 self-start sm:self-auto">
          {(["24h", "7d", "30d"] as const).map((rng) => {
            const isSelected = timeRange === rng;
            const label = rng === "24h" ? "24H" : rng === "7d" ? "7D" : "30D";
            return (
              <button
                key={rng}
                type="button"
                onClick={() => onTimeRangeChange && onTimeRangeChange(rng)}
                className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-slate-100 dark:border-slate-800 shrink-0" />

      {/* Compact Interactive Legend Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
        <div className="flex flex-wrap items-center gap-3 font-semibold">
          {/* Series 1 Button (Blue) */}
          <button
            type="button"
            onClick={() => toggleSeries("s1")}
            onMouseEnter={() => setHoveredSeries("s1")}
            onMouseLeave={() => setHoveredSeries(null)}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 transition-all cursor-pointer ${
              !visibleSeries.s1 ? "opacity-35 line-through" : "opacity-100"
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-xs" />
            <span className="text-slate-900 dark:text-white font-bold">{s1Label}</span>
          </button>

          {/* Series 2 Button (Green) */}
          <button
            type="button"
            onClick={() => toggleSeries("s2")}
            onMouseEnter={() => setHoveredSeries("s2")}
            onMouseLeave={() => setHoveredSeries(null)}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 transition-all cursor-pointer ${
              !visibleSeries.s2 ? "opacity-35 line-through" : "opacity-100"
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs" />
            <span className="text-slate-900 dark:text-white font-bold">{s2Label}</span>
          </button>

          {/* Series 3 Button (Purple) */}
          <button
            type="button"
            onClick={() => toggleSeries("s3")}
            onMouseEnter={() => setHoveredSeries("s3")}
            onMouseLeave={() => setHoveredSeries(null)}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 transition-all cursor-pointer ${
              !visibleSeries.s3 ? "opacity-35 line-through" : "opacity-100"
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600 shadow-xs" />
            <span className="text-slate-900 dark:text-white font-bold">{s3Label}</span>
          </button>
        </div>

        <span className="text-[11px] text-slate-400 font-medium hidden md:inline">
          ● Hover chart for values
        </span>
      </div>

      {/* Flexible Chart Canvas Container (flex-1 fills available height) */}
      <div className="relative flex-1 w-full min-h-[220px] max-h-[360px] overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          preserveAspectRatio="none"
          className="w-full h-full overflow-visible cursor-crosshair"
          onMouseMove={handleMouseMove}
          onClick={handleClick}
          onMouseLeave={() => {
            if (!isTouch) setActiveIndex(null);
          }}
        >
          <defs>
            <linearGradient id={`grad_s1_${chartId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1677FF" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#1677FF" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id={`grad_s2_${chartId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id={`grad_s3_${chartId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
            const y = paddingTop + drawHeight * pct;
            const val = Math.round(maxVal * (1 - pct));
            return (
              <g key={pct}>
                <line x1={paddingLeft} y1={y} x2={chartWidth - paddingRight} y2={y} stroke="#F1F5F9" strokeWidth="1" className="dark:stroke-slate-800" />
                <text x={paddingLeft - 6} y={y + 3} textAnchor="end" fill="#94A3B8" fontSize="10" fontWeight="600">
                  {val}
                </text>
              </g>
            );
          })}

          {/* Area Fills */}
          {visibleSeries.s1 && (
            <path d={buildAreaD(1)} fill={`url(#grad_s1_${chartId})`} className="transition-all duration-300 pointer-events-none" />
          )}
          {visibleSeries.s2 && (
            <path d={buildAreaD(2)} fill={`url(#grad_s2_${chartId})`} className="transition-all duration-300 pointer-events-none" />
          )}
          {visibleSeries.s3 && (
            <path d={buildAreaD(3)} fill={`url(#grad_s3_${chartId})`} className="transition-all duration-300 pointer-events-none" />
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
              opacity="0.75"
              className="pointer-events-none transition-all duration-75"
            />
          )}

          {/* Series Lines */}
          {visibleSeries.s1 && (
            <path
              d={buildPathD(1)}
              fill="none"
              stroke="#1677FF"
              strokeWidth={hoveredSeries === "s1" ? "3.5" : "2.5"}
              opacity={hoveredSeries && hoveredSeries !== "s1" ? 0.25 : 1}
              className="transition-all duration-300 pointer-events-none"
            />
          )}
          {visibleSeries.s2 && (
            <path
              d={buildPathD(2)}
              fill="none"
              stroke="#10B981"
              strokeWidth={hoveredSeries === "s2" ? "3.5" : "2.5"}
              opacity={hoveredSeries && hoveredSeries !== "s2" ? 0.25 : 1}
              className="transition-all duration-300 pointer-events-none"
            />
          )}
          {visibleSeries.s3 && (
            <path
              d={buildPathD(3)}
              fill="none"
              stroke="#8B5CF6"
              strokeWidth={hoveredSeries === "s3" ? "3.5" : "2.5"}
              strokeDasharray="4 3"
              opacity={hoveredSeries && hoveredSeries !== "s3" ? 0.25 : 1}
              className="transition-all duration-300 pointer-events-none"
            />
          )}

          {/* Data Points */}
          {chartData.map((pt, idx) => {
            const x = getX(idx);
            const isActive = activeIndex === idx;

            return (
              <g key={pt.label} className="pointer-events-none">
                {/* X Axis Labels */}
                <text
                  x={x}
                  y={chartHeight - 10}
                  textAnchor="middle"
                  fill={isActive ? "#1677FF" : "#64748B"}
                  fontSize={isActive ? "11" : "10"}
                  fontWeight={isActive ? "800" : "600"}
                >
                  {pt.label}
                </text>

                {/* Series 1 Point */}
                {visibleSeries.s1 && (
                  <circle
                    cx={x}
                    cy={getY(getVal(pt, 1))}
                    r={isActive ? "6" : "3"}
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
                    r={isActive ? "6" : "3"}
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
                    r={isActive ? "6" : "3"}
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

        {/* Dynamic Tooltip */}
        {activePoint && (
          <div
            className={`absolute top-2 ${
              isRightHalf ? "left-3" : "right-3"
            } z-30 p-3 rounded-2xl bg-[#071B34]/95 text-white shadow-xl border border-white/20 text-xs space-y-1.5 pointer-events-none backdrop-blur-md min-w-[190px] transition-all duration-150`}
          >
            <div className="font-extrabold text-cyan-300 text-xs border-b border-white/10 pb-1 flex items-center justify-between">
              <span>{activePoint.label}</span>
              <span className="text-[10px] text-slate-400 font-semibold">{timeRange.toUpperCase()} Flow</span>
            </div>

            <div className="space-y-1 pt-0.5 text-[11px]">
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
          </div>
        )}
      </div>

    </div>
  );
}
