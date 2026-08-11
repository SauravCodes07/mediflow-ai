"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "../brand/Logo";
import { NAV_GROUPS } from "./navConfig";
import { HOSPITAL_SHORT_NAME } from "@/lib/config/hospital";

interface SidebarProps {
  open: boolean;
  onClose?: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={`sidebar ${open ? "open" : ""}`} aria-label="Primary navigation">
      {/* Brand Logo Header */}
      <div className="sidebar-brand flex items-center justify-between">
        <Link href="/" className="inline-flex items-center" onClick={onClose}>
          <Logo size="sm" variant="dark" showTagline={false} />
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
            aria-label="Close Sidebar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Hospital Selector Widget */}
      <div className="mx-3 my-3 p-3 rounded-xl bg-[#0B2545] border border-white/10 flex items-center space-x-3 shadow-inner">
        <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 shrink-0">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V9a2 2 0 012-2h2a2 2 0 012 2v12m-6 0a2 2 0 002 2h2a2 2 0 002-2" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-bold text-white truncate">{HOSPITAL_SHORT_NAME}</div>
          <div className="text-[10px] text-slate-300 truncate">Main Campus · Org-01</div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="sidebar-nav no-scrollbar">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-2">
            <div className="sidebar-group-label">{group.label}</div>
            {group.items.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`sidebar-link ${active ? "active" : ""}`}
                >
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
