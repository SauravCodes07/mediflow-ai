"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { EmptyState } from "../../components/ui/EmptyState";
import type { AdmissionRow } from "../../../lib/data/queries";
import type { ReadinessStatus } from "../../../lib/data/types";

const READINESS_LABEL: Record<ReadinessStatus, string> = {
  pending: "Pending",
  in_progress: "In progress",
  ready: "Ready",
  blocked: "Blocked",
};

const READINESS_TONE: Record<ReadinessStatus, "neutral" | "info" | "success" | "critical"> = {
  pending: "neutral",
  in_progress: "info",
  ready: "success",
  blocked: "critical",
};

const CONSENT_LABEL: Record<AdmissionRow["consent"], string> = {
  not_started: "Not started",
  pending_signature: "Pending signature",
  signed: "Signed",
  waived: "Waived",
};

const TRANSFER_LABEL: Record<AdmissionRow["transfer"], string> = {
  not_required: "Not required",
  requested: "Requested",
  in_transit: "In transit",
  completed: "Completed",
};

const STAGE_LABEL: Record<AdmissionRow["stage"], string> = {
  registered: "Registered",
  assessment: "Assessment",
  ward_assigned: "Ward assigned",
  ready_for_procedure: "Ready for procedure",
  completed: "Completed",
  cancelled: "Cancelled",
};

type ReadinessFilter = "all" | ReadinessStatus;
type SortKey = "recent" | "oldest" | "name";

function formatTime(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AdmissionsBoard({ rows }: { rows: AdmissionRow[] }) {
  const [query, setQuery] = useState("");
  const [readinessFilter, setReadinessFilter] = useState<ReadinessFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("recent");

  const filtered = useMemo(() => {
    let next = rows;

    if (readinessFilter !== "all") {
      next = next.filter((r) => r.readiness === readinessFilter);
    }

    const q = query.trim().toLowerCase();
    if (q) {
      next = next.filter(
        (r) =>
          r.patientName.toLowerCase().includes(q) ||
          r.mrn.toLowerCase().includes(q) ||
          r.departmentName.toLowerCase().includes(q) ||
          (r.wardName ?? "").toLowerCase().includes(q)
      );
    }

    const sorted = [...next];
    if (sortKey === "recent") {
      sorted.sort((a, b) => (a.admittedAt < b.admittedAt ? 1 : -1));
    } else if (sortKey === "oldest") {
      sorted.sort((a, b) => (a.admittedAt > b.admittedAt ? 1 : -1));
    } else {
      sorted.sort((a, b) => a.patientName.localeCompare(b.patientName));
    }
    return sorted;
  }, [rows, query, readinessFilter, sortKey]);

  return (
    <div className="stack" style={{ gap: "var(--space-4)" }}>
      <Card>
        <div className="row" style={{ gap: "var(--space-3)", flexWrap: "wrap", alignItems: "center" }}>
          <input
            className="input"
            style={{ maxWidth: 280 }}
            placeholder="Search patient, MRN, department or ward…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search admissions"
          />
          <select
            className="select"
            style={{ maxWidth: 200 }}
            value={readinessFilter}
            onChange={(e) => setReadinessFilter(e.target.value as ReadinessFilter)}
            aria-label="Filter by readiness"
          >
            <option value="all">All readiness states</option>
            <option value="ready">Ready</option>
            <option value="in_progress">In progress</option>
            <option value="pending">Pending</option>
            <option value="blocked">Blocked</option>
          </select>
          <select
            className="select"
            style={{ maxWidth: 200 }}
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            aria-label="Sort admissions"
          >
            <option value="recent">Sort: most recent</option>
            <option value="oldest">Sort: oldest first</option>
            <option value="name">Sort: patient name</option>
          </select>
          <span className="text-meta" style={{ marginLeft: "auto" }}>
            {filtered.length} of {rows.length} admission{rows.length === 1 ? "" : "s"}
          </span>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon="⌕"
            title={rows.length === 0 ? "No admissions right now" : "No admissions match your filters"}
            description={
              rows.length === 0
                ? "New admissions will appear here as soon as they're registered."
                : "Try clearing the search text or the readiness filter."
            }
            action={
              rows.length > 0 && (query || readinessFilter !== "all") ? (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setQuery("");
                    setReadinessFilter("all");
                  }}
                >
                  Clear filters
                </button>
              ) : undefined
            }
          />
        </Card>
      ) : (
        <div className="table-wrap">
          <table className="dt">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Stage</th>
                <th>Readiness</th>
                <th>Consent</th>
                <th>Transfer</th>
                <th>Admitted</th>
                <th>Target ready by</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr
                  key={r.id}
                  style={
                    r.isBlocked
                      ? { background: "var(--color-critical-bg)" }
                      : undefined
                  }
                >
                  <td>
                    <div className="stack" style={{ gap: 2 }}>
                      <Link href={`/patients/${r.patientId}`} style={{ fontWeight: 600, color: "var(--color-navy)" }}>
                        {r.patientName}
                      </Link>
                      <span className="text-meta">
                        {r.mrn} · Age {r.age} · {r.departmentName}
                        {r.wardName ? ` · ${r.wardName}` : ""}
                      </span>
                      {r.delayReason && (
                        <span className="text-meta" style={{ color: "var(--color-critical)" }}>
                          ⚠ {r.delayReason}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>{STAGE_LABEL[r.stage]}</td>
                  <td>
                    <Badge tone={READINESS_TONE[r.readiness]}>{READINESS_LABEL[r.readiness]}</Badge>
                  </td>
                  <td>{CONSENT_LABEL[r.consent]}</td>
                  <td>{TRANSFER_LABEL[r.transfer]}</td>
                  <td>{formatTime(r.admittedAt)}</td>
                  <td>{formatTime(r.targetReadyBy)}</td>
                  <td>
                    <Link href={`/patients/${r.patientId}`} className="btn btn-ghost btn-sm">
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
