"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DEMO_OT_ROOMS, OTRoomRecord, OTProcedureScheduleRecord } from "@/lib/data/ot-data";
import { ScheduleProcedureModal } from "@/app/components/ot/ScheduleProcedureModal";
import { ProcedureDetailDrawer } from "@/app/components/ot/ProcedureDetailDrawer";
import { PatientFlowLineChart } from "@/app/components/charts/PatientFlowLineChart";
import { HOSPITAL_NAME } from "@/lib/config/hospital";
import { useOperationalData } from "@/lib/data/operational-context";

export function OTOverviewBoard() {
  const { getTimeSeries } = useOperationalData();

  const [rooms] = useState<OTRoomRecord[]>(DEMO_OT_ROOMS);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<OTRoomRecord | OTProcedureScheduleRecord | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Live Timer tick
  const [timerTick, setTimerTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTimerTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatElapsed = (seconds: number) => {
    const totalSecs = seconds + timerTick;
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const getStatusBadge = (status: OTRoomRecord["status"]) => {
    if (status === "IN PROCEDURE") return "bg-blue-100 text-blue-700 border-blue-200";
    if (status === "TURNOVER") return "bg-amber-100 text-amber-800 border-amber-200";
    if (status === "AVAILABLE") return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (status === "PREPARING") return "bg-purple-100 text-purple-700 border-purple-200";
    return "bg-rose-100 text-rose-700 border-rose-200 animate-pulse";
  };

  const handleSchedule = () => {
    setToastMsg("✓ Procedure scheduled successfully in Mediflow General Hospital.");
    setTimeout(() => setToastMsg(null), 3000);
  };

  const series = getTimeSeries();

  return (
    <div className="space-y-6 font-sans max-w-7xl mx-auto">
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 px-4 py-3 rounded-2xl bg-emerald-600 text-white font-semibold text-xs shadow-2xl flex items-center space-x-2 animate-in slide-in-from-top-4 duration-200">
          <span>✓</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Operating Theatre</h1>
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs font-bold text-emerald-700">● LIVE</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Real-time visibility into operating room utilization, procedures, turnover and surgical delays for {HOSPITAL_NAME}.
          </p>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            ● OT operations updated 12 seconds ago · Live surgical feed
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button
            onClick={() => setScheduleModalOpen(true)}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center space-x-1.5"
          >
            <span>+ Schedule Procedure</span>
          </button>
          <Link
            href="/ot/schedule"
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-200 transition-all cursor-pointer flex items-center justify-center space-x-1.5"
          >
            <span>View Full Schedule →</span>
          </Link>
        </div>
      </div>

      {/* 5 OT KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* KPI 1 */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all transform hover:-translate-y-0.5">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">ACTIVE PROCEDURES</div>
          <div className="text-2xl font-black text-blue-600">1</div>
          <div className="text-[11px] font-bold text-blue-600 mt-1">OT 01 in progress</div>
        </div>

        {/* KPI 2 */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all transform hover:-translate-y-0.5">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">UPCOMING TODAY</div>
          <div className="text-2xl font-black text-slate-900">6</div>
          <div className="text-[11px] font-medium text-slate-400 mt-1">Cases scheduled</div>
        </div>

        {/* KPI 3 */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all transform hover:-translate-y-0.5">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">AVAILABLE ROOMS</div>
          <div className="text-2xl font-black text-emerald-600">2 / 5</div>
          <div className="text-[11px] font-bold text-emerald-600 mt-1">OT 05 & OT 03 ready</div>
        </div>

        {/* KPI 4 */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all transform hover:-translate-y-0.5">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">ROOM UTILIZATION</div>
          <div className="text-2xl font-black text-slate-900">78%</div>
          <div className="text-[11px] font-bold text-emerald-600 mt-1">↑ 6.2% vs yesterday</div>
        </div>

        {/* KPI 5 */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-rose-300 transition-all transform hover:-translate-y-0.5">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">CRITICAL DELAYS</div>
          <div className="text-2xl font-black text-rose-600">2</div>
          <div className="text-[11px] font-bold text-rose-600 mt-1">● Needs Attention</div>
        </div>
      </div>

      {/* Operating Room Status Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h2 className="text-lg font-extrabold text-slate-900">Operating Room Status</h2>
          <span className="text-xs font-semibold text-slate-500">Showing 5 Rooms</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {rooms.map((room) => (
            <div
              key={room.id}
              onClick={() => {
                setSelectedItem(room);
                setDrawerOpen(true);
              }}
              className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-400 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">{room.name}</span>
                    <span className="text-xs font-semibold text-slate-500">({room.department})</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusBadge(room.status)}`}>
                    ● {room.status}
                  </span>
                </div>

                <div className="text-xs font-bold text-slate-900 mb-1">{room.currentProcedure}</div>

                <div className="space-y-1 text-xs text-slate-600 font-medium mb-4">
                  <div><span className="text-slate-400">Patient:</span> {room.patientName}</div>
                  <div><span className="text-slate-400">Surgeon:</span> {room.surgeon}</div>
                  {room.status === "IN PROCEDURE" && (
                    <div className="flex items-center space-x-2 pt-1">
                      <span className="text-slate-400">Elapsed Time:</span>
                      <span className="font-mono font-bold text-blue-600">{formatElapsed(room.elapsedSeconds)}</span>
                    </div>
                  )}
                  {room.delayReason && (
                    <div className="text-rose-600 font-semibold pt-1">⚠ {room.delayReason}</div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Next: {room.nextProcedure}</span>
                <span className="text-blue-600 font-bold group-hover:underline">View Case →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Procedures List & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">Active Procedures Progress</h2>
          <div className="space-y-4 text-xs">
            {rooms.filter((r) => r.status === "IN PROCEDURE" || r.status === "DELAYED").map((r) => (
              <div key={r.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{r.currentProcedure} — {r.name}</span>
                  <span className="font-bold text-blue-600">{r.progressPct}% Complete</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${r.progressPct}%` }} />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                  <span>Patient: {r.patientName}</span>
                  <span>Expected End: {r.expectedCompletion}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* OT Utilization Chart */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">OT Utilization Trend</h2>
            <p className="text-xs text-slate-500 mb-2">Hourly surgical room occupancy %</p>
            <PatientFlowLineChart series={series} height={180} />
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      <ScheduleProcedureModal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        onSchedule={handleSchedule}
      />

      {/* Detail Drawer */}
      <ProcedureDetailDrawer
        item={selectedItem}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
