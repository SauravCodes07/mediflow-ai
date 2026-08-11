"use client";

import React, { useState, useId } from "react";
import Link from "next/link";
import { HOSPITAL_NAME } from "@/lib/config/hospital";

// Data Types
export interface StaffUser {
  id: string;
  name: string;
  title: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  lastActive: string;
  status: "Active" | "Inactive" | "Suspended" | "Pending";
  joinedDate: string;
  initials: string;
  avatarBg: string;
  permissions: {
    patients: ("View" | "Edit" | "Create" | "Delete")[];
    admissions: ("View" | "Edit" | "Create")[];
    wards: ("View" | "Edit")[];
    ot: ("View" | "Edit")[];
    cssd: ("View" | "Edit")[];
    analytics: ("View" | "Export")[];
    reports: ("View" | "Export")[];
  };
  recentActivity: { time: string; action: string }[];
}

// 15 Realistic Demo Records (Total Staff Representation)
const INITIAL_STAFF: StaffUser[] = [
  {
    id: "USR-001",
    name: "Dr. Anika Rao",
    title: "Chief Administrator",
    role: "Administrator",
    department: "Hospital Administration",
    email: "anika.rao@mediflow.ai",
    phone: "+1 (555) 234-5678",
    lastActive: "2 min ago",
    status: "Active",
    joinedDate: "12 Jan 2023",
    initials: "AR",
    avatarBg: "bg-blue-600",
    permissions: {
      patients: ["View", "Edit", "Create", "Delete"],
      admissions: ["View", "Edit", "Create"],
      wards: ["View", "Edit"],
      ot: ["View", "Edit"],
      cssd: ["View", "Edit"],
      analytics: ["View", "Export"],
      reports: ["View", "Export"],
    },
    recentActivity: [
      { time: "22:04", action: "Logged into Mediflow-AI Command Center" },
      { time: "21:42", action: "Viewed patient profile PT-10482" },
      { time: "20:18", action: "Exported admissions throughput summary report" },
      { time: "18:32", action: "Updated ward bed occupancy thresholds" },
    ],
  },
  {
    id: "USR-002",
    name: "Nurse Kevin Mathew",
    title: "Admissions Charge Nurse",
    role: "Nurse",
    department: "Admissions",
    email: "kevin.mathew@mediflow.ai",
    phone: "+1 (555) 345-6789",
    lastActive: "8 min ago",
    status: "Active",
    joinedDate: "05 Mar 2023",
    initials: "KM",
    avatarBg: "bg-emerald-600",
    permissions: {
      patients: ["View", "Edit"],
      admissions: ["View", "Edit", "Create"],
      wards: ["View"],
      ot: [],
      cssd: [],
      analytics: ["View"],
      reports: ["View"],
    },
    recentActivity: [
      { time: "21:55", action: "Assigned bed Ward A-04 to patient Wei Chen" },
      { time: "21:10", action: "Approved consent form intake clearance" },
    ],
  },
  {
    id: "USR-003",
    name: "Dr. Sana Iyer",
    title: "Senior General Physician",
    role: "Clinician",
    department: "General Wards",
    email: "sana.iyer@mediflow.ai",
    phone: "+1 (555) 456-7890",
    lastActive: "14 min ago",
    status: "Active",
    joinedDate: "18 Aug 2022",
    initials: "SI",
    avatarBg: "bg-cyan-600",
    permissions: {
      patients: ["View", "Edit", "Create"],
      admissions: ["View"],
      wards: ["View", "Edit"],
      ot: ["View"],
      cssd: [],
      analytics: ["View"],
      reports: ["View"],
    },
    recentActivity: [
      { time: "21:48", action: "Updated vitals chart for Ward C Bed 02" },
      { time: "20:30", action: "Signed discharge clearance summary" },
    ],
  },
  {
    id: "USR-004",
    name: "Dr. Rajesh Kumar",
    title: "Emergency Lead Physician",
    role: "Clinician",
    department: "Emergency",
    email: "rajesh.kumar@mediflow.ai",
    phone: "+1 (555) 567-8901",
    lastActive: "21 min ago",
    status: "Active",
    joinedDate: "10 Nov 2021",
    initials: "RK",
    avatarBg: "bg-cyan-600",
    permissions: {
      patients: ["View", "Edit", "Create"],
      admissions: ["View", "Create"],
      wards: ["View"],
      ot: ["View"],
      cssd: [],
      analytics: ["View"],
      reports: ["View"],
    },
    recentActivity: [
      { time: "21:40", action: "Triggered ER bed bottleneck alert" },
      { time: "19:15", action: "Initiated urgent surgery transfer to OT-02" },
    ],
  },
  {
    id: "USR-005",
    name: "Priya Sharma",
    title: "CSSD Sterilization Specialist",
    role: "CSSD Technician",
    department: "CSSD",
    email: "priya.sharma@mediflow.ai",
    phone: "+1 (555) 678-9012",
    lastActive: "32 min ago",
    status: "Active",
    joinedDate: "22 Jan 2024",
    initials: "PS",
    avatarBg: "bg-amber-600",
    permissions: {
      patients: [],
      admissions: [],
      wards: [],
      ot: ["View"],
      cssd: ["View", "Edit"],
      analytics: ["View"],
      reports: ["View", "Export"],
    },
    recentActivity: [
      { time: "21:30", action: "Completed Autoclave Sterilization Cycle #B804" },
      { time: "20:10", action: "Flagged GEN-SET-09 pack expiry status" },
    ],
  },
  {
    id: "USR-006",
    name: "Marcus Lee",
    title: "OT Operations Coordinator",
    role: "OT Manager",
    department: "Operating Theatre",
    email: "marcus.lee@mediflow.ai",
    phone: "+1 (555) 789-0123",
    lastActive: "1 hr ago",
    status: "Active",
    joinedDate: "14 Feb 2022",
    initials: "ML",
    avatarBg: "bg-purple-600",
    permissions: {
      patients: ["View"],
      admissions: ["View"],
      wards: ["View"],
      ot: ["View", "Edit"],
      cssd: ["View"],
      analytics: ["View", "Export"],
      reports: ["View", "Export"],
    },
    recentActivity: [
      { time: "21:00", action: "Rescheduled OT-03 turnover window" },
      { time: "19:40", action: "Verified surgical tray clearance" },
    ],
  },
  {
    id: "USR-007",
    name: "Dr. Vikram Mehta",
    title: "Consultant Cardiologist",
    role: "Clinician",
    department: "Cardiology",
    email: "vikram.mehta@mediflow.ai",
    phone: "+1 (555) 890-1234",
    lastActive: "2 hrs ago",
    status: "Active",
    joinedDate: "30 May 2021",
    initials: "VM",
    avatarBg: "bg-cyan-600",
    permissions: {
      patients: ["View", "Edit"],
      admissions: ["View"],
      wards: ["View"],
      ot: ["View", "Edit"],
      cssd: [],
      analytics: ["View"],
      reports: ["View"],
    },
    recentActivity: [
      { time: "20:00", action: "Reviewed pre-op ECG report for case #408" },
    ],
  },
  {
    id: "USR-008",
    name: "Sarah Jenkins",
    title: "Patient Intake Lead",
    role: "Front Desk",
    department: "Admissions",
    email: "sarah.jenkins@mediflow.ai",
    phone: "+1 (555) 901-2345",
    lastActive: "3 hrs ago",
    status: "Active",
    joinedDate: "11 Jun 2023",
    initials: "SJ",
    avatarBg: "bg-indigo-600",
    permissions: {
      patients: ["View", "Create"],
      admissions: ["View", "Create", "Edit"],
      wards: ["View"],
      ot: [],
      cssd: [],
      analytics: ["View"],
      reports: [],
    },
    recentActivity: [
      { time: "19:12", action: "Registered elective surgery intake ER-904" },
    ],
  },
  {
    id: "USR-009",
    name: "David Chen",
    title: "Senior Systems Administrator",
    role: "Administrator",
    department: "Hospital Administration",
    email: "david.chen@mediflow.ai",
    phone: "+1 (555) 012-3456",
    lastActive: "5 hrs ago",
    status: "Active",
    joinedDate: "03 Jan 2021",
    initials: "DC",
    avatarBg: "bg-blue-600",
    permissions: {
      patients: ["View", "Edit"],
      admissions: ["View"],
      wards: ["View"],
      ot: ["View"],
      cssd: ["View"],
      analytics: ["View", "Export"],
      reports: ["View", "Export"],
    },
    recentActivity: [
      { time: "17:05", action: "Updated role permission policy Matrix #14" },
    ],
  },
  {
    id: "USR-010",
    name: "Elena Rostova",
    title: "ICU Charge Nurse",
    role: "Nurse",
    department: "General Wards",
    email: "elena.rostova@mediflow.ai",
    phone: "+1 (555) 123-4567",
    lastActive: "1 day ago",
    status: "Active",
    joinedDate: "09 Jul 2022",
    initials: "ER",
    avatarBg: "bg-emerald-600",
    permissions: {
      patients: ["View", "Edit"],
      admissions: ["View"],
      wards: ["View", "Edit"],
      ot: ["View"],
      cssd: [],
      analytics: ["View"],
      reports: ["View"],
    },
    recentActivity: [
      { time: "Yesterday", action: "Logged shift turnover report" },
    ],
  },
  {
    id: "USR-011",
    name: "Dr. Tariq Al-Mansoor",
    title: "Associate Surgeon",
    role: "Clinician",
    department: "Operating Theatre",
    email: "tariq.mansoor@mediflow.ai",
    phone: "+1 (555) 234-5679",
    lastActive: "2 days ago",
    status: "Pending",
    joinedDate: "10 Aug 2026",
    initials: "TM",
    avatarBg: "bg-amber-600",
    permissions: {
      patients: ["View"],
      admissions: [],
      wards: ["View"],
      ot: ["View"],
      cssd: [],
      analytics: [],
      reports: [],
    },
    recentActivity: [
      { time: "2 days ago", action: "Invitation dispatched to email" },
    ],
  },
  {
    id: "USR-012",
    name: "Maya Lin",
    title: "CSSD Operations Lead",
    role: "CSSD Technician",
    department: "CSSD",
    email: "maya.lin@mediflow.ai",
    phone: "+1 (555) 345-6780",
    lastActive: "3 days ago",
    status: "Suspended",
    joinedDate: "15 Apr 2022",
    initials: "ML",
    avatarBg: "bg-rose-600",
    permissions: {
      patients: [],
      admissions: [],
      wards: [],
      ot: [],
      cssd: [],
      analytics: [],
      reports: [],
    },
    recentActivity: [
      { time: "3 days ago", action: "Account suspended due to policy audit" },
    ],
  },
  {
    id: "USR-013",
    name: "Robert Taylor",
    title: "IT Security Specialist",
    role: "Administrator",
    department: "Hospital Administration",
    email: "robert.taylor@mediflow.ai",
    phone: "+1 (555) 456-7891",
    lastActive: "5 days ago",
    status: "Inactive",
    joinedDate: "01 Nov 2020",
    initials: "RT",
    avatarBg: "bg-slate-600",
    permissions: {
      patients: ["View"],
      admissions: [],
      wards: [],
      ot: [],
      cssd: [],
      analytics: ["View"],
      reports: [],
    },
    recentActivity: [
      { time: "5 days ago", action: "Password reset completed" },
    ],
  },
  {
    id: "USR-014",
    name: "Dr. Chloe Bennett",
    title: "Orthopedic Specialist",
    role: "Clinician",
    department: "Orthopedics",
    email: "chloe.bennett@mediflow.ai",
    phone: "+1 (555) 567-8902",
    lastActive: "6 days ago",
    status: "Active",
    joinedDate: "19 Sep 2023",
    initials: "CB",
    avatarBg: "bg-cyan-600",
    permissions: {
      patients: ["View", "Edit"],
      admissions: ["View"],
      wards: ["View"],
      ot: ["View", "Edit"],
      cssd: [],
      analytics: ["View"],
      reports: ["View"],
    },
    recentActivity: [
      { time: "6 days ago", action: "Assigned knee replacement case" },
    ],
  },
  {
    id: "USR-015",
    name: "Aisha Patel",
    title: "Emergency Staff Nurse",
    role: "Nurse",
    department: "Emergency",
    email: "aisha.patel@mediflow.ai",
    phone: "+1 (555) 678-9013",
    lastActive: "1 wk ago",
    status: "Active",
    joinedDate: "02 Feb 2024",
    initials: "AP",
    avatarBg: "bg-emerald-600",
    permissions: {
      patients: ["View", "Edit"],
      admissions: ["View", "Create"],
      wards: ["View"],
      ot: [],
      cssd: [],
      analytics: ["View"],
      reports: [],
    },
    recentActivity: [
      { time: "1 wk ago", action: "Triage check-in completed" },
    ],
  },
];

