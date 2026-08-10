/**
 * Data access layer — the ONLY module UI pages/components should import
 * data from. Nothing in `app/` should reach into `seed.ts` directly.
 *
 * Every exported function takes `orgId` as its first argument. This is the
 * authorization boundary documented in DATA_MODEL.md: until Step 21 wires
 * Firebase Authentication and a real per-request session, `getCurrentOrgId()`
 * below is the single choke point that stands in for "which tenant is this
 * request allowed to see." Swapping it for a real session lookup later is a
 * one-function change — no query below needs to change shape.
 *
 * Functions are `async` and awaited even though the current source is an
 * in-memory array, so call sites already have the correct loading-state
 * shape for when this is backed by a real database.
 */
import {
  DEMO_ORG,
  DEMO_DEPARTMENTS,
  DEMO_WARDS,
  DEMO_BEDS,
  DEMO_PATIENTS,
  DEMO_ADMISSIONS,
  DEMO_WORKFLOW_EVENTS,
  DEMO_OT_ROOMS,
  DEMO_PROCEDURES,
  DEMO_INSTRUMENT_PACKS,
  DEMO_STERILIZATION_BATCHES,
} from "./seed";
import type {
  Admission,
  AdmissionStage,
  BedStatus,
  ReadinessStatus,
  WorkflowEventType,
  OTRoomStatus,
  ProcedureStage,
  PackLifecycle,
  SterilizationStatus,
} from "./types";

/** Stand-in for "resolve org from the authenticated session." Single-tenant
 * demo today; real implementation arrives with Step 21 (Firebase Auth). */
export async function getCurrentOrgId(): Promise<string> {
  return DEMO_ORG.id;
}

function simulatedLatency<T>(value: T, ms = 120): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export interface AdmissionRow {
  id: string;
  patientId: string;
  patientName: string;
  mrn: string;
  age: number;
  departmentName: string;
  wardName: string | null;
  stage: AdmissionStage;
  readiness: ReadinessStatus;
  consent: Admission["consent"];
  transfer: Admission["transfer"];
  delayReason: string | null;
  admittedAt: string;
  targetReadyBy: string | null;
  isBlocked: boolean;
}

/** The Admissions board (Step 11): admission episodes joined with patient,
 * department and ward names, org-scoped. This is the single source of
 * truth the Admissions page, its stat cards and (later) any dashboard
 * "admissions today" metric must all read from — no page should re-derive
 * these numbers independently. */
export async function getAdmissionsBoard(orgId: string): Promise<AdmissionRow[]> {
  const rows: AdmissionRow[] = DEMO_ADMISSIONS.filter((a) => a.orgId === orgId).map((a) => {
    const patient = DEMO_PATIENTS.find((p) => p.id === a.patientId);
    const department = DEMO_DEPARTMENTS.find((d) => d.id === a.departmentId);
    const ward = a.wardId ? DEMO_WARDS.find((w) => w.id === a.wardId) : null;
    return {
      id: a.id,
      patientId: a.patientId,
      patientName: patient?.name ?? "Unknown patient",
      mrn: patient?.mrn ?? "—",
      age: patient?.age ?? 0,
      departmentName: department?.name ?? "Unassigned",
      wardName: ward?.name ?? null,
      stage: a.stage,
      readiness: a.readiness,
      consent: a.consent,
      transfer: a.transfer,
      delayReason: a.delayReason,
      admittedAt: a.admittedAt,
      targetReadyBy: a.targetReadyBy,
      isBlocked: a.readiness === "blocked" || a.stage === "cancelled",
    };
  });

  rows.sort((x, y) => (x.admittedAt < y.admittedAt ? 1 : -1));
  return simulatedLatency(rows);
}

export interface AdmissionsStats {
  totalActive: number;
  readyNow: number;
  blocked: number;
  pendingConsent: number;
}

/** Derived purely from `getAdmissionsBoard`'s output so the stat cards and
 * the table below them can never disagree. */
