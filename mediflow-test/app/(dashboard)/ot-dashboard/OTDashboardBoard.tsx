"use client";

import { useState } from "react";
import Link from "next/link";
import { DEMO_OT_ROOMS, DEMO_OT_ACTIVITY_LOGS, OTRoomRecord } from "@/lib/data/ot-data";
import { ProcedureDetailDrawer } from "@/app/components/ot/ProcedureDetailDrawer";
import { HOSPITAL_NAME } from "@/lib/config/hospital";

export function OTDashboardBoard() {
  const [rooms] = useState<OTRoomRecord[]>(DEMO_OT_ROOMS);
  const [selectedRoom, setSelectedRoom] = useState<OTRoomRecord | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [investigated, setInvestigated] = useState<string | null>(null);

  const getStatusBadge = (status: OTRoomRecord["status"]) => {
    if (status === "IN PROCEDURE") return "bg-blue-100 text-blue-700 border-blue-200";
    if (status === "TURNOVER") return "bg-amber-100 text-amber-800 border-amber-200";
    if (status === "AVAILABLE") return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (status === "PREPARING") return "bg-purple-100 text-purple-700 border-purple-200";
    return "bg-rose-100 text-rose-700 border-rose-200 animate-pulse";
  };

  return (
    <div className="space-y-6 font-sans max-w-7xl mx-auto">
      {/* Toast Feedback */}
      {investigated && (
        <div className="fixed top-20 right-6 z-50 px-4 py-3 rounded-2xl bg-blue-600 text-white font-semibold text-xs shadow-2xl flex items-center space-x-2 animate-in slide-in-from-top-4 duration-200">
          <span>🔍</span>
          <span>Surgical supervisor dispatched to {investigated}.</span>
        </div>
      )}

      {/* Live Status Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#071B34] via-[#0B2545] to-[#0F325C] text-white border border-white/10 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-semibold mb-3">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>● LIVE · All Operating Theatres Operational</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">OT Command Center</h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Real-time surgical operations, room utilization, turnover performance and critical delays for {HOSPITAL_NAME}.
          </p>
          <div className="text-[11px] text-slate-400 mt-2 font-medium">
            ● Last updated 12 seconds ago · Live surgical telemetry
          </div>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <Link
            href="/ai-assistant"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg border border-purple-400/30 flex items-center space-x-2 transition-all transform hover:-translate-y-0.5"
          >
            <span>✨ Ask AI Assistant</span>
          </Link>
          <Link
            href="/alerts"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/20 flex items-center space-x-2 transition-all"
          >
            <span>View Critical Alerts (2)</span>
          </Link>
        </div>
      </div>

      {/* 6 Command KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-[10px] font-bold text-slate-500 uppercase">ACTIVE PROCEDURES</div>
          <div className="text-2xl font-black text-blue-600 mt-1">3</div>
          <div className="text-[11px] font-bold text-blue-600 mt-0.5">In progress</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-[10px] font-bold text-slate-500 uppercase">UPCOMING TODAY</div>
          <div className="text-2xl font-black text-slate-900 mt-1">8</div>
          <div className="text-[11px] font-medium text-slate-400 mt-0.5">Scheduled cases</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-[10px] font-bold text-slate-500 uppercase">COMPLETED TODAY</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">5</div>
          <div className="text-[11px] font-medium text-emerald-600 mt-0.5">Turned over</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-[10px] font-bold text-slate-500 uppercase">CRITICAL DELAYS</div>
          <div className="text-2xl font-black text-rose-600 mt-1">2</div>
          <div className="text-[11px] font-bold text-rose-600 mt-0.5">● Attention</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-[10px] font-bold text-slate-500 uppercase">ROOM UTILIZATION</div>
          <div className="text-2xl font-black text-slate-900 mt-1">78%</div>
          <div className="text-[11px] font-bold text-emerald-600 mt-0.5">Target: 75%</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-[10px] font-bold text-slate-500 uppercase">AVG TURNOVER</div>
          <div className="text-2xl font-black text-amber-600 mt-1">27 <span className="text-xs font-normal">min</span></div>
          <div className="text-[11px] font-medium text-slate-400 mt-0.5">Target: 30 min</div>
        </div>
      </div>

      {/* Live OT Status Grid with 5-Stage Steppers */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-200 pb-3">Live Operating Room Progress Steppers</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {rooms.map((room) => (
            <div
              key={room.id}
              onClick={() => {
                setSelectedRoom(room);
                setDrawerOpen(true);
              }}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-base font-extrabold text-slate-900">{room.name}</span>
                  <span className="text-xs text-slate-500 font-semibold ml-2">({room.department})</span>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusBadge(room.status)}`}>
                  ● {room.status}
                </span>
              </div>

              <div>
                <div className="text-sm font-bold text-slate-900">{room.currentProcedure}</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">
                  Surgeon: {room.surgeon} · Patient: {room.patientName}
                </div>
              </div>

              {/* 5-Stage Visual Progress Stepper */}
              <div className="space-y-1 pt-2">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Surgical Workflow Stages</div>
                <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] font-bold">
                  <div className={`p-1.5 rounded-lg border ${room.stageProgress.preparation === "completed" ? "bg-emerald-100 text-emerald-800 border-emerald-300" : room.stageProgress.preparation === "active" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                    Prep {room.stageProgress.preparation === "completed" ? "✓" : ""}
                  </div>
                  <div className={`p-1.5 rounded-lg border ${room.stageProgress.anesthesia === "completed" ? "bg-emerald-100 text-emerald-800 border-emerald-300" : room.stageProgress.anesthesia === "active" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                    Anesthesia {room.stageProgress.anesthesia === "completed" ? "✓" : ""}
                  </div>
                  <div className={`p-1.5 rounded-lg border ${room.stageProgress.procedure === "completed" ? "bg-emerald-100 text-emerald-800 border-emerald-300" : room.stageProgress.procedure === "active" ? "bg-blue-600 text-white animate-pulse" : "bg-slate-100 text-slate-400"}`}>
                    Procedure {room.stageProgress.procedure === "active" ? "●" : ""}
                  </div>
                  <div className={`p-1.5 rounded-lg border ${room.stageProgress.closure === "completed" ? "bg-emerald-100 text-emerald-800 border-emerald-300" : room.stageProgress.closure === "active" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                    Closure
                  </div>
                  <div className={`p-1.5 rounded-lg border ${room.stageProgress.turnover === "completed" ? "bg-emerald-100 text-emerald-800 border-emerald-300" : room.stageProgress.turnover === "active" ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-400"}`}>
                    Turnover
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Critical Delay Monitors & Turnover Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical Delay Monitor */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">Critical Surgical Delay Monitors</h2>

          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-900 text-sm">OT 02 — Total Knee Replacement</span>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-200 text-rose-900 font-extrabold">20 min delay</span>
              </div>
              <p className="text-rose-800 font-medium">Reason: Previous room turnover overran by 20 minutes due to orthopedic tray count verification.</p>
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    setInvestigated("OT 02");
                    setTimeout(() => setInvestigated(null), 3000);
                  }}
                  className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-xs cursor-pointer"
                >
                  Investigate Delay →
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-900 text-sm">OT 03 — Inguinal Hernia Repair</span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 font-extrabold">12 min delay</span>
              </div>
              <p className="text-amber-800 font-medium">Reason: Instrument pack STZ-903 awaiting CSSD sterilization release code confirmation.</p>
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    setInvestigated("OT 03");
                    setTimeout(() => setInvestigated(null), 3000);
                  }}
                  className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-xs cursor-pointer"
                >
                  Investigate Delay →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Turnover Performance Comparison */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">Average Room Turnover Performance</h2>
          <div className="space-y-3 text-xs">
            {rooms.map((r) => (
              <div key={r.id} className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-800">{r.name} ({r.department})</span>
                  <span className="text-slate-600 font-bold">{r.turnoverMinutes} min <span className="text-slate-400 font-normal">(Target 30m)</span></span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${r.turnoverMinutes > 30 ? "bg-rose-500" : "bg-emerald-500"}`}
                    style={{ width: `${(r.turnoverMinutes / 40) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Activity Feed */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">Live OT Activity Feed</h2>

        <div className="space-y-3 text-xs">
          {DEMO_OT_ACTIVITY_LOGS.map((act) => (
            <div key={act.id} className="flex items-start space-x-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
              <div className="flex-1">
                <div className="font-bold text-slate-900">{act.description}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{act.room} · Logged at {act.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Drawer */}
      <ProcedureDetailDrawer
        item={selectedRoom}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
