"use client";

import { useState } from "react";
import { HOSPITAL_NAME } from "@/lib/config/hospital";
import { TimeSeriesPoint } from "@/lib/data/operational-context";

interface ReportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  department: string;
  timeframe: string;
  series: TimeSeriesPoint[];
  kpis: {
    total1: number;
    total2: number;
    occupancy: number;
    otUtil: number;
    cssdPct: number;
  };
}

export function ReportPreviewModal({
  isOpen,
  onClose,
  department,
  timeframe,
  series,
  kpis,
}: ReportPreviewModalProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const generatedDate = new Date().toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "short",
  });

  const reportFileName = `Mediflow_Operational_Report_${department.replace(/\s+/g, "_")}_${timeframe.toUpperCase()}.pdf`;

  // Real client-side file download trigger
  const handleDownloadPDF = () => {
    setDownloading(true);
    setDownloadSuccess(false);

    setTimeout(() => {
      // Create printable structured report text / blob document
      const reportHtmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>${HOSPITAL_NAME} - Operational Intelligence Report</title>
  <style>
    body { font-family: 'Inter', system-ui, sans-serif; color: #0F172A; padding: 40px; line-height: 1.6; }
    .header { border-bottom: 2px solid #1677FF; padding-bottom: 20px; margin-bottom: 30px; }
    .title { font-size: 24px; font-weight: 800; color: #071B34; margin: 0; }
    .meta { font-size: 12px; color: #64748B; margin-top: 6px; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 24px 0; }
    .card { background: #F8FAFC; border: 1px solid #E2E8F0; padding: 16px; border-radius: 12px; }
    .card-title { font-size: 11px; text-transform: uppercase; color: #64748B; font-weight: 700; }
    .card-val { font-size: 22px; font-weight: 800; color: #1677FF; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; margin: 24px 0; font-size: 12px; }
    th { background: #071B34; color: #fff; text-align: left; padding: 10px; }
    td { border-bottom: 1px solid #E2E8F0; padding: 10px; }
    .section-title { font-size: 16px; font-weight: 700; color: #071B34; margin-top: 28px; }
    ul { padding-left: 20px; font-size: 13px; color: #334155; }
    .footer { font-size: 11px; color: #94A3B8; margin-top: 40px; border-top: 1px solid #E2E8F0; padding-top: 16px; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <div class="title">${HOSPITAL_NAME}</div>
    <div style="font-size: 16px; font-weight: 700; color: #1677FF;">Operational Intelligence Executive Report</div>
    <div class="meta">
      <strong>Generated:</strong> ${generatedDate} | 
      <strong>Reporting Period:</strong> ${timeframe.toUpperCase()} | 
      <strong>Department:</strong> ${department}
    </div>
  </div>

  <div class="section-title">Executive Summary</div>
  <p style="font-size: 13px; color: #334155;">
    This executive operational report details performance throughput, bed occupancy metrics, surgical unit utilization, and sterilization batch readiness for ${HOSPITAL_NAME} during the selected ${timeframe.toUpperCase()} reporting window for ${department}.
  </p>

  <div class="grid">
    <div class="card">
      <div class="card-title">Primary Volume / Admissions</div>
      <div class="card-val">${kpis.total1}</div>
    </div>
    <div class="card">
      <div class="card-title">Discharges / Processed</div>
      <div class="card-val">${kpis.total2}</div>
    </div>
    <div class="card">
      <div class="card-title">Bed Occupancy Rate</div>
      <div class="card-val">${kpis.occupancy}%</div>
    </div>
  </div>

  <div class="section-title">Time-Series Operational Throughput Data</div>
  <table>
    <thead>
      <tr>
        <th>Interval / Day</th>
        <th>Series 1 / Admissions</th>
        <th>Series 2 / Discharges</th>
        <th>Series 3 / Transfers</th>
        <th>Net Flow</th>
      </tr>
    </thead>
    <tbody>
      ${series
        .map(
          (s) => `
        <tr>
          <td><strong>${s.label}</strong></td>
          <td>${s.series1Val ?? s.admissions}</td>
          <td>${s.series2Val ?? s.discharges}</td>
          <td>${s.series3Val ?? s.transfers}</td>
          <td>+${s.netFlow}</td>
        </tr>
      `
        )
        .join("")}
    </tbody>
  </table>

  <div class="section-title">Key Operational Insights</div>
  <ul>
    <li>Overall ward occupancy remained steady at ${kpis.occupancy}% with 48 total bed allocation.</li>
    <li>Operating Theatre room utilization achieved ${kpis.otUtil}% efficiency across active surgical suites.</li>
    <li>CSSD instrument pack sterilization readiness stands at ${kpis.cssdPct}%.</li>
    <li>Net patient flow variance across departments registered +${kpis.total1 - kpis.total2} patients.</li>
  </ul>

  <div class="section-title">Strategic Operational Recommendations</div>
  <ul>
    <li>Fast-track consent clearance in Emergency Admissions to eliminate intake delays.</li>
    <li>Optimize OT Room 02 turnover protocols between scheduled surgical procedures.</li>
    <li>Maintain autoclave sterilization batch cadence for afternoon surgical cases.</li>
  </ul>

  <div class="footer">
    Mediflow-AI Operational Intelligence Platform · ${HOSPITAL_NAME} · Confidential Internal Document
  </div>
</body>
</html>
      `;

      // Trigger client-side blob download
      const blob = new Blob([reportHtmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = reportFileName.replace(".pdf", ".html");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloading(false);
      setDownloadSuccess(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div>
            <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-0.5">
              Executive PDF Report Preview
            </div>
            <h2 className="text-lg font-bold text-slate-900">{HOSPITAL_NAME}</h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-all"
            aria-label="Close report preview"
          >
            ✕
          </button>
        </div>

        {/* Modal Body / Report Document Sheet */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 font-sans text-slate-800">
          {/* Success Banner */}
          {downloadSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between animate-in fade-in duration-200">
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">✓</span>
                <span>Report downloaded successfully as <strong>{reportFileName.replace(".pdf", ".html")}</strong></span>
              </div>
              <button onClick={() => setDownloadSuccess(false)} className="text-emerald-700 hover:underline">Dismiss</button>
            </div>
          )}

          {/* Report Cover Header */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#071B34] to-[#0B2545] text-white space-y-2">
            <div className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">
              Mediflow-AI Operational Intelligence
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Operational Performance Report
            </h1>
            <div className="text-xs text-slate-300 flex flex-wrap gap-4 pt-1 border-t border-white/10">
              <span><strong>Hospital:</strong> {HOSPITAL_NAME}</span>
              <span><strong>Period:</strong> {timeframe.toUpperCase()}</span>
              <span><strong>Department:</strong> {department}</span>
              <span><strong>Generated:</strong> {generatedDate}</span>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">1. Executive Summary</h3>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
              This executive report synthesizes key performance throughput, ward bed occupancy, surgical unit utilization, and CSSD sterilization batch readiness for {HOSPITAL_NAME} during the {timeframe.toUpperCase()} window filtered by {department}.
            </p>
          </div>

          {/* KPI Snapshot Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">2. KPI Overview</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200">
                <div className="text-[10px] font-bold text-blue-600 uppercase">Primary Intake</div>
                <div className="text-xl font-extrabold text-slate-900 mt-0.5">{kpis.total1}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="text-[10px] font-bold text-emerald-600 uppercase">Discharges</div>
                <div className="text-xl font-extrabold text-slate-900 mt-0.5">{kpis.total2}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
                <div className="text-[10px] font-bold text-amber-600 uppercase">Bed Occupancy</div>
                <div className="text-xl font-extrabold text-slate-900 mt-0.5">{kpis.occupancy}%</div>
              </div>
              <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200">
                <div className="text-[10px] font-bold text-indigo-600 uppercase">OT Utilization</div>
                <div className="text-xl font-extrabold text-slate-900 mt-0.5">{kpis.otUtil}%</div>
              </div>
            </div>
          </div>

          {/* Operational Insights */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">3. Key Operational Insights</h3>
            <ul className="space-y-2 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100 list-disc list-inside">
              <li>Ward bed occupancy maintained at {kpis.occupancy}% across 48 total bed allocation.</li>
              <li>Operating Theatre utilization achieved {kpis.otUtil}% across active rooms.</li>
              <li>CSSD sterilization readiness registered {kpis.cssdPct}%.</li>
              <li>Net patient flow balance registered +{kpis.total1 - kpis.total2} patients.</li>
            </ul>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-all cursor-pointer"
          >
            Close Preview
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50 flex items-center space-x-2 cursor-pointer"
            >
              {downloading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generating PDF Report...</span>
                </>
              ) : (
                <>
                  <span>📥 Download Executive Report</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
