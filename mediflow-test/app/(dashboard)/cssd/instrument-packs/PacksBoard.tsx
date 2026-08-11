"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { INITIAL_PACKS, InstrumentPack } from "@/lib/data/cssd-data";
import { HOSPITAL_NAME } from "@/lib/config/hospital";

export function PacksBoard() {
  const [packs, setPacks] = useState<InstrumentPack[]>(INITIAL_PACKS);
  const [search, setSearch] = useState("");
  const [lifecycleFilter, setLifecycleFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [roomFilter, setRoomFilter] = useState("all");
  const [selectedPackDrawer, setSelectedPackDrawer] = useState<InstrumentPack | null>(null);

  // Add Pack Modal State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<"General Surgery" | "Orthopedic" | "Endoscopy" | "Cardiology">("General Surgery");

  // Filtering
  const filteredPacks = useMemo(() => {
    return packs.filter((p) => {
      const matchSearch =
        p.code.toLowerCase().includes(search.toLowerCase()) ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase());

      const matchLife = lifecycleFilter === "all" || p.lifecycle === lifecycleFilter;
      const matchCat = categoryFilter === "all" || p.category === categoryFilter;
      const matchRoom =
        roomFilter === "all" ||
        (roomFilter === "Unassigned" ? p.assignedRoom === "Unassigned" : p.assignedRoom.includes(roomFilter));

      return matchSearch && matchLife && matchCat && matchRoom;
    });
  }, [packs, search, lifecycleFilter, categoryFilter, roomFilter]);

  // Handle Pack Actions
  const handleAction = (id: string, action: "assign" | "reprocess" | "hold") => {
    setPacks((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        if (action === "assign") {
          return { ...p, assignedRoom: "OT 01", lifecycle: "in_use", statusTone: "info" };
        }
        if (action === "reprocess") {
          return { ...p, lifecycle: "reprocessing", statusTone: "warning", assignedRoom: "CSSD Wash" };
        }
        if (action === "hold") {
          return { ...p, lifecycle: "held", statusTone: "warning", blockedFromUse: true };
        }
        return p;
      })
    );
    if (selectedPackDrawer?.id === id) {
      setSelectedPackDrawer(null);
    }
  };

  const handleAddPack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim() || !newName.trim()) return;

    const created: InstrumentPack = {
      id: `pack_${Date.now()}`,
      code: newCode.trim().toUpperCase(),
      name: newName.trim(),
      category: newCategory,
      lifecycle: "available",
      statusTone: "success",
      expiresAt: "2026-08-25",
      expiryStatus: "normal",
      assignedRoom: "Unassigned",
      lastSterilized: new Date().toISOString().split("T")[0],
      cyclesCount: 1,
      blockedFromUse: false,
      operator: "Dr. Anika Rao",
    };

    setPacks((prev) => [created, ...prev]);
    setNewCode("");
    setNewName("");
    setAddModalOpen(false);
  };

  return (
    <div className="space-y-6 font-sans select-none pb-24 text-slate-800 dark:text-slate-100">
      
      {/* Page Header */}
      <PageHeader
        title="Instrument Pack Inventory"
        category="CSSD / INVENTORY"
        description={`Track sterile instrument sets, lifecycle status and room allocation across ${HOSPITAL_NAME}.`}
        actions={
          <div className="flex items-center space-x-2">
            <button
              onClick={() => alert("Scanner active — scan barcode on instrument pack.")}
              className="px-4 py-2.5 rounded-xl bg-[#0B2545] hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
            >
              📷 Scan Pack
            </button>
            <button
              onClick={() => setAddModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
            >
              + Add Pack
            </button>
          </div>
        }
      />

      {/* Inventory KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-slate-800 text-center">
          <div className="text-[10px] font-extrabold uppercase text-slate-500">24 Total</div>
          <div className="text-xl font-extrabold font-mono text-slate-900 dark:text-white">Packs</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-slate-800 text-center">
          <div className="text-[10px] font-extrabold uppercase text-emerald-600">18 Available</div>
          <div className="text-xl font-extrabold font-mono text-emerald-600">Ready</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-slate-800 text-center">
          <div className="text-[10px] font-extrabold uppercase text-blue-600">3 In Cycle</div>
          <div className="text-xl font-extrabold font-mono text-blue-600 dark:text-cyan-400">Processing</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-slate-800 text-center">
          <div className="text-[10px] font-extrabold uppercase text-purple-600">1 In Use</div>
          <div className="text-xl font-extrabold font-mono text-purple-600">Active OT</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-slate-800 text-center">
          <div className="text-[10px] font-extrabold uppercase text-amber-600">2 Expiring</div>
          <div className="text-xl font-extrabold font-mono text-amber-600">&lt; 72 Hours</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-slate-800 text-center">
          <div className="text-[10px] font-extrabold uppercase text-rose-600">1 Blocked</div>
          <div className="text-xl font-extrabold font-mono text-rose-600">Held</div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search pack code or name..."
          className="w-full md:w-64 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={lifecycleFilter}
            onChange={(e) => setLifecycleFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
          >
            <option value="all">Lifecycle: All</option>
            <option value="available">Available</option>
            <option value="in_use">In Use</option>
            <option value="reprocessing">Reprocessing</option>
            <option value="held">Held</option>
            <option value="expired">Expired</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
          >
            <option value="all">Category: All</option>
            <option value="General Surgery">General Surgery</option>
            <option value="Orthopedic">Orthopedic</option>
            <option value="Endoscopy">Endoscopy</option>
            <option value="Cardiology">Cardiology</option>
          </select>

          <select
            value={roomFilter}
            onChange={(e) => setRoomFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
          >
            <option value="all">Room: All</option>
            <option value="OT 1">OT 01</option>
            <option value="OT 2">OT 02</option>
            <option value="OT 3">OT 03</option>
            <option value="Unassigned">Unassigned</option>
          </select>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white dark:bg-[#0B2545] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Pack Code & Name</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Lifecycle</th>
                <th className="py-3.5 px-4">Expiry Date</th>
                <th className="py-3.5 px-4">Assigned Room</th>
                <th className="py-3.5 px-4">Sterilization</th>
                <th className="py-3.5 px-4">Cycles</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredPacks.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => setSelectedPackDrawer(p)}
                  className="hover:bg-blue-50/50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block w-2.5 h-2.5 rounded-full ${
                        p.lifecycle === "available"
                          ? "bg-emerald-500"
                          : p.lifecycle === "expired" || p.blockedFromUse
                          ? "bg-rose-500"
                          : "bg-amber-500"
                      }`}
                    />
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-extrabold text-slate-900 dark:text-white">{p.code}</div>
                    <div className="text-[11px] text-slate-500 font-medium">{p.name}</div>
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                    {p.category}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        p.lifecycle === "available"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : p.lifecycle === "expired"
                          ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                      }`}
                    >
                      {p.lifecycle.replace("_", " ")}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                    {p.expiresAt}
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                    {p.assignedRoom}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-500">
                    {p.lastSterilized}
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                    {p.cyclesCount}
                  </td>

                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end space-x-1">
                      <button
                        type="button"
                        onClick={() => setSelectedPackDrawer(p)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-[11px]"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAction(p.id, "assign")}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-cyan-400 font-bold text-[11px]"
                      >
                        Assign
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analytics Below Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Pack Distribution by Specialty</h3>
          <div className="space-y-2 text-xs font-semibold">
            <div>General Surgery (8 packs)<div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden"><div className="h-full bg-blue-600 w-3/4" /></div></div>
            <div>Orthopedic (6 packs)<div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden"><div className="h-full bg-emerald-500 w-1/2" /></div></div>
            <div>Endoscopy (5 packs)<div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden"><div className="h-full bg-amber-500 w-2/5" /></div></div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Lifecycle Readiness Breakdown</h3>
          <div className="space-y-2 text-xs font-semibold">
            <div className="flex justify-between"><span>Available (18)</span><span className="font-mono text-emerald-600">75%</span></div>
            <div className="flex justify-between"><span>Reprocessing (3)</span><span className="font-mono text-blue-600">12%</span></div>
            <div className="flex justify-between"><span>Expiring / Held (3)</span><span className="font-mono text-amber-600">13%</span></div>
          </div>
        </div>
      </div>

      {/* Detail Drawer */}
      {selectedPackDrawer && (
        <div className="fixed inset-0 z-[120] bg-slate-900/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full p-6 shadow-2xl border-l border-slate-200 dark:border-slate-800 space-y-6 overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">PACK DETAILS</span>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{selectedPackDrawer.code}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPackDrawer(null)}
                className="text-slate-400 font-bold hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-2 font-semibold">
                <div className="flex justify-between"><span>Name:</span><strong className="text-slate-900 dark:text-white">{selectedPackDrawer.name}</strong></div>
                <div className="flex justify-between"><span>Category:</span><strong>{selectedPackDrawer.category}</strong></div>
                <div className="flex justify-between"><span>Lifecycle State:</span><strong className="uppercase text-blue-600">{selectedPackDrawer.lifecycle}</strong></div>
                <div className="flex justify-between"><span>Assigned Room:</span><strong>{selectedPackDrawer.assignedRoom}</strong></div>
                <div className="flex justify-between"><span>Operator:</span><strong>{selectedPackDrawer.operator}</strong></div>
              </div>

              {/* Lifecycle Flow Node */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-bold uppercase text-slate-400">Lifecycle Audit Flow</span>
                <div className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-[11px] font-mono space-y-1">
                  <div>✓ Assembled by {selectedPackDrawer.operator}</div>
                  <div>✓ Sterilized in Batch STZ-0810-A</div>
                  <div>✓ Quality Check Passed</div>
                  <div className="text-blue-600 dark:text-cyan-400 font-bold">● Current Status: {selectedPackDrawer.lifecycle.toUpperCase()}</div>
                </div>
              </div>

              <div className="pt-4 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => handleAction(selectedPackDrawer.id, "assign")}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                >
                  Assign to Operating Theatre (OT 01)
                </button>
                <button
                  type="button"
                  onClick={() => handleAction(selectedPackDrawer.id, "reprocess")}
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs"
                >
                  Send for Sterilization Reprocessing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Pack Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-[150] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleAddPack}
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4"
          >
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              + Register New Instrument Pack
            </h3>
            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">Pack Code</label>
              <input
                type="text"
                required
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                placeholder="e.g. GEN-SET-12"
                className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">Pack Name</label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Orthopedic Trauma Tray C"
                className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
              >
                <option value="General Surgery">General Surgery</option>
                <option value="Orthopedic">Orthopedic</option>
                <option value="Endoscopy">Endoscopy</option>
                <option value="Cardiology">Cardiology</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
              >
                Create Pack
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
