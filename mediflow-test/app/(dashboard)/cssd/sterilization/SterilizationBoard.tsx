"use client";

import { useState } from "react";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { INITIAL_BATCHES, INITIAL_AUTOCLAVES, SterilizationBatch } from "@/lib/data/cssd-data";
import { HOSPITAL_NAME } from "@/lib/config/hospital";

export function SterilizationBoard() {
  const [batches, setBatches] = useState<SterilizationBatch[]>(INITIAL_BATCHES);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBatchDrawer, setSelectedBatchDrawer] = useState<SterilizationBatch | null>(null);

  // Start Batch Modal State
  const [startModalOpen, setStartModalOpen] = useState(false);
  const [batchCodeInput, setBatchCodeInput] = useState("");
  const [autoclaveSelect, setAutoclaveSelect] = useState("auto_01");

  const filteredBatches = statusFilter === "all" ? batches : batches.filter((b) => b.status === statusFilter);

  const handleRelease = (id: string) => {
    setBatches((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "released", qcResult: "Passed", completedAt: new Date().toISOString() } : b))
    );
    if (selectedBatchDrawer?.id === id) setSelectedBatchDrawer(null);
  };

  const handleHold = (id: string) => {
    setBatches((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "held", qcResult: "Review" } : b))
    );
    if (selectedBatchDrawer?.id === id) setSelectedBatchDrawer(null);
  };

  const handleStartBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchCodeInput.trim()) return;

    const newBatch: SterilizationBatch = {
      id: `bt_${Date.now()}`,
      batchCode: batchCodeInput.trim().toUpperCase(),
      status: "in_cycle",
      autoclaveId: autoclaveSelect,
      autoclaveName: autoclaveSelect === "auto_01" ? "Autoclave 01" : "Autoclave 02",
      packCodes: ["GEN-SET-02", "SCOPE-SET-07"],
      startedAt: new Date().toISOString(),
      completedAt: null,
      cycleMinutes: null,
      targetMinutes: 120,
      operator: "Dr. Anika Rao",
      qcResult: "Pending",
      temperature: 134,
      pressure: 2.1,
    };

    setBatches((prev) => [newBatch, ...prev]);
    setBatchCodeInput("");
    setStartModalOpen(false);
  };

  return (
    <div className="space-y-6 font-sans select-none pb-24 text-slate-800 dark:text-slate-100">
      
      {/* Page Header */}
      <PageHeader
        title="Sterilization Control Center"
        category="CSSD / STERILIZATION"
        description={`Monitor active sterilization cycles, batch release and autoclave performance for ${HOSPITAL_NAME}.`}
        actions={
          <div className="flex items-center space-x-2">
            <button
              onClick={() => alert("Sterilization history logs filtered for past 30 days.")}
              className="px-4 py-2.5 rounded-xl bg-[#0B2545] hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
            >
              📋 View History
            </button>
            <button
              onClick={() => setStartModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
            >
              + Start Batch
            </button>
          </div>
        }
      />

      {/* Top 6 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[10px] font-extrabold uppercase text-slate-500">Active Cycles</div>
          <div className="text-2xl font-extrabold font-mono text-blue-600 dark:text-cyan-400 mt-1">2</div>
          <div className="text-[11px] font-semibold text-blue-600 dark:text-cyan-400">Autoclaves 01 & 02</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[10px] font-extrabold uppercase text-emerald-600">Completed Today</div>
          <div className="text-2xl font-extrabold font-mono text-emerald-600 mt-1">8</div>
          <div className="text-[11px] font-semibold text-emerald-600">100% sterile yield</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[10px] font-extrabold uppercase text-purple-600">Pending Release</div>
          <div className="text-2xl font-extrabold font-mono text-purple-600 mt-1">1</div>
          <div className="text-[11px] font-semibold text-purple-600">Awaiting QC Signoff</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[10px] font-extrabold uppercase text-rose-600">Failed / Held</div>
          <div className="text-2xl font-extrabold font-mono text-rose-600 mt-1">1</div>
          <div className="text-[11px] font-semibold text-rose-600">Temp deviation</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[10px] font-extrabold uppercase text-slate-500">Avg Cycle Time</div>
          <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white mt-1">112m</div>
          <div className="text-[11px] font-semibold text-emerald-600">Target: 120m</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[10px] font-extrabold uppercase text-emerald-600">Success Rate</div>
          <div className="text-2xl font-extrabold font-mono text-emerald-600 mt-1">97.4%</div>
          <div className="text-[11px] font-semibold text-emerald-600">+2.1% this week</div>
        </div>
      </div>

      {/* Live Autoclaves Machines Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex justify-between items-center">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Live Autoclave Chamber Status</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Real-time pressure, temperature, operator and remaining cycle time</p>
          </div>
          <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 font-bold px-2.5 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950">
            ● 2 Chambers Running
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {INITIAL_AUTOCLAVES.map((m) => (
            <div key={m.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-sm text-slate-900 dark:text-white">{m.name}</span>
                <span className={`px-2.5 py-0.5 text-[9px] font-extrabold uppercase rounded-full ${
                  m.status === "active" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                }`}>
                  {m.status}
                </span>
              </div>

              {m.status === "active" ? (
                <>
                  <div className="text-xs font-mono font-bold text-blue-600 dark:text-cyan-400 flex justify-between">
                    <span>Batch: {m.currentBatch}</span>
                    <span>{m.progressPct}%</span>
                  </div>

                  <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div className="h-full bg-blue-600 dark:bg-cyan-500 rounded-full animate-pulse" style={{ width: `${m.progressPct}%` }} />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-600 dark:text-slate-300 pt-1">
                    <div>Temp: <strong className="text-slate-900 dark:text-white">{m.temperature}°C</strong></div>
                    <div>Press: <strong className="text-slate-900 dark:text-white">{m.pressure} bar</strong></div>
                    <div>Elapsed: <strong>{m.elapsedMin} min</strong></div>
                    <div>Rem: <strong className="text-blue-600 dark:text-cyan-400">{m.remainingMin} min</strong></div>
                  </div>

                  <div className="text-[11px] text-slate-400 font-medium pt-1 border-t border-slate-200 dark:border-slate-700">
                    Operator: <span className="font-bold text-slate-700 dark:text-slate-200">{m.operator}</span>
                  </div>
                </>
              ) : (
                <div className="text-xs text-slate-400 font-medium py-6 text-center">
                  Chamber under maintenance · Service due 12 Aug
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Live Cycle Timeline */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="text-xs font-extrabold uppercase tracking-widest text-slate-400">ACTIVE STERILIZATION STAGE FLOW</div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-xs font-bold text-center">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200">PRE-CLEAN ✓</div>
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200">LOADING ✓</div>
          <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-md animate-pulse">STERILIZATION ● ACTIVE</div>
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400">DRYING ○</div>
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400">QC SIGN OFF ○</div>
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400">RELEASE ○</div>
        </div>
      </div>

      {/* Sterilization Batch Table */}
      <div className="bg-white dark:bg-[#0B2545] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Sterilization Batch Registry</h3>
          <div className="flex items-center space-x-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            >
              <option value="all">Status: All</option>
              <option value="in_cycle">In Cycle</option>
              <option value="released">Released</option>
              <option value="held">Held</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Batch ID</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Packs Included</th>
                <th className="py-3.5 px-4">Chamber</th>
                <th className="py-3.5 px-4">Started At</th>
                <th className="py-3.5 px-4">Completed</th>
                <th className="py-3.5 px-4">Duration</th>
                <th className="py-3.5 px-4">Operator</th>
                <th className="py-3.5 px-4">QC Result</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredBatches.map((b) => (
                <tr
                  key={b.id}
                  onClick={() => setSelectedBatchDrawer(b)}
                  className="hover:bg-blue-50/50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-4 font-extrabold font-mono text-blue-600 dark:text-cyan-400">
                    {b.batchCode}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        b.status === "released"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : b.status === "in_cycle"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                          : b.status === "failed"
                          ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                      }`}
                    >
                      {b.status.replace("_", " ")}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                    {b.packCodes.join(", ")}
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                    {b.autoclaveName}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-500">
                    {new Date(b.startedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-500">
                    {b.completedAt ? new Date(b.completedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "In progress"}
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                    {b.cycleMinutes ? `${b.cycleMinutes} min` : "Active"}
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                    {b.operator}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`font-bold ${
                        b.qcResult === "Passed"
                          ? "text-emerald-600"
                          : b.qcResult === "Failed"
                          ? "text-rose-600"
                          : "text-amber-600"
                      }`}
                    >
                      {b.qcResult}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end space-x-1">
                      {b.status === "in_cycle" || b.status === "held" ? (
                        <button
                          type="button"
                          onClick={() => handleRelease(b.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px]"
                        >
                          Release
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => handleHold(b.id)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[11px]"
                      >
                        Hold
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sterilization Analytics & Failure Reason Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Cycle Performance vs Target</h3>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-2 text-xs font-semibold">
            <div className="flex justify-between"><span>Average Cycle Duration:</span><strong className="font-mono text-blue-600">112 mins</strong></div>
            <div className="flex justify-between"><span>Benchmark Target:</span><strong className="font-mono text-emerald-600">120 mins</strong></div>
            <div className="flex justify-between"><span>Efficiency Gain:</span><strong className="font-mono text-cyan-600">+6.7% faster</strong></div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Quality Check Failure Breakdown</h3>
          <div className="space-y-2 text-xs font-semibold">
            <div>Temperature Deviation (60%)<div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden"><div className="h-full bg-rose-500 w-3/5" /></div></div>
            <div>Packaging Defect (25%)<div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden"><div className="h-full bg-amber-500 w-1/4" /></div></div>
            <div>Pressure Fluctuation (15%)<div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden"><div className="h-full bg-blue-500 w-1/6" /></div></div>
          </div>
        </div>
      </div>

      {/* Batch Detail Drawer */}
      {selectedBatchDrawer && (
        <div className="fixed inset-0 z-[120] bg-slate-900/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full p-6 shadow-2xl border-l border-slate-200 dark:border-slate-800 space-y-6 overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">BATCH TELEMETRY</span>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{selectedBatchDrawer.batchCode}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBatchDrawer(null)}
                className="text-slate-400 font-bold hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-2 font-semibold">
                <div className="flex justify-between"><span>Chamber:</span><strong className="text-slate-900 dark:text-white">{selectedBatchDrawer.autoclaveName}</strong></div>
                <div className="flex justify-between"><span>Operator:</span><strong>{selectedBatchDrawer.operator}</strong></div>
                <div className="flex justify-between"><span>Status:</span><strong className="uppercase text-blue-600">{selectedBatchDrawer.status}</strong></div>
                <div className="flex justify-between"><span>QC Result:</span><strong className="text-emerald-600">{selectedBatchDrawer.qcResult}</strong></div>
                <div className="flex justify-between"><span>Temperature:</span><strong>{selectedBatchDrawer.temperature}°C</strong></div>
                <div className="flex justify-between"><span>Pressure:</span><strong>{selectedBatchDrawer.pressure} bar</strong></div>
              </div>

              <div className="pt-2 space-y-2">
                <span className="text-[10px] font-bold uppercase text-slate-400">Packs in Batch</span>
                <div className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold">
                  {selectedBatchDrawer.packCodes.join(" · ")}
                </div>
              </div>

              <div className="pt-4 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => handleRelease(selectedBatchDrawer.id)}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                >
                  Authorize Batch Release
                </button>
                <button
                  type="button"
                  onClick={() => handleHold(selectedBatchDrawer.id)}
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs"
                >
                  Flag Batch for Quality Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Start Batch Modal */}
      {startModalOpen && (
        <div className="fixed inset-0 z-[150] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleStartBatch}
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4"
          >
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              + Initialize Sterilization Batch
            </h3>
            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">Batch Code</label>
              <input
                type="text"
                required
                value={batchCodeInput}
                onChange={(e) => setBatchCodeInput(e.target.value)}
                placeholder="e.g. STZ-0812-A"
                className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">Select Autoclave Chamber</label>
              <select
                value={autoclaveSelect}
                onChange={(e) => setAutoclaveSelect(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
              >
                <option value="auto_01">Autoclave 01 (Active)</option>
                <option value="auto_02">Autoclave 02 (Active)</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setStartModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
              >
                Start Sterilization Cycle
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
