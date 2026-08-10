"use client";

import { useState } from "react";
import { PageShell } from "../../components/ui/PageShell";

export default function ProfilePage() {
  const [name, setName] = useState("Dr. Anika Rao");
  const [email, setEmail] = useState("anika.rao@meridian-health.org");
  const [role] = useState("Hospital Administrator");
  const [dept] = useState("Hospital Administration");
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [criticalSms, setCriticalSms] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <PageShell title="User Profile & Preferences" description="Manage your account profile, clinical role, and notification channels.">
      <div className="grid grid-2" style={{ gap: "var(--space-4)" }}>
        {/* Profile Card */}
        <div className="card">
          <div className="row" style={{ gap: "var(--space-3)", marginBottom: "var(--space-4)" }}>
            <div
              className="avatar"
              style={{
                width: "64px",
                height: "64px",
                fontSize: "1.5rem",
                background: "var(--color-primary)",
                color: "#fff",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              AR
            </div>
            <div>
              <h2 className="text-lg font-bold">{name}</h2>
              <span className="badge badge-neutral">{role}</span>
              <p className="text-xs text-muted" style={{ marginTop: "4px" }}>
                {dept} • Meridian General Hospital
              </p>
            </div>
          </div>

          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            <div>
              <label className="text-xs font-semibold text-muted block mb-1">Full Name</label>
              <input className="input" style={{ width: "100%" }} value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted block mb-1">Email Address</label>
              <input className="input" style={{ width: "100%" }} value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted block mb-1">Hospital Organization</label>
              <input className="input" style={{ width: "100%", background: "var(--color-bg)" }} value="Meridian General Hospital (Demo)" disabled />
            </div>

            <div className="row row-between pt-2">
              {saved ? <span className="text-xs text-success font-medium">✓ Settings saved successfully</span> : <span></span>}
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* Security & Notification Preferences */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <div className="card">
            <h3 className="font-bold text-sm mb-3">Security Status</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              <div className="row row-between text-xs">
                <span>Authentication Provider</span>
                <span className="badge badge-success">Firebase Auth</span>
              </div>
              <div className="row row-between text-xs">
                <span>Session Persistence</span>
                <span className="font-mono text-muted">LOCAL_STORAGE</span>
              </div>
              <div className="row row-between text-xs">
                <span>Two-Factor Authentication</span>
                <span className="badge badge-neutral">Enabled</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-bold text-sm mb-3">Notification Preferences</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              <label className="row row-between text-xs" style={{ cursor: "pointer" }}>
                <span>Email summaries for critical alerts</span>
                <input type="checkbox" checked={emailNotifs} onChange={(e) => setEmailNotifs(e.target.checked)} />
              </label>
              <label className="row row-between text-xs" style={{ cursor: "pointer" }}>
                <span>Critical emergency SMS alerts</span>
                <input type="checkbox" checked={criticalSms} onChange={(e) => setCriticalSms(e.target.checked)} />
              </label>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
