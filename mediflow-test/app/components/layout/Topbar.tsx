"use client";

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="topbar">
      <div className="row" style={{ gap: "var(--space-3)" }}>
        <button className="icon-btn mobile-menu-btn" onClick={onMenuClick} aria-label="Toggle navigation">
          ☰
        </button>
        <div className="row" style={{ gap: "var(--space-2)" }}>
          <span className="text-label">Hospital</span>
          <span className="badge badge-neutral">Demo General Hospital</span>
        </div>
      </div>
      <div className="row" style={{ gap: "var(--space-3)" }}>
        <a href="/alerts" className="icon-btn" title="Emergency / Critical Alerts" style={{ color: "var(--color-critical)", borderColor: "var(--color-critical-bg)" }}>
          ⚠
        </a>
        <a href="/notifications" className="icon-btn" title="Notifications">
          🔔
        </a>
        <a href="/profile" className="avatar" title="Profile">
          DU
        </a>
      </div>
    </header>
  );
}
