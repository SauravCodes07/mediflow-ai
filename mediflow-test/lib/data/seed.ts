/**
 * DEMO DATA — Mediflow-AI
 *
 * Everything in this file is synthetic and clearly labeled as demo data
 * per the contract's requirement that no unlabeled fake production metrics
 * ship. There is no real hospital, patient or staff behind any record here.
 *
 * This is the seed for the in-memory data layer used until Step 21+ wires
 * a real database/Firebase backend. `queries.ts` is the only file that
 * should import from here — pages must go through `queries.ts`.
 */
import type {
  Organization,
  Profile,
  Department,
  Ward,
  Bed,
  Patient,
  Admission,
  OTRoom,
  Procedure,
  InstrumentPack,
  SterilizationBatch,
  WorkflowEvent,
} from "./types";

export const DEMO_ORG: Organization = {
  id: "org_meridian",
  name: "Meridian General Hospital (Demo)",
  slug: "meridian-general-demo",
  timezone: "Asia/Kolkata",
  createdAt: "2026-01-05T08:00:00.000Z",
};

export const DEMO_PROFILES: Profile[] = [
  { id: "prf_001", orgId: DEMO_ORG.id, authUid: null, name: "Dr. Anika Rao", role: "admin", departmentId: "dep_admin", active: true, createdAt: "2026-01-06T08:00:00.000Z" },
  { id: "prf_002", orgId: DEMO_ORG.id, authUid: null, name: "Nurse Kevin Mathew", role: "front_desk", departmentId: "dep_admissions", active: true, createdAt: "2026-01-06T08:00:00.000Z" },
  { id: "prf_003", orgId: DEMO_ORG.id, authUid: null, name: "Dr. Sana Iyer", role: "clinician", departmentId: "dep_wards", active: true, createdAt: "2026-01-06T08:00:00.000Z" },
];

export const DEMO_DEPARTMENTS: Department[] = [
  { id: "dep_admissions", orgId: DEMO_ORG.id, name: "Admissions", kind: "administrative" },
  { id: "dep_wards", orgId: DEMO_ORG.id, name: "General Wards", kind: "clinical" },
  { id: "dep_ot", orgId: DEMO_ORG.id, name: "Operating Theatre", kind: "surgical" },
  { id: "dep_cssd", orgId: DEMO_ORG.id, name: "CSSD", kind: "support" },
  { id: "dep_admin", orgId: DEMO_ORG.id, name: "Hospital Administration", kind: "administrative" },
];

export const DEMO_BEDS: Bed[] = [
  { id: "bed_A1", wardId: "ward_a", label: "A-1", status: "occupied", patientId: "pat_1001" },
  { id: "bed_A2", wardId: "ward_a", label: "A-2", status: "available", patientId: null },
  { id: "bed_A3", wardId: "ward_a", label: "A-3", status: "occupied", patientId: "pat_1009" },
  { id: "bed_A4", wardId: "ward_a", label: "A-4", status: "cleaning", patientId: null },
  { id: "bed_B1", wardId: "ward_b", label: "B-1", status: "occupied", patientId: "pat_1002" },
  { id: "bed_B2", wardId: "ward_b", label: "B-2", status: "cleaning", patientId: null },
  { id: "bed_B3", wardId: "ward_b", label: "B-3", status: "available", patientId: null },
  { id: "bed_B4", wardId: "ward_b", label: "B-4", status: "blocked", patientId: null },
  { id: "bed_C1", wardId: "ward_c", label: "C-1", status: "available", patientId: null },
  { id: "bed_C2", wardId: "ward_c", label: "C-2", status: "occupied", patientId: "pat_1010" },
  { id: "bed_C3", wardId: "ward_c", label: "C-3", status: "available", patientId: null },
];

export const DEMO_WARDS: Ward[] = [
  { id: "ward_a", orgId: DEMO_ORG.id, departmentId: "dep_wards", name: "Ward A — General Medicine", bedIds: ["bed_A1", "bed_A2", "bed_A3", "bed_A4"] },
  { id: "ward_b", orgId: DEMO_ORG.id, departmentId: "dep_wards", name: "Ward B — Surgical Recovery", bedIds: ["bed_B1", "bed_B2", "bed_B3", "bed_B4"] },
  { id: "ward_c", orgId: DEMO_ORG.id, departmentId: "dep_wards", name: "Ward C — Paediatrics", bedIds: ["bed_C1", "bed_C2", "bed_C3"] },
];