export async function getAdmissionsStats(orgId: string): Promise<AdmissionsStats> {
  const rows = await getAdmissionsBoard(orgId);
  const active = rows.filter((r) => r.stage !== "cancelled" && r.stage !== "completed");
  return {
    totalActive: active.length,
    readyNow: active.filter((r) => r.readiness === "ready").length,
    blocked: active.filter((r) => r.isBlocked).length,
    pendingConsent: active.filter((r) => r.consent === "not_started" || r.consent === "pending_signature").length,
  };
}

export async function getBedSummaryForWard(wardId: string) {
  const beds = DEMO_BEDS.filter((b) => b.wardId === wardId);
  return simulatedLatency(beds);
}

/* ------------------------------------------------------------------ */
/* Step 12 — Wards and Patient Workflow                                */
/* ------------------------------------------------------------------ */

export interface WardBedRow {
  id: string;
  label: string;
  status: BedStatus;
  patientId: string | null;
  patientName: string | null;
}

export interface WardOverview {
  id: string;
  name: string;
  departmentName: string;
  beds: WardBedRow[];
  totalBeds: number;
  occupied: number;
  available: number;
  cleaning: number;
  blocked: number;
  occupancyPct: number;
  transferQueueCount: number;
  blockedAdmissionsCount: number;
}

/** Ward occupancy + bed state, org-scoped. This is the single source of
 * truth the Wards board and its summary stat cards both read from — the
 * per-ward occupancy percentage always derives from the same bed list
 * rendered underneath it. */
export async function getWardsOverview(orgId: string): Promise<WardOverview[]> {
  const wards = DEMO_WARDS.filter((w) => w.orgId === orgId);
  const admissions = DEMO_ADMISSIONS.filter((a) => a.orgId === orgId);

  const overview = wards.map((ward) => {
    const department = DEMO_DEPARTMENTS.find((d) => d.id === ward.departmentId);
    const beds: WardBedRow[] = DEMO_BEDS.filter((b) => b.wardId === ward.id).map((b) => {
      const patient = b.patientId ? DEMO_PATIENTS.find((p) => p.id === b.patientId) : null;
      return {
        id: b.id,
        label: b.label,
        status: b.status,
        patientId: b.patientId,
        patientName: patient?.name ?? null,
      };
    });

    const occupied = beds.filter((b) => b.status === "occupied").length;
    const available = beds.filter((b) => b.status === "available").length;
    const cleaning = beds.filter((b) => b.status === "cleaning").length;
    const blocked = beds.filter((b) => b.status === "blocked").length;

    const wardAdmissions = admissions.filter((a) => a.wardId === ward.id);
    const transferQueueCount = wardAdmissions.filter(
      (a) => a.transfer === "requested" || a.transfer === "in_transit"
    ).length;
    const blockedAdmissionsCount = wardAdmissions.filter(
      (a) => a.readiness === "blocked"
    ).length;

    return {
      id: ward.id,
      name: ward.name,
      departmentName: department?.name ?? "Unassigned",
      beds,
      totalBeds: beds.length,
      occupied,
      available,
      cleaning,
      blocked,
      occupancyPct: beds.length === 0 ? 0 : Math.round((occupied / beds.length) * 100),
      transferQueueCount,
      blockedAdmissionsCount,
    };
  });

  return simulatedLatency(overview);
}

export interface TransferQueueRow {
  admissionId: string;
  patientId: string;
  patientName: string;
  fromDepartmentName: string;
  toWardName: string | null;
  transfer: Admission["transfer"];
  requestedAt: string;
}

/** Cross-ward transfer queue — admissions currently mid-transfer, regardless
 * of which ward they're headed to. Reads the same Admission records as the
 * Admissions board (Step 11) and the per-ward counts above, so all three
 * views of "who is being transferred" can never disagree. */
export async function getTransferQueue(orgId: string): Promise<TransferQueueRow[]> {
  const rows = DEMO_ADMISSIONS.filter(
    (a) => a.orgId === orgId && (a.transfer === "requested" || a.transfer === "in_transit")
  ).map((a) => {
    const patient = DEMO_PATIENTS.find((p) => p.id === a.patientId);
    const fromDept = DEMO_DEPARTMENTS.find((d) => d.id === a.departmentId);
    const toWard = a.wardId ? DEMO_WARDS.find((w) => w.id === a.wardId) : null;
    return {
      admissionId: a.id,
      patientId: a.patientId,
      patientName: patient?.name ?? "Unknown patient",
      fromDepartmentName: fromDept?.name ?? "Unassigned",
      toWardName: toWard?.name ?? "Unassigned ward",
      transfer: a.transfer,
      requestedAt: a.updatedAt,
    };
  });

  rows.sort((x, y) => (x.requestedAt < y.requestedAt ? 1 : -1));
  return simulatedLatency(rows);
}

