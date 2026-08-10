"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "../components/layout/Sidebar";
import { Topbar } from "../components/layout/Topbar";
import { AIChatDrawer } from "../components/AIChatDrawer";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only redirect if auth status loading is finished and user is not authenticated
    if (!loading && !user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, loading, router, pathname]);

  // Loading state skeleton/spinner while Firebase restores persistent session
  if (loading) {
    return (
      <div className="min-h-screen bg-[#020B1C] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4 text-cyan-400">
          <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin shadow-[0_0_20px_#18D8E8]" />
          <div className="text-sm font-medium text-slate-300">Restoring Mediflow-AI Session...</div>
        </div>
      </div>
    );
  }

  // Unauthenticated user will be redirected by useEffect
  if (!user) {
    return null;
  }

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
