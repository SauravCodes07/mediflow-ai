"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_GROUPS } from "./navConfig";

export function Sidebar({ open }: { open: boolean }) {
  const pathname = usePathname();

  return (
    <aside className={`sidebar ${open ? "open" : ""}`} aria-label="Primary navigation">
      <div className="sidebar-brand">
        <span
          aria-hidden
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: "var(--color-primary)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
          }}
        >
          M
        </span>
        <span>Mediflow-AI</span>
      </div>
      <nav className="sidebar-nav">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <div className="sidebar-group-label">{group.label}</div>
            {group.items.map((item) => {
              const active = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} className={`sidebar-link ${active ? "active" : ""}`}>
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
