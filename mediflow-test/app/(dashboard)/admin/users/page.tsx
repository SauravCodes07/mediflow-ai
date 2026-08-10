"use client";

import { useEffect, useState } from "react";
import { PageShell } from "../../../components/ui/PageShell";
import { getProfiles, type ProfileRow } from "@/lib/data/queries";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfiles("org_meridian").then((res) => {
      setUsers(res);
      setLoading(false);
    });
  }, []);

  const toggleUserStatus = (id: string) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, active: !u.active } : u)));
  };

  return (
    <PageShell title="User Administration & Access Control" description="Staff account management, role assignment, and active access status.">
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="px-4 py-3 row row-between" style={{ borderBottom: "1px solid var(--color-border)", background: "var(--color-bg)" }}>
          <h3 className="font-bold text-sm">Registered Staff Accounts</h3>
          <button className="btn btn-sm btn-primary">+ Add New Staff User</button>
        </div>

        {loading ? (
          <div className="py-6 text-center text-muted">Loading users...</div>
        ) : (
          <table className="table" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                <th className="px-4 py-2 text-left text-xs font-semibold text-muted">User ID</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-muted">Name</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-muted">Clinical Role</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-muted">Department</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-muted">Status</th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                  <td className="px-4 py-3 text-xs font-mono">{u.id}</td>
                  <td className="px-4 py-3 text-xs font-bold">{u.name}</td>
                  <td className="px-4 py-3 text-xs">
                    <span className="badge badge-neutral" style={{ textTransform: "capitalize" }}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs">{u.departmentName}</td>
                  <td className="px-4 py-3 text-xs">
                    <span className={`badge ${u.active ? "badge-success" : "badge-critical"}`}>
                      {u.active ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-right">
                    <button className="btn btn-sm btn-outline" onClick={() => toggleUserStatus(u.id)}>
                      {u.active ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </PageShell>
  );
}
