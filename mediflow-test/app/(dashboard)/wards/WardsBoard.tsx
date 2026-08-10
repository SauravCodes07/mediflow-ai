"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { EmptyState } from "../../components/ui/EmptyState";
import type { TransferQueueRow, WardOverview } from "../../../lib/data/queries";

const BED_TILE_CLASS: Record<string, string> = {
  occupied: "bed-tile bed-tile-occupied",
  cleaning: "bed-tile bed-tile-cleaning",
  blocked: "bed-tile bed-tile-blocked",
  available: "bed-tile",
};

const BED_STATUS_LABEL: Record<string, string> = {
  occupied: "Occupied",
  available: "Available",
  cleaning: "Cleaning",
  blocked: "Blocked",
};

const TRANSFER_LABEL: Record<TransferQueueRow["transfer"], string> = {
  not_required: "Not required",
  requested: "Requested",
  in_transit: "In transit",
  completed: "Completed",
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function WardsBoard({
  wards,
  transferQueue,
}: {
  wards: WardOverview[];
  transferQueue: TransferQueueRow[];
}) {
  const [query, setQuery] = useState("");

  const filteredWards = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return wards;
    return wards
      .map((ward) => ({
        ...ward,
        beds: ward.beds.filter(
          (b) =>
            ward.name.toLowerCase().includes(q) ||
            b.label.toLowerCase().includes(q) ||
            (b.patientName ?? "").toLowerCase().includes(q)
        ),
      }))
      .filter((ward) => ward.name.toLowerCase().includes(q) || ward.beds.length > 0);
  }, [wards, query]);

  const blockers = useMemo(() => {
    const items: { key: string; label: string; wardName: string }[] = [];
    for (const ward of wards) {
      for (const bed of ward.beds) {
        if (bed.status === "blocked") {
          items.push({ key: bed.id, label: `Bed ${bed.label} is out of service`, wardName: ward.name });
        }
      }
      if (ward.blockedAdmissionsCount > 0) {
        items.push({
          key: `${ward.id}-admissions`,
          label: `${ward.blockedAdmissionsCount} blocked admission${ward.blockedAdmissionsCount === 1 ? "" : "s"} waiting on this ward`,
          wardName: ward.name,
        });
      }
    }
    return items;
  }, [wards]);

  return (
    <div className="stack" style={{ gap: "var(--space-6)" }}>
      <Card>
        <input
          className="input"
          style={{ maxWidth: 320 }}
          placeholder="Search ward, bed or patient…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search wards"
        />
      </Card>

      {blockers.length > 0 && (
        <Card>
          <div className="text-label" style={{ marginBottom: "var(--space-3)" }}>
            Operational blockers
          </div>
          <div className="stack" style={{ gap: "var(--space-2)" }}>
            {blockers.map((b) => (
              <div key={b.key} className="row" style={{ gap: "var(--space-2)" }}>
                <Badge tone="critical">{b.wardName}</Badge>
                <span className="text-body">{b.label}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {filteredWards.length === 0 ? (
        <Card>
          <EmptyState
            icon="⌕"
            title="No wards match your search"
            description="Try a different ward name, bed label or patient name."
            action={
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setQuery("")}>
                Clear search
              </button>
            }
          />
        </Card>
      ) : (
        filteredWards.map((ward) => (
          <Card key={ward.id}>
            <div className="panel-header">
              <div>
                <div style={{ fontWeight: 700, color: "var(--color-navy)" }}>{ward.name}</div>
                <span className="text-meta">
                  {ward.departmentName} · {ward.occupied}/{ward.totalBeds} beds occupied
                </span>
              </div>
              <div style={{ minWidth: 140, textAlign: "right" }}>
                <span className="text-meta">{ward.occupancyPct}% occupancy</span>
                <div className="occupancy-bar" style={{ marginTop: 4 }}>
                  <div className="occupancy-bar-fill" style={{ width: `${ward.occupancyPct}%` }} />
                </div>
              </div>
            </div>

            <div className="bed-grid">
              {ward.beds.map((bed) => (
                <div key={bed.id} className={BED_TILE_CLASS[bed.status]}>
                  <span className="bed-tile-label">{bed.label}</span>
                  <span className="text-meta">{BED_STATUS_LABEL[bed.status]}</span>
                  {bed.patientName && (
                    <Link href={`/patients/${bed.patientId}`} className="text-meta" style={{ color: "var(--color-primary)", fontWeight: 600 }}>
                      {bed.patientName}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </Card>
        ))
      )}

      <Card>
        <div className="panel-header">
          <div className="text-label">Transfer queue</div>
          <span className="text-meta">{transferQueue.length} in progress</span>
        </div>
        {transferQueue.length === 0 ? (
          <EmptyState icon="○" title="No transfers in progress" description="Transfer requests will appear here as they're raised." />
        ) : (
          <div className="table-wrap">
            <table className="dt">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>From</th>
                  <th>To ward</th>
                  <th>Status</th>
                  <th>Requested</th>
                </tr>
              </thead>
              <tbody>
                {transferQueue.map((row) => (
                  <tr key={row.admissionId}>
                    <td>
                      <Link href={`/patients/${row.patientId}`} style={{ fontWeight: 600, color: "var(--color-navy)" }}>
                        {row.patientName}
                      </Link>
                    </td>
                    <td>{row.fromDepartmentName}</td>
                    <td>{row.toWardName}</td>
                    <td>
                      <Badge tone={row.transfer === "in_transit" ? "info" : "warning"}>{TRANSFER_LABEL[row.transfer]}</Badge>
                    </td>
                    <td>{formatTime(row.requestedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
