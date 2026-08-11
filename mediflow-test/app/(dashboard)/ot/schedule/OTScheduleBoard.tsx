"use client";

import { useState } from "react";
import { DEMO_SCHEDULE_PROCEDURES, OTProcedureScheduleRecord } from "@/lib/data/ot-data";
import { ScheduleProcedureModal } from "@/app/components/ot/ScheduleProcedureModal";
import { ProcedureDetailDrawer } from "@/app/components/ot/ProcedureDetailDrawer";

export function OTScheduleBoard() {
  const [procedures, setProcedures] = useState<OTProcedureScheduleRecord[]>(DEMO_SCHEDULE_PROCEDURES);
  const [roomFilter, setRoomFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"day" | "week">("day");
  const [currentDate, setCurrentDate] = useState("09 AUG 2026");

  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedProcedure, setSelectedProcedure] = useState<OTProcedureScheduleRecord | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const roomsList = ["OT 01", "OT 02", "OT 03", "OT 04", "OT 05"];
  const timeSlots = ["06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

  const filteredProcedures = procedures.filter((p) => roomFilter === "All" || p.room === roomFilter);

  const getStatusColor = (status: OTProcedureScheduleRecord["status"]) => {
    if (status === "active") return "bg-blue-600 border-blue-500 text-white shadow-md";
    if (status === "completed") return "bg-emerald-600 border-emerald-500 text-white";
    if (status === "turnover") return "bg-amber-500 border-amber-400 text-white";
    if (status === "delayed") return "bg-rose-600 border-rose-500 text-white animate-pulse";
    return "bg-purple-600 border-purple-500 text-white";
  };

  const handleAddProcedure = (newProc: OTProcedureScheduleRecord) => {
    setProcedures((prev) => [newProc, ...prev]);
    setToastMsg("✓ Procedure scheduled successfully in Mediflow General Hospital.");
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="space-y-6 font-sans max-w-7xl mx-auto">
      {/* Toast Banner */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 px-4 py-3 rounded-2xl bg-emerald-600 text-white font-semibold text-xs shadow-2xl flex items-center space-x-2 animate-in slide-in-from-top-4 duration-200">
          <span>✓</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Operating Theatre Schedule</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Plan, monitor and coordinate surgical procedures across all operating rooms in Mediflow General Hospital.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button
            onClick={() => setScheduleModalOpen(true)}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            + Schedule Procedure
          </button>
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setViewMode("day")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${viewMode === "day" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600"}`}
            >
              Day View
            </button>
            <button
              onClick={() => setViewMode("week")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${viewMode === "week" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600"}`}
            >
              Week View
            </button>
          </div>
        </div>
      </div>

      {/* Schedule KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-[10px] font-bold text-slate-500 uppercase">TODAY'S PROCEDURES</div>
          <div className="text-2xl font-black text-slate-900 mt-1">12</div>
          <div className="text-[11px] font-medium text-slate-400 mt-0.5">Across 5 OTs</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-[10px] font-bold text-slate-500 uppercase">ACTIVE</div>
          <div className="text-2xl font-black text-blue-600 mt-1">3</div>
          <div className="text-[11px] font-medium text-blue-600 mt-0.5">Cases in progress</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-[10px] font-bold text-slate-500 uppercase">COMPLETED</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">6</div>
          <div className="text-[11px] font-medium text-emerald-600 mt-0.5">Turned over</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-[10px] font-bold text-slate-500 uppercase">DELAYED</div>
          <div className="text-2xl font-black text-rose-600 mt-1">2</div>
          <div className="text-[11px] font-bold text-rose-600 mt-0.5">● Delayed cases</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-[10px] font-bold text-slate-500 uppercase">AVAILABLE SLOTS</div>
          <div className="text-2xl font-black text-purple-600 mt-1">4</div>
          <div className="text-[11px] font-medium text-purple-600 mt-0.5">Open for booking</div>
        </div>
      </div>

      {/* Date & Filter Toolbar */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold">
        <div className="flex items-center space-x-3">
          <button onClick={() => setCurrentDate("08 AUG 2026")} className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200">← Previous Day</button>
          <span className="text-sm font-extrabold text-slate-900">{currentDate}</span>
          <button onClick={() => setCurrentDate("10 AUG 2026")} className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200">Next Day →</button>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-slate-500 uppercase font-bold">Room Filter:</span>
          <select
            value={roomFilter}
            onChange={(e) => setRoomFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 font-bold focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Operating Rooms</option>
            <option value="OT 01">OT 01 (Cardiology)</option>
            <option value="OT 02">OT 02 (Orthopedics)</option>
            <option value="OT 03">OT 03 (General)</option>
            <option value="OT 04">OT 04 (Neurology)</option>
            <option value="OT 05">OT 05 (Pediatrics)</option>
          </select>
        </div>
      </div>

      {/* Scheduling Timeline Grid */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden p-6">
        <div className="overflow-x-auto">
          <div className="min-w-[900px] space-y-4">
            {/* Timeline Header Row */}
            <div className="grid grid-cols-13 gap-2 border-b border-slate-200 pb-3 text-xs font-bold text-slate-500 uppercase">
              <div className="col-span-1">ROOM</div>
              {timeSlots.map((slot) => (
                <div key={slot} className="col-span-1 text-center font-mono">{slot}</div>
              ))}
            </div>

            {/* Room Timeline Rows */}
            {roomsList.filter((r) => roomFilter === "All" || r === roomFilter).map((r) => {
              const roomProcedures = filteredProcedures.filter((p) => p.room === r);

              return (
                <div key={r} className="grid grid-cols-13 gap-2 items-center min-h-[70px] border-b border-slate-100 pb-3">
                  <div className="col-span-1 font-extrabold text-sm text-slate-900">{r}</div>

                  <div className="col-span-12 relative h-14 bg-slate-50 rounded-2xl border border-slate-100 flex items-center p-1 overflow-hidden">
                    {roomProcedures.map((proc) => {
                      const leftPct = ((proc.startHour - 6.0) / 11.0) * 100;
                      const widthPct = (proc.durationHours / 11.0) * 100;

                      return (
                        <div
                          key={proc.id}
                          onClick={() => {
                            setSelectedProcedure(proc);
                            setDrawerOpen(true);
                          }}
                          style={{ left: `${Math.max(0, leftPct)}%`, width: `${Math.min(100, widthPct)}%` }}
                          className={`absolute h-12 rounded-xl p-2 border flex flex-col justify-between text-xs cursor-pointer transition-all hover:scale-[1.02] ${getStatusColor(proc.status)}`}
                        >
                          <div className="font-bold truncate">{proc.procedure}</div>
                          <div className="text-[10px] opacity-90 truncate font-medium">{proc.patientName} · {proc.surgeon}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      <ScheduleProcedureModal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        onSchedule={handleAddProcedure}
      />

      {/* Detail Drawer */}
      <ProcedureDetailDrawer
        item={selectedProcedure}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
