export type NavItem = { label: string; href: string };
export type NavGroup = { label: string; items: NavItem[] };

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { label: "Command Center", href: "/command-center" },
      { label: "Dashboard", href: "/" },
      { label: "Analytics", href: "/analytics" },
    ],
  },
  {
    label: "Patient Flow",
    items: [
      { label: "Admissions", href: "/admissions" },
      { label: "Wards", href: "/wards" },
      { label: "Patients", href: "/patients" },
      { label: "Patient Workflow", href: "/patient-workflow" },
    ],
  },
  {
    label: "Operating Theatre",
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
    label: "Intelligence",
    items: [
      { label: "AI Assistant", href: "/ai-assistant" },
      { label: "AI Insights", href: "/ai-insights" },
      { label: "Reports", href: "/reports" },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Alerts", href: "/alerts" },
      { label: "Notifications", href: "/notifications" },
      { label: "Audit Logs", href: "/audit-logs" },
    ],
  },
  {
    label: "Administration",
    items: [
      { label: "Hospital Admin", href: "/admin/hospital" },
      { label: "User Admin", href: "/admin/users" },
      { label: "Settings", href: "/settings" },
      { label: "Profile", href: "/profile" },
    ],
  },
];