// Department Staff Counts for Bar Chart
const DEPT_STAFF_COUNTS = [
  { name: "General Wards", total: 31, active: 28, inactive: 3, pct: 24.2 },
  { name: "Hospital Administration", total: 18, active: 16, inactive: 2, pct: 14.1 },
  { name: "Emergency", total: 17, active: 16, inactive: 1, pct: 13.3 },
  { name: "Operating Theatre", total: 16, active: 15, inactive: 1, pct: 12.5 },
  { name: "Admissions", total: 14, active: 13, inactive: 1, pct: 10.9 },
  { name: "CSSD", total: 12, active: 10, inactive: 2, pct: 9.4 },
  { name: "Cardiology", total: 8, active: 8, inactive: 0, pct: 6.25 },
  { name: "Orthopedics", total: 7, active: 6, inactive: 1, pct: 5.5 },
  { name: "Other", total: 5, active: 4, inactive: 1, pct: 3.85 },
];

export function UserManagementDashboard() {
  const chartId = useId();
  const [staffList, setStaffList] = useState<StaffUser[]>(INITIAL_STAFF);

  // Filters & State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [roleFilter, setRoleFilter] = useState<string>("All");
  const [deptFilter, setDeptFilter] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("Last Active");

  // Selection & UI Modals
  const [selectedUser, setSelectedUser] = useState<StaffUser | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const [isEditMatrix, setIsEditMatrix] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" } | null>(null);
  const [timeRange, setTimeRange] = useState<"24H" | "7D" | "30D">("7D");
  const [hoveredBarDept, setHoveredBarDept] = useState<string | null>(null);
  const [hoveredRoleDonut, setHoveredRoleDonut] = useState<string | null>(null);

  // Add User Form State
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPhone, setNewUserPhone] = useState("");
  const [newUserRole, setNewUserRole] = useState("Clinician");
  const [newUserDept, setNewUserDept] = useState("General Wards");
  const [newUserEmpId, setNewUserEmpId] = useState("USR-016");
  const [creatingUser, setCreatingUser] = useState(false);

  const showToast = (message: string, type: "success" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3200);
  };

  // Filtered & Sorted Staff List
  const filteredStaff = staffList.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "All" || user.status === statusFilter;
    const matchesRole = roleFilter === "All" || user.role === roleFilter;
    const matchesDept = deptFilter === "All" || user.department === deptFilter;

    return matchesSearch && matchesStatus && matchesRole && matchesDept;
  });

  // Action Menu Handlers
  const handleToggleStatus = (userId: string, newStatus: "Active" | "Inactive" | "Suspended") => {
    setStaffList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    );
    setActionMenuId(null);
    showToast(`Staff account ${userId} status updated to ${newStatus}.`);
  };

  const handleCreateStaffUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;

    setCreatingUser(true);
    setTimeout(() => {
      const newUser: StaffUser = {
        id: newUserEmpId || `USR-0${staffList.length + 1}`,
        name: newUserName,
        title: `${newUserRole} Specialist`,
        role: newUserRole,
        department: newUserDept,
        email: newUserEmail,
        phone: newUserPhone || "+1 (555) 999-0000",
        lastActive: "Just now",
        status: "Active",
        joinedDate: "Today",
        initials: newUserName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
        avatarBg: "bg-[#1677FF]",
        permissions: {
          patients: ["View", "Edit"],
          admissions: ["View"],
          wards: ["View"],
          ot: [],
          cssd: [],
          analytics: ["View"],
          reports: [],
        },
        recentActivity: [{ time: "Just now", action: "Staff account created" }],
      };

      setStaffList((prev) => [newUser, ...prev]);
      setCreatingUser(false);
      setIsAddModalOpen(false);

      // Reset form
      setNewUserName("");
      setNewUserEmail("");
      setNewUserPhone("");

      showToast("Staff account created successfully.", "success");
    }, 600);
  };

  // PDF Export Function
  const handleExportPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const todayStr = new Date().toISOString().split("T")[0];
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Mediflow-User-Administration-${todayStr}</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #071B34; padding: 30px; margin: 0; }
            .header { border-bottom: 2px solid #1677FF; padding-bottom: 15px; margin-bottom: 25px; }
            .title { font-size: 24px; font-weight: bold; color: #071B34; }
            .subtitle { font-size: 14px; color: #64748B; margin-top: 5px; }
            .meta { font-size: 12px; color: #1677FF; font-weight: bold; margin-top: 10px; }
            .kpi-grid { display: flex; gap: 15px; margin-bottom: 25px; }
            .kpi-card { flex: 1; background: #F8FAFC; border: 1px solid #E2E8F0; padding: 12px; border-radius: 8px; }
            .kpi-val { font-size: 20px; font-weight: bold; color: #071B34; }
            .kpi-lbl { font-size: 11px; color: #64748B; text-transform: uppercase; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px; }
            th { background: #071B34; color: #FFF; padding: 8px; text-align: left; }
            td { padding: 8px; border-bottom: 1px solid #E2E8F0; }
            .footer { margin-top: 40px; border-top: 1px solid #E2E8F0; padding-top: 15px; font-size: 10px; color: #94A3B8; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">Mediflow General Hospital</div>
            <div class="subtitle">User Administration & Access Control Security Report</div>
            <div class="meta">Generated on: ${new Date().toLocaleString()} | Hospital Organization: Mediflow-AI Main Campus</div>
          </div>

          <div class="kpi-grid">
            <div class="kpi-card"><div class="kpi-lbl">Total Staff</div><div class="kpi-val">128</div></div>
            <div class="kpi-card"><div class="kpi-lbl">Active Users</div><div class="kpi-val">114 (89.1%)</div></div>
            <div class="kpi-card"><div class="kpi-lbl">Pending Invites</div><div class="kpi-val">7</div></div>
            <div class="kpi-card"><div class="kpi-lbl">Suspended</div><div class="kpi-val">4</div></div>
            <div class="kpi-card"><div class="kpi-lbl">Admins</div><div class="kpi-val">9 (7.0%)</div></div>
          </div>

          <h3>Active Registered Staff Directory (${staffList.length} Accounts Displayed)</h3>
          <table>
            <thead>
              <tr>
                <th>Staff ID</th>
                <th>Name</th>
                <th>Role</th>
                <th>Department</th>
                <th>Email</th>
                <th>Last Active</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${staffList
                .map(
                  (u) => `
                <tr>
                  <td><b>${u.id}</b></td>
                  <td>${u.name}</td>
                  <td>${u.role}</td>
                  <td>${u.department}</td>
                  <td>${u.email}</td>
                  <td>${u.lastActive}</td>
                  <td>${u.status}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>

          <div class="footer">
            Mediflow-AI Enterprise Clinical Intelligence System · Confidential User Access Report · Page 1 of 1
          </div>
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    showToast("PDF report layout prepared for download.", "info");
  };

  return (
    <div className="space-y-8 max-w-[1440px] mx-auto font-sans select-none pb-12">
      {/* Toast Feedback */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 px-4 py-3 rounded-2xl bg-[#071B34] text-white font-semibold text-xs shadow-2xl border border-cyan-400/40 flex items-center space-x-2 animate-in slide-in-from-top-4 duration-200">
          <span className="text-cyan-400 font-bold">✓</span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* 1. PAGE HEADER CARD */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#071B34] text-white border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold tracking-wide">
            <span>● SYSTEM OPERATIONAL</span>
            <span className="text-slate-400">· Last synchronized: 12 seconds ago</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            USER MANAGEMENT
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-normal leading-relaxed">
            Staff accounts, roles, permissions and access activity across {HOSPITAL_NAME}.
          </p>
        </div>

        {/* Top-Right Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 z-10 w-full md:w-auto">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex-1 md:flex-initial px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm shadow-[0_4px_20px_rgba(22,119,255,0.4)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center space-x-1.5"
          >
            <span>+ Add Staff User</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-xs sm:text-sm transition-all hover:border-cyan-400/40 cursor-pointer flex items-center space-x-1.5"
          >
            <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Export PDF</span>
          </button>

          <div className="relative group/more">
            <button className="px-3.5 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-xs sm:text-sm transition-all cursor-pointer flex items-center space-x-1">
              <span>More</span>
              <span>▾</span>
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 p-2 rounded-2xl bg-slate-900 border border-white/15 shadow-2xl text-xs space-y-1 opacity-0 scale-95 pointer-events-none group-hover/more:opacity-100 group-hover/more:scale-100 group-hover/more:pointer-events-auto transition-all z-30">
              <button onClick={() => showToast("Staff accounts synchronized from LDAP.")} className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/10 text-slate-200">
                🔄 Sync LDAP / SSO
              </button>
              <button onClick={handleExportPDF} className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/10 text-slate-200">
                📄 Audit Log Report
              </button>
              <button onClick={() => showToast("Security policy refreshed.")} className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/10 text-slate-200">
                🛡️ Refresh Security Matrix
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ADMINISTRATION KPI CARDS (6 Grid Layout) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Card 1: TOTAL STAFF */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md transition-all group cursor-default">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold mb-2">
            <span>TOTAL STAFF</span>
            <span className="text-blue-500 text-base">👥</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">128</div>
          <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center space-x-1">
            <span>↑ 8.4%</span>
            <span className="text-slate-400 font-normal">this quarter</span>
          </div>
        </div>

        {/* Card 2: ACTIVE USERS */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md transition-all group cursor-default">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold mb-2">
            <span>ACTIVE USERS</span>
            <span className="text-emerald-500 text-base">●</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">114</div>
          <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            89.1% of registered staff
          </div>
        </div>

        {/* Card 3: PENDING INVITES */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md transition-all group cursor-default">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold mb-2">
            <span>PENDING INVITES</span>
            <span className="text-amber-500 text-base">⏳</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">7</div>
          <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400 mt-1">
            3 expiring soon
          </div>
        </div>

        {/* Card 4: SUSPENDED */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md transition-all group cursor-default">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold mb-2">
            <span>SUSPENDED</span>
            <span className="text-rose-500 text-base">⛔</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">4</div>
          <div className="text-[11px] font-bold text-rose-600 dark:text-rose-400 mt-1">
            Requires review
          </div>
        </div>

        {/* Card 5: ADMINS */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md transition-all group cursor-default">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold mb-2">
            <span>ADMINS</span>
            <span className="text-purple-500 text-base">🔑</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">9</div>
          <div className="text-[11px] font-bold text-purple-600 dark:text-purple-400 mt-1">
            7.0% of staff
          </div>
        </div>

        {/* Card 6: ONLINE NOW */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md transition-all group cursor-default">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold mb-2">
            <span>ONLINE NOW</span>
            <span className="text-cyan-500 text-base">⚡</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">37</div>
          <div className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400 mt-1 flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Currently active</span>
          </div>
        </div>
      </div>

      {/* 3. USER ACTIVITY OVERVIEW (2-Column Analytics Section) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: Staff Login & Activity Chart */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                Staff Login & Activity
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Daily staff logins vs concurrent active sessions
              </p>
            </div>

            {/* Time Range Selector */}
            <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
              {(["24H", "7D", "30D"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    timeRange === r
                      ? "bg-white dark:bg-blue-600 text-slate-900 dark:text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Line Chart SVG */}
          <div className="relative w-full overflow-hidden">
            <svg viewBox="0 0 500 200" className="w-full h-auto overflow-visible cursor-crosshair">
              <defs>
                <linearGradient id={`grad_login_${chartId}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1677FF" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#1677FF" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id={`grad_session_${chartId}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 0.33, 0.66, 1].map((pct) => (
                <line
                  key={pct}
                  x1="30"
                  y1={20 + 140 * pct}
                  x2="480"
                  y2={20 + 140 * pct}
                  stroke="#F1F5F9"
                  strokeWidth="1"
                  className="dark:stroke-slate-800"
                />
              ))}

              {/* Logins Area & Line */}
              <path
                d="M 40 85 L 110 70 L 180 78 L 250 45 L 320 52 L 390 98 L 460 110 L 460 160 L 40 160 Z"
                fill={`url(#grad_login_${chartId})`}
              />
              <path
                d="M 40 85 L 110 70 L 180 78 L 250 45 L 320 52 L 390 98 L 460 110"
                fill="none"
                stroke="#1677FF"
                strokeWidth="3"
              />

              {/* Active Sessions Line */}
              <path
                d="M 40 130 L 110 118 L 180 125 L 250 102 L 320 110 L 390 136 L 460 144 L 460 160 L 40 160 Z"
                fill={`url(#grad_session_${chartId})`}
              />
              <path
                d="M 40 130 L 110 118 L 180 125 L 250 102 L 320 110 L 390 136 L 460 144"
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
                strokeDasharray="4 3"
              />

              {/* Data Points & X Axis */}
              {[
                { day: "Mon", login: 84, session: 21, x: 40 },
                { day: "Tue", login: 91, session: 28, x: 110 },
                { day: "Wed", login: 87, session: 24, x: 180 },
                { day: "Thu", login: 103, session: 35, x: 250 },
                { day: "Fri", login: 98, session: 31, x: 320 },
                { day: "Sat", login: 76, session: 18, x: 390 },
                { day: "Sun", login: 69, session: 14, x: 460 },
              ].map((pt) => (
                <g key={pt.day}>
                  <text x={pt.x} y="180" textAnchor="middle" fill="#94A3B8" fontSize="10" fontWeight="600">
                    {pt.day}
                  </text>
                  <circle cx={pt.x} cy={160 - (pt.login / 120) * 120} r="3.5" fill="#1677FF" stroke="#FFF" strokeWidth="2" />
                  <circle cx={pt.x} cy={160 - (pt.session / 120) * 120} r="3" fill="#10B981" stroke="#FFF" strokeWidth="1.5" />
                </g>
              ))}
            </svg>
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-white/10">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1.5 font-bold text-slate-700 dark:text-slate-200">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <span>Daily Logins</span>
              </span>
              <span className="flex items-center space-x-1.5 font-bold text-slate-700 dark:text-slate-200">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Concurrent Active Sessions</span>
              </span>
            </div>
            <span className="text-slate-400 font-semibold">Peak: Thu (103 logins)</span>
          </div>
        </div>

        {/* RIGHT: Role Distribution Donut Chart */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
          <div className="border-b border-slate-100 dark:border-white/10 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
              Role Distribution
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Breakdown across 128 registered staff accounts
            </p>
          </div>

          {/* Centered Donut SVG */}
          <div className="relative flex items-center justify-center my-2 w-full max-w-[200px] mx-auto aspect-square">
            <svg viewBox="0 0 120 120" className="w-full h-full transform -rotate-90 overflow-visible">
              <circle cx="60" cy="60" r="44" fill="none" stroke="#F1F5F9" strokeWidth="10" className="dark:stroke-slate-800" />
              
              {/* Segments: Clinicians (42), Nursing (31), Admin (18), Front Desk (14), CSSD (9), OT (8), Other (6) */}
              {[
                { id: "clinicians", name: "Clinicians", count: 42, pct: 32.8, color: "#1677FF" },
                { id: "nursing", name: "Nursing", count: 31, pct: 24.2, color: "#10B981" },
                { id: "admin", name: "Administration", count: 18, pct: 14.1, color: "#8B5CF6" },
                { id: "frontdesk", name: "Front Desk", count: 14, pct: 10.9, color: "#6366F1" },
                { id: "cssd", name: "CSSD Staff", count: 9, pct: 7.0, color: "#F59E0B" },
                { id: "ot", name: "OT Staff", count: 8, pct: 6.25, color: "#EC4899" },
                { id: "other", name: "Other", count: 6, pct: 4.75, color: "#94A3B8" },
              ].map((role, idx) => {
                const isHovered = hoveredRoleDonut === role.id;
                const circumference = 276.46;
                const segLength = (role.count / 128) * circumference;
                const strokeDasharray = `${segLength} ${circumference - segLength}`;
                const strokeDashoffset = -idx * (circumference / 7);

                return (
                  <circle
                    key={role.id}
                    cx="60"
                    cy="60"
                    r="44"
                    fill="none"
                    stroke={role.color}
                    strokeWidth={isHovered ? "13" : "10"}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-200 cursor-pointer"
                    onMouseEnter={() => setHoveredRoleDonut(role.id)}
                    onMouseLeave={() => setHoveredRoleDonut(null)}
                  />
                );
              })}

              <text x="60" y="54" textAnchor="middle" dominantBaseline="middle" transform="rotate(90 60 60)" className="text-2xl font-extrabold fill-slate-900 dark:fill-white">
                128
              </text>
              <text x="60" y="74" textAnchor="middle" dominantBaseline="middle" transform="rotate(90 60 60)" className="text-[9px] font-bold fill-slate-400 uppercase tracking-widest">
                TOTAL STAFF
              </text>
            </svg>

            {hoveredRoleDonut && (
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[11px] font-bold px-3 py-1 rounded-xl shadow-xl whitespace-nowrap z-20 pointer-events-none">
                {hoveredRoleDonut.toUpperCase()} role active
              </div>
            )}
          </div>

          {/* Compact Legend Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100 dark:border-white/10">
            <div className="flex items-center justify-between font-medium">
              <span className="flex items-center space-x-1.5 text-slate-700 dark:text-slate-300">
                <span className="w-2 h-2 rounded-full bg-[#1677FF]" />
                <span>Clinicians</span>
              </span>
              <span className="font-bold text-slate-900 dark:text-white">42 (32.8%)</span>
            </div>
            <div className="flex items-center justify-between font-medium">
              <span className="flex items-center space-x-1.5 text-slate-700 dark:text-slate-300">
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span>Nursing</span>
              </span>
              <span className="font-bold text-slate-900 dark:text-white">31 (24.2%)</span>
            </div>
            <div className="flex items-center justify-between font-medium">
              <span className="flex items-center space-x-1.5 text-slate-700 dark:text-slate-300">
                <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
                <span>Administration</span>
              </span>
              <span className="font-bold text-slate-900 dark:text-white">18 (14.1%)</span>
            </div>
            <div className="flex items-center justify-between font-medium">
              <span className="flex items-center space-x-1.5 text-slate-700 dark:text-slate-300">
                <span className="w-2 h-2 rounded-full bg-[#6366F1]" />
                <span>Front Desk</span>
              </span>
              <span className="font-bold text-slate-900 dark:text-white">14 (10.9%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. DEPARTMENT STAFF DISTRIBUTION (Horizontal Bar Chart) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
        <div className="border-b border-slate-100 dark:border-white/10 pb-3">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
            Department Staff Distribution
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Staff allocation and active presence across hospital clinical units
          </p>
        </div>

        <div className="space-y-3 pt-1">
          {DEPT_STAFF_COUNTS.map((dept) => {
            const isHovered = hoveredBarDept === dept.name;
            return (
              <div
                key={dept.name}
                onMouseEnter={() => setHoveredBarDept(dept.name)}
                onMouseLeave={() => setHoveredBarDept(null)}
                className="group relative space-y-1 cursor-default p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-800 dark:text-slate-200 group-hover:text-blue-500 transition-colors">
                    {dept.name}
                  </span>
                  <span className="text-slate-600 dark:text-slate-400 font-bold">
                    {dept.total} staff <span className="text-slate-400 font-normal">({dept.pct}%)</span>
                  </span>
                </div>

                <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-500 group-hover:from-blue-500 group-hover:to-cyan-300"
                    style={{ width: `${(dept.total / 31) * 100}%` }}
                  />
                </div>

                {isHovered && (
                  <div className="absolute right-4 top-0 bg-slate-900 text-white text-[11px] p-2 rounded-xl shadow-xl z-20 font-medium animate-in fade-in duration-150">
                    <span className="font-bold text-cyan-300">{dept.name}</span>: {dept.active} active · {dept.inactive} inactive
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. STAFF DIRECTORY DATA TABLE */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-white/10 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-white/10 pb-4">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
              Staff Directory & Access Records
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Showing {filteredStaff.length} of {staffList.length} staff accounts
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-72 relative">
            <input
              type="text"
              placeholder="Search by name, email, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-medium"
            />
            <span className="absolute left-3 top-2.5 text-xs text-slate-400">🔍</span>
          </div>
        </div>

        {/* Toolbar Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Status Tabs */}
          <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl font-bold">
            {["All", "Active", "Inactive", "Suspended", "Pending"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  statusFilter === status
                    ? "bg-white dark:bg-blue-600 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none"
            >
              <option value="All">All Roles</option>
              <option value="Administrator">Admin</option>
              <option value="Clinician">Clinician</option>
              <option value="Nurse">Nurse</option>
              <option value="Front Desk">Front Desk</option>
              <option value="CSSD Technician">CSSD Technician</option>
              <option value="OT Manager">OT Manager</option>
            </select>

            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none"
            >
              <option value="All">All Departments</option>
              <option value="Hospital Administration">Administration</option>
              <option value="Admissions">Admissions</option>
              <option value="General Wards">General Wards</option>
              <option value="Emergency">Emergency</option>
              <option value="Operating Theatre">Operating Theatre</option>
              <option value="CSSD">CSSD</option>
            </select>
          </div>
        </div>

        {/* Staff Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider">
                <th className="p-3.5">Staff</th>
                <th className="p-3.5">Staff ID</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Department</th>
                <th className="p-3.5">Contact</th>
                <th className="p-3.5">Last Active</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredStaff.map((u) => {
                return (
                  <tr
                    key={u.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer"
                    onClick={() => setSelectedUser(u)}
                  >
                    {/* 6. Avatar + Name */}
                    <td className="p-3.5">
                      <div className="flex items-center space-x-3">
                        <div className={`w-9 h-9 rounded-full ${u.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm`}>
                          {u.initials}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                            {u.name}
                          </div>
                          <div className="text-[11px] text-slate-400 font-normal">{u.title}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5 font-mono text-slate-600 dark:text-slate-400 font-bold">{u.id}</td>

                    <td className="p-3.5">
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-[11px]">
                        {u.role}
                      </span>
                    </td>

                    <td className="p-3.5 text-slate-700 dark:text-slate-300 font-semibold">{u.department}</td>

                    <td className="p-3.5 text-slate-500 dark:text-slate-400">{u.email}</td>

                    <td className="p-3.5 text-slate-500 dark:text-slate-400">{u.lastActive}</td>

                    {/* 7. Status Badges */}
                    <td className="p-3.5">
                      {u.status === "Active" && (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800 font-bold text-[11px] inline-flex items-center space-x-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Active</span>
                        </span>
                      )}
                      {u.status === "Inactive" && (
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 font-bold text-[11px]">
                          Inactive
                        </span>
                      )}
                      {u.status === "Suspended" && (
                        <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800 font-bold text-[11px]">
                          Suspended
                        </span>
                      )}
                      {u.status === "Pending" && (
                        <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800 font-bold text-[11px]">
                          Pending
                        </span>
                      )}
                    </td>

                    {/* 8. Action Menu Dropdown */}
                    <td className="p-3.5 text-right relative" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setActionMenuId(actionMenuId === u.id ? null : u.id)}
                        className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm"
                      >
                        ⋮
                      </button>

                      {actionMenuId === u.id && (
                        <div className="absolute right-4 top-10 w-44 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl z-30 text-left space-y-1 font-semibold text-xs animate-in fade-in zoom-in-95 duration-150">
                          <button
                            onClick={() => {
                              setSelectedUser(u);
                              setActionMenuId(null);
                            }}
                            className="w-full px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-left"
                          >
                            View Profile
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUser(u);
                              setActionMenuId(null);
                            }}
                            className="w-full px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-left"
                          >
                            Edit User
                          </button>
                          <button
                            onClick={() => {
                              showToast(`Password reset link sent to ${u.email}.`);
                              setActionMenuId(null);
                            }}
                            className="w-full px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-left"
                          >
                            Reset Password
                          </button>
                          {u.status === "Active" ? (
                            <button
                              onClick={() => handleToggleStatus(u.id, "Suspended")}
                              className="w-full px-3 py-1.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950 text-rose-600 text-left"
                            >
                              Suspend Account
                            </button>
                          ) : (
                            <button
                              onClick={() => handleToggleStatus(u.id, "Active")}
                              className="w-full px-3 py-1.5 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950 text-emerald-600 text-left"
                            >
                              Activate Account
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 11. ROLE MANAGEMENT (Role & Access Summary Cards) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-white/10 shadow-sm space-y-5">
        <div className="border-b border-slate-100 dark:border-white/10 pb-3">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
            Role & Access Summary
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            System governance roles and staff assignment levels
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { role: "SUPER ADMIN", count: 3, desc: "Full system administration & security policy access", color: "border-blue-500" },
            { role: "HOSPITAL ADMIN", count: 6, desc: "Hospital operational management and reporting", color: "border-cyan-500" },
            { role: "CLINICIAN", count: 42, desc: "Patient treatment, vitals, and surgical procedures", color: "border-emerald-500" },
            { role: "NURSING", count: 31, desc: "Ward bed management and patient intake workflow", color: "border-purple-500" },
            { role: "OT STAFF", count: 16, desc: "Operating theatre schedule and room turnover", color: "border-indigo-500" },
            { role: "CSSD STAFF", count: 12, desc: "Autoclave sterilization cycles and pack readiness", color: "border-amber-500" },
            { role: "FRONT DESK", count: 14, desc: "Admissions registration and patient triage intake", color: "border-pink-500" },
          ].map((r) => (
            <div key={r.role} className={`p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border-l-4 ${r.color} border-t border-r border-b border-slate-200 dark:border-slate-700 space-y-2 hover:shadow-md transition-all`}>
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-xs text-slate-900 dark:text-white tracking-wider">{r.role}</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 font-bold text-[10px]">
                  {r.count} users
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">{r.desc}</p>
              <div className="pt-2 flex justify-between text-[11px] font-bold text-blue-600 dark:text-cyan-400">
                <button onClick={() => setRoleFilter(r.role)} className="hover:underline cursor-pointer">View Users →</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 12 & 13. ACCESS SECURITY & RECENT ADMIN ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ACCESS SECURITY */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
              🛡️ Access Security & Governance
            </h3>
            <button onClick={() => showToast("Security Audit log downloaded.")} className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline">
              Review Events →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900">
              <div className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase">Failed Logins</div>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">12 today</div>
            </div>
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900">
              <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase">Suspicious Sessions</div>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">2 flagged</div>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900">
              <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">2FA Enforcement</div>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">87% enabled</div>
            </div>
          </div>
        </div>

        {/* RECENT ADMIN ACTIVITY */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
          <div className="border-b border-slate-100 dark:border-white/10 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
              Recent Administrative Activity
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            {[
              { time: "22:04", user: "Dr. Anika Rao", action: "Logged in to Mediflow Command Center" },
              { time: "21:48", user: "Nurse Kevin Mathew", action: "Permissions updated by Administrator" },
              { time: "21:31", user: "System", action: "New staff account USR-015 created" },
              { time: "20:55", user: "Admin", action: "CSSD Technician account suspended" },
              { time: "20:20", user: "Dr. Anika Rao", action: "Exported staff PDF report" },
            ].map((log) => (
              <div key={log.time + log.user} className="flex items-start space-x-3">
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono font-bold text-[10px]">
                  {log.time}
                </span>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">{log.user}</span>:{" "}
                  <span className="text-slate-600 dark:text-slate-300">{log.action}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 14. PERMISSION MATRIX */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
              Role Permission Matrix
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Module level access governance policy definitions
            </p>
          </div>
          <button
            onClick={() => setIsEditMatrix(!isEditMatrix)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs cursor-pointer"
          >
            {isEditMatrix ? "Save Policy Matrix" : "Edit Matrix"}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-400">
                <th className="p-3">Role</th>
                <th className="p-3">Patients</th>
                <th className="p-3">Admissions</th>
                <th className="p-3">Wards</th>
                <th className="p-3">OT</th>
                <th className="p-3">CSSD</th>
                <th className="p-3">Analytics</th>
                <th className="p-3">Reports</th>
                <th className="p-3">Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold text-slate-800 dark:text-slate-200">
              {[
                { role: "Administrator", p: "✓ Full", a: "✓ Full", w: "✓ Full", ot: "✓ Full", c: "✓ Full", an: "✓ Full", r: "✓ Full", adm: "✓ Full" },
                { role: "Clinician", p: "✓ Full", a: "◐ Limited", w: "✓ Full", ot: "◐ Limited", c: "— None", an: "✓ Full", r: "◐ Limited", adm: "— None" },
                { role: "Nurse", p: "✓ Full", a: "✓ Full", w: "✓ Full", ot: "— None", c: "— None", an: "◐ Limited", r: "— None", adm: "— None" },
                { role: "CSSD Staff", p: "— None", a: "— None", w: "— None", ot: "— None", c: "✓ Full", an: "◐ Limited", r: "✓ Full", adm: "— None" },
                { role: "OT Staff", p: "◐ Limited", a: "— None", w: "— None", ot: "✓ Full", c: "◐ Limited", an: "✓ Full", r: "✓ Full", adm: "— None" },
                { role: "Front Desk", p: "✓ Full", a: "✓ Full", w: "◐ Limited", ot: "— None", c: "— None", an: "— None", r: "— None", adm: "— None" },
              ].map((m) => (
                <tr key={m.role} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-slate-900 dark:text-white">{m.role}</td>
                  <td className="p-3 text-emerald-600">{m.p}</td>
                  <td className="p-3 text-emerald-600">{m.a}</td>
                  <td className="p-3 text-emerald-600">{m.w}</td>
                  <td className="p-3 text-emerald-600">{m.ot}</td>
                  <td className="p-3 text-emerald-600">{m.c}</td>
                  <td className="p-3 text-emerald-600">{m.an}</td>
                  <td className="p-3 text-emerald-600">{m.r}</td>
                  <td className="p-3 text-emerald-600">{m.adm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 9. USER DETAILS DRAWER (Slide-over Right Panel) */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl p-6 overflow-y-auto space-y-6 animate-in slide-in-from-right duration-250 border-l border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-full ${selectedUser.avatarBg} text-white font-bold text-lg flex items-center justify-center`}>
                  {selectedUser.initials}
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{selectedUser.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">{selectedUser.title}</p>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} className="p-2 text-slate-400 hover:text-slate-900 font-bold text-lg">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Staff ID:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedUser.id}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Email:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedUser.email}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Department:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedUser.department}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Role:</span>
                <span className="font-bold text-blue-600">{selectedUser.role}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Account Status:</span>
                <span className="font-bold text-emerald-600">● {selectedUser.status}</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">Module Permissions</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 font-semibold">Patients: <span className="text-emerald-600">✓ View ✓ Edit</span></div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 font-semibold">Admissions: <span className="text-emerald-600">✓ View</span></div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 font-semibold">Wards: <span className="text-emerald-600">✓ View</span></div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 font-semibold">OT: <span className="text-emerald-600">✓ View</span></div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex space-x-2">
              <button onClick={() => showToast(`Edit window opened for ${selectedUser.name}`)} className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-500">
                Edit User
              </button>
              <button onClick={() => handleToggleStatus(selectedUser.id, selectedUser.status === "Active" ? "Suspended" : "Active")} className="flex-1 py-2.5 rounded-xl bg-rose-50 text-rose-600 font-bold text-xs hover:bg-rose-100">
                {selectedUser.status === "Active" ? "Suspend Account" : "Activate Account"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 10. ADD STAFF USER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">+ Add Staff User</h3>
                <p className="text-xs text-slate-500 font-medium">Create a new clinical staff account for Mediflow General Hospital</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 font-bold text-lg hover:text-slate-900">✕</button>
            </div>

            <form onSubmit={handleCreateStaffUser} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Anika Rao"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. anika.rao@mediflow.ai"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Role</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none"
                  >
                    <option value="Clinician">Clinician</option>
                    <option value="Nurse">Nurse</option>
                    <option value="Administrator">Administrator</option>
                    <option value="Front Desk">Front Desk</option>
                    <option value="CSSD Technician">CSSD Technician</option>
                    <option value="OT Manager">OT Manager</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Department</label>
                  <select
                    value={newUserDept}
                    onChange={(e) => setNewUserDept(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none"
                  >
                    <option value="General Wards">General Wards</option>
                    <option value="Admissions">Admissions</option>
                    <option value="Hospital Administration">Hospital Administration</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Operating Theatre">Operating Theatre</option>
                    <option value="CSSD">CSSD</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingUser}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 shadow-md cursor-pointer disabled:opacity-50"
                >
                  {creatingUser ? "Creating Account..." : "Create Staff Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
