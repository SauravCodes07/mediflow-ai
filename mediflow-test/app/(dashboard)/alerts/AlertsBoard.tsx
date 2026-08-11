"use client";

import React, { useState, useEffect } from "react";

export interface AlertItem {
  id: string;
  severity: "critical" | "warning" | "info";
  title: string;
  description: string;
  department: string;
  assignedTo: string;
  status: "open" | "acknowledged" | "resolved";
  createdAt: string;
  age: string;
  patientId?: string;
  patientName?: string;
  escalationLevel?: string;
  relatedEvent?: string;
  notes?: { time: string; author: string; text: string }[];
  timeline: { time: string; event: string }[];
}

const INITIAL_ALERTS: AlertItem[] = [
  {
    id: "ALT-001",
    severity: "critical",
    title: "OT Room 01 Delay",
    description: "Surgical procedure turnover time exceeded target by 28 minutes. Patient waiting in pre-op holding area.",
    department: "Operating Theatre",
    assignedTo: "Unassigned",
    status: "open",
    createdAt: "12:45 PM",
    age: "18 min",
    patientName: "Wei Chen",
    patientId: "PT-10482",
    escalationLevel: "Level 2 — Operating Manager Alert",
    relatedEvent: "Case PROC-5001 turnover overrun",
    notes: [],
    timeline: [
      { time: "12:45 PM", event: "Alert generated automatically by OT Delay Detection engine" },
      { time: "12:48 PM", event: "Notified OT Operations Coordinator & Surgical Nurse Lead" },
    ],
  },
  {
    id: "ALT-002",
    severity: "critical",
    title: "CSSD Sterile Pack Expired",
    description: "Sterile tray pack GEN-SET-09 reached expiration timestamp in active OT inventory holding.",
    department: "CSSD",
    assignedTo: "Dr. Anika Rao",
    status: "acknowledged",
    createdAt: "11:50 AM",
    age: "1 hr",
    escalationLevel: "Level 1 — Department Lead Action",
    relatedEvent: "Pack GEN-SET-09 expiration batch #B804",
    notes: [
      { time: "11:58 AM", author: "Dr. Anika Rao", text: "Replacement tray pack GEN-SET-10 dispatched to OT Holding." }
    ],
    timeline: [
      { time: "11:50 AM", event: "Alert created by CSSD Expiry Monitor" },
      { time: "11:52 AM", event: "Assigned to Dr. Anika Rao" },
      { time: "11:58 AM", event: "Acknowledged by Dr. Anika Rao — Replacement pack dispatched" },
    ],
  },
  {
    id: "ALT-003",
    severity: "warning",
    title: "Ward A Occupancy Above 80%",
    description: "Bed occupancy reached 82% (39 of 48 beds occupied). High admissions volume expected during evening shift.",
    department: "General Wards",
    assignedTo: "Nurse Kevin Mathew",
    status: "open",
    createdAt: "12:10 PM",
    age: "45 min",
    escalationLevel: "Level 1 — Ward Charge Nurse Notice",
    relatedEvent: "Capacity threshold 80% breached in Ward A",
    notes: [],
    timeline: [
      { time: "12:10 PM", event: "Capacity warning limit triggered at 82% occupancy" },
    ],
  },
  {
    id: "ALT-004",
    severity: "warning",
    title: "Patient Consent Pending",
    description: "Elective orthopedic surgery consent clearance pending signature before scheduled 14:00 procedure slot.",
    department: "Admissions",
    assignedTo: "Nurse Kevin Mathew",
    status: "acknowledged",
    createdAt: "12:10 PM",
    age: "40 min",
    patientName: "Robert Miller",
    patientId: "PT-10499",
    escalationLevel: "Level 1 — Pre-Op Administrative Check",
    relatedEvent: "Pre-op checklist missing signed consent form",
    notes: [
      { time: "12:15 PM", author: "Nurse Kevin Mathew", text: "Attending physician contacting patient's legal proxy." }
    ],
    timeline: [
      { time: "12:10 PM", event: "Pre-op checklist flagged missing consent form" },
      { time: "12:15 PM", event: "Acknowledged by Nurse Kevin Mathew" },
    ],
  },
  {
    id: "ALT-005",
    severity: "info",
    title: "Patient Transfer Requested",
    description: "Step-down ward transfer request submitted from ICU Bed 04 to Ward C Bed 02.",
    department: "General Wards",
    assignedTo: "Ward Manager",
    status: "open",
    createdAt: "09:40 AM",
    age: "3 hr",
    patientName: "Sarah Connor",
    patientId: "PT-10450",
    escalationLevel: "Informational",
    relatedEvent: "ICU step-down transfer workflow #TR-990",
    notes: [],
    timeline: [
      { time: "09:40 AM", event: "Intake request submitted by ICU Physician" },
    ],
  },
  {
    id: "ALT-006",
    severity: "critical",
    title: "ICU Ventilator Pressure Anomaly",
    description: "Flow sensor pressure variance detected on Ventilator Unit #V-04 in Emergency ICU Bay 2.",
    department: "Emergency",
    assignedTo: "Dr. Rajesh Kumar",
    status: "open",
    createdAt: "12:35 PM",
    age: "28 min",
    escalationLevel: "Level 3 — Emergency Lead Notification",
    relatedEvent: "Telemetry alert dispatched to ER Lead & Biomedical Tech",
    notes: [],
    timeline: [
      { time: "12:35 PM", event: "Telemetry telemetry alarm dispatched to ER Lead" },
    ],
  },
  {
    id: "ALT-007",
    severity: "warning",
    title: "Autoclave Cycle #B804 Thermal Dip",
    description: "Autoclave Chamber 2 recorded a 1.2°C temperature variance during sterilization phase.",
    department: "CSSD",
    assignedTo: "CSSD Supervisor",
    status: "acknowledged",
    createdAt: "10:15 AM",
    age: "2 hr",
    escalationLevel: "Level 1 — Sterilization Quality Check",
    relatedEvent: "Autoclave sensor thermal variance log",
    notes: [
      { time: "10:20 AM", author: "CSSD Supervisor", text: "Cycle aborted and re-run scheduled." }
    ],
    timeline: [
      { time: "10:15 AM", event: "Autoclave sensor log flagged temperature dip" },
      { time: "10:20 AM", event: "Acknowledged by CSSD Supervisor — Cycle re-run initiated" },
    ],
  },
  {
    id: "ALT-008",
    severity: "info",
    title: "Elective Surgery Intake Delayed",
    description: "Intake registration delayed by 15 minutes due to insurance verification bottleneck.",
    department: "Operating Theatre",
    assignedTo: "Dr. Sana Iyer",
    status: "resolved",
    createdAt: "08:30 AM",
    age: "4 hr",
    escalationLevel: "Resolved",
    relatedEvent: "Intake delay resolved",
    notes: [
      { time: "09:10 AM", author: "Dr. Sana Iyer", text: "Pre-op clearance approved after manual verification." }
    ],
    timeline: [
      { time: "08:30 AM", event: "Delay logged at intake desk" },
      { time: "09:10 AM", event: "Resolved by Dr. Sana Iyer — Pre-op clearance approved" },
    ],
  },
  {
    id: "ALT-009",
    severity: "warning",
    title: "Blood Bank O-Negative Stock Low",
    description: "Emergency Blood Bank reserve for O-Negative dropped below minimum 4-unit safety threshold.",
    department: "Emergency",
    assignedTo: "Dr. Sana Iyer",
    status: "open",
    createdAt: "11:15 AM",
    age: "1.5 hr",
    escalationLevel: "Level 2 — Pharmacy & Blood Bank Lead",
    relatedEvent: "Inventory drop alert",
    notes: [],
    timeline: [
      { time: "11:15 AM", event: "Blood bank inventory system triggered low stock warning" },
    ],
  },
  {
    id: "ALT-010",
    severity: "info",
    title: "Routine HVAC Filter Change Scheduled",
    description: "Scheduled maintenance for OT 03 HEPA air filtration system planned for 20:00 tonight.",
    department: "Operating Theatre",
    assignedTo: "Hospital Administrator",
    status: "open",
    createdAt: "08:00 AM",
    age: "5 hr",
    escalationLevel: "Maintenance Routine",
    relatedEvent: "Facilities ticket #FAC-881",
    notes: [],
    timeline: [
      { time: "08:00 AM", event: "Automated maintenance reminder issued" },
    ],
  },
  {
    id: "ALT-011",
    severity: "critical",
    title: "Cardiac Monitor Telemetry Disconnection",
    description: "Bed B-03 patient telemetry monitor lost wireless network handshake signal.",
    department: "General Wards",
    assignedTo: "Nurse Kevin Mathew",
    status: "acknowledged",
    createdAt: "01:05 PM",
    age: "12 min",
    patientName: "Elena Rostova",
    patientId: "PT-10512",
    escalationLevel: "Level 2 — Telemetry Technician Alert",
    relatedEvent: "Telemetry dropped connection",
    notes: [
      { time: "01:10 PM", author: "Nurse Kevin Mathew", text: "Physical vitals checked manually. Network unit re-syncing." }
    ],
    timeline: [
      { time: "01:05 PM", event: "Telemetry system logged signal loss" },
      { time: "01:10 PM", event: "Acknowledged by Nurse Kevin Mathew" },
    ],
  },
  {
    id: "ALT-012",
    severity: "warning",
    title: "Admissions Waiting Queue Over 30 min",
    description: "Average intake registration wait time in main lobby exceeded target threshold.",
    department: "Admissions",
    assignedTo: "Unassigned",
    status: "open",
    createdAt: "12:20 PM",
    age: "35 min",
    escalationLevel: "Level 1 — Queue Manager",
    relatedEvent: "Intake desk queue surge",
    notes: [],
    timeline: [
      { time: "12:20 PM", event: "Queue monitor triggered 30+ min delay alert" },
    ],
  },
  {
    id: "ALT-013",
    severity: "info",
    title: "Pharmacy Medication Batch Dispatched",
    description: "Stat IV antibiotics batch dispatched from Central Pharmacy to Ward B clean utility room.",
    department: "General Wards",
    assignedTo: "Ward Manager",
    status: "resolved",
    createdAt: "10:00 AM",
    age: "3 hr",
    escalationLevel: "Resolved",
    relatedEvent: "Pharmacy order #RX-4022",
    notes: [],
    timeline: [
      { time: "10:00 AM", event: "Dispensed by Central Pharmacy" },
      { time: "10:15 AM", event: "Received and verified in Ward B" },
    ],
  },
  {
    id: "ALT-014",
    severity: "critical",
    title: "Emergency Bay Trauma Surge Alert",
    description: "Emergency Department intake reached 100% capacity due to multi-vehicle accident admissions.",
    department: "Emergency",
    assignedTo: "Dr. Anika Rao",
    status: "open",
    createdAt: "01:12 PM",
    age: "5 min",
    escalationLevel: "Level 3 — Hospital Wide Triage Surge",
    relatedEvent: "Mass casualty event #MCE-04",
    notes: [],
    timeline: [
      { time: "01:12 PM", event: "Emergency Department chief declared Level 3 Triage Surge" },
    ],
  },
];

