"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "../brand/Logo";
import { NAV_GROUPS } from "./navConfig";

export function Sidebar({ open }: { open: boolean }) {
  const pathname = usePathname();

  return (
    <aside className={`sidebar ${open ? "open" : ""}`} aria-label="Primary navigation">
      {/* Brand Logo Header */}
      <div className="sidebar-brand">
        <Link href="/" className="inline-flex items-center">
          <Logo size="sm" showTagline={false} />
        </Link>
      </div>

      {/* Hospital Selector Widget */}
      <div className="mx-3 my-3 p-3 rounded-xl bg-[#0B2748] border border-white/10 flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 shrink-0">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V9a2 2 0 012-2h2a2 2 0 012 2v12m-6 0a2 2 0 002 2h2a2 2 0 002-2" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-bold text-white truncate">Meridian General</div>
          <div className="text-[10px] text-slate-400 truncate">Main Campus · Org-01</div>
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
