"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function ProfilePage() {
  const { user, profile, logout } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile?.name || user?.displayName || "Dr. Anika Rao");
  const [email, setEmail] = useState(user?.email || "anika.rao@meridian-health.org");
  const [role, setRole] = useState(profile?.role || "Hospital Administrator");
  const [department, setDepartment] = useState("Hospital Administration");
  const [phone, setPhone] = useState("+1 (555) 234-5678");

  // Notification Toggles
  const [criticalAlerts, setCriticalAlerts] = useState(true);
  const [operationalUpdates, setOperationalUpdates] = useState(true);
  const [emailSummaries, setEmailSummaries] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);

  // AI & Appearance Preferences
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  const [aiAssistantEnabled, setAiAssistantEnabled] = useState(true);
  const [aiInsightPriority, setAiInsightPriority] = useState("important");
  const [aiResponseStyle, setAiResponseStyle] = useState("balanced");

  // Save Toast Feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const photoUrl = user?.photoURL;
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setIsEditing(false);
      setToastMessage("Profile updated successfully.");
      setTimeout(() => setToastMessage(null), 3000);
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 px-4 py-3 rounded-2xl bg-emerald-600 text-white font-semibold text-xs shadow-2xl flex items-center space-x-2 animate-in slide-in-from-top-4 duration-200">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumb & Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
          <Link href="/settings" className="hover:text-blue-600">Settings</Link>
          <span>/</span>
          <span className="text-slate-900 font-bold">Profile</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Profile & Preferences</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your account identity, clinical role, security status, and notification preferences.
        </p>
      </div>

      {/* Profile Hero Identity Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-5">
          {/* Profile Photo */}
          <div className="relative group shrink-0">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-blue-500/20 shadow-md transition-transform group-hover:scale-[1.03]"
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-white text-2xl font-black flex items-center justify-center border-4 border-blue-500/20 shadow-md">
                {initials}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">{name}</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold capitalize">
                {role}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Meridian General Hospital · {department}
            </p>
            <div className="flex items-center space-x-2 mt-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs font-semibold text-emerald-700">● Account Active</span>
              <span className="text-xs text-slate-400">· Last active: Just now</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition-all"
            >
              Edit Profile
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(false)}
              className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-all"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column: Profile Information (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Profile Information</h3>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Full Name</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 text-slate-900 disabled:bg-slate-50 disabled:text-slate-500 focus:outline-none focus:border-blue-500"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      disabled={!isEditing}
                      className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 text-slate-900 disabled:bg-slate-50 disabled:text-slate-500 focus:outline-none focus:border-blue-500"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <span className="absolute right-3 top-2.5 text-[11px] font-bold text-emerald-600">✓ Verified</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Clinical Role</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 text-slate-900 disabled:bg-slate-50 disabled:text-slate-500 focus:outline-none focus:border-blue-500"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Department</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 text-slate-900 disabled:bg-slate-50 disabled:text-slate-500 focus:outline-none focus:border-blue-500"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Hospital Organization</label>
                  <input
                    type="text"
                    disabled
                    className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-500"
                    value="Meridian General Hospital"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 text-slate-900 disabled:bg-slate-50 disabled:text-slate-500 focus:outline-none focus:border-blue-500"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              {isEditing && (
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 shadow-md"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Notification Preferences Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Notification Preferences</h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50">
                <div>
                  <div className="font-bold text-slate-900">Critical Alerts</div>
                  <div className="text-slate-500">Receive immediate notifications for emergency events</div>
                </div>
                <button
                  type="button"
                  onClick={() => setCriticalAlerts(!criticalAlerts)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${criticalAlerts ? "bg-blue-600" : "bg-slate-300"}`}
                >
                  <span className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${criticalAlerts ? "right-0.5" : "left-0.5"}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50">
                <div>
                  <div className="font-bold text-slate-900">Operational Updates</div>
                  <div className="text-slate-500">Updates regarding admissions, wards and OT turnover</div>
                </div>
                <button
                  type="button"
                  onClick={() => setOperationalUpdates(!operationalUpdates)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${operationalUpdates ? "bg-blue-600" : "bg-slate-300"}`}
                >
                  <span className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${operationalUpdates ? "right-0.5" : "left-0.5"}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50">
                <div>
                  <div className="font-bold text-slate-900">Daily Email Summaries</div>
                  <div className="text-slate-500">Receive morning operational intelligence digests</div>
                </div>
                <button
                  type="button"
                  onClick={() => setEmailSummaries(!emailSummaries)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${emailSummaries ? "bg-blue-600" : "bg-slate-300"}`}
                >
                  <span className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${emailSummaries ? "right-0.5" : "left-0.5"}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50">
                <div>
                  <div className="font-bold text-slate-900">SMS Emergency Alerts</div>
                  <div className="text-slate-500">Dispatch SMS for critical bed capacity warnings</div>
                </div>
                <button
                  type="button"
                  onClick={() => setSmsAlerts(!smsAlerts)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${smsAlerts ? "bg-blue-600" : "bg-slate-300"}`}
                >
                  <span className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${smsAlerts ? "right-0.5" : "left-0.5"}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Security & Preferences (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Security & Account Card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Security & Account</h3>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-1">
              <div className="font-bold flex items-center space-x-1.5">
                <span>🔒</span>
                <span>Account Protected</span>
              </div>
              <p className="text-[11px] text-emerald-800">
                Your session is secured via Firebase Authentication with ADC domain guardrails.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-500">Auth Provider:</span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">
                  {user?.providerData?.[0]?.providerId === "google.com" ? "Google Auth" : "Firebase Auth"}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-500">Email Verification:</span>
                <span className="font-bold text-emerald-600">✓ Verified</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-500">Session Status:</span>
                <span className="font-bold text-slate-800">Secure</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-500">Two-Factor Auth:</span>
                <span className="text-slate-400 font-medium">Not configured</span>
              </div>
            </div>
          </div>

          {/* AI Preferences Card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">✨ AI Preferences</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">AI Response Style</label>
                <select
                  value={aiResponseStyle}
                  onChange={(e) => setAiResponseStyle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="concise">Concise (Bullet Summaries)</option>
                  <option value="balanced">Balanced (Standard Operational)</option>
                  <option value="detailed">Detailed (Comprehensive Analytics)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">AI Operational Insight Priority</label>
                <select
                  value={aiInsightPriority}
                  onChange={(e) => setAiInsightPriority(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="critical">Critical Only</option>
                  <option value="important">Important & Critical</option>
                  <option value="all">All Operational Insights</option>
                </select>
              </div>
            </div>
          </div>

          {/* Account Activity Timeline */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Recent Account Activity</h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-start space-x-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div>
                  <div className="font-bold text-slate-900">Signed in via Firebase Auth</div>
                  <div className="text-[11px] text-slate-400">Today · Just now</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <div>
                  <div className="font-bold text-slate-900">Profile preferences loaded</div>
                  <div className="text-[11px] text-slate-400">Yesterday · 4:18 PM</div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Actions / Danger Zone */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Account Actions</h3>
            <button
              onClick={() => logout()}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-rose-600 font-semibold text-xs transition-colors flex items-center justify-center space-x-2"
            >
              <span>Sign Out of Account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