export interface WorkflowTimelineEntry {
  id: string;
  type: WorkflowEventType;
  message: string;
  patientId: string;
  patientName: string;
  admissionId: string;
  isBlocker: boolean;
  occurredAt: string;
}

/** A single admission-through-discharge timeline across all patients,
 * org-scoped. Each entry traces back to the same Admission record the
 * Admissions board reads, so the timeline narrates exactly the state
 * changes visible there — nothing here is invented independently. */
export async function getPatientWorkflowTimeline(orgId: string): Promise<WorkflowTimelineEntry[]> {
  const admissionsById = new Map(
    DEMO_ADMISSIONS.filter((a) => a.orgId === orgId).map((a) => [a.id, a])
  );

  const entries: WorkflowTimelineEntry[] = DEMO_WORKFLOW_EVENTS.filter(
    (e) => e.orgId === orgId && e.entityType === "admission" && admissionsById.has(e.entityId)
  ).map((e) => {
    const admission = admissionsById.get(e.entityId)!;
    const patient = DEMO_PATIENTS.find((p) => p.id === admission.patientId);
    return {
      id: e.id,
      type: e.type,
      message: e.message,
      patientId: admission.patientId,
      patientName: patient?.name ?? "Unknown patient",
      admissionId: admission.id,
      isBlocker: e.message.toLowerCase().startsWith("blocked"),
      occurredAt: e.occurredAt,
    };
  });

  entries.sort((x, y) => (x.occurredAt < y.occurredAt ? 1 : -1));
  return simulatedLatency(entries);
}

/* ------------------------------------------------------------------ */
/* Step 13 — Operating Theatre                                         */
/* ------------------------------------------------------------------ */

export interface EventTimelineEntry {
  id: string;
  message: string;
  occurredAt: string;
}

export interface ProcedureRow {
  id: string;
  patientId: string;
  patientName: string;
  roomId: string;
  roomName: string;
  name: string;
  surgeon: string;
  stage: ProcedureStage;
  scheduledStart: string;
  scheduledEnd: string;
  actualStart: string | null;
  actualEnd: string | null;
  delayReason: string | null;
  isDelayed: boolean;
  turnoverMinutes: number | null;
}

function toProcedureRow(p: (typeof DEMO_PROCEDURES)[number]): ProcedureRow {
  const patient = DEMO_PATIENTS.find((pt) => pt.id === p.patientId);
  const room = DEMO_OT_ROOMS.find((r) => r.id === p.otRoomId);
  const turnoverMinutes =
    p.actualStart && p.scheduledStart
      ? Math.round((new Date(p.actualStart).getTime() - new Date(p.scheduledStart).getTime()) / 60000)
      : null;
  return {
    id: p.id,
    patientId: p.patientId,
    patientName: patient?.name ?? "Unknown patient",
    roomId: p.otRoomId,
    roomName: room?.name ?? "Unassigned room",
    name: p.name,
    surgeon: p.surgeon,
    stage: p.stage,
    scheduledStart: p.scheduledStart,
    scheduledEnd: p.scheduledEnd,
    actualStart: p.actualStart,
    actualEnd: p.actualEnd,
    delayReason: p.delayReason,
    isDelayed: Boolean(p.delayReason),
    turnoverMinutes,
  };
}

export interface OTRoomRow {
  id: string;
  name: string;
  status: OTRoomStatus;
  currentProcedure: ProcedureRow | null;
}

/** OT overview (Step 13): every room, its live status, and the procedure
 * currently occupying it (if any). Reads the same `Procedure` records the
 * schedule and command dashboard read below, so room status can never
 * disagree with what's shown on the case itself. */