export const DEMO_PATIENTS: Patient[] = [
  { id: "pat_1001", orgId: DEMO_ORG.id, mrn: "MRN-10231", name: "Ravi Deshmukh", sex: "male", age: 54, primaryWardId: "ward_a", createdAt: "2026-08-08T04:10:00.000Z" },
  { id: "pat_1002", orgId: DEMO_ORG.id, mrn: "MRN-10232", name: "Meera Joshi", sex: "female", age: 39, primaryWardId: "ward_b", createdAt: "2026-08-08T05:40:00.000Z" },
  { id: "pat_1003", orgId: DEMO_ORG.id, mrn: "MRN-10233", name: "Arjun Nair", sex: "male", age: 62, primaryWardId: null, createdAt: "2026-08-08T06:05:00.000Z" },
  { id: "pat_1004", orgId: DEMO_ORG.id, mrn: "MRN-10234", name: "Fatima Sheikh", sex: "female", age: 28, primaryWardId: null, createdAt: "2026-08-08T06:50:00.000Z" },
  { id: "pat_1005", orgId: DEMO_ORG.id, mrn: "MRN-10235", name: "Wei Chen", sex: "male", age: 71, primaryWardId: null, createdAt: "2026-08-08T07:20:00.000Z" },
  { id: "pat_1006", orgId: DEMO_ORG.id, mrn: "MRN-10236", name: "Priya Subramaniam", sex: "female", age: 45, primaryWardId: null, createdAt: "2026-08-08T07:55:00.000Z" },
  { id: "pat_1007", orgId: DEMO_ORG.id, mrn: "MRN-10237", name: "Omar Farooq", sex: "male", age: 33, primaryWardId: null, createdAt: "2026-08-08T08:30:00.000Z" },
  { id: "pat_1008", orgId: DEMO_ORG.id, mrn: "MRN-10238", name: "Lakshmi Pillai", sex: "female", age: 58, primaryWardId: null, createdAt: "2026-08-09T02:15:00.000Z" },
  { id: "pat_1009", orgId: DEMO_ORG.id, mrn: "MRN-10239", name: "Karan Malhotra", sex: "male", age: 47, primaryWardId: "ward_a", createdAt: "2026-08-07T09:00:00.000Z" },
  { id: "pat_1010", orgId: DEMO_ORG.id, mrn: "MRN-10240", name: "Ananya Bose", sex: "female", age: 9, primaryWardId: "ward_c", createdAt: "2026-08-08T10:30:00.000Z" },
];

