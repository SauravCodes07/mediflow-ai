"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export interface NotificationItem {
  id: string;
  type: "ot" | "critical" | "transfer" | "admission" | "cssd";
  title: string;
  description: string;
  department: string;
  timestamp: string;
  read: boolean;
  severity: "critical" | "warning" | "info" | "success";
  route: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif_01",
    type: "ot",
    title: "OT Schedule Update",
    description: "OT Room 01 surgical procedure has entered in-procedure stage.",
    department: "Operating Theatre",
    timestamp: "2 min ago",
    read: false,
    severity: "info",
    route: "/ot",
  },
  {
    id: "notif_02",
    type: "cssd",
    title: "Critical Sterilization Alert",
    description: "Sterile pack GEN-SET-09 has expired and blocked from surgical use.",
    department: "CSSD",
    timestamp: "12 min ago",
    read: false,
    severity: "critical",
    route: "/cssd",
  },
  {
    id: "notif_03",
    type: "transfer",
    title: "Patient Transfer Requested",
    description: "Transfer requested for patient Wei Chen to Ward A Bed 04.",
    department: "Patient Flow",
    timestamp: "25 min ago",
    read: true,
    severity: "info",
    route: "/patient-workflow",
  },
  {
    id: "notif_04",
    type: "admission",
    title: "New Admission Ready",
    description: "Intake ER-904 consent signed and ready for ward bed placement.",
    department: "Admissions",
    timestamp: "45 min ago",
    read: true,
    severity: "success",
    route: "/admissions",
  },
];

export function NotificationCenter() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Handle Mark All Read
  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Handle Click Individual Notification
  const handleNotificationClick = (item: NotificationItem) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
    );
    setIsOpen(false);
    router.push(item.route);
  };

  // Click Outside & Escape Key Listeners
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  }, []);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, handleKeyDown, handleClickOutside]);

  // SVG Icon Renderer by Severity & Type
  const renderIcon = (item: NotificationItem) => {
    let iconBg = "bg-blue-100 text-blue-600";
    if (item.severity === "critical") iconBg = "bg-rose-100 text-rose-600";
    else if (item.severity === "warning") iconBg = "bg-amber-100 text-amber-600";
    else if (item.severity === "success") iconBg = "bg-emerald-100 text-emerald-600";

    return (
      <div className={`w-9 h-9 rounded-full ${iconBg} flex items-center justify-center shrink-0`}>
        {item.type === "ot" && (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
        {item.type === "critical" && (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        )}
        {item.type === "transfer" && (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        )}
        {item.type === "admission" && (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        )}
        {item.type === "cssd" && (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        )}
      </div>
    );
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Header Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all focus:outline-none"
        title="Notifications"
        aria-label="Toggle notifications"
        aria-expanded={isOpen}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 01-6 0v-1m6 0H9" />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white font-extrabold text-[11px] flex items-center justify-center shadow-md animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Popover Panel */}
      {isOpen && (
        <div
          className="fixed sm:absolute top-16 sm:top-12 right-2.5 sm:right-0 w-[calc(100vw-20px)] sm:w-[400px] max-h-[600px] bg-white border border-slate-200 rounded-2xl shadow-[0_20px_50px_rgba(15,23,42,0.18)] z-[100] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
          role="dialog"
          aria-label="Notifications Panel"
        >
          {/* Panel Header */}
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
            <div className="flex items-center space-x-2.5">
              <h3 className="text-lg font-bold text-[#0f2747] tracking-tight">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                  {unreadCount} unread
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notification Items List */}
          <div className="flex-1 overflow-y-auto max-h-[440px] divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs font-medium">
                No active notifications
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`p-4 flex items-start space-x-3 transition-all duration-180 cursor-pointer ${
                    !item.read ? "bg-[#f0f7ff] hover:bg-[#e4efff]" : "bg-white hover:bg-slate-50"
                  }`}
                >
                  {/* Icon */}
                  {renderIcon(item)}

                  {/* Body Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <div className="flex items-center space-x-1.5 min-w-0">
                        {!item.read && <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />}
                        <h4 className="text-xs font-bold text-slate-900 truncate">{item.title}</h4>
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium shrink-0 ml-2">
                        {item.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-1.5 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="text-[11px] font-semibold text-slate-400">
                      {item.department} · Click to open
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Panel Footer */}
          <div className="p-3 border-t border-slate-100 bg-slate-50 text-center shrink-0">
            <Link
              href="/notifications"
              onClick={() => setIsOpen(false)}
              className="text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors inline-flex items-center space-x-1"
            >
              <span>View all notifications</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
