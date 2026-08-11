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

  const handleDownloadPDF = () => {
    setDownloading(true);
    setDownloadSuccess(false);

    setTimeout(() => {
      // Build printable window for direct Save as PDF
      const reportHtmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>${HOSPITAL_NAME} - ${department} Operational Report</title>
  <style>
    body { font-family: 'Inter', system-ui, sans-serif; color: #0F172A; padding: 40px; line-height: 1.6; background: #fff; }
    .header { border-bottom: 3px solid #1677FF; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
    .title { font-size: 24px; font-weight: 800; color: #071B34; margin: 0; }
    .subtitle { font-size: 16px; font-weight: 700; color: #1677FF; margin-top: 4px; }
    .meta { font-size: 11px; color: #64748B; margin-top: 8px; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 24px 0; }
    .card { background: #F8FAFC; border: 1px solid #E2E8F0; padding: 16px; border-radius: 12px; }
    .card-title { font-size: 11px; text-transform: uppercase; color: #64748B; font-weight: 700; }
    .card-val { font-size: 24px; font-weight: 800; color: #1677FF; margin-top: 4px; font-family: monospace; }
    table { width: 100%; border-collapse: collapse; margin: 24px 0; font-size: 12px; }
    th { background: #071B34; color: #fff; text-align: left; padding: 10px; font-size: 11px; text-transform: uppercase; }
    td { border-bottom: 1px solid #E2E8F0; padding: 10px; }
    .section-title { font-size: 16px; font-weight: 700; color: #071B34; margin-top: 28px; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px; }
    ul { padding-left: 20px; font-size: 13px; color: #334155; }
    .footer { font-size: 11px; color: #94A3B8; margin-top: 40px; border-top: 1px solid #E2E8F0; padding-top: 16px; text-align: center; }
    @media print {
      body { padding: 20px; }
      button { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="title">${HOSPITAL_NAME}</div>
      <div class="subtitle">Operational Intelligence Executive Report</div>
      <div class="meta">
        <strong>Generated:</strong> ${generatedDate} | 
        <strong>Period:</strong> ${timeframe.toUpperCase()} | 
        <strong>Target:</strong> ${department}
      </div>
    </div>
  </div>

  <div class="section-title">Executive Summary</div>
  <p style="font-size: 13px; color: #334155;">
    Operational summary for ${HOSPITAL_NAME} covering admissions intake, bed capacity, surgical theatre metrics, and sterilization readiness for ${department} across ${timeframe.toUpperCase()}.
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

  <div class="section-title">Time-Series Operational Telemetry</div>
  <table>
    <thead>
      <tr>
        <th>Interval / Label</th>
        <th>Series 1 / Admissions</th>
        <th>Series 2 / Discharges</th>
        <th>Series 3 / Transfers</th>
        <th>Net Flow Variance</th>
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

  <div class="section-title">Key Operational Insights & Findings</div>
  <ul>
    <li>Hospital ward bed occupancy recorded at ${kpis.occupancy}% utilization.</li>
    <li>Operating Theatre active case throughput achieved ${kpis.otUtil}% efficiency.</li>
    <li>CSSD sterile pack availability currently registers at ${kpis.cssdPct}%.</li>
    <li>Net throughput balance across active departments: +${kpis.total1 - kpis.total2} patients.</li>
  </ul>

  <div class="section-title">Strategic Operational Recommendations</div>
  <ul>
    <li>Maintain fast-track consent protocols in Emergency Admissions to prevent intake queue accumulation.</li>
    <li>Monitor OT turnover intervals between scheduled cases to sustain surgical capacity.</li>
    <li>Sustain autoclave batch processing cadence for afternoon surgical cases.</li>
  </ul>

  <div class="footer">
    Mediflow-AI Operational Intelligence Platform · ${HOSPITAL_NAME} · Confidential Internal Report
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() { window.print(); }, 400);
    };
  </script>
</body>
</html>
      `;

      const printWin = window.open("", "_blank");
      if (printWin) {
        printWin.document.write(reportHtmlContent);
        printWin.document.close();
      }

      setDownloading(false);
      setDownloadSuccess(true);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/80">
          <div>
            <div className="text-xs font-extrabold text-blue-600 dark:text-cyan-400 uppercase tracking-wider mb-0.5">
              PDF Executive Report Preview
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">{HOSPITAL_NAME}</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-all font-bold"
            aria-label="Close report preview"
          >
            ✕
          </button>
        </div>

        {/* Modal Body Sheet */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 font-sans text-slate-800 dark:text-slate-100">
          {downloadSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">✓</span>
                <span>PDF print dialog opened for <strong>{reportFileName}</strong></span>
              </div>
              <button type="button" onClick={() => setDownloadSuccess(false)} className="text-emerald-700 dark:text-emerald-300 hover:underline">Dismiss</button>
            </div>
          )}

          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3 gap-2">
              <div>
                <span className="text-xs font-extrabold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest block">REPORT METADATA</span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{department} Operations Report</h3>
              </div>
              <div className="text-xs font-mono text-slate-500 dark:text-slate-400 text-right">
                <div>Period: <strong>{timeframe.toUpperCase()}</strong></div>
                <div>Generated: {generatedDate}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Admissions</span>
                <span className="text-lg font-extrabold font-mono text-blue-600 dark:text-cyan-400">{kpis.total1}</span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Discharges</span>
                <span className="text-lg font-extrabold font-mono text-emerald-600">{kpis.total2}</span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Bed Occupancy</span>
                <span className="text-lg font-extrabold font-mono text-amber-600">{kpis.occupancy}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-extrabold text-xs transition-colors cursor-pointer"
          >
            Close Preview
          </button>

          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md transition-all disabled:opacity-50 cursor-pointer flex items-center space-x-2"
          >
            {downloading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Preparing PDF...</span>
              </>
            ) : (
              <span>📥 Export PDF Document</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
