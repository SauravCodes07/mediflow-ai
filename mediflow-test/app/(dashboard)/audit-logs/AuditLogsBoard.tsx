"use client";

import React, { useState, useEffect } from "react";

export interface AuditItem {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  module: string;
  target: string;
  ipSession: string;
  status: "Success" | "Warning" | "Failed";
  previousState?: string;
  newState?: string;
  browserDevice?: string;
  timeline?: { time: string; event: string }[];
}

const INITIAL_AUDIT_LOGS: AuditItem[] = [
  {
    id: "AUD-001",
    timestamp: "08/11/2026 12:15 PM",
    actor: "Dr. Anika Rao",
    actorRole: "Administrator",
    action: "Alert Acknowledged",
    module: "Alerts",
    target: "ALT-003",
    ipSession: "192.168.1.104",
    status: "Success",
    previousState: "Status: Open",
    newState: "Status: Acknowledged (Assigned: Dr. Anika Rao)",
    browserDevice: "Chrome 124 / macOS Sonoma",
    timeline: [
      { time: "12:15:02 PM", event: "User interaction received at gateway" },
      { time: "12:15:03 PM", event: "Permission check passed (Role: Administrator)" },
      { time: "12:15:04 PM", event: "State transition persisted to Audit Vault" },
    ],
  },
  {
    id: "AUD-002",
    timestamp: "08/11/2026 11:50 AM",
    actor: "Dr. Sana Iyer",
    actorRole: "Clinician",
    action: "Procedure Stage Changed",
    module: "Operating Theatre",
    target: "PROC-5001",
    ipSession: "192.168.1.112",
    status: "Success",
    previousState: "Stage: Preparing",
    newState: "Stage: In-Procedure (OT Room 01)",
    browserDevice: "Firefox 125 / Windows 11",
    timeline: [
      { time: "11:50:10 AM", event: "Surgical timer telemetry sync" },
      { time: "11:50:12 AM", event: "Procedure stage updated" },
    ],
  },
  {
    id: "AUD-003",
    timestamp: "08/11/2026 10:40 AM",
    actor: "Nurse Kevin Mathew",
    actorRole: "Nurse",
    action: "Patient Transfer Requested",
    module: "General Wards",
    target: "PT-10482",
    ipSession: "192.168.1.118",
    status: "Success",
    previousState: "Location: ICU Bed 04",
    newState: "Transfer Requested: Ward A Bed 04",
    browserDevice: "Safari 17 / iPadOS",
    timeline: [
      { time: "10:40:00 AM", event: "Intake form submitted" },
      { time: "10:40:02 AM", event: "Bed availability validated" },
    ],
  },
  {
    id: "AUD-004",
    timestamp: "08/11/2026 09:20 AM",
    actor: "Dr. Anika Rao",
    actorRole: "Administrator",
    action: "Permission Changed",
    module: "Administration",
    target: "USR-002",
    ipSession: "192.168.1.104",
    status: "Warning",
    previousState: "Role: Staff Nurse",
    newState: "Role: Admissions Charge Nurse (Permissions Expanded)",
    browserDevice: "Chrome 124 / macOS Sonoma",
    timeline: [
      { time: "09:20:15 AM", event: "Role matrix modification requested" },
      { time: "09:20:18 AM", event: "Warning: Elevated access granted without 2FA step" },
    ],
  },
  {
    id: "AUD-005",
    timestamp: "08/11/2026 08:40 AM",
    actor: "System",
    actorRole: "Automated Service",
    action: "CSSD Batch Released",
    module: "CSSD",
    target: "BATCH-9001",
    ipSession: "System Service",
    status: "Success",
    previousState: "Batch Status: Sterilizing",
    newState: "Batch Status: Released to Active Inventory",
    browserDevice: "Mediflow Automated Daemon v1.0",
    timeline: [
      { time: "08:40:00 AM", event: "Autoclave sensors verified 134°C hold" },
      { time: "08:40:01 AM", event: "Batch automatically certified" },
    ],
  },
  {
    id: "AUD-006",
    timestamp: "08/11/2026 08:15 AM",
    actor: "Dr. Rajesh Kumar",
    actorRole: "Clinician",
    action: "Emergency Telemetry Alert Logged",
    module: "Emergency",
    target: "ALT-006",
    ipSession: "192.168.1.120",
    status: "Success",
    previousState: "Telemetry Normal",
    newState: "Ventilator Pressure Anomaly Flagged",
    browserDevice: "Chrome 124 / Android Workstation",
  },
  {
    id: "AUD-007",
    timestamp: "08/11/2026 07:50 AM",
    actor: "Priya Sharma",
    actorRole: "CSSD Technician",
    action: "Autoclave Sterilization Cycle Re-run",
    module: "CSSD",
    target: "CYCLE-B804",
    ipSession: "192.168.1.135",
    status: "Success",
    previousState: "Cycle Status: Temperature Variance Dip",
    newState: "Cycle Status: Re-run Active (134°C 4.0 bar)",
    browserDevice: "Edge 123 / Windows 11",
  },
  {
    id: "AUD-008",
    timestamp: "08/11/2026 07:10 AM",
    actor: "Marcus Lee",
    actorRole: "OT Manager",
    action: "OT Schedule Window Rescheduled",
    module: "Operating Theatre",
    target: "OT-03",
    ipSession: "192.168.1.140",
    status: "Success",
    previousState: "Start Time: 07:30 AM",
    newState: "Start Time: 08:00 AM (Cleaning Window Added)",
    browserDevice: "Safari 17 / macOS",
  },
  {
    id: "AUD-009",
    timestamp: "08/11/2026 06:45 AM",
    actor: "David Chen",
    actorRole: "Administrator",
    action: "System Backup Verification",
    module: "Administration",
    target: "SYS-BACKUP-904",
    ipSession: "192.168.1.100",
    status: "Success",
    previousState: "Backup In Progress",
    newState: "Encrypted Snapshot Verified (GCS Store)",
    browserDevice: "Terminal / Admin CLI",
  },
  {
    id: "AUD-010",
    timestamp: "08/11/2026 06:00 AM",
    actor: "System",
    actorRole: "Automated Service",
    action: "Daily Operational Report Generated",
    module: "Reports",
    target: "REP-DAILY-0811",
    ipSession: "System Cron",
    status: "Success",
    previousState: "Report Pending",
    newState: "Report Generated & Archived",
    browserDevice: "Mediflow Report Engine v1.0",
  },
  {
    id: "AUD-011",
    timestamp: "07/11/2026 11:30 PM",
    actor: "Unknown IP 192.168.5.88",
    actorRole: "Guest / External",
    action: "Failed Login Attempt",
    module: "Administration",
    target: "LOGIN-GATEWAY",
    ipSession: "192.168.5.88",
    status: "Failed",
    previousState: "Auth Challenge",
    newState: "Invalid Password Credentials (Locked for 15 min)",
    browserDevice: "Chrome 120 / Unknown",
    timeline: [
      { time: "11:30:00 PM", event: "Invalid credentials attempt #3" },
      { time: "11:30:01 PM", event: "IP threshold limit triggered — Lockout enforced" },
    ],
  },
  {
    id: "AUD-012",
    timestamp: "07/11/2026 10:15 PM",
    actor: "Dr. Anika Rao",
    actorRole: "Administrator",
    action: "User Account Suspended",
    module: "Administration",
    target: "USR-012",
    ipSession: "192.168.1.104",
    status: "Warning",
    previousState: "Status: Active",
    newState: "Status: Suspended (Security Policy Audit)",
    browserDevice: "Chrome 124 / macOS Sonoma",
  },
  {
    id: "AUD-013",
    timestamp: "07/11/2026 09:10 PM",
    actor: "Nurse Kevin Mathew",
    actorRole: "Nurse",
    action: "Vitals Reading Logged",
    module: "General Wards",
    target: "PT-10499",
    ipSession: "192.168.1.118",
    status: "Success",
    previousState: "Vitals: Baseline Intake",
    newState: "Vitals: BP 120/80, SpO2 98%, Pulse 72 bpm",
    browserDevice: "Safari 17 / iPadOS",
  },
  {
    id: "AUD-014",
    timestamp: "07/11/2026 08:00 PM",
    actor: "System",
    actorRole: "Automated Service",
    action: "Database Index Rebuild",
    module: "Administration",
    target: "DB-MAIN-01",
    ipSession: "System Cron",
    status: "Success",
    previousState: "Index fragmentation 14%",
    newState: "Index optimized (0% fragmentation)",
    browserDevice: "Mediflow DB Daemon",
  },
];