export const DEMO_ADMISSIONS: Admission[] = [
  {
    id: "adm_1001", orgId: DEMO_ORG.id, patientId: "pat_1001", departmentId: "dep_wards", wardId: "ward_a",
    stage: "ward_assigned", readiness: "ready", consent: "signed", transfer: "completed",
    delayReason: null, admittedAt: "2026-08-08T04:15:00.000Z", targetReadyBy: "2026-08-08T09:00:00.000Z",
    updatedAt: "2026-08-08T08:40:00.000Z",
  },
  {
    id: "adm_1002", orgId: DEMO_ORG.id, patientId: "pat_1002", departmentId: "dep_wards", wardId: "ward_b",
    stage: "ready_for_procedure", readiness: "ready", consent: "signed", transfer: "completed",
    delayReason: null, admittedAt: "2026-08-08T05:45:00.000Z", targetReadyBy: "2026-08-08T10:00:00.000Z",
    updatedAt: "2026-08-08T09:30:00.000Z",
  },
  {
    id: "adm_1003", orgId: DEMO_ORG.id, patientId: "pat_1003", departmentId: "dep_admissions", wardId: null,
    stage: "assessment", readiness: "blocked", consent: "pending_signature", transfer: "not_required",
    delayReason: "Awaiting cardiology clearance before ward assignment.", admittedAt: "2026-08-08T06:10:00.000Z",
    targetReadyBy: "2026-08-08T11:00:00.000Z", updatedAt: "2026-08-09T02:05:00.000Z",
  },
  {
    id: "adm_1004", orgId: DEMO_ORG.id, patientId: "pat_1004", departmentId: "dep_admissions", wardId: null,
    stage: "registered", readiness: "pending", consent: "not_started", transfer: "not_required",
    delayReason: null, admittedAt: "2026-08-08T06:55:00.000Z", targetReadyBy: "2026-08-08T12:00:00.000Z",
    updatedAt: "2026-08-08T06:55:00.000Z",
  },
  {
    id: "adm_1005", orgId: DEMO_ORG.id, patientId: "pat_1005", departmentId: "dep_wards", wardId: null,
    stage: "assessment", readiness: "in_progress", consent: "signed", transfer: "requested",
    delayReason: null, admittedAt: "2026-08-08T07:25:00.000Z", targetReadyBy: "2026-08-08T13:00:00.000Z",
    updatedAt: "2026-08-09T01:10:00.000Z",
  },
  {
    id: "adm_1006", orgId: DEMO_ORG.id, patientId: "pat_1006", departmentId: "dep_wards", wardId: null,
    stage: "assessment", readiness: "blocked", consent: "signed", transfer: "in_transit",
    delayReason: "Ward A at capacity — holding for bed A-2 cleaning to complete.", admittedAt: "2026-08-08T08:00:00.000Z",
    targetReadyBy: "2026-08-08T12:30:00.000Z", updatedAt: "2026-08-09T03:20:00.000Z",
  },
  {
    id: "adm_1007", orgId: DEMO_ORG.id, patientId: "pat_1007", departmentId: "dep_admissions", wardId: null,
    stage: "registered", readiness: "pending", consent: "not_started", transfer: "not_required",
    delayReason: null, admittedAt: "2026-08-08T08:35:00.000Z", targetReadyBy: "2026-08-08T14:00:00.000Z",
    updatedAt: "2026-08-08T08:35:00.000Z",
  },
  {
    id: "adm_1008", orgId: DEMO_ORG.id, patientId: "pat_1008", departmentId: "dep_wards", wardId: null,
    stage: "cancelled", readiness: "pending", consent: "waived", transfer: "not_required",
    delayReason: "Patient discharged against admission — elective procedure postponed by family.",
    admittedAt: "2026-08-09T02:20:00.000Z", targetReadyBy: null, updatedAt: "2026-08-09T03:00:00.000Z",
  },
];

/** Workflow events (Step 12) — the append-only history behind the Patient
 * Workflow timeline. Each entry traces back to one of the admissions above;
 * these are not invented independently of Admissions, they narrate the same
 * `stage`/`readiness`/`consent`/`transfer` transitions already on those
 * records so the timeline can never contradict the Admissions board. */