export async function getOTRooms(orgId: string): Promise<OTRoomRow[]> {
  const rooms: OTRoomRow[] = DEMO_OT_ROOMS.filter((r) => r.orgId === orgId).map((r) => {
    const current = DEMO_PROCEDURES.find(
      (p) => p.otRoomId === r.id && p.orgId === orgId && p.actualEnd === null && p.stage !== "available"
    );
    return {
      id: r.id,
      name: r.name,
      status: r.status,
      currentProcedure: current ? toProcedureRow(current) : null,
    };
  });
  return simulatedLatency(rooms);
}

/** Every procedure/case, chronological, across all rooms — backs the OT
 * Schedule route and the Command Dashboard's active/upcoming/delayed
 * lists. Single source of truth so those three views can't disagree. */
export async function getOTSchedule(orgId: string): Promise<ProcedureRow[]> {
  const rows = DEMO_PROCEDURES.filter((p) => p.orgId === orgId)
    .map((p) => toProcedureRow(p))
    .sort((a, b) => (a.scheduledStart < b.scheduledStart ? -1 : 1));
  return simulatedLatency(rows);
}

/** Single case detail for the `ot/[id]` dynamic route, including its
 * event timeline. Returns `null` when the case doesn't exist in this org,
 * so the page can render a real not-found state. */
export async function getProcedureDetail(
  orgId: string,
  procedureId: string
): Promise<(ProcedureRow & { timeline: EventTimelineEntry[] }) | null> {
  const p = DEMO_PROCEDURES.find((pr) => pr.id === procedureId && pr.orgId === orgId);
  if (!p) return simulatedLatency(null);

  const row = toProcedureRow(p);
  const timeline: EventTimelineEntry[] = DEMO_WORKFLOW_EVENTS.filter(
    (e) => e.orgId === orgId && e.entityType === "procedure" && e.entityId === procedureId
  )
    .sort((a, b) => (a.occurredAt < b.occurredAt ? -1 : 1))
    .map((e) => ({ id: e.id, message: e.message, occurredAt: e.occurredAt }));

  return simulatedLatency({ ...row, timeline });
}

export interface OTDashboardStats {
  activeProcedures: number;
  upcomingToday: number;
  criticalDelays: number;
  roomsAvailable: number;
  roomsTotal: number;
  roomUtilizationPct: number;
}

/** OT Command Dashboard (Step 13): the exact figures the contract names —
 * active procedures, upcoming procedures, critical delays and room
 * utilization — all derived from `getOTSchedule`/`getOTRooms` rather than
 * computed independently, so the numbers can't drift from the lists shown
 * next to them. */
export async function getOTDashboard(
  orgId: string
): Promise<{ stats: OTDashboardStats; active: ProcedureRow[]; upcoming: ProcedureRow[]; delayed: ProcedureRow[] }> {
  const schedule = await getOTSchedule(orgId);
  const rooms = await getOTRooms(orgId);

  const active = schedule.filter((p) => p.stage === "procedure" || p.stage === "in_room");
  const upcoming = schedule.filter((p) => p.stage === "preparation" || p.stage === "ready");
  const delayed = schedule.filter((p) => p.isDelayed);
  const roomsAvailable = rooms.filter((r) => r.status === "available").length;

  return simulatedLatency({
    stats: {
      activeProcedures: active.length,
      upcomingToday: upcoming.length,
      criticalDelays: delayed.length,
      roomsAvailable,
      roomsTotal: rooms.length,
      roomUtilizationPct: rooms.length === 0 ? 0 : Math.round(((rooms.length - roomsAvailable) / rooms.length) * 100),
    },
    active,
    upcoming,
    delayed,
  });
}

/* ------------------------------------------------------------------ */
/* Step 14 — CSSD / Instrument Packs / Sterilization                   */
/* ------------------------------------------------------------------ */

export interface InstrumentPackRow {
  id: string;
  code: string;
  name: string;
  lifecycle: PackLifecycle;
  expiresAt: string;
  isExpired: boolean;
  expiringSoon: boolean;
  assignedRoomName: string | null;
  /** Enforces the contract's "block use of expired/unavailable packs" rule
   * — pages must not offer an assignment action on a pack where this is
   * true, rather than re-deriving the condition themselves. */
  blockedFromUse: boolean;
}