export function AuditLogsBoard() {
  const [logs, setLogs] = useState<AuditItem[]>(INITIAL_AUDIT_LOGS);
  const [searchQuery, setSearchQuery] = useState("");
  const [actorFilter, setActorFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("today");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Selected Detail Drawer State
  const [selectedAudit, setSelectedAudit] = useState<AuditItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Keyboard Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedAudit(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter Logic
  const filteredLogs = logs.filter((item) => {
    const matchesSearch =
      item.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.module.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ipSession.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesActor = actorFilter === "all" || item.actor === actorFilter;
    const matchesAction = actionFilter === "all" || item.action.includes(actionFilter);
    const matchesDept = deptFilter === "all" || item.module === deptFilter;
    const matchesSeverity = severityFilter === "all" || item.status === severityFilter;

    return matchesSearch && matchesActor && matchesAction && matchesDept && matchesSeverity;
  });

  // KPI Calculations
  const totalEvents = 5284;
  const todayEvents = 186;
  const adminActions = 42;
  const securityEvents = 8;
  const failedActions = 2;

  // Pagination Calculations
  const totalPages = Math.ceil(filteredLogs.length / pageSize) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + pageSize);

  const handleResetFilters = () => {
    setSearchQuery("");
    setActorFilter("all");
    setActionFilter("all");
    setDeptFilter("all");
    setSeverityFilter("all");
    setDateFilter("today");
    setCurrentPage(1);
    showToast("Audit filters reset to default.");
  };

  // PDF Export Generator
  const handleExportPDF = () => {
    const printWin = window.open("", "_blank");
    if (!printWin) {
      showToast("✕ Pop-up blocked. Please allow pop-ups to export PDF.");
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Mediflow General Hospital — Immutable Audit Log</title>
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
            table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 11px; }
            th { background: #071b34; color: white; padding: 8px 10px; text-align: left; font-size: 10px; text-transform: uppercase; }
            td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; }
            .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700; text-transform: uppercase; }
            .success { background: #dcfce7; color: #15803d; }
            .warning { background: #fef3c7; color: #b45309; }
            .failed { background: #ffe4e6; color: #b91c1c; }
            .footer { margin-top: 30px; border-top: 1px solid #e2e8f0; pt: 10px; font-size: 10px; color: #94a3b8; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 class="hospital-title">Mediflow General Hospital</h1>
              <div class="report-title">Immutable System Audit & Security Log</div>
            </div>
            <div class="meta">
              <div>Generated: ${new Date().toLocaleString()}</div>
              <div>Applied Filters: User (${actorFilter}), Action (${actionFilter}), Status (${severityFilter})</div>
            </div>
          </div>

          <div class="summary-cards">
            <div class="card" style="border-left: 4px solid #071b34;">
              <div class="card-title">Total Vault Events</div>
              <div class="card-val" style="color: #071b34;">${totalEvents}</div>
            </div>
            <div class="card" style="border-left: 4px solid #1677ff;">
              <div class="card-title">Logged Today</div>
              <div class="card-val" style="color: #1677ff;">${todayEvents}</div>
            </div>
            <div class="card" style="border-left: 4px solid #8b5cf6;">
              <div class="card-title">Admin Actions</div>
              <div class="card-val" style="color: #8b5cf6;">${adminActions}</div>
            </div>
            <div class="card" style="border-left: 4px solid #e11d48;">
              <div class="card-title">Failed Actions</div>
              <div class="card-val" style="color: #e11d48;">${failedActions}</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Event ID</th>
                <th>Timestamp</th>
                <th>Actor & Role</th>
                <th>Action Description</th>
                <th>Module</th>
                <th>Target</th>
                <th>IP / Session</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${filteredLogs
                .map(
                  (l) => `
                <tr>
                  <td><b>${l.id}</b></td>
                  <td>${l.timestamp}</td>
                  <td><b>${l.actor}</b><br/><span style="color:#64748b;">${l.actorRole}</span></td>
                  <td>${l.action}</td>
                  <td>${l.module}</td>
                  <td>${l.target}</td>
                  <td>${l.ipSession}</td>
                  <td><span class="badge ${l.status.toLowerCase()}">${l.status}</span></td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>

          <div class="footer">
            Cryptographically Verified Immutable Audit Record — Mediflow General Hospital Information Security
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
    showToast("✓ Audit log PDF report generated.");
  };

  const copyEventId = (id: string) => {
    navigator.clipboard.writeText(id);
    showToast(`✓ Event ID ${id} copied to clipboard.`);
  };

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto font-sans select-none pb-24 text-slate-800 dark:text-slate-100">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-[70] px-4 py-3 rounded-2xl bg-[#071B34] text-white font-bold text-xs shadow-2xl border border-cyan-400/40 flex items-center space-x-2.5 animate-in slide-in-from-top-4 duration-200">
          <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs">✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#071B34] text-white border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.35)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="space-y-2 z-10">
          <div className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">
            Mediflow General Hospital · Security Vault
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
            Audit Trail & Security Logs
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-normal leading-relaxed">
            Immutable records of system changes, administrative actions and operational events across Mediflow General Hospital.
          </p>

          <div className="inline-flex items-center space-x-2 text-[11px] font-bold text-cyan-400 pt-1">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#18D8E8]" />
            <span>● Audit logging active · {totalEvents.toLocaleString()} events recorded</span>
          </div>
        </div>

        {/* Top Right Controls */}
        <div className="flex items-center space-x-3 z-10 w-full md:w-auto shrink-0">
          <button
            type="button"
            onClick={() => showToast("✓ Audit log index synchronized.")}
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

      {/* AUDIT KPI SUMMARY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total Events */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-white/10 shadow-xs hover:shadow-md transition-all">
          <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">Total Events</span>
          <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white mt-1">
            {totalEvents.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 font-semibold">Immutable vault</span>
        </div>

        {/* Today */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-white/10 shadow-xs hover:shadow-md transition-all">
          <span className="text-[10px] font-extrabold uppercase text-blue-600 dark:text-cyan-400 tracking-wider">Today</span>
          <div className="text-2xl font-extrabold font-mono text-blue-600 dark:text-cyan-400 mt-1">
            {todayEvents}
          </div>
          <span className="text-[11px] text-slate-400 font-semibold">Recorded today</span>
        </div>

        {/* Administrative Actions */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-white/10 shadow-xs hover:shadow-md transition-all">
          <span className="text-[10px] font-extrabold uppercase text-purple-600 dark:text-purple-400 tracking-wider">Administrative</span>
          <div className="text-2xl font-extrabold font-mono text-purple-600 dark:text-purple-400 mt-1">
            {adminActions}
          </div>
          <span className="text-[11px] text-slate-400 font-semibold">System config edits</span>
        </div>

        {/* Security Events */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-white/10 shadow-xs hover:shadow-md transition-all">
          <span className="text-[10px] font-extrabold uppercase text-amber-600 dark:text-amber-400 tracking-wider">Security Events</span>
          <div className="text-2xl font-extrabold font-mono text-amber-600 dark:text-amber-400 mt-1">
            {securityEvents}
          </div>
          <span className="text-[11px] text-slate-400 font-semibold">Elevated auth checks</span>
        </div>

        {/* Failed Actions */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-white/10 shadow-xs hover:shadow-md transition-all col-span-2 sm:col-span-1">
          <span className="text-[10px] font-extrabold uppercase text-rose-600 dark:text-rose-400 tracking-wider">Failed Actions</span>
          <div className="text-2xl font-extrabold font-mono text-rose-600 dark:text-rose-400 mt-1">
            {failedActions}
          </div>
          <span className="text-[11px] text-slate-400 font-semibold">Unauthorized / Lockouts</span>
        </div>
      </div>

      {/* FILTER TOOLBAR */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-white/10 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1 min-w-[260px]">
            <span className="absolute left-3.5 top-3 text-slate-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search by user, action, entity, ID..."
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
            {/* User */}
            <div>
              <select
                value={actorFilter}
                onChange={(e) => {
                  setActorFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold cursor-pointer"
              >
                <option value="all">User: All Users</option>
                <option value="Dr. Anika Rao">Dr. Anika Rao</option>
                <option value="Dr. Sana Iyer">Dr. Sana Iyer</option>
                <option value="Nurse Kevin Mathew">Nurse Kevin Mathew</option>
                <option value="System">System Service</option>
              </select>
            </div>

            {/* Action */}
            <div>
              <select
                value={actionFilter}
                onChange={(e) => {
                  setActionFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold cursor-pointer"
              >
                <option value="all">Action: All Actions</option>
                <option value="Acknowledged">Alert Acknowledged</option>
                <option value="Stage">Procedure Stage Changed</option>
                <option value="Permission">Permission Changed</option>
                <option value="Batch">Batch Released</option>
                <option value="Failed">Failed Actions</option>
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
                <option value="Alerts">Alerts</option>
                <option value="Operating Theatre">Operating Theatre</option>
                <option value="General Wards">General Wards</option>
                <option value="CSSD">CSSD</option>
                <option value="Administration">Administration</option>
              </select>
            </div>

            {/* Status / Severity */}
            <div>
              <select
                value={severityFilter}
                onChange={(e) => {
                  setSeverityFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold cursor-pointer"
              >
                <option value="all">Status: All</option>
                <option value="Success">Success</option>
                <option value="Warning">Warning</option>
                <option value="Failed">Failed</option>
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

      {/* AUDIT LOGS TABLE */}
      <div className="bg-white dark:bg-[#0B2545] rounded-3xl border border-slate-200 dark:border-white/10 shadow-xs overflow-hidden">
        
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 font-extrabold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                <th className="p-4">Event ID</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Actor</th>
                <th className="p-4">Action</th>
                <th className="p-4">Module</th>
                <th className="p-4">Target</th>
                <th className="p-4">IP / Session</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-800 dark:text-slate-200">
              {paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-slate-500 font-bold">
                    No matching audit records found.
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedAudit(item)}
                    className="hover:bg-[#f7faff] dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                  >
                    {/* Event ID */}
                    <td className="p-4 font-mono font-bold text-blue-600 dark:text-cyan-400">
                      {item.id}
                    </td>

                    {/* Timestamp */}
                    <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">
                      {item.timestamp}
                    </td>

                    {/* Actor */}
                    <td className="p-4">
                      <div className="font-bold text-slate-900 dark:text-white">{item.actor}</div>
                      <div className="text-[11px] text-slate-500">{item.actorRole}</div>
                    </td>

                    {/* Action */}
                    <td className="p-4 font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {item.action}
                    </td>

                    {/* Module */}
                    <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">
                      {item.module}
                    </td>

                    {/* Target */}
                    <td className="p-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                      {item.target}
                    </td>

                    {/* IP / Session */}
                    <td className="p-4 font-mono text-slate-500 text-[11px]">
                      {item.ipSession}
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                          item.status === "Success"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                            : item.status === "Warning"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                            : "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    {/* Details Action */}
                    <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => setSelectedAudit(item)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-[11px] cursor-pointer"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800 p-4 space-y-4">
          {paginatedLogs.length === 0 ? (
            <div className="p-8 text-center text-slate-500 font-bold">No records.</div>
          ) : (
            paginatedLogs.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedAudit(item)}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <span className="font-mono font-bold text-blue-600 text-xs">{item.id}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      item.status === "Success"
                        ? "bg-emerald-100 text-emerald-700"
                        : item.status === "Warning"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{item.action}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{item.actor} ({item.actorRole})</p>
                </div>

                <div className="flex justify-between items-center text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <span>Module: <b>{item.module}</b></span>
                  <span>Target: <b className="font-mono">{item.target}</b></span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] font-mono text-slate-400">{item.timestamp}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedAudit(item)}
                    className="px-3 py-1 rounded-lg bg-blue-600 text-white font-bold text-xs"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* PAGINATION FOOTER */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-600 dark:text-slate-400">
          <div className="flex items-center space-x-3">
            <span>Records per page:</span>
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
            Showing {filteredLogs.length > 0 ? startIndex + 1 : 0}–
            {Math.min(startIndex + pageSize, filteredLogs.length)} of {filteredLogs.length} audit entries
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

      {/* AUDIT DETAIL SIDE DRAWER */}
      {selectedAudit && (
        <div className="fixed inset-0 z-[80] flex items-center justify-end bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-xl h-full max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 flex flex-col justify-between overflow-y-auto space-y-6">
            
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-mono text-xs font-bold text-blue-600 dark:text-cyan-400">{selectedAudit.id}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        selectedAudit.status === "Success"
                          ? "bg-emerald-100 text-emerald-700"
                          : selectedAudit.status === "Warning"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {selectedAudit.status}
                    </span>
                  </div>
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {selectedAudit.action}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedAudit(null)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xl font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Event Metadata Grid */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  <div>Timestamp: <b className="text-slate-900 dark:text-white">{selectedAudit.timestamp}</b></div>
                  <div>Module: <b className="text-slate-900 dark:text-white">{selectedAudit.module}</b></div>
                  <div>Actor: <b className="text-slate-900 dark:text-white">{selectedAudit.actor}</b></div>
                  <div>Role: <b className="text-slate-900 dark:text-white">{selectedAudit.actorRole}</b></div>
                  <div>Target Entity: <b className="text-cyan-600 font-mono">{selectedAudit.target}</b></div>
                  <div>IP Address: <b className="font-mono text-slate-900 dark:text-white">{selectedAudit.ipSession}</b></div>
                </div>

                {selectedAudit.browserDevice && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 font-mono">
                    Client Telemetry: {selectedAudit.browserDevice}
                  </div>
                )}
              </div>

              {/* State Diffs */}
              {(selectedAudit.previousState || selectedAudit.newState) && (
                <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 text-xs font-mono space-y-2 border border-slate-800">
                  <div className="text-[10px] font-extrabold uppercase text-slate-400">State Transition Diff</div>
                  {selectedAudit.previousState && (
                    <div className="text-rose-400">
                      - Previous: {selectedAudit.previousState}
                    </div>
                  )}
                  {selectedAudit.newState && (
                    <div className="text-emerald-400">
                      + New State: {selectedAudit.newState}
                    </div>
                  )}
                </div>
              )}

              {/* Timeline */}
              <div className="space-y-2.5 text-xs">
                <h3 className="font-extrabold text-slate-900 dark:text-white">Audit Trail Verification Sequence</h3>
                <div className="space-y-2 pl-2 border-l-2 border-slate-200 dark:border-slate-700">
                  {(selectedAudit.timeline || [
                    { time: selectedAudit.timestamp, event: "Event created at API edge" },
                    { time: selectedAudit.timestamp, event: "Validation check passed & audit entry sealed" }
                  ]).map((item, idx) => (
                    <div key={idx} className="relative pl-4">
                      <span className="absolute -left-[9px] top-1 w-2 h-2 rounded-full bg-blue-600" />
                      <span className="font-mono text-[10px] text-slate-400">{item.time}</span>
                      <p className="font-medium text-slate-800 dark:text-slate-200">{item.event}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Controls */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => copyEventId(selectedAudit.id)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 cursor-pointer"
              >
                Copy Event ID
              </button>

              <button
                type="button"
                onClick={handleExportPDF}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md cursor-pointer"
              >
                Export Event PDF
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
