"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "../components/layout/Sidebar";
import { Topbar } from "../components/layout/Topbar";
import { AIChatDrawer } from "../components/AIChatDrawer";
import { OperationalDataProvider } from "@/lib/data/operational-context";

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
      <div className="min-h-screen bg-[#071B34] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4 text-cyan-400">
          <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin shadow-[0_0_20px_#1677FF]" />
          <div className="text-sm font-medium text-slate-200">Restoring Mediflow-AI Session...</div>
        </div>
      </div>
    );
  }

  // Unauthenticated user will be redirected by useEffect
  if (!user) {
    return null;
  }

  return (
    <OperationalDataProvider>
      <div className="app-shell">
        <Sidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
        {mobileOpen && (
          <div
            onClick={() => setMobileOpen(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(7,27,52,0.6)", zIndex: 40 }}
            aria-hidden
          />
        )}
        <div className="main-col">
          <Topbar onMenuClick={() => setMobileOpen((v) => !v)} />
          <main className="content max-w-[1440px] w-full mx-auto">{children}</main>
        </div>
        <AIChatDrawer />
      </div>
    </OperationalDataProvider>
  );
}
