"use client";

import { useEffect, useCallback } from "react";
import { PatientRecord } from "@/lib/data/patients-data";

interface PatientDetailDrawerProps {
  patient: PatientRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PatientDetailDrawer({ patient, isOpen, onClose }: PatientDetailDrawerProps) {
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

  if (!isOpen || !patient) return null;

  const initials = patient.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const getStatusBadge = (status: PatientRecord["status"]) => {
    if (status === "Critical") return "bg-rose-100 text-rose-700 border-rose-200";
    if (status === "Admitted") return "bg-blue-100 text-blue-700 border-blue-200";
    if (status === "Discharged") return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (status === "Under Observation") return "bg-amber-100 text-amber-800 border-amber-200";
    return "bg-purple-100 text-purple-700 border-purple-200";
  };

  return (
    <div className="fixed inset-0 z-[180] overflow-hidden font-sans">
      {/* Backdrop Overlay */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Right Slide-Over Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
          {/* Drawer Header */}
          <div className="p-6 border-b border-slate-100 bg-slate-50/80 flex items-start justify-between shrink-0">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white font-black text-lg flex items-center justify-center shadow-md">
                {initials}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg font-extrabold text-slate-900">{patient.name}</h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusBadge(patient.status)}`}>
                    {patient.status}
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-semibold mt-0.5">
                  ID: <span className="font-mono text-slate-800">{patient.id}</span> · {patient.age} yrs, {patient.gender}
                </div>
                <div className="text-xs text-blue-600 font-bold mt-1">
                  📍 {patient.roomBed}
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-all cursor-pointer"
              aria-label="Close drawer"
            >
              ✕
            </button>
          </div>

          {/* Drawer Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Quick Profile Specs */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Department:</span>
                <span className="font-bold text-slate-900">{patient.department}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Assigned Physician:</span>
                <span className="font-bold text-slate-900">{patient.assignedDoctor}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Admission Date:</span>
                <span className="font-bold text-slate-900">{patient.admissionDate}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-medium">Emergency Contact:</span>
                <span className="font-semibold text-slate-800 truncate max-w-[200px]">{patient.emergencyContact}</span>
              </div>
            </div>

            {/* Current Vitals Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Vitals</h3>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  patient.vitalsStatus === "Critical"
                    ? "bg-rose-100 text-rose-700"
                    : patient.vitalsStatus === "Warning"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-emerald-100 text-emerald-700"
                }`}>
                  ● {patient.vitalsStatus}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                {/* Heart Rate */}
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-blue-300 transition-all relative group">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Heart Rate</div>
                  <div className="text-xl font-extrabold text-slate-900 mt-1">{patient.vitals.heartRate} <span className="text-xs font-semibold text-slate-500">BPM</span></div>
                  <div className="text-[10px] font-semibold text-emerald-600 mt-0.5">Normal Range: 60-100 BPM</div>
                </div>

                {/* Blood Pressure */}
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-blue-300 transition-all relative group">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Blood Pressure</div>
                  <div className="text-xl font-extrabold text-slate-900 mt-1">{patient.vitals.bp}</div>
                  <div className="text-[10px] font-semibold text-emerald-600 mt-0.5">Normal Range: 120/80</div>
                </div>

                {/* SpO2 */}
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-blue-300 transition-all relative group">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">SpO₂ Oxygen</div>
                  <div className="text-xl font-extrabold text-slate-900 mt-1">{patient.vitals.spO2}%</div>
                  <div className="text-[10px] font-semibold text-emerald-600 mt-0.5">Normal Range: 95-100%</div>
                </div>

                {/* Body Temperature */}
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-blue-300 transition-all relative group">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Temperature</div>
                  <div className="text-xl font-extrabold text-slate-900 mt-1">{patient.vitals.temp}°F</div>
                  <div className="text-[10px] font-semibold text-emerald-600 mt-0.5">Normal Range: 97-99°F</div>
                </div>
              </div>
            </div>

            {/* Medical Timeline Events */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Medical & Clinical Timeline</h3>

              <div className="relative border-l-2 border-slate-200 ml-3 pl-4 space-y-4 text-xs">
                {patient.timeline.map((evt, idx) => (
                  <div key={idx} className="relative group">
                    {/* Bullet */}
                    <span className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-blue-600 border-2 border-white shadow-xs" />
                    <div className="font-bold text-slate-900 flex items-center justify-between">
                      <span>{evt.title}</span>
                      <span className="text-[10px] font-medium text-slate-400">{evt.time}</span>
                    </div>
                    <p className="text-slate-600 mt-0.5 leading-relaxed">{evt.description}</p>
                    <div className="text-[10px] font-semibold text-slate-400 mt-1">Logged by: {evt.actor}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Drawer Footer Actions */}
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center space-x-3 shrink-0">
            <button
              onClick={() => alert(`Printing Medical Report for ${patient.name}...`)}
              className="flex-1 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs shadow-2xs transition-all cursor-pointer"
            >
              📄 Export Profile
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
