"use client";

import React from "react";

export interface SegmentOption<T extends string> {
  id: T;
  label: string;
  badge?: string | number;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: "sm" | "md";
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  size = "sm",
}: SegmentedControlProps<T>) {
  return (
    <div className="inline-flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 transition-colors">
      {options.map((opt) => {
        const isActive = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`flex items-center space-x-1.5 font-extrabold rounded-xl transition-all cursor-pointer ${
              size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-xs sm:text-sm"
            } ${
              isActive
                ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-cyan-400 shadow-xs border border-slate-200/60 dark:border-slate-600/50"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <span>{opt.label}</span>
            {opt.badge !== undefined && (
              <span
                className={`px-1.5 py-0.2 text-[10px] rounded-full font-mono font-bold ${
                  isActive
                    ? "bg-blue-100 text-blue-800 dark:bg-cyan-950 dark:text-cyan-300"
                    : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                }`}
              >
                {opt.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
