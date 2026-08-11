"use client";

import { useState } from "react";
import { PatientRecord } from "@/lib/data/patients-data";

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPatient: (patient: PatientRecord) => void;
}

export function AddPatientModal({ isOpen, onClose, onAddPatient }: AddPatientModalProps) {
  const [name, setName] = useState("");
  const [age, setAge] = useState<number>(38);
  const [gender, setGender] = useState<"Male" | "Female" | "Other">("Male");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState<PatientRecord["department"]>("Emergency");
  const [doctor, setDoctor] = useState("Dr. Anika Rao");
  const [status, setStatus] = useState<PatientRecord["status"]>("Admitted");
  const [emergencyContact, setEmergencyContact] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const newId = `PT-${Math.floor(10000 + Math.random() * 90000)}`;
    const newPatient: PatientRecord = {
      id: newId,
      name: name.trim(),
      age: Number(age) || 30,
      gender,
      phone: phone.trim(),
      department,
      assignedDoctor: doctor,
      admissionDate: "Today",
      status,
      vitals: { heartRate: 76, bp: "120/80", spO2: 98, temp: 98.4, rr: 16 },
      vitalsStatus: "Normal",
      roomBed: `${department} - Bed 01`,
      emergencyContact: emergencyContact.trim() || "Contact on File",
      timeline: [
        {
          time: "Just now",
          title: "Patient Registered & Admitted",
          description: "New patient profile created in Mediflow Command Center.",
          actor: doctor,
          type: "admission",
        },
      ],
    };

    onAddPatient(newPatient);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[190] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-sans animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">+ Add New Patient</h2>
            <p className="text-xs text-slate-500 font-medium">Register a patient profile into Mediflow General Hospital</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-all">✕</button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Kavya Nair"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Phone Number *</label>
              <input
                type="text"
                required
                placeholder="+91 98201 00000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as "Male" | "Female" | "Other")}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Initial Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PatientRecord["status"])}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
              >
                <option value="Admitted">Admitted</option>
                <option value="Under Observation">Under Observation</option>
                <option value="Critical">Critical</option>
                <option value="Scheduled">Scheduled</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as PatientRecord["department"])}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
              >
                <option value="Emergency">Emergency</option>
                <option value="Cardiology">Cardiology</option>
                <option value="General Medicine">General Medicine</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Neurology">Neurology</option>
                <option value="Surgery">Surgery</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="ICU">ICU</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Assigned Physician</label>
              <input
                type="text"
                value={doctor}
                onChange={(e) => setDoctor(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Emergency Contact Details</label>
            <input
              type="text"
              placeholder="e.g. Spouse / Kin name & phone"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold">Cancel</button>
            <button type="submit" className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md">Register & Add Patient</button>
          </div>
        </form>
      </div>
    </div>
  );
}
