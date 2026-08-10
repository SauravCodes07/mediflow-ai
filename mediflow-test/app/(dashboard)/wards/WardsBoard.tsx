"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { TransferQueueRow, WardOverview } from "../../../lib/data/queries";

interface SelectedBedInfo {
  bedLabel: string;
  wardName: string;
  status: string;
  patientName?: string | null;
  mrn?: string | null;
}

export function WardsBoard({
  wards,
  transferQueue,
}: {
  wards: WardOverview[];
  transferQueue: TransferQueueRow[];
}) {
  const [query, setQuery] = useState("");
  const [selectedBed, setSelectedBed] = useState<SelectedBedInfo | null>(null);

  const totalCapacity = useMemo(() => {
    let cap = 0;
    let occ = 0;
    let blocked = 0;
    for (const w of wards) {
      cap += w.totalBeds;
      occ += w.occupiedBeds;
      blocked += w.blockedBedsCount;
    }
    const pct = cap > 0 ? Math.round((occ / cap) * 100) : 0;
    return { cap, occ, free: cap - occ, blocked, pct };
  }, [wards]);

  return (
    <div className="space-y-6">
      {/* Capacity Overview KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Overall Occupancy</div>
          <div className="text-3xl font-extrabold text-slate-900">{totalCapacity.pct}%</div>
          <div className="text-xs font-medium text-slate-500 mt-2">{totalCapacity.occ} / {totalCapacity.cap} beds occupied</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Available Beds</div>
          <div className="text-3xl font-extrabold text-emerald-600">{totalCapacity.free}</div>
          <div className="text-xs font-semibold text-emerald-600 mt-2">✓ Ready for immediate intake</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Transfers in Transit</div>
          <div className="text-3xl font-extrabold text-blue-600">{transferQueue.length}</div>
          <div className="text-xs font-medium text-blue-600 mt-2">● Active ward dispatch</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Blocked / Out of Service</div>
          <div className="text-3xl font-extrabold text-rose-600">{totalCapacity.blocked}</div>
          <div className="text-xs font-semibold text-rose-600 mt-2">⚠ Maintenance / Isolation</div>
        </div>
      </div>

      {/* Ward Comparison Bars */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900">Ward Occupancy Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {wards.map((ward) => {
            const occPct = Math.round((ward.occupiedBeds / ward.totalBeds) * 100);
            return (
              <div key={ward.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">{ward.name}</span>
                  <span className="font-extrabold text-blue-600">{occPct}%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      occPct > 90 ? "bg-amber-500" : "bg-blue-600"
                    }`}
                    style={{ width: `${occPct}%` }}
                  />
                </div>
                <div className="text-[11px] text-slate-500 flex justify-between font-medium">
                  <span>{ward.occupiedBeds} occupied</span>
                  <span>{ward.totalBeds - ward.occupiedBeds} free</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Search Input */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <input
          type="text"
          className="w-full max-w-sm px-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          placeholder="Search ward, bed code or patient..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Visual Interactive Bed Map Grid */}
      <div className="space-y-6">
        {wards.map((ward) => (
          <div key={ward.id} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">{ward.name} Bed Map</h3>
                <p className="text-xs text-slate-500">{ward.occupiedBeds} of {ward.totalBeds} beds occupied</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                {ward.totalBeds - ward.occupiedBeds} Available
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {ward.beds.map((bed) => {
                const isOccupied = bed.status === "occupied";
                const isCleaning = bed.status === "cleaning";
                const isBlocked = bed.status === "blocked";

                const tileClass = isOccupied
                  ? "bg-blue-50 border-blue-300 text-blue-900 hover:bg-blue-100"
                  : isCleaning
                  ? "bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100"
                  : isBlocked
                  ? "bg-rose-50 border-rose-300 text-rose-900 hover:bg-rose-100"
                  : "bg-emerald-50 border-emerald-300 text-emerald-900 hover:bg-emerald-100";

                return (
                  <button
                    key={bed.id}
                    onClick={() =>
                      setSelectedBed({
                        bedLabel: bed.label,
                        wardName: ward.name,
                        status: bed.status,
                        patientName: bed.patientName,
                        mrn: bed.patientMrn,
                      })
                    }
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between space-y-2 transition-all transform hover:-translate-y-0.5 cursor-pointer ${tileClass}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs">{bed.label}</span>
                      <span className="w-2 h-2 rounded-full bg-current" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold truncate">
                        {bed.patientName || "Available Bed"}
                      </div>
                      <div className="text-[10px] opacity-75 capitalize font-medium">
                        ● {bed.status}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bed Detail Modal/Drawer */}
      {selectedBed && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedBed(null)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Bed {selectedBed.bedLabel}</h3>
                <p className="text-xs text-slate-500">{selectedBed.wardName}</p>
              </div>
              <button
                onClick={() => setSelectedBed(null)}
                className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-bold capitalize text-blue-600">{selectedBed.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Occupant:</span>
                  <span className="font-bold text-slate-900">{selectedBed.patientName || "None (Available)"}</span>
                </div>
                {selectedBed.mrn && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">MRN:</span>
                    <span className="font-mono text-slate-900">{selectedBed.mrn}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">Sanitization:</span>
                  <span className="font-bold text-emerald-600">Passed / Cleared</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedBed(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