function isPastNow(iso: string, now: Date) {
  return new Date(iso).getTime() < now.getTime();
}

function isWithinHours(iso: string, now: Date, hours: number) {
  const diffHours = (new Date(iso).getTime() - now.getTime()) / (1000 * 60 * 60);
  return diffHours >= 0 && diffHours <= hours;
}

/** Instrument pack inventory (Step 14), org-scoped. */
export async function getInstrumentPacks(orgId: string): Promise<InstrumentPackRow[]> {
  const now = new Date();
  const rows: InstrumentPackRow[] = DEMO_INSTRUMENT_PACKS.filter((p) => p.orgId === orgId).map((p) => {
    const room = p.assignedOtRoomId ? DEMO_OT_ROOMS.find((r) => r.id === p.assignedOtRoomId) : null;
    const expired = p.lifecycle === "expired" || isPastNow(p.expiresAt, now);
    return {
      id: p.id,
      code: p.code,
      name: p.name,
      lifecycle: p.lifecycle,
      expiresAt: p.expiresAt,
      isExpired: expired,
      expiringSoon: !expired && isWithinHours(p.expiresAt, now, 72),
      assignedRoomName: room?.name ?? null,
      blockedFromUse: expired || p.lifecycle === "held" || p.lifecycle === "reprocessing",
    };
  });
  rows.sort((a, b) => a.expiresAt.localeCompare(b.expiresAt));
  return simulatedLatency(rows);
}

export interface SterilizationBatchRow {
  id: string;
  batchCode: string;
  status: SterilizationStatus;
  packCodes: string[];
  startedAt: string;
  completedAt: string | null;
  cycleMinutes: number | null;
}

/** Sterilization batch tracking (Step 14), org-scoped. Pack codes are
 * joined from `getInstrumentPacks`' source data so a batch never shows a
 * pack identifier the inventory doesn't recognize. */
export async function getSterilizationBatches(orgId: string): Promise<SterilizationBatchRow[]> {
  const rows: SterilizationBatchRow[] = DEMO_STERILIZATION_BATCHES.filter((b) => b.orgId === orgId).map((b) => ({
    id: b.id,
    batchCode: b.batchCode,
    status: b.status,
    packCodes: b.packIds.map((id) => DEMO_INSTRUMENT_PACKS.find((p) => p.id === id)?.code ?? id),
    startedAt: b.startedAt,
    completedAt: b.completedAt,
    cycleMinutes: b.completedAt ? Math.round((new Date(b.completedAt).getTime() - new Date(b.startedAt).getTime()) / 60000) : null,
  }));
  rows.sort((a, b) => (a.startedAt < b.startedAt ? 1 : -1));
  return simulatedLatency(rows);
}

export interface CSSDOverviewStats {
  totalPacks: number;
  availablePacks: number;
  inUsePacks: number;
  problemPacks: number;
  batchesInCycle: number;
  batchesHeldOrFailed: number;
}

/** CSSD overview (Step 14): the counts the contract calls out, all derived
 * from `getInstrumentPacks`/`getSterilizationBatches` — this page never
 * computes its own numbers. Per the contract, cross-module Alert *records*
 * for pack problems are Step 15's job; this exposes the same "problem"
 * condition inline (via `problemPacks`) so CSSD surfaces it now without
 * prematurely building the Alerts data model. */
export async function getCSSDOverview(
  orgId: string
): Promise<{ stats: CSSDOverviewStats; problemPacks: InstrumentPackRow[] }> {
  const packs = await getInstrumentPacks(orgId);
  const batches = await getSterilizationBatches(orgId);
  const problemPacks = packs.filter((p) => p.isExpired || p.expiringSoon || p.blockedFromUse);

  return simulatedLatency({
    stats: {
      totalPacks: packs.length,
      availablePacks: packs.filter((p) => p.lifecycle === "available").length,
      inUsePacks: packs.filter((p) => p.lifecycle === "in_use").length,
      problemPacks: problemPacks.length,
      batchesInCycle: batches.filter((b) => b.status === "in_cycle").length,
      batchesHeldOrFailed: batches.filter((b) => b.status === "held" || b.status === "failed").length,
    },
    problemPacks,
  });
}
