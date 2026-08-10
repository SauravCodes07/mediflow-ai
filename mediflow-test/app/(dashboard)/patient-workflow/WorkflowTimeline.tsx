"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { EmptyState } from "../../components/ui/EmptyState";
import type { WorkflowTimelineEntry } from "../../../lib/data/queries";

const TYPE_LABEL: Record<string, string> = {
  admission_created: "Admission created",
  readiness_changed: "Readiness update",
  consent_changed: "Consent update",
  transfer_changed: "Transfer update",
  procedure_stage_changed: "Procedure stage",
  pack_assigned: "Pack assigned",
  alert_raised: "Alert raised",
  alert_resolved: "Alert resolved",
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function WorkflowTimeline({ entries }: { entries: WorkflowTimelineEntry[] }) {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const availableTypes = useMemo(() => {
    const types = new Set(entries.map((e) => e.type));
    return Array.from(types);
  }, [entries]);

  const filtered = useMemo(() => {
    let next = entries;
    if (typeFilter !== "all") {
      next = next.filter((e) => e.type === typeFilter);
    }
    const q = query.trim().toLowerCase();
    if (q) {
      next = next.filter((e) => e.patientName.toLowerCase().includes(q) || e.message.toLowerCase().includes(q));
    }
    return next;
  }, [entries, query, typeFilter]);

  return (
    <div className="stack" style={{ gap: "var(--space-4)" }}>
      <Card>
        <div className="row" style={{ gap: "var(--space-3)", flexWrap: "wrap", alignItems: "center" }}>
          <input
            className="input"
            style={{ maxWidth: 280 }}
            placeholder="Search patient or event…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search workflow timeline"
          />
          <select
            className="select"
            style={{ maxWidth: 220 }}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            aria-label="Filter by event type"
          >
            <option value="all">All event types</option>
            {availableTypes.map((t) => (
              <option key={t} value={t}>
                {TYPE_LABEL[t] ?? t}
              </option>
            ))}
          </select>
          <span className="text-meta" style={{ marginLeft: "auto" }}>
            {filtered.length} of {entries.length} event{entries.length === 1 ? "" : "s"}
          </span>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon="⌕"
            title={entries.length === 0 ? "No workflow events yet" : "No events match your filters"}
            description={
              entries.length === 0
                ? "Events will appear here as admissions move through the workflow."
                : "Try clearing the search text or the event type filter."
            }
            action={
              entries.length > 0 && (query || typeFilter !== "all") ? (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setQuery("");
                    setTypeFilter("all");
                  }}
                >
                  Clear filters
                </button>
              ) : undefined
            }
          />
        </Card>
      ) : (
        <Card>
          <div className="timeline">
            {filtered.map((entry) => (
              <div key={entry.id} className="timeline-item">
                <div className={`timeline-dot ${entry.isBlocker ? "timeline-dot-blocker" : ""}`} />
                <div className="stack" style={{ gap: 4, flex: 1 }}>
                  <div className="row" style={{ gap: "var(--space-2)", flexWrap: "wrap" }}>
                    <Link href={`/patients/${entry.patientId}`} style={{ fontWeight: 600, color: "var(--color-navy)" }}>
                      {entry.patientName}
                    </Link>
                    <Badge tone={entry.isBlocker ? "critical" : "neutral"}>{TYPE_LABEL[entry.type] ?? entry.type}</Badge>
                  </div>
                  <span className="text-body">{entry.message}</span>
                  <span className="text-meta">{formatTime(entry.occurredAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
