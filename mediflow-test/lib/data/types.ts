/**
 * Mediflow-AI — Production Data Model (Step 10)
 *
 * These types are the single source of truth for entity shape across the
 * application. Every dashboard metric, table and detail view reads through
 * `lib/data/queries.ts`, which reads through these types — nothing in the
 * UI layer should invent its own shadow shape for these entities.
 *
 * Conventions (see DATA_MODEL.md for the full write-up):
 * - All timestamps are ISO 8601 strings in UTC (`createdAt`, `updatedAt`, etc).
 * - All ids are opaque strings, human-readable prefixes for demo legibility
 *   only (e.g. "adm_1042") — never assume the prefix encodes real structure.
 * - Every record that belongs to a hospital carries `orgId` for tenant
 *   isolation. Query functions always take `orgId` as their first argument.
 * - Status fields are closed string-literal unions, never free text, so the
 *   UI can render consistent badges and the data layer can validate.
 */

export type ID = string;
export type ISODateTime = string;

/** Organizations / hospitals — the tenant boundary for every other record. */
export interface Organization {
  id: ID;
  name: string;
  slug: string;
  timezone: string;
  createdAt: ISODateTime;
}

export type UserRole = "admin" | "clinician" | "ot_staff" | "cssd_staff" | "front_desk";

/** Profiles / users — app-side profile, distinct from the auth identity that
 * Firebase Authentication will own from Step 21 onward. `authUid` is left
 * null until that step links a Firebase UID to this profile. */
export interface Profile {
  id: ID;
  orgId: ID;
  authUid: string | null;
  name: string;
  role: UserRole;
  departmentId: ID | null;
  active: boolean;
  createdAt: ISODateTime;
}

export interface Department {
  id: ID;
  orgId: ID;
  name: string;
  kind: "clinical" | "surgical" | "support" | "administrative";
}

export type BedStatus = "available" | "occupied" | "cleaning" | "blocked";

export interface Bed {
  id: ID;
  wardId: ID;
  label: string;
  status: BedStatus;
  patientId: ID | null;
}

export interface Ward {
  id: ID;
  orgId: ID;
  departmentId: ID;
  name: string;
  bedIds: ID[];
}

export type Sex = "male" | "female" | "other" | "undisclosed";

/** Patients — demographic + identifying record only. Clinical detail
 * (diagnosis, treatment) is intentionally out of scope for this build; the
 * AI assistant (Step 23) is explicitly barred from inventing clinical facts
 * that aren't modeled here. */
export interface Patient {
  id: ID;
  orgId: ID;
  mrn: string; // medical record number, org-scoped
  name: string;
  sex: Sex;
  age: number;
  primaryWardId: ID | null;
  createdAt: ISODateTime;
}

export type ReadinessStatus = "pending" | "in_progress" | "ready" | "blocked";
export type ConsentStatus = "not_started" | "pending_signature" | "signed" | "waived";
export type TransferStatus = "not_required" | "requested" | "in_transit" | "completed";

export type AdmissionStage = "registered" | "assessment" | "ward_assigned" | "ready_for_procedure" | "completed" | "cancelled";

/** Admissions / transfers — Step 11's primary entity. One row per patient
 * admission episode; readiness/consent/transfer are tracked as sub-status
 * fields on the same episode rather than separate tables, since they share
 * one lifecycle and are always read together on the Admissions board. */
export interface Admission {
  id: ID;
  orgId: ID;
  patientId: ID;
  departmentId: ID;
  wardId: ID | null;
  stage: AdmissionStage;
  readiness: ReadinessStatus;
  consent: ConsentStatus;
  transfer: TransferStatus;
  delayReason: string | null;
  admittedAt: ISODateTime;
  targetReadyBy: ISODateTime | null;
  updatedAt: ISODateTime;
}

export type OTRoomStatus = "available" | "preparation" | "in_procedure" | "turnover" | "closed";

export interface OTRoom {
  id: ID;
  orgId: ID;
  name: string;
  status: OTRoomStatus;
}

export type ProcedureStage = "preparation" | "ready" | "in_room" | "procedure" | "closing" | "turnover" | "available";

export interface Procedure {
  id: ID;
  orgId: ID;
  otRoomId: ID;
  patientId: ID;
  name: string;
  surgeon: string;
  stage: ProcedureStage;
  scheduledStart: ISODateTime;
  scheduledEnd: ISODateTime;
  actualStart: ISODateTime | null;
  actualEnd: ISODateTime | null;
  delayReason: string | null;
}

export type WorkflowEventType =
  | "admission_created"
  | "readiness_changed"
  | "consent_changed"
  | "transfer_changed"
  | "procedure_stage_changed"
  | "pack_assigned"
  | "alert_raised"
  | "alert_resolved";

/** Workflow events — the append-only timeline every "history" / traceability
 * view (patient detail, procedure timeline, pack traceability) reads from.
 * Nothing overwrites an event; state changes append a new event. */
export interface WorkflowEvent {
  id: ID;
  orgId: ID;
  type: WorkflowEventType;
  entityType: "admission" | "procedure" | "instrument_pack" | "alert";
  entityId: ID;
  message: string;
  actorProfileId: ID | null;
  occurredAt: ISODateTime;
}

export type PackLifecycle = "available" | "reserved" | "in_use" | "returned" | "reprocessing" | "held" | "expired";

export interface InstrumentPack {
  id: ID;
  orgId: ID;
  code: string;
  name: string;
  lifecycle: PackLifecycle;
  expiresAt: ISODateTime;
  assignedOtRoomId: ID | null;
}

export type SterilizationStatus = "in_cycle" | "released" | "held" | "failed";

export interface SterilizationBatch {
  id: ID;
  orgId: ID;
  batchCode: string;
  packIds: ID[];
  status: SterilizationStatus;
  startedAt: ISODateTime;
  completedAt: ISODateTime | null;
}

export type AlertSeverity = "critical" | "warning" | "info";
export type AlertStatus = "open" | "acknowledged" | "resolved" | "overdue";

export interface Alert {
  id: ID;
  orgId: ID;
  severity: AlertSeverity;
  status: AlertStatus;
  title: string;
  description: string;
  sourceEntityType: "admission" | "procedure" | "instrument_pack" | "ward";
  sourceEntityId: ID;
  assignedProfileId: ID | null;
  createdAt: ISODateTime;
  resolvedAt: ISODateTime | null;
}

export interface Notification {
  id: ID;
  orgId: ID;
  profileId: ID;
  title: string;
  body: string;
  read: boolean;
  deepLink: string;
  createdAt: ISODateTime;
}

export type ReportKind =
  | "daily_operations"
  | "ot_utilization"
  | "cssd_sterilization"
  | "admissions_readiness"
  | "alerts_bottleneck"
  | "workflow_performance"
  | "executive_monthly";

export interface ReportRun {
  id: ID;
  orgId: ID;
  kind: ReportKind;
  rangeStart: ISODateTime;
  rangeEnd: ISODateTime;
  status: "queued" | "running" | "ready" | "failed";
  requestedByProfileId: ID;
  createdAt: ISODateTime;
}

export interface AuditLogEntry {
  id: ID;
  orgId: ID;
  actorProfileId: ID | null;
  action: string;
  entityType: string;
  entityId: ID;
  occurredAt: ISODateTime;
}
