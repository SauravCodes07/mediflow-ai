"use client";

import { useState } from "react";
import { OTProcedureScheduleRecord } from "@/lib/data/ot-data";

interface ScheduleProcedureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (item: OTProcedureScheduleRecord) => void;
}

export function ScheduleProcedureModal({ isOpen, onClose, onSchedule }: ScheduleProcedureModalProps) {
  const [room, setRoom] = useState("OT 01");
  const [procedure, setProcedure] = useState("");
  const [patientName, setPatientName] = useState("");
  const [surgeon, setSurgeon] = useState("Dr. Marcus Lee");
  const [startTime, setStartTime] = useState("10:00 AM");
  const [durationHours, setDurationHours] = useState(2.0);
  const [preOpStatus, setPreOpStatus] = useState<"Ready" | "Pending Consent" | "Lab Held">("Ready");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!procedure.trim() || !patientName.trim()) return;

    const startHourVal = parseFloat(startTime) || 10.0;
    const newProcedure: OTProcedureScheduleRecord = {
      id: `sch_${Date.now()}`,
      room,
      procedure: procedure.trim(),
      patientName: patientName.trim(),
      surgeon,
      startTime,
      endTime: "12:00 PM",
      startHour: startHourVal,
      durationHours: Number(durationHours) || 2.0,
      status: "preparing",
      preOpStatus,
      packCode: `STZ-${Math.floor(800 + Math.random() * 199)}`,
      anesthesiaStatus: "Clear",
    };

    onSchedule(newProcedure);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[190] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-sans animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">+ Schedule Surgical Procedure</h2>
            <p className="text-xs text-slate-500 font-medium">Reserve Operating Theatre slot in Mediflow General Hospital</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-all">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Operating Room *</label>
              <select
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:border-blue-500"
              >
                <option value="OT 01">OT 01 (Cardiology / Vascular)</option>
                <option value="OT 02">OT 02 (Orthopedics / Joint)</option>
                <option value="OT 03">OT 03 (General / Laparoscopic)</option>
                <option value="OT 04">OT 04 (Neurology / Spine)</option>
                <option value="OT 05">OT 05 (Pediatrics / ENT)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Procedure Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Laparoscopic Cholecystectomy"
                value={procedure}
                onChange={(e) => setProcedure(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-medium focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Patient Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Meera Joshi"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-medium focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Lead Surgeon</label>
              <select
                value={surgeon}
                onChange={(e) => setSurgeon(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:border-blue-500"
              >
                <option value="Dr. Marcus Lee">Dr. Marcus Lee (Cardiac)</option>
                <option value="Dr. Vikram Seth">Dr. Vikram Seth (Ortho)</option>
                <option value="Dr. Ananya Roy">Dr. Ananya Roy (General)</option>
                <option value="Dr. S. Mukherjee">Dr. S. Mukherjee (Neuro)</option>
                <option value="Dr. Sana Iyer">Dr. Sana Iyer (Peds)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Start Time</label>
              <input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-medium focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Est. Duration (hrs)</label>
              <input
                type="number"
                step="0.25"
                value={durationHours}
                onChange={(e) => setDurationHours(parseFloat(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-medium focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Pre-Op Readiness</label>
              <select
                value={preOpStatus}
                onChange={(e) => setPreOpStatus(e.target.value as "Ready" | "Pending Consent" | "Lab Held")}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:border-blue-500"
              >
                <option value="Ready">Ready</option>
                <option value="Pending Consent">Pending Consent</option>
                <option value="Lab Held">Lab Held</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold">Cancel</button>
            <button type="submit" className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md">Confirm & Schedule</button>
          </div>
        </form>
      </div>
    </div>
  );
}