export const DEMO_WORKFLOW_EVENTS: WorkflowEvent[] = [
  { id: "evt_0001", orgId: DEMO_ORG.id, type: "admission_created", entityType: "admission", entityId: "adm_1001", message: "Admission registered for Ravi Deshmukh.", actorProfileId: "prf_002", occurredAt: "2026-08-08T04:15:00.000Z" },
  { id: "evt_0002", orgId: DEMO_ORG.id, type: "readiness_changed", entityType: "admission", entityId: "adm_1001", message: "Readiness moved to in progress — assessment underway.", actorProfileId: "prf_003", occurredAt: "2026-08-08T06:00:00.000Z" },
  { id: "evt_0003", orgId: DEMO_ORG.id, type: "transfer_changed", entityType: "admission", entityId: "adm_1001", message: "Transfer to Ward A completed.", actorProfileId: "prf_003", occurredAt: "2026-08-08T08:20:00.000Z" },
  { id: "evt_0004", orgId: DEMO_ORG.id, type: "readiness_changed", entityType: "admission", entityId: "adm_1001", message: "Readiness marked ready — ward transfer complete.", actorProfileId: "prf_003", occurredAt: "2026-08-08T08:40:00.000Z" },

  { id: "evt_0005", orgId: DEMO_ORG.id, type: "admission_created", entityType: "admission", entityId: "adm_1002", message: "Admission registered for Meera Joshi.", actorProfileId: "prf_002", occurredAt: "2026-08-08T05:45:00.000Z" },
  { id: "evt_0006", orgId: DEMO_ORG.id, type: "consent_changed", entityType: "admission", entityId: "adm_1002", message: "Consent signed.", actorProfileId: "prf_002", occurredAt: "2026-08-08T07:00:00.000Z" },
  { id: "evt_0007", orgId: DEMO_ORG.id, type: "transfer_changed", entityType: "admission", entityId: "adm_1002", message: "Transfer to Ward B completed.", actorProfileId: "prf_003", occurredAt: "2026-08-08T09:30:00.000Z" },

  { id: "evt_0008", orgId: DEMO_ORG.id, type: "admission_created", entityType: "admission", entityId: "adm_1003", message: "Admission registered for Arjun Nair.", actorProfileId: "prf_002", occurredAt: "2026-08-08T06:10:00.000Z" },
  { id: "evt_0009", orgId: DEMO_ORG.id, type: "readiness_changed", entityType: "admission", entityId: "adm_1003", message: "Assessment started.", actorProfileId: "prf_003", occurredAt: "2026-08-08T06:30:00.000Z" },
  { id: "evt_0010", orgId: DEMO_ORG.id, type: "readiness_changed", entityType: "admission", entityId: "adm_1003", message: "Blocked — awaiting cardiology clearance before ward assignment.", actorProfileId: "prf_003", occurredAt: "2026-08-09T02:05:00.000Z" },

  { id: "evt_0011", orgId: DEMO_ORG.id, type: "admission_created", entityType: "admission", entityId: "adm_1004", message: "Admission registered for Fatima Sheikh.", actorProfileId: "prf_002", occurredAt: "2026-08-08T06:55:00.000Z" },

  { id: "evt_0012", orgId: DEMO_ORG.id, type: "admission_created", entityType: "admission", entityId: "adm_1005", message: "Admission registered for Wei Chen.", actorProfileId: "prf_002", occurredAt: "2026-08-08T07:25:00.000Z" },
  { id: "evt_0013", orgId: DEMO_ORG.id, type: "readiness_changed", entityType: "admission", entityId: "adm_1005", message: "Assessment in progress.", actorProfileId: "prf_003", occurredAt: "2026-08-08T08:10:00.000Z" },
  { id: "evt_0014", orgId: DEMO_ORG.id, type: "transfer_changed", entityType: "admission", entityId: "adm_1005", message: "Transfer requested to Ward A.", actorProfileId: "prf_003", occurredAt: "2026-08-09T01:10:00.000Z" },

  { id: "evt_0015", orgId: DEMO_ORG.id, type: "admission_created", entityType: "admission", entityId: "adm_1006", message: "Admission registered for Priya Subramaniam.", actorProfileId: "prf_002", occurredAt: "2026-08-08T08:00:00.000Z" },
  { id: "evt_0016", orgId: DEMO_ORG.id, type: "transfer_changed", entityType: "admission", entityId: "adm_1006", message: "Transfer in transit to Ward A.", actorProfileId: "prf_003", occurredAt: "2026-08-08T08:45:00.000Z" },
  { id: "evt_0017", orgId: DEMO_ORG.id, type: "readiness_changed", entityType: "admission", entityId: "adm_1006", message: "Blocked — Ward A at capacity, holding for bed A-2 cleaning to complete.", actorProfileId: "prf_003", occurredAt: "2026-08-09T03:20:00.000Z" },

  { id: "evt_0018", orgId: DEMO_ORG.id, type: "admission_created", entityType: "admission", entityId: "adm_1007", message: "Admission registered for Omar Farooq.", actorProfileId: "prf_002", occurredAt: "2026-08-08T08:35:00.000Z" },

  { id: "evt_0019", orgId: DEMO_ORG.id, type: "admission_created", entityType: "admission", entityId: "adm_1008", message: "Admission registered for Lakshmi Pillai.", actorProfileId: "prf_002", occurredAt: "2026-08-09T02:20:00.000Z" },
  { id: "evt_0020", orgId: DEMO_ORG.id, type: "readiness_changed", entityType: "admission", entityId: "adm_1008", message: "Admission cancelled — patient discharged against admission, elective procedure postponed by family.", actorProfileId: "prf_002", occurredAt: "2026-08-09T03:00:00.000Z" },

  { id: "evt_0021", orgId: DEMO_ORG.id, type: "procedure_stage_changed", entityType: "procedure", entityId: "proc_5001", message: "Case moved into OT 1 — patient in room.", actorProfileId: "prf_004", occurredAt: "2026-08-09T06:05:00.000Z" },
  { id: "evt_0022", orgId: DEMO_ORG.id, type: "pack_assigned", entityType: "instrument_pack", entityId: "pack_001", message: "Pack GEN-SET-04 assigned to OT 1.", actorProfileId: "prf_005", occurredAt: "2026-08-09T05:40:00.000Z" },
  { id: "evt_0023", orgId: DEMO_ORG.id, type: "procedure_stage_changed", entityType: "procedure", entityId: "proc_5001", message: "Procedure started — 20 min behind schedule.", actorProfileId: "prf_004", occurredAt: "2026-08-09T06:20:00.000Z" },
  { id: "evt_0024", orgId: DEMO_ORG.id, type: "procedure_stage_changed", entityType: "procedure", entityId: "proc_5002", message: "Procedure completed — room entering turnover.", actorProfileId: "prf_004", occurredAt: "2026-08-09T06:40:00.000Z" },
  { id: "evt_0025", orgId: DEMO_ORG.id, type: "procedure_stage_changed", entityType: "procedure", entityId: "proc_5004", message: "Preparation delayed — instrument pack GEN-SET-04 not yet released from sterilization.", actorProfileId: "prf_005", occurredAt: "2026-08-09T07:00:00.000Z" },
];

