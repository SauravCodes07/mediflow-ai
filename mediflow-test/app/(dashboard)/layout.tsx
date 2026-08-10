"use client";

import { useState } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import { Topbar } from "../components/layout/Topbar";
import { AIChatDrawer } from "../components/AIChatDrawer";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar open={mobileOpen} />
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(11,31,58,0.4)", zIndex: 20 }}
          aria-hidden
        />
      )}
      <div className="main-col">
        <Topbar onMenuClick={() => setMobileOpen((v) => !v)} />
        <main className="content">{children}</main>
      </div>
      <AIChatDrawer />
    </div>
  );
}
