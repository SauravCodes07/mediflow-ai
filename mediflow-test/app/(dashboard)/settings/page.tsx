"use client";

import { useState } from "react";
import Link from "next/link";

export default function SettingsPage() {
  const [turnoverThreshold, setTurnoverThreshold] = useState("30");
  const [wardOccupancyThreshold, setWardOccupancyThreshold] = useState("80");
  const [packExpiryLeadDays, setPackExpiryLeadDays] = useState("3");
  const [autoEscalateMinutes, setAutoEscalateMinutes] = useState("15");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
          <Link href="/dashboard" className="hover:text-blue-600">Command Center</Link>
          <span>/</span>
          <span className="text-slate-900 font-bold">Settings</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Operational Settings & Thresholds</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Configure hospital warning thresholds, turnover alert limits, and escalation rules.
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <form onSubmit={handleSave} className="space-y-6">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Operational Alert Thresholds</h3>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                OT Turnover Alert Threshold (Minutes)
              </label>
              <input
                type="number"
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500"
                value={turnoverThreshold}
                onChange={(e) => setTurnoverThreshold(e.target.value)}
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Triggers a warning alert when room turnover between procedures exceeds this duration.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Ward High Occupancy Alert Threshold (%)
              </label>
              <input
                type="number"
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500"
                value={wardOccupancyThreshold}
                onChange={(e) => setWardOccupancyThreshold(e.target.value)}
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Triggers a capacity warning alert when ward occupancy reaches or exceeds this percentage.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                CSSD Instrument Pack Expiry Warning (Days)
              </label>
              <input
                type="number"
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500"
                value={packExpiryLeadDays}
                onChange={(e) => setPackExpiryLeadDays(e.target.value)}
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Flags instrument packs as &quot;Expiring Soon&quot; when expiry date is within this lead window.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Unacknowledged Alert Auto-Escalation (Minutes)
              </label>
              <input
                type="number"
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500"
                value={autoEscalateMinutes}
                onChange={(e) => setAutoEscalateMinutes(e.target.value)}
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Escalates open critical alerts to department administrator if unacknowledged.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            {saved ? <span className="text-xs text-emerald-600 font-bold">✓ Operational thresholds saved</span> : <span />}
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-500 shadow-md"
            >
              Save Thresholds
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
