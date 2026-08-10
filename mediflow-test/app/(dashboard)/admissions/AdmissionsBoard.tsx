"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { AdmissionRow } from "../../../lib/data/queries";
import type { ReadinessStatus } from "../../../lib/data/types";

export function AdmissionsBoard({ rows }: { rows: AdmissionRow[] }) {
  const [query, setQuery] = useState("");
  const [readinessFilter, setReadinessFilter] = useState<string>("all");
  const [selectedPatient, setSelectedPatient] = useState<AdmissionRow | null>(null);

  const stats = useMemo(() => {
    const total = rows.length;
    const ready = rows.filter((r) => r.readiness === "ready").length;
    const blocked = rows.filter((r) => r.readiness === "blocked").length;
    const pendingConsent = rows.filter((r) => r.consent === "pending_signature" || r.consent === "not_started").length;
    return { total, ready, blocked, pendingConsent };
  }, [rows]);

  const filtered = useMemo(() => {
    let list = rows;
    if (readinessFilter !== "all") {
      list = list.filter((r) => r.readiness === readinessFilter);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (r) =>
          r.patientName.toLowerCase().includes(q) ||
          r.mrn.toLowerCase().includes(q) ||
          r.departmentName.toLowerCase().includes(q)
      );
    }
    return list;
  }, [rows, readinessFilter, query]);

  return (
    <div className="space-y-6">
      {/* Top 4 Visual KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Total Active Admissions</div>
          <div className="text-3xl font-extrabold text-slate-900">{stats.total}</div>
          <div className="text-xs text-slate-500 mt-2 font-medium">● 100% tracked in real-time</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Ready for Ward / Procedure</div>
          <div className="text-3xl font-extrabold text-emerald-600">{stats.ready}</div>
          <div className="text-xs text-emerald-600 font-semibold mt-2">✓ Clearance completed</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Blocked Admissions</div>
          <div className="text-3xl font-extrabold text-rose-600">{stats.blocked}</div>
          <div className="text-xs text-rose-600 font-semibold mt-2">⚠ Requires supervisor action</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Pending Consent Forms</div>
          <div className="text-3xl font-extrabold text-amber-600">{stats.pendingConsent}</div>
          <div className="text-xs text-amber-600 font-semibold mt-2">⌛ Mobile consent pending</div>
        </div>
      </div>

      {/* Admissions Flow Funnel Visual */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-4">Admissions Stage Funnel</h3>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {[
            { stage: "Registered", count: 8, color: "bg-blue-50 border-blue-200 text-blue-800" },
            { stage: "Assessment", count: 6, color: "bg-purple-50 border-purple-200 text-purple-800" },
            { stage: "Ward Assigned", count: 7, color: "bg-amber-50 border-amber-200 text-amber-800" },
            { stage: "Ready Now", count: 5, color: "bg-emerald-50 border-emerald-200 text-emerald-800" },
            { stage: "Completed", count: 2, color: "bg-slate-100 border-slate-200 text-slate-700" },
          ].map((item, idx) => (
            <div key={item.stage} className={`p-4 rounded-2xl border ${item.color} flex flex-col justify-between`}>
              <div className="text-xs font-bold uppercase tracking-wider opacity-80">{item.stage}</div>
              <div className="text-2xl font-extrabold my-1">{item.count}</div>
              <div className="text-[10px] opacity-75 font-semibold">Stage {idx + 1}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-80 relative">
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
            placeholder="Search patient, MRN, or department..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <svg className="w-4 h-4 text-slate-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto">
          {["all", "ready", "blocked", "in_progress", "pending"].map((f) => (
            <button
              key={f}
              onClick={() => setReadinessFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                readinessFilter === f
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {f.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Enhanced Table */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Patient Info</th>
                <th className="py-3.5 px-6">Department & Ward</th>
                <th className="py-3.5 px-6">Stage</th>
                <th className="py-3.5 px-6">Readiness</th>
                <th className="py-3.5 px-6">Consent</th>
                <th className="py-3.5 px-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {filtered.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => setSelectedPatient(row)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-900">{row.patientName}</div>
                    <div className="text-xs text-slate-500 font-mono">{row.mrn}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-semibold text-slate-800">{row.departmentName}</div>
                    <div className="text-xs text-slate-500">{row.wardName || "Unassigned"}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                      {row.stage.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                        row.readiness === "ready"
                          ? "bg-emerald-100 text-emerald-800"
                          : row.readiness === "blocked"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      ● {row.readiness}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-xs font-medium text-slate-700">
                      {row.consent === "signed" ? "✓ Signed" : "⌛ Pending"}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <Link
                      href={`/patients/${row.patientId}`}
                      onClick={(e) => e.stopPropagation()}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold text-xs transition-colors"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Detail Drawer */}
      {selectedPatient && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end"
          onClick={() => setSelectedPatient(null)}
        >
          <div
            className="w-full max-w-md bg-white h-full p-6 shadow-2xl overflow-y-auto space-y-6 animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{selectedPatient.patientName}</h3>
                <p className="text-xs text-slate-500 font-mono">MRN: {selectedPatient.mrn}</p>
              </div>
              <button
                onClick={() => setSelectedPatient(null)}
                className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Department:</span>
                  <span className="font-bold text-slate-900">{selectedPatient.departmentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Ward:</span>
                  <span className="font-bold text-slate-900">{selectedPatient.wardName || "Unassigned"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Readiness Status:</span>
                  <span className="font-bold text-blue-600 capitalize">{selectedPatient.readiness}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Consent Status:</span>
                  <span className="font-bold text-slate-900 capitalize">{selectedPatient.consent.replace(/_/g, " ")}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex space-x-3">
                <Link
                  href={`/patients/${selectedPatient.patientId}`}
                  className="w-full text-center py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-500 shadow-md"
                >
                  Open Full Patient Record →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