export const DEMO_OT_ROOMS: OTRoom[] = [
  { id: "ot_1", orgId: DEMO_ORG.id, name: "OT 1", status: "in_procedure" },
  { id: "ot_2", orgId: DEMO_ORG.id, name: "OT 2", status: "turnover" },
  { id: "ot_3", orgId: DEMO_ORG.id, name: "OT 3", status: "available" },
];

/** Procedures (Step 13). `patientId` traces back to the patients seeded
 * above — pat_1002 and pat_1005 are the two admissions already at
 * `ready_for_procedure`/`assessment`, so the OT board and the Admissions
 * board agree about who is currently in surgery. */
export const DEMO_PROCEDURES: Procedure[] = [
  {
    id: "proc_5001", orgId: DEMO_ORG.id, otRoomId: "ot_1", patientId: "pat_1002",
    name: "Laparoscopic Cholecystectomy", surgeon: "Dr. Marcus Lee", stage: "procedure",
    scheduledStart: "2026-08-09T06:00:00.000Z", scheduledEnd: "2026-08-09T08:00:00.000Z",
    actualStart: "2026-08-09T06:20:00.000Z", actualEnd: null,
    delayReason: "Case started 20 min late — prior turnover overran.",
  },
  {
    id: "proc_5002", orgId: DEMO_ORG.id, otRoomId: "ot_2", patientId: "pat_1005",
    name: "Total Knee Replacement", surgeon: "Dr. Priyanka Verma", stage: "turnover",
    scheduledStart: "2026-08-09T04:00:00.000Z", scheduledEnd: "2026-08-09T06:30:00.000Z",
    actualStart: "2026-08-09T04:05:00.000Z", actualEnd: "2026-08-09T06:40:00.000Z", delayReason: null,
  },
  {
    id: "proc_5003", orgId: DEMO_ORG.id, otRoomId: "ot_2", patientId: "pat_1001",
    name: "Inguinal Hernia Repair", surgeon: "Dr. Marcus Lee", stage: "ready",
    scheduledStart: "2026-08-09T07:30:00.000Z", scheduledEnd: "2026-08-09T09:00:00.000Z",
    actualStart: null, actualEnd: null, delayReason: null,
  },
  {
    id: "proc_5004", orgId: DEMO_ORG.id, otRoomId: "ot_3", patientId: "pat_1006",
    name: "Diagnostic Endoscopy", surgeon: "Dr. Sana Iyer", stage: "preparation",
    scheduledStart: "2026-08-09T09:00:00.000Z", scheduledEnd: "2026-08-09T09:45:00.000Z",
    actualStart: null, actualEnd: null,
    delayReason: "Instrument pack GEN-SET-04 not yet released from sterilization.",
  },
];

/** Instrument packs (Step 14). Deliberately spans every `PackLifecycle`
 * state, including an expired pack and one held out of sterilization, so
 * the "block use of expired/unavailable packs" rule has something real to
 * demonstrate against. */
