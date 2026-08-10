export type NavItem = { label: string; href: string; icon?: string };
export type NavGroup = { label: string; items: NavItem[] };

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "COMMAND CENTER",
    items: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Analytics", href: "/analytics" },
    ],
  },
  {
    label: "PATIENT FLOW",
    items: [
      { label: "Admissions", href: "/admissions" },
      { label: "Wards", href: "/wards" },
      { label: "Patients", href: "/patients" },
      { label: "Patient Workflow", href: "/patient-workflow" },
    ],
  },
  {
    label: "OPERATING THEATRE",
    items: [
      { label: "OT Overview", href: "/ot" },
      { label: "OT Schedule", href: "/ot/schedule" },
      { label: "OT Dashboard", href: "/ot-dashboard" },
    ],
  },
  {
    label: "CSSD",
    items: [
      { label: "CSSD Overview", href: "/cssd" },
      { label: "Instrument Packs", href: "/cssd/instrument-packs" },
      { label: "Sterilization", href: "/cssd/sterilization" },
    ],
  },
  {
    label: "INTELLIGENCE",
    items: [
      { label: "AI Assistant", href: "/ai-assistant" },
      { label: "AI Insights", href: "/ai-insights" },
      { label: "Reports", href: "/reports" },
    ],
  },
  {
    label: "OPERATIONS",
    items: [
      { label: "Alerts", href: "/alerts" },
      { label: "Notifications", href: "/notifications" },
      { label: "Audit Logs", href: "/audit-logs" },
    ],
  },
  {
    label: "ADMINISTRATION",
    items: [
      { label: "User Management", href: "/admin/users" },
      { label: "Settings", href: "/settings" },
      { label: "Profile", href: "/profile" },
    ],
  },
];
