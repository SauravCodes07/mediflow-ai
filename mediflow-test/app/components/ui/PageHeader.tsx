"use client";

import React, { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  category?: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader({
  title,
  category,
  description,
  actions,
}: PageHeaderProps) {
  // Auto-derive category badge if not explicitly passed based on common page titles
  let categoryBadge = category;
  if (!categoryBadge) {
    const titleLower = title.toLowerCase();
    if (titleLower.includes("dashboard") || titleLower.includes("overview") || titleLower.includes("command")) {
      categoryBadge = "COMMAND CENTER";
    } else if (titleLower.includes("ot") || titleLower.includes("operating") || titleLower.includes("schedule")) {
      categoryBadge = "OPERATING THEATRE";
    } else if (titleLower.includes("patient") || titleLower.includes("ward") || titleLower.includes("admission") || titleLower.includes("workflow")) {
      categoryBadge = "PATIENT FLOW";
    } else if (titleLower.includes("cssd") || titleLower.includes("pack") || titleLower.includes("sterilization")) {
      categoryBadge = "CSSD";
    } else if (titleLower.includes("ai") || titleLower.includes("insight") || titleLower.includes("assistant")) {
      categoryBadge = "INTELLIGENCE";
    } else if (titleLower.includes("alert") || titleLower.includes("notification") || titleLower.includes("report")) {
      categoryBadge = "OPERATIONS";
    } else if (titleLower.includes("audit") || titleLower.includes("user") || titleLower.includes("security") || titleLower.includes("settings")) {
      categoryBadge = "ADMINISTRATION";
    }
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800 mb-6">
      <div className="space-y-1">
        {categoryBadge && (
          <div className="text-[11px] font-extrabold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">
            {categoryBadge}
          </div>
        )}
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h1>
        {description && (
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-2xl leading-snug">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center space-x-3 shrink-0 self-start sm:self-auto">
          {actions}
        </div>
      )}
    </div>
  );
}