export const DEMO_INSTRUMENT_PACKS: InstrumentPack[] = [
  { id: "pack_001", orgId: DEMO_ORG.id, code: "GEN-SET-04", name: "General Surgery Set 04", lifecycle: "in_use", expiresAt: "2026-08-15T00:00:00.000Z", assignedOtRoomId: "ot_1" },
  { id: "pack_002", orgId: DEMO_ORG.id, code: "ORTHO-SET-11", name: "Orthopedic Set 11", lifecycle: "returned", expiresAt: "2026-08-20T00:00:00.000Z", assignedOtRoomId: "ot_2" },
  { id: "pack_003", orgId: DEMO_ORG.id, code: "GEN-SET-02", name: "General Surgery Set 02", lifecycle: "available", expiresAt: "2026-08-12T00:00:00.000Z", assignedOtRoomId: null },
  { id: "pack_004", orgId: DEMO_ORG.id, code: "SCOPE-SET-07", name: "Endoscopy Set 07", lifecycle: "reprocessing", expiresAt: "2026-08-10T00:00:00.000Z", assignedOtRoomId: null },
  { id: "pack_005", orgId: DEMO_ORG.id, code: "ORTHO-SET-03", name: "Orthopedic Set 03", lifecycle: "held", expiresAt: "2026-08-11T00:00:00.000Z", assignedOtRoomId: null },
  { id: "pack_006", orgId: DEMO_ORG.id, code: "GEN-SET-09", name: "General Surgery Set 09", lifecycle: "expired", expiresAt: "2026-08-07T00:00:00.000Z", assignedOtRoomId: null },
];

/** Sterilization batches (Step 14). Each batch's `packIds` traces back to
 * the packs above, so a pack's lifecycle and the batch that produced it
 * never disagree. */
export const DEMO_STERILIZATION_BATCHES: SterilizationBatch[] = [
  { id: "batch_9001", orgId: DEMO_ORG.id, batchCode: "STZ-0809-A", packIds: ["pack_002", "pack_003"], status: "released", startedAt: "2026-08-09T01:00:00.000Z", completedAt: "2026-08-09T03:10:00.000Z" },
  { id: "batch_9002", orgId: DEMO_ORG.id, batchCode: "STZ-0809-B", packIds: ["pack_004"], status: "in_cycle", startedAt: "2026-08-09T06:30:00.000Z", completedAt: null },
  { id: "batch_9003", orgId: DEMO_ORG.id, batchCode: "STZ-0808-C", packIds: ["pack_005"], status: "held", startedAt: "2026-08-08T22:00:00.000Z", completedAt: "2026-08-09T00:15:00.000Z" },
  { id: "batch_9004", orgId: DEMO_ORG.id, batchCode: "STZ-0808-D", packIds: ["pack_006"], status: "failed", startedAt: "2026-08-08T20:00:00.000Z", completedAt: "2026-08-08T21:30:00.000Z" },
];

export const DEMO_ALERTS = [
  {
    id: "alt_001",
    orgId: DEMO_ORG.id,
    severity: "critical" as const,
    status: "open" as const,
    title: "Sterile Pack EXP-2451 Expiring Soon",
    description: "Pack GEN-SET-09 in CSSD expired on 2026-08-07. Immediate reprocessing or replacement required before OT assignment.",
    sourceEntityType: "instrument_pack" as const,
    sourceEntityId: "pack_006",
    assignedProfileId: "prf_001",
    createdAt: "2026-08-09T05:30:00.000Z",
    resolvedAt: null,
  },
  {
    id: "alt_002",
    orgId: DEMO_ORG.id,
    severity: "critical" as const,
    status: "open" as const,
    title: "OT 2 Surgery Delayed by 20 min",
    description: "Case proc_5001 (Laparoscopic Cholecystectomy) started late due to turnover overrun in OT 2.",
    sourceEntityType: "procedure" as const,
    sourceEntityId: "proc_5001",
    assignedProfileId: "prf_003",
    createdAt: "2026-08-09T06:20:00.000Z",
    resolvedAt: null,
  },
  {
    id: "alt_003",
    orgId: DEMO_ORG.id,
    severity: "warning" as const,
    status: "acknowledged" as const,
    title: "Patient Consent Pending — ID: P12345",
    description: "Patient Arjun Nair (pat_1003) consent signature pending for cardiology clearance.",
    sourceEntityType: "admission" as const,
    sourceEntityId: "adm_1003",
    assignedProfileId: "prf_002",
    createdAt: "2026-08-09T06:40:00.000Z",
    resolvedAt: null,
  },
  {
    id: "alt_004",
    orgId: DEMO_ORG.id,
    severity: "warning" as const,
    status: "open" as const,
    title: "Ward A Occupancy Above 80%",
    description: "General Medicine Ward A is at 75% capacity with 1 bed undergoing cleaning.",
    sourceEntityType: "ward" as const,
    sourceEntityId: "ward_a",
    assignedProfileId: null,
    createdAt: "2026-08-09T07:15:00.000Z",
    resolvedAt: null,
  },
  {
    id: "alt_005",
    orgId: DEMO_ORG.id,
    severity: "info" as const,
    status: "resolved" as const,
    title: "CSSD Sterilization Batch Completed",
    description: "Batch STZ-0809-A released successfully with 2 instrument sets.",
    sourceEntityType: "instrument_pack" as const,
    sourceEntityId: "batch_9001",
    assignedProfileId: "prf_001",
    createdAt: "2026-08-09T03:10:00.000Z",
    resolvedAt: "2026-08-09T03:30:00.000Z",
  },
];

