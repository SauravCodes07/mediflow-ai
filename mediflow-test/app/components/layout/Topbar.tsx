"use client";

import { useState } from "react";
import Link from "next/link";
import { NotificationCenter } from "./NotificationCenter";
import { InstallAppButton } from "../ui/InstallAppButton";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/lib/theme-context";
import { HOSPITAL_NAME } from "@/lib/config/hospital";

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, profile, logout } = useAuth();
  const { theme, setTheme, isDark } = useTheme();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const photoUrl = user?.photoURL;
  const displayName = profile?.name || user?.displayName || user?.email?.split("@")[0] || "Dr. Anika Rao";
  const clinicalRole = profile?.role ? profile.role.toUpperCase() : "HOSPITAL ADMIN";

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header className="topbar">
      <div className="flex items-center space-x-4">
        {/* Mobile Menu Toggle Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 border border-slate-200 dark:border-slate-700 cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Hospital Indicator */}
        <div className="hidden sm:flex items-center space-x-2 text-xs font-extrabold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
          <svg className="w-4 h-4 text-blue-600 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V9a2 2 0 012-2h2a2 2 0 012 2v12m-6 0a2 2 0 002 2h2a2 2 0 002-2" />
          </svg>
          <span>{HOSPITAL_NAME}</span>
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Real-time Status Indicator */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-extrabold">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="hidden md:inline">● LIVE · System operational</span>
          <span className="md:hidden">● LIVE</span>
        </div>

        {/* Install App Button */}
        <InstallAppButton variant="compact" />

        {/* Global Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          title={`Theme: ${theme.toUpperCase()} (Click to change)`}
          aria-label="Toggle light, dark, or system theme"
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer text-xs font-bold flex items-center space-x-1.5"
        >
          <span>{isDark ? "🌙" : "☀️"}</span>
          <span className="hidden sm:inline uppercase text-[10px] tracking-wider">{theme}</span>
        </button>

        {/* Notifications Component */}
        <NotificationCenter />

        {/* User Profile Dropdown Menu */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center space-x-3 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all cursor-pointer"
            aria-label="User Profile Menu"
          >
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={displayName}
                className="w-9 h-9 rounded-full object-cover border-2 border-blue-500 shadow-xs"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                {displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="hidden md:block text-left leading-tight">
              <div className="text-xs font-extrabold text-slate-900 dark:text-white">{displayName}</div>
              <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{clinicalRole}</div>
            </div>
            <svg className="w-4 h-4 text-slate-400 hidden md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {profileDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                <div className="text-xs font-extrabold text-slate-900 dark:text-white">{displayName}</div>
                <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">{user?.email || "staff@mediflow.org"}</div>
              </div>

              <div className="px-4 py-2">
                <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider mb-1.5">Theme Preference</div>
                <div className="grid grid-cols-2 gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  <button
                    onClick={() => setTheme("light")}
                    className={`py-1.5 px-3 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                      theme === "light" ? "bg-white text-blue-600 shadow-xs" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    ☀️ Light
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className={`py-1.5 px-3 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                      theme === "dark" ? "bg-slate-700 text-cyan-400 shadow-xs" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    🌙 Dark
                  </button>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

              <Link href="/profile" onClick={() => setProfileDropdownOpen(false)} className="flex items-center space-x-2 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
                <svg className="w-4 h-4 text-blue-600 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Profile & Account</span>
              </Link>

              <Link href="/settings" onClick={() => setProfileDropdownOpen(false)} className="flex items-center space-x-2 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Operational Settings</span>
              </Link>

              <div className="px-4 py-2">
                <InstallAppButton variant="full" />
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  logout();
                }}
                className="w-full text-left flex items-center space-x-2 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