const STAFF_MEMBERS = [
  "Dr. Anika Rao",
  "Dr. Sana Iyer",
  "Dr. Rajesh Kumar",
  "Nurse Kevin Mathew",
  "Priya Sharma",
  "Marcus Lee",
  "OT Manager",
  "Ward Manager",
  "CSSD Supervisor",
  "Hospital Administrator",
];

export function AlertsBoard() {
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("today");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals & Active Selections
  const [detailModalAlert, setDetailModalAlert] = useState<AlertItem | null>(null);
  const [assignModalAlert, setAssignModalAlert] = useState<AlertItem | null>(null);
  const [assigneeInput, setAssigneeInput] = useState(STAFF_MEMBERS[0]);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [newNoteText, setNewNoteText] = useState("");

  // Toast System
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (text: string, type: "success" | "error" | "info" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Keyboard Escape Listener for Modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDetailModalAlert(null);
        setAssignModalAlert(null);
        setActiveDropdownId(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter Logic
  const filteredAlerts = alerts.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.patientName && item.patientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.assignedTo && item.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSeverity = severityFilter === "all" || item.severity === severityFilter;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesDept = deptFilter === "all" || item.department === deptFilter;

    return matchesSearch && matchesSeverity && matchesStatus && matchesDept;
  });

  // KPI Calculations
  const criticalCount = alerts.filter((a) => a.severity === "critical" && a.status !== "resolved").length;
  const warningCount = alerts.filter((a) => a.severity === "warning" && a.status !== "resolved").length;
  const openCount = alerts.filter((a) => a.status === "open").length;
  const acknowledgedCount = alerts.filter((a) => a.status === "acknowledged").length;

  // Pagination Calculations
  const totalPages = Math.ceil(filteredAlerts.length / pageSize) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const paginatedAlerts = filteredAlerts.slice(startIndex, startIndex + pageSize);

  // Actions
  const handleAcknowledge = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setAlerts((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "acknowledged",
              assignedTo: item.assignedTo === "Unassigned" ? "Dr. Anika Rao" : item.assignedTo,
              timeline: [
                ...item.timeline,
                { time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), event: "Acknowledged by user" },
              ],
            }
          : item
      )
    );
    if (detailModalAlert && detailModalAlert.id === id) {
      setDetailModalAlert((prev) => (prev ? { ...prev, status: "acknowledged" } : null));
    }
    showToast(`✓ Alert ${id} acknowledged successfully.`);
    setActiveDropdownId(null);
  };

  const handleResolve = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setAlerts((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "resolved",
              timeline: [
                ...item.timeline,
                { time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), event: "Marked as resolved" },
              ],
            }
          : item
      )
    );
    if (detailModalAlert && detailModalAlert.id === id) {
      setDetailModalAlert((prev) => (prev ? { ...prev, status: "resolved" } : null));
    }
    showToast(`✓ Alert ${id} marked as resolved.`);
    setActiveDropdownId(null);
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignModalAlert) return;

    const targetId = assignModalAlert.id;
    setAlerts((prev) =>
      prev.map((item) =>
        item.id === targetId
          ? {
              ...item,
              assignedTo: assigneeInput,
              timeline: [
                ...item.timeline,
                { time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), event: `Assigned to ${assigneeInput}` },
              ],
            }
          : item
      )
    );

    if (detailModalAlert && detailModalAlert.id === targetId) {
      setDetailModalAlert((prev) => (prev ? { ...prev, assignedTo: assigneeInput } : null));
    }

    showToast(`✓ Alert ${targetId} assigned to ${assigneeInput}`);
    setAssignModalAlert(null);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!detailModalAlert || !newNoteText.trim()) return;

    const noteObj = {
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      author: "Dr. Anika Rao",
      text: newNoteText.trim(),
    };

    setAlerts((prev) =>
      prev.map((item) =>
        item.id === detailModalAlert.id
          ? { ...item, notes: [...(item.notes || []), noteObj] }
          : item
      )
    );

    setDetailModalAlert((prev) => (prev ? { ...prev, notes: [...(prev.notes || []), noteObj] } : null));
    setNewNoteText("");
    showToast("✓ Clinical note appended to alert history.");
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSeverityFilter("all");
    setStatusFilter("all");
    setDeptFilter("all");
    setDateFilter("today");
    setCurrentPage(1);
    showToast("Filters reset to default.");
  };

  // PDF Export Generator
  const handleExportPDF = () => {
    const printWin = window.open("", "_blank");
    if (!printWin) {
      showToast("✕ Pop-up blocked. Please allow pop-ups to export PDF.", "error");
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Mediflow General Hospital — Alert Report</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; color: #0f172a; padding: 30px; margin: 0; }
            .header { border-bottom: 2px solid #071b34; padding-bottom: 15px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
            .hospital-title { font-size: 24px; font-weight: 800; color: #071b34; margin: 0; }
            .report-title { font-size: 14px; font-weight: 700; color: #1677ff; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }
            .meta { font-size: 11px; color: #64748b; text-align: right; }
            .summary-cards { display: flex; gap: 12px; margin-bottom: 24px; }
            .card { flex: 1; padding: 12px; border-radius: 8px; border: 1px solid #cbd5e1; background: #f8fafc; }
            .card-title { font-size: 10px; font-weight: 700; text-transform: uppercase; color: #475569; }
            .card-val { font-size: 20px; font-weight: 800; margin-top: 4px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
            th { background: #071b34; color: white; padding: 8px 12px; text-align: left; font-size: 11px; text-transform: uppercase; }
            td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; }
            .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700; text-transform: uppercase; }
            .critical { background: #ffe4e6; color: #e11d48; }
            .warning { background: #fef3c7; color: #d97706; }
            .info { background: #e0f2fe; color: #0284c7; }
            .footer { margin-top: 30px; border-top: 1px solid #e2e8f0; pt: 10px; font-size: 10px; color: #94a3b8; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 class="hospital-title">Mediflow General Hospital</h1>
              <div class="report-title">Operational Alerts & Emergency Report</div>
            </div>
            <div class="meta">
              <div>Generated: ${new Date().toLocaleString()}</div>
              <div>Applied Filters: Severity (${severityFilter}), Dept (${deptFilter})</div>
            </div>
          </div>

          <div class="summary-cards">
            <div class="card" style="border-left: 4px solid #e11d48;">
              <div class="card-title">Critical Alerts</div>
              <div class="card-val" style="color: #e11d48;">${criticalCount}</div>
            </div>
            <div class="card" style="border-left: 4px solid #d97706;">
              <div class="card-title">Warnings</div>
              <div class="card-val" style="color: #d97706;">${warningCount}</div>
            </div>
            <div class="card" style="border-left: 4px solid #1677ff;">
              <div class="card-title">Open</div>
              <div class="card-val" style="color: #1677ff;">${openCount}</div>
            </div>
            <div class="card" style="border-left: 4px solid #10b981;">
              <div class="card-title">Acknowledged</div>
              <div class="card-val" style="color: #10b981;">${acknowledgedCount}</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Severity</th>
                <th>Alert Title</th>
                <th>Department</th>
                <th>Assigned To</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              ${filteredAlerts
                .map(
                  (a) => `
                <tr>
                  <td><b>${a.id}</b></td>
                  <td><span class="badge ${a.severity}">${a.severity}</span></td>
                  <td><b>${a.title}</b><br/><span style="color:#64748b; font-size:10px;">${a.description}</span></td>
                  <td>${a.department}</td>
                  <td>${a.assignedTo}</td>
                  <td>${a.status.toUpperCase()}</td>
                  <td>${a.createdAt} (${a.age})</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>

          <div class="footer">
            Confidential Healthcare Operational Document — Mediflow General Hospital Command Center
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    printWin.document.open();
    printWin.document.write(htmlContent);
    printWin.document.close();
    showToast("✓ PDF Report generated for printing.");
  };

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto font-sans select-none pb-24 text-slate-800 dark:text-slate-100">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-[70] px-4 py-3 rounded-2xl bg-[#071B34] text-white font-bold text-xs shadow-2xl border border-cyan-400/40 flex items-center space-x-2.5 animate-in slide-in-from-top-4 duration-200">
          <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs">
            {toastMessage.type === "error" ? "✕" : "✓"}
          </span>
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#071B34] text-white border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.35)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        
        <div className="space-y-2 z-10">
          <div className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">
            Mediflow General Hospital · Command Center
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
            Alerts & Emergency Operations
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-normal leading-relaxed">
            Real-time operational alerts, acknowledgement, assignment and escalation across all hospital departments.
          </p>

          <div className="inline-flex items-center space-x-2 text-[11px] font-bold text-cyan-400 pt-1">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#18D8E8]" />
            <span>● Live monitoring · Last updated: Just now</span>
          </div>
        </div>

        {/* Top Right Actions */}
        <div className="flex items-center space-x-3 z-10 w-full md:w-auto shrink-0">
          <button
            type="button"
            onClick={() => setSeverityFilter(severityFilter === "all" ? "critical" : "all")}
            className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-xs transition-all cursor-pointer hover:shadow-md active:scale-95"
          >
            Filter
          </button>
          <button
            type="button"
            onClick={() => showToast("✓ Alert telemetry re-synchronized.")}
            className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-xs transition-all cursor-pointer hover:shadow-md active:scale-95"
          >
            Refresh
          </button>
          <button
            type="button"
            onClick={handleExportPDF}
            className="flex-1 md:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-[0_4px_25px_rgba(22,119,255,0.4)] transition-all cursor-pointer active:scale-95 flex items-center justify-center space-x-1.5"
          >
            <span>📄 Export PDF</span>
          </button>
        </div>
      </div>

      {/* CRITICAL EMERGENCY BANNER (If any open critical alerts exist) */}
      {criticalCount > 0 && (
        <div className="p-5 rounded-3xl bg-rose-500/10 dark:bg-rose-950/40 border-2 border-rose-500/60 text-rose-950 dark:text-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg animate-in fade-in duration-300">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-md">
              🚨
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base tracking-tight text-rose-700 dark:text-rose-300">
                  {criticalCount} Critical Emergency Alerts Active
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              </div>
              <p className="text-xs text-rose-800 dark:text-rose-300/80 font-medium">
                Immediate clinical / operational intervention required for operating room turnover & emergency triage.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setSeverityFilter("critical");
              setStatusFilter("all");
            }}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/30 transition-all cursor-pointer shrink-0 active:scale-95"
          >
            View Critical Alerts →
          </button>
        </div>
      )}

      {/* KPI SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {/* CRITICAL */}
        <div
          title="2 active critical alerts"
          onClick={() => setSeverityFilter("critical")}
          className="p-5 rounded-3xl bg-white dark:bg-[#0B2545] border-l-4 border-l-rose-500 border border-slate-200 dark:border-white/10 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-extrabold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Critical</span>
            <span className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 text-base group-hover:scale-110 transition-transform">🚨</span>
          </div>
          <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white mt-2">
            {criticalCount}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Requires immediate action</p>
        </div>

        {/* WARNING */}
        <div
          title="2 warning alerts pending"
          onClick={() => setSeverityFilter("warning")}
          className="p-5 rounded-3xl bg-white dark:bg-[#0B2545] border-l-4 border-l-amber-500 border border-slate-200 dark:border-white/10 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Warning</span>
            <span className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 text-base group-hover:scale-110 transition-transform">▲</span>
          </div>
          <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white mt-2">
            {warningCount}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Needs attention</p>
        </div>

        {/* OPEN */}
        <div
          title="3 open alerts awaiting resolution"
          onClick={() => setStatusFilter("open")}
          className="p-5 rounded-3xl bg-white dark:bg-[#0B2545] border-l-4 border-l-blue-500 border border-slate-200 dark:border-white/10 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-extrabold text-blue-600 dark:text-cyan-400 uppercase tracking-wider">Open</span>
            <span className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 text-base group-hover:scale-110 transition-transform">⚡</span>
          </div>
          <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white mt-2">
            {openCount}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Awaiting resolution</p>
        </div>

        {/* ACKNOWLEDGED */}
        <div
          title="1 alert currently acknowledged"
          onClick={() => setStatusFilter("acknowledged")}
          className="p-5 rounded-3xl bg-white dark:bg-[#0B2545] border-l-4 border-l-emerald-500 border border-slate-200 dark:border-white/10 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Acknowledged</span>
            <span className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 text-base group-hover:scale-110 transition-transform">✓</span>
          </div>
          <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white mt-2">
            {acknowledgedCount}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Currently being handled</p>
        </div>
      </div>

      {/* FILTER TOOLBAR CARD */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-white/10 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1 min-w-[260px]">
            <span className="absolute left-3.5 top-3 text-slate-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search alerts by title, patient, department, ID..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filters Grid */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
            {/* Severity */}
            <div>
              <select
                value={severityFilter}
                onChange={(e) => {
                  setSeverityFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold cursor-pointer"
              >
                <option value="all">Severity: All</option>
                <option value="critical">Critical</option>
                <option value="warning">Warning</option>
                <option value="info">Info</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold cursor-pointer"
              >
                <option value="all">Status: All</option>
                <option value="open">Open</option>
                <option value="acknowledged">Acknowledged</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            {/* Department */}
            <div>
              <select
                value={deptFilter}
                onChange={(e) => {
                  setDeptFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold cursor-pointer"
              >
                <option value="all">Dept: All</option>
                <option value="Admissions">Admissions</option>
                <option value="General Wards">General Wards</option>
                <option value="Operating Theatre">Operating Theatre</option>
                <option value="CSSD">CSSD</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>

            {/* Date */}
            <div>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold cursor-pointer"
              >
                <option value="today">Today</option>
                <option value="7d">7 Days</option>
                <option value="30d">30 Days</option>
              </select>
            </div>

            {/* Reset */}
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-3.5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* ALERT DATA TABLE / CARD LIST */}
      <div className="bg-white dark:bg-[#0B2545] rounded-3xl border border-slate-200 dark:border-white/10 shadow-xs overflow-hidden">
        
        {/* Desktop & Tablet Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 font-extrabold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                <th className="p-4">Severity</th>
                <th className="p-4">Alert Title & Description</th>
                <th className="p-4">Department</th>
                <th className="p-4">Assigned To</th>
                <th className="p-4">Status</th>
                <th className="p-4">Created / Age</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-800 dark:text-slate-200">
              {paginatedAlerts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-500 font-bold">
                    No matching alerts found for applied filters.
                  </td>
                </tr>
              ) : (
                paginatedAlerts.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setDetailModalAlert(item)}
                    className="hover:bg-[#f7faff] dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                  >
                    {/* Severity */}
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                          item.severity === "critical"
                            ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border-rose-200 dark:border-rose-800"
                            : item.severity === "warning"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                        }`}
                      >
                        {item.severity}
                      </span>
                    </td>

                    {/* Alert */}
                    <td className="p-4 max-w-sm">
                      <div className="font-extrabold text-slate-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {item.description}
                      </div>
                      {item.patientName && (
                        <div className="text-[10px] text-cyan-600 dark:text-cyan-400 font-bold mt-1">
                          Patient: {item.patientName} ({item.patientId})
                        </div>
                      )}
                    </td>

                    {/* Department */}
                    <td className="p-4 font-bold text-slate-700 dark:text-slate-300">
                      {item.department}
                    </td>

                    {/* Assigned To */}
                    <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">
                      <span className={item.assignedTo === "Unassigned" ? "text-amber-600 dark:text-amber-400 font-bold" : ""}>
                        {item.assignedTo}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                          item.status === "open"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                            : item.status === "acknowledged"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    {/* Created / Age */}
                    <td className="p-4">
                      <div className="font-bold text-slate-900 dark:text-white">{item.createdAt}</div>
                      <div className="text-[11px] text-slate-400">{item.age} ago</div>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end space-x-2">
                        {item.status === "open" && (
                          <button
                            type="button"
                            onClick={(e) => handleAcknowledge(item.id, e)}
                            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] cursor-pointer shadow-xs active:scale-95"
                          >
                            Acknowledge
                          </button>
                        )}

                        {item.status !== "resolved" && (
                          <button
                            type="button"
                            onClick={(e) => handleResolve(item.id, e)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] cursor-pointer shadow-xs active:scale-95"
                          >
                            Resolve
                          </button>
                        )}

                        {item.status === "resolved" && (
                          <button
                            type="button"
                            onClick={() => setDetailModalAlert(item)}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-[11px] cursor-pointer"
                          >
                            View
                          </button>
                        )}

                        {/* More Menu Trigger */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setActiveDropdownId(activeDropdownId === item.id ? null : item.id)}
                            className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 cursor-pointer"
                          >
                            •••
                          </button>

                          {activeDropdownId === item.id && (
                            <div className="absolute right-0 top-9 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-50 py-1 text-left font-semibold text-xs animate-in fade-in">
                              <button
                                type="button"
                                onClick={() => {
                                  setDetailModalAlert(item);
                                  setActiveDropdownId(null);
                                }}
                                className="w-full px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-left"
                              >
                                View Details
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setAssignModalAlert(item);
                                  setAssigneeInput(item.assignedTo === "Unassigned" ? STAFF_MEMBERS[0] : item.assignedTo);
                                  setActiveDropdownId(null);
                                }}
                                className="w-full px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-left"
                              >
                                Assign User
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setDetailModalAlert(item);
                                  setActiveDropdownId(null);
                                }}
                                className="w-full px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-left"
                              >
                                Add Note
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked Card View */}
        <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800 p-4 space-y-4">
          {paginatedAlerts.length === 0 ? (
            <div className="p-8 text-center text-slate-500 font-bold">No alerts found.</div>
          ) : (
            paginatedAlerts.map((item) => (
              <div
                key={item.id}
                onClick={() => setDetailModalAlert(item)}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      item.severity === "critical"
                        ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                        : item.severity === "warning"
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                    }`}
                  >
                    {item.severity}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">{item.age} ago</span>
                </div>

                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{item.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.description}</p>
                </div>

                <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300 pt-1">
                  <span>Dept: <b>{item.department}</b></span>
                  <span>Assigned: <b>{item.assignedTo}</b></span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => setDetailModalAlert(item)}
                    className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs"
                  >
                    View
                  </button>

                  <div className="flex space-x-2">
                    {item.status === "open" && (
                      <button
                        type="button"
                        onClick={(e) => handleAcknowledge(item.id, e)}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs"
                      >
                        Acknowledge
                      </button>
                    )}
                    {item.status !== "resolved" && (
                      <button
                        type="button"
                        onClick={(e) => handleResolve(item.id, e)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* PAGINATION FOOTER */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-600 dark:text-slate-400">
          <div className="flex items-center space-x-3">
            <span>Show records per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <div>
            Showing {filteredAlerts.length > 0 ? startIndex + 1 : 0}–
            {Math.min(startIndex + pageSize, filteredAlerts.length)} of {filteredAlerts.length} alerts
          </div>

          <div className="flex items-center space-x-1">
            <button
              type="button"
              disabled={safeCurrentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                type="button"
                onClick={() => setCurrentPage(pg)}
                className={`w-8 h-8 rounded-lg font-bold transition-all cursor-pointer ${
                  pg === safeCurrentPage
                    ? "bg-blue-600 text-white"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                }`}
              >
                {pg}
              </button>
            ))}

            <button
              type="button"
              disabled={safeCurrentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>

      </div>

      {/* ALERT DETAILS MODAL */}
      {detailModalAlert && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-mono text-xs font-bold text-slate-500">{detailModalAlert.id}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      detailModalAlert.severity === "critical"
                        ? "bg-rose-100 text-rose-700"
                        : detailModalAlert.severity === "warning"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {detailModalAlert.severity}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-extrabold uppercase">
                    {detailModalAlert.status}
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {detailModalAlert.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setDetailModalAlert(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xl font-bold"
              >
                ✕
              </button>
            </div>

            {/* Alert Description & Parameters */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                {detailModalAlert.description}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                <div>Department: <b className="text-slate-900 dark:text-white">{detailModalAlert.department}</b></div>
                <div>Assigned: <b className="text-slate-900 dark:text-white">{detailModalAlert.assignedTo}</b></div>
                <div>Created: <b className="text-slate-900 dark:text-white">{detailModalAlert.createdAt}</b></div>
                <div>Age: <b className="text-slate-900 dark:text-white">{detailModalAlert.age}</b></div>
              </div>
            </div>

            {/* Timeline Events */}
            <div className="space-y-2.5 text-xs">
              <h3 className="font-extrabold text-slate-900 dark:text-white">Audit & Resolution Timeline</h3>
              <div className="space-y-2 pl-2 border-l-2 border-slate-200 dark:border-slate-700">
                {detailModalAlert.timeline.map((item, idx) => (
                  <div key={idx} className="relative pl-4">
                    <span className="absolute -left-[9px] top-1 w-2 h-2 rounded-full bg-blue-600" />
                    <span className="font-mono text-[10px] text-slate-400">{item.time}</span>
                    <p className="font-medium text-slate-800 dark:text-slate-200">{item.event}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes Section */}
            <div className="space-y-3 text-xs">
              <h3 className="font-extrabold text-slate-900 dark:text-white">Clinical & Operational Notes</h3>
              
              {detailModalAlert.notes && detailModalAlert.notes.length > 0 && (
                <div className="space-y-2">
                  {detailModalAlert.notes.map((n, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 font-medium">
                      <div className="flex justify-between text-[10px] text-slate-500 font-bold mb-1">
                        <span>{n.author}</span>
                        <span>{n.time}</span>
                      </div>
                      <div className="text-slate-800 dark:text-slate-200">{n.text}</div>
                    </div>
                  ))}
                </div>
              )}

              <form onSubmit={handleAddNote} className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Add operational note or handoff comment..."
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shrink-0 cursor-pointer"
                >
                  Add Note
                </button>
              </form>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setAssignModalAlert(detailModalAlert);
                  setAssigneeInput(detailModalAlert.assignedTo === "Unassigned" ? STAFF_MEMBERS[0] : detailModalAlert.assignedTo);
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 cursor-pointer"
              >
                Assign
              </button>

              {detailModalAlert.status === "open" && (
                <button
                  type="button"
                  onClick={() => handleAcknowledge(detailModalAlert.id)}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md cursor-pointer"
                >
                  Acknowledge
                </button>
              )}

              {detailModalAlert.status !== "resolved" && (
                <button
                  type="button"
                  onClick={() => handleResolve(detailModalAlert.id)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md cursor-pointer"
                >
                  Resolve
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ASSIGN ALERT MODAL */}
      {assignModalAlert && (
        <div className="fixed inset-0 z-[85] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Assign Alert {assignModalAlert.id}
            </h3>
            
            <form onSubmit={handleAssignSubmit} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">Select Responsible Staff Member</label>
                <select
                  value={assigneeInput}
                  onChange={(e) => setAssigneeInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                >
                  {STAFF_MEMBERS.map((staff) => (
                    <option key={staff} value={staff}>{staff}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setAssignModalAlert(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold shadow-md cursor-pointer"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
