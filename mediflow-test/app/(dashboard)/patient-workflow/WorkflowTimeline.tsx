"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { WorkflowTimelineEntry } from "../../../lib/data/queries";

export function WorkflowTimeline({ entries }: { entries: WorkflowTimelineEntry[] }) {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    let list = entries;
    if (typeFilter !== "all") {
      list = list.filter((e) => e.type === typeFilter);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (e) => e.patientName.toLowerCase().includes(q) || e.message.toLowerCase().includes(q)
      );
    }
    return list;
  }, [entries, query, typeFilter]);

  return (
    <div className="space-y-6">
      {/* Top 4 Workflow KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Patients Tracked</div>
          <div className="text-3xl font-extrabold text-slate-900">28</div>
          <div className="text-xs text-blue-600 font-semibold mt-2">● Real-time workflow tracking</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Total Timeline Events</div>
          <div className="text-3xl font-extrabold text-blue-600">{entries.length}</div>
          <div className="text-xs text-slate-500 font-medium mt-2">Logged across departments</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Critical Blocker Events</div>
          <div className="text-3xl font-extrabold text-rose-600">4</div>
          <div className="text-xs text-rose-600 font-semibold mt-2">⚠ Action required</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Average Length of Stay</div>
          <div className="text-3xl font-extrabold text-emerald-600">2.4 Days</div>
          <div className="text-xs text-emerald-600 font-semibold mt-2">↓ 0.3 days optimization</div>
        </div>
      </div>

      {/* Patient Flow Visualization Pipeline */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900">Patient Care Flow Pipeline</h3>
        <div className="flex items-center justify-between overflow-x-auto py-3 no-scrollbar space-x-3">
          {[
            { step: "Admission Intake", time: "0m", count: 8 },
            { step: "Triage & Assessment", time: "18m avg", count: 6 },
            { step: "Ward Bed Assignment", time: "42m avg", count: 7 },
            { step: "Procedure Execution", time: "1h 15m avg", count: 4 },
            { step: "Post-Op Recovery", time: "35m avg", count: 3 },
          ].map((item, idx) => (
            <div key={item.step} className="flex items-center space-x-3 shrink-0">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center min-w-[140px]">
                <span className="text-[10px] uppercase font-bold text-slate-400">Step 0{idx + 1}</span>
                <span className="text-xs font-bold text-slate-900 text-center my-1">{item.step}</span>
                <span className="text-[11px] font-semibold text-blue-600">{item.time}</span>
              </div>
              {idx < 4 && (
                <svg className="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Stage Transition Time Bottleneck Analytics */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900">Average Stage Transition Times</h3>
        <div className="space-y-3">
          {[
            { label: "Registration → Assessment Clearance", duration: "18 min", pct: 25, color: "bg-emerald-500" },
            { label: "Assessment → Ward Bed Assignment", duration: "42 min", pct: 60, color: "bg-blue-600" },
            { label: "Ward Assignment → Surgical Procedure", duration: "1h 15 min", pct: 85, color: "bg-amber-500" },
            { label: "Procedure → Post-Op Recovery", duration: "35 min", pct: 45, color: "bg-purple-600" },
          ].map((bar) => (
            <div key={bar.label} className="space-y-1 text-xs">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-700">{bar.label}</span>
                <span className="text-slate-900 font-bold">{bar.duration}</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div className={`h-full rounded-full ${bar.color}`} style={{ width: `${bar.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <input
          type="text"
          className="w-full sm:w-80 px-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          placeholder="Search patient name or event description..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="text-xs text-slate-500 font-medium">
          Showing {filtered.length} of {entries.length} workflow events
        </div>
      </div>

      {/* Interactive Patient Timeline Feed */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div className="space-y-6 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {filtered.map((entry) => {
            const isAlert = entry.type.includes("alert");
            const isConsent = entry.type.includes("consent");

            const dotColor = isAlert
              ? "bg-rose-500 border-rose-200"
              : isConsent
              ? "bg-amber-500 border-amber-200"
              : "bg-blue-600 border-blue-200";

            return (
              <div key={entry.id} className="relative pl-10">
                <div className={`absolute left-2.5 top-1.5 w-3.5 h-3.5 rounded-full border-2 ${dotColor} -translate-x-1/2`} />
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 hover:bg-slate-100/80 transition-colors">
                  <div className="flex items-center justify-between">
                    <Link href={`/patients/${entry.patientId}`} className="font-bold text-sm text-slate-900 hover:text-blue-600">
                      {entry.patientName}
                    </Link>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {new Date(entry.occurredAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <div className="text-xs text-slate-700 font-medium">{entry.message}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider pt-1">
                    Event Type: {entry.type.replace(/_/g, " ")}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
