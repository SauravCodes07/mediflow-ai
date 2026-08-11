"use client";

import { useEffect, useCallback } from "react";
import { OTProcedureScheduleRecord, OTRoomRecord } from "@/lib/data/ot-data";

interface ProcedureDetailDrawerProps {
  item: OTProcedureScheduleRecord | OTRoomRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProcedureDetailDrawer({ item, isOpen, onClose }: ProcedureDetailDrawerProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !item) return null;

  const isRoomRecord = "elapsedSeconds" in item;
  const title = isRoomRecord ? (item as OTRoomRecord).currentProcedure : (item as OTProcedureScheduleRecord).procedure;
  const roomName = isRoomRecord ? (item as OTRoomRecord).name : (item as OTProcedureScheduleRecord).room;
  const patientName = isRoomRecord ? (item as OTRoomRecord).patientName : (item as OTProcedureScheduleRecord).patientName;
  const surgeon = isRoomRecord ? (item as OTRoomRecord).surgeon : (item as OTProcedureScheduleRecord).surgeon;
  const status = isRoomRecord ? (item as OTRoomRecord).status : (item as OTProcedureScheduleRecord).status;

  return (
    <div className="fixed inset-0 z-[180] overflow-hidden font-sans">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 bg-slate-50/80 flex items-start justify-between shrink-0">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold">
                  {roomName}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold capitalize">
                  {status}
                </span>
              </div>
              <h2 className="text-lg font-extrabold text-slate-900 mt-1">{title}</h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Surgical Procedure Record · Mediflow General Hospital</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-all">✕</button>
          </div>

          {/* Details */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Patient Name:</span>
                <span className="font-bold text-slate-900">{patientName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Attending Surgeon:</span>
                <span className="font-bold text-slate-900">{surgeon}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Operating Room:</span>
                <span className="font-bold text-blue-600">{roomName}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-medium">CSSD Pack Code:</span>
                <span className="font-mono font-bold text-slate-800">
                  {!isRoomRecord ? (item as OTProcedureScheduleRecord).packCode : "STZ-902"}
                </span>
              </div>
            </div>

            {/* Stage Readiness */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
              <h3 className="font-bold text-slate-900">Pre-Operative Readiness Checks</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                  <span className="text-slate-600 font-medium">Surgical Consent Signature</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold">✓ Verified</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                  <span className="text-slate-600 font-medium">Anesthesia Clearance</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold">✓ Cleared</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                  <span className="text-slate-600 font-medium">CSSD Instrument Sterilization</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold">✓ Batch Released</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-2 shrink-0">
            <button
              onClick={() => alert(`Rescheduling ${title}...`)}
              className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs shadow-2xs"
            >
              📅 Reschedule
            </button>
            <button
              onClick={() => alert(`Editing case ${title}...`)}
              className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs shadow-2xs"
            >
              ✏️ Edit Case
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
