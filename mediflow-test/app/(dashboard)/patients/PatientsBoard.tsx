"use client";

import { useState, useMemo } from "react";
import { DEMO_PATIENTS_LIST, PatientRecord } from "@/lib/data/patients-data";
import { PatientDetailDrawer } from "@/app/components/patients/PatientDetailDrawer";
import { AddPatientModal } from "@/app/components/patients/AddPatientModal";
import { PatientFlowLineChart } from "@/app/components/charts/PatientFlowLineChart";
import { HOSPITAL_NAME } from "@/lib/config/hospital";
import { useOperationalData } from "@/lib/data/operational-context";

export function PatientsBoard() {
  const { getTimeSeries } = useOperationalData();

  // Patient List State
  const [patients, setPatients] = useState<PatientRecord[]>(DEMO_PATIENTS_LIST);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [deptFilter, setDeptFilter] = useState<string>("All");
  const [genderFilter, setGenderFilter] = useState<string>("All");

  // Selected Patient for Drawer
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Modals & Feedback
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Chart Timeframe
  const [chartTimeframe, setChartTimeframe] = useState<"24h" | "7d" | "30d">("7d");

  // Filtered Patient Dataset
  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.phone.includes(searchQuery) ||
        p.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.assignedDoctor.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === "All" || p.status === statusFilter;
      const matchDept = deptFilter === "All" || p.department === deptFilter;
      const matchGender = genderFilter === "All" || p.gender === genderFilter;

      return matchSearch && matchStatus && matchDept && matchGender;
    });
  }, [patients, searchQuery, statusFilter, deptFilter, genderFilter]);

  // Reset pagination to Page 1 when filters change
  const paginatedPatients = useMemo(() => {
    const startIdx = (currentPage - 1) * rowsPerPage;
    return filteredPatients.slice(startIdx, startIdx + rowsPerPage);
  }, [filteredPatients, currentPage, rowsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredPatients.length / rowsPerPage));

  // Add Patient Handler
  const handleAddPatient = (newPatient: PatientRecord) => {
    setPatients((prev) => [newPatient, ...prev]);
    setToastMsg("✓ Patient added successfully to Mediflow General Hospital.");
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Export CSV Handler
  const handleExportCSV = () => {
    const csvRows = [
      ["Patient ID", "Full Name", "Age", "Gender", "Phone", "Department", "Assigned Doctor", "Admission Date", "Status"],
      ...filteredPatients.map((p) => [
        p.id,
        `"${p.name}"`,
        p.age,
        p.gender,
        `"${p.phone}"`,
        `"${p.department}"`,
        `"${p.assignedDoctor}"`,
        `"${p.admissionDate}"`,
        p.status,
      ]),
    ];

    const csvContent = csvRows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Mediflow_Patients_${deptFilter}_${statusFilter}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setToastMsg("✓ Filtered patient list exported as CSV.");
    setTimeout(() => setToastMsg(null), 3000);
  };

  const series = getTimeSeries();

  const getStatusBadge = (status: PatientRecord["status"]) => {
    if (status === "Critical") return "bg-rose-100 text-rose-700 border-rose-200";
    if (status === "Admitted") return "bg-blue-100 text-blue-700 border-blue-200";
    if (status === "Discharged") return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (status === "Under Observation") return "bg-amber-100 text-amber-800 border-amber-200";
    return "bg-purple-100 text-purple-700 border-purple-200";
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Toast Notification Banner */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 px-4 py-3 rounded-2xl bg-emerald-600 text-white font-semibold text-xs shadow-2xl flex items-center space-x-2 animate-in slide-in-from-top-4 duration-200">
          <span>✓</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Patients</h1>
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs font-semibold text-emerald-700">● LIVE</span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Search, monitor and manage patients across {HOSPITAL_NAME}.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button
            onClick={() => setAddModalOpen(true)}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center space-x-1.5"
          >
            <span>+ Add Patient</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-200 transition-all cursor-pointer flex items-center justify-center space-x-1.5"
          >
            <span>📄 Export Patient Data</span>
          </button>
        </div>
      </div>

      {/* 6 Interactive Top KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* KPI 1 */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 transform hover:-translate-y-0.5">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">TOTAL PATIENTS</div>
          <div className="text-2xl font-black text-slate-900">1,284</div>
          <div className="text-[11px] font-bold text-emerald-600 mt-1">↑ 8.4% this month</div>
        </div>

        {/* KPI 2 */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 transform hover:-translate-y-0.5">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">ACTIVE PATIENTS</div>
          <div className="text-2xl font-black text-blue-600">186</div>
          <div className="text-[11px] font-medium text-slate-400 mt-1">Currently in-house</div>
        </div>

        {/* KPI 3 */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all duration-200 transform hover:-translate-y-0.5">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">ADMITTED TODAY</div>
          <div className="text-2xl font-black text-emerald-600">42</div>
          <div className="text-[11px] font-medium text-slate-400 mt-1">Intake processed</div>
        </div>

        {/* KPI 4 */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-200 transform hover:-translate-y-0.5">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">DISCHARGED TODAY</div>
          <div className="text-2xl font-black text-indigo-600">27</div>
          <div className="text-[11px] font-medium text-slate-400 mt-1">Home cleared</div>
        </div>

        {/* KPI 5 */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-rose-300 transition-all duration-200 transform hover:-translate-y-0.5">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">CRITICAL</div>
          <div className="text-2xl font-black text-rose-600">8</div>
          <div className="text-[11px] font-bold text-rose-600 mt-1">● High Triage</div>
        </div>

        {/* KPI 6 */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-300 transition-all duration-200 transform hover:-translate-y-0.5">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">AVERAGE STAY</div>
          <div className="text-2xl font-black text-amber-600">4.6 <span className="text-xs font-normal">days</span></div>
          <div className="text-[11px] font-medium text-slate-400 mt-1">Target: 4.8 days</div>
        </div>
      </div>

      {/* Patient Search & Multi-Filters Toolbar */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 min-w-0">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search patients by name, patient ID, phone, department, doctor..."
              className="w-full px-4 py-2.5 pl-10 text-xs sm:text-sm rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
            />
            <span className="absolute left-3.5 top-3 text-slate-400">🔍</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Options */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* Status Filter */}
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-slate-500 uppercase tracking-wider">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 rounded-xl border border-slate-200 text-slate-800 text-xs font-semibold focus:outline-none focus:border-blue-500"
              >
                <option value="All">All Statuses</option>
                <option value="Admitted">Admitted</option>
                <option value="Discharged">Discharged</option>
                <option value="Critical">Critical</option>
                <option value="Under Observation">Under Observation</option>
                <option value="Scheduled">Scheduled</option>
              </select>
            </div>

            {/* Department Filter */}
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-slate-500 uppercase tracking-wider">Department:</span>
              <select
                value={deptFilter}
                onChange={(e) => {
                  setDeptFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 rounded-xl border border-slate-200 text-slate-800 text-xs font-semibold focus:outline-none focus:border-blue-500"
              >
                <option value="All">All Departments</option>
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
          </div>
        </div>

        {/* Filter Badges Summary */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 font-medium">
          <div>
            Showing <strong className="text-slate-900">{filteredPatients.length}</strong> matching patients
          </div>
          {(statusFilter !== "All" || deptFilter !== "All" || searchQuery) && (
            <button
              onClick={() => {
                setStatusFilter("All");
                setDeptFilter("All");
                setSearchQuery("");
                setCurrentPage(1);
              }}
              className="text-blue-600 font-bold hover:underline"
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Responsive Patient Table */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="p-4">Patient</th>
                <th className="p-4">Patient ID</th>
                <th className="p-4">Age / Gender</th>
                <th className="p-4">Department</th>
                <th className="p-4">Assigned Physician</th>
                <th className="p-4">Admission Date</th>
                <th className="p-4">Status</th>
                <th className="p-4">Current Vitals</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {paginatedPatients.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-slate-400 font-medium">
                    No patients match your search criteria.
                  </td>
                </tr>
              ) : (
                paginatedPatients.map((p) => {
                  const initials = p.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();

                  return (
                    <tr
                      key={p.id}
                      onClick={() => {
                        setSelectedPatient(p);
                        setDrawerOpen(true);
                      }}
                      className="hover:bg-blue-50/50 transition-all cursor-pointer group border-l-4 border-l-transparent hover:border-l-blue-600"
                    >
                      {/* Avatar & Name */}
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                            {initials}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{p.name}</div>
                            <div className="text-[11px] text-slate-400 font-medium">{p.phone}</div>
                          </div>
                        </div>
                      </td>

                      {/* ID */}
                      <td className="p-4 font-mono font-semibold text-slate-800">{p.id}</td>

                      {/* Age & Gender */}
                      <td className="p-4 font-medium text-slate-700">{p.age} yrs, {p.gender}</td>

                      {/* Department */}
                      <td className="p-4 font-bold text-slate-900">{p.department}</td>

                      {/* Doctor */}
                      <td className="p-4 font-medium text-slate-700">{p.assignedDoctor}</td>

                      {/* Admission */}
                      <td className="p-4 font-medium text-slate-500">{p.admissionDate}</td>

                      {/* Status Badge */}
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusBadge(p.status)}`}>
                          {p.status}
                        </span>
                      </td>

                      {/* Vitals Summary */}
                      <td className="p-4">
                        <div className="text-[11px] font-semibold text-slate-700">
                          {p.vitals.heartRate} BPM · SpO₂ {p.vitals.spO2}%
                        </div>
                        <div className="text-[10px] text-slate-400">BP {p.vitals.bp}</div>
                      </td>

                      {/* Actions Button */}
                      <td className="p-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPatient(p);
                            setDrawerOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-700 text-[11px] font-bold transition-all"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer Controls */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-600">
          <div className="flex items-center space-x-2">
            <span>Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white font-bold"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span>
              Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
            </span>
            <div className="flex items-center space-x-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 font-bold"
              >
                ← Previous
              </button>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 font-bold"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Patient Flow Trend Line Chart Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Patient Flow Analytics (Admissions vs Discharges)</h3>
            <p className="text-xs text-slate-500 font-medium">Real-time throughput comparison over time</p>
          </div>

          <div className="flex items-center space-x-1 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
            {(["24h", "7d", "30d"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setChartTimeframe(t)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  chartTimeframe === t ? "bg-blue-600 text-white shadow-md" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <PatientFlowLineChart series={series} height={300} />
      </div>

      {/* Demographics Distribution Visual Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Age Distribution Card */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Age Distribution</h3>
          <div className="space-y-3 text-xs">
            {[
              { group: "0–17 yrs", count: 164, pct: "12.8%", color: "bg-blue-500" },
              { group: "18–30 yrs", count: 210, pct: "16.4%", color: "bg-cyan-500" },
              { group: "31–45 yrs", count: 384, pct: "29.9%", color: "bg-emerald-500" },
              { group: "46–60 yrs", count: 312, pct: "24.3%", color: "bg-amber-500" },
              { group: "61+ yrs", count: 214, pct: "16.6%", color: "bg-purple-500" },
            ].map((age) => (
              <div key={age.group} className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-800">{age.group}</span>
                  <span className="text-slate-500">{age.count} patients ({age.pct})</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full rounded-full ${age.color}`} style={{ width: age.pct }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gender Distribution Card */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Gender Demographics</h3>
            <div className="space-y-3 text-xs pt-2">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-blue-50 border border-blue-100">
                <span className="font-bold text-slate-800">Male Patients</span>
                <span className="font-extrabold text-blue-600">612 (47.7%)</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
                <span className="font-bold text-slate-800">Female Patients</span>
                <span className="font-extrabold text-emerald-600">640 (49.8%)</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-purple-50 border border-purple-100">
                <span className="font-bold text-slate-800">Other / Unspecified</span>
                <span className="font-extrabold text-purple-600">32 (2.5%)</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center text-xs font-semibold text-slate-600">
            Total Demographics Base: <strong>1,284 Patients</strong>
          </div>
        </div>

        {/* Department Distribution Card */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Department Patient Load</h3>
          <div className="space-y-3 text-xs">
            {[
              { dept: "General Medicine", count: 304, color: "bg-blue-600" },
              { dept: "Cardiology", count: 214, color: "bg-emerald-500" },
              { dept: "Emergency", count: 186, color: "bg-rose-500" },
              { dept: "Surgery", count: 178, color: "bg-purple-600" },
              { dept: "Pediatrics", count: 164, color: "bg-amber-500" },
            ].map((d) => (
              <div key={d.dept} className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-800">{d.dept}</span>
                  <span className="text-slate-500">{d.count} patients</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full rounded-full ${d.color}`} style={{ width: `${(d.count / 304) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Patient Detail Slide-Over Drawer */}
      <PatientDetailDrawer
        patient={selectedPatient}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      {/* Add Patient Modal */}
      <AddPatientModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAddPatient={handleAddPatient}
      />
    </div>
  );
}