export const DEMO_NOTIFICATIONS = [
  {
    id: "notif_001",
    orgId: DEMO_ORG.id,
    profileId: "prf_001",
    title: "Critical Alert: Sterile Pack Expired",
    body: "Pack GEN-SET-09 has expired. Please check CSSD inventory.",
    read: false,
    deepLink: "/cssd/instrument-packs",
    createdAt: "2026-08-09T05:30:00.000Z",
  },
  {
    id: "notif_002",
    orgId: DEMO_ORG.id,
    profileId: "prf_001",
    title: "OT Schedule Update",
    body: "OT 1 procedure Laparoscopic Cholecystectomy has entered in-procedure stage.",
    read: false,
    deepLink: "/ot/schedule",
    createdAt: "2026-08-09T06:20:00.000Z",
  },
  {
    id: "notif_003",
    orgId: DEMO_ORG.id,
    profileId: "prf_001",
    title: "Patient Transfer Requested",
    body: "Transfer requested for patient Wei Chen to Ward A.",
    read: true,
    deepLink: "/patient-workflow",
    createdAt: "2026-08-09T01:10:00.000Z",
  },
  {
    id: "notif_004",
    orgId: DEMO_ORG.id,
    profileId: "prf_001",
    title: "New Admission Registered",
    body: "Ravi Deshmukh admitted to Ward A — General Medicine.",
    read: true,
    deepLink: "/admissions",
    createdAt: "2026-08-08T04:15:00.000Z",
  },
];

export const DEMO_AUDIT_LOGS = [
  {
    id: "aud_001",
    orgId: DEMO_ORG.id,
    actorProfileId: "prf_001",
    action: "Alert Acknowledged",
    entityType: "alert",
    entityId: "alt_003",
    occurredAt: "2026-08-09T06:45:00.000Z",
  },
  {
    id: "aud_002",
    orgId: DEMO_ORG.id,
    actorProfileId: "prf_002",
    action: "Consent Signed",
    entityType: "admission",
    entityId: "adm_1002",
    occurredAt: "2026-08-08T07:00:00.000Z",
  },
  {
    id: "aud_003",
    orgId: DEMO_ORG.id,
    actorProfileId: "prf_003",
    action: "Procedure Stage Changed: Preparation -> Procedure",
    entityType: "procedure",
    entityId: "proc_5001",
    occurredAt: "2026-08-09T06:20:00.000Z",
  },
  {
    id: "aud_004",
    orgId: DEMO_ORG.id,
    actorProfileId: "prf_001",
    action: "Sterilization Batch Released",
    entityType: "sterilization_batch",
    entityId: "batch_9001",
    occurredAt: "2026-08-09T03:10:00.000Z",
  },
  {
    id: "aud_005",
    orgId: DEMO_ORG.id,
    actorProfileId: "prf_001",
    action: "User Created: Nurse Kevin Mathew",
    entityType: "profile",
    entityId: "prf_002",
    occurredAt: "2026-01-06T08:00:00.000Z",
  },
];

