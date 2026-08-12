"use client";

import React from "react";

export interface StatCardProps {
  label: string;
  value: string | number;
  icon?: string | React.ReactNode;
  delta?: string;
  tone?: "success" | "warning" | "danger" | "critical" | "info" | "neutral";
  subtitle?: string;
  statusBadge?: string;
}

export function StatCard({
  label,
  value,
  icon,
  delta,
  tone = "neutral",
  subtitle,
  statusBadge,
}: StatCardProps) {
  const toneClasses =
    tone === "success"
      ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800"
      : tone === "warning"
      ? "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800"
      : tone === "danger" || tone === "critical"
      ? "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800"
      : tone === "info"
      ? "text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800"
      : "text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700";

  return (
    <div className="p-5 rounded-3xl bg-white dark:bg-[#101F33] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3 transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {label}
        </span>
        {icon && (
          <span className="w-8 h-8 rounded-xl flex items-center justify-center text-base bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
            {icon}
          </span>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
          {value}
        </span>
        {statusBadge && (
          <span className={`px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-full border ${toneClasses}`}>
            {statusBadge}
          </span>
        )}
      </div>

      {(delta || subtitle) && (
        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-800/80">
          {delta && <span className={`font-semibold ${toneClasses.split(" ")[0]}`}>{delta}</span>}
          {subtitle && <span className="text-slate-400 dark:text-slate-500 text-[11px] font-medium">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
