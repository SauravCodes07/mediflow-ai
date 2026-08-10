"use client";

import { PageShell } from "../../../components/ui/PageShell";

const DEPARTMENTS = [
  { id: "dep_admissions", name: "Admissions", kind: "Administrative", head: "Nurse Kevin Mathew", rooms: 4 },
  { id: "dep_wards", name: "General Wards", kind: "Clinical", head: "Dr. Sana Iyer", rooms: 11 },
  { id: "dep_ot", name: "Operating Theatre", kind: "Surgical", head: "Dr. Marcus Lee", rooms: 3 },
  { id: "dep_cssd", name: "CSSD", kind: "Support", head: "Anika Rao", rooms: 2 },
  { id: "dep_admin", name: "Hospital Administration", kind: "Administrative", head: "Dr. Anika Rao", rooms: 1 },
];

export default function AdminHospitalPage() {
  return (
    <PageShell title="Hospital Administration" description="Manage hospital organization details, departments, and room capacity.">
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        {/* Organization Card */}
        <div className="card">
          <div className="row row-between flex-wrap" style={{ gap: "var(--space-3)" }}>
            <div>
              <h2 className="text-lg font-bold">Meridian General Hospital</h2>
              <p className="text-xs text-muted" style={{ margin: 0 }}>
                Tenant ID: org_meridian | Timezone: Asia/Kolkata | Status: Active Demo Tenant
              </p>
            </div>
            <span className="badge badge-success">Production Tenant Active</span>
          </div>
        </div>

        {/* Departments List */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--color-border)", background: "var(--color-bg)" }}>
            <h3 className="font-bold text-sm">Hospital Departments</h3>
          </div>
          <table className="table" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                <th className="px-4 py-2 text-left text-xs font-semibold text-muted">Department ID</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-muted">Department Name</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-muted">Category</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-muted">Department Head</th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-muted">Beds / Rooms</th>
              </tr>
            </thead>
            <tbody>
              {DEPARTMENTS.map((dept) => (
                <tr key={dept.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                  <td className="px-4 py-3 text-xs font-mono">{dept.id}</td>
                  <td className="px-4 py-3 text-xs font-bold">{dept.name}</td>
                  <td className="px-4 py-3 text-xs">
                    <span className="badge badge-neutral">{dept.kind}</span>
                  </td>
                  <td className="px-4 py-3 text-xs">{dept.head}</td>
                  <td className="px-4 py-3 text-xs text-right font-mono">{dept.rooms}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageShell>
  );
}
