# Production Data Model — Step 10

This documents the data model added in Step 10 and wired for real in Step 11.
Source: `lib/data/types.ts` (shapes), `lib/data/seed.ts` (demo data),
`lib/data/queries.ts` (the only access layer pages are allowed to import from).

## Why an in-memory layer right now

The contract defers Firebase Authentication to Step 21 and doesn't mandate a
specific database. Building the real entity model and a real query-function
boundary now — instead of leaving hardcoded arrays inside page components —
means Steps 11 onward connect pages to `lib/data/queries.ts` functions whose
*signatures* won't change when a real database is wired in later. Only the
implementation inside `queries.ts` changes; every page keeps working.

**This is not a design decision to keep using in-memory data long-term.**
It is scaffolding so later steps replace one file's internals instead of
rewriting every page a second time.

## Entities

| Entity | File | Purpose |
|---|---|---|
| `Organization` | types.ts | Tenant boundary. Every other record traces back to one org. |
| `Profile` | types.ts | App-side user/staff profile. `authUid` stays `null` until Step 21 links a Firebase UID. |
| `Department` | types.ts | Admissions / Wards / OT / CSSD / Admin groupings. |
| `Ward`, `Bed` | types.ts | Physical capacity; a bed optionally holds one patient. |
| `Patient` | types.ts | Demographic/identifying record only — no diagnosis or treatment data modeled. |
| `Admission` | types.ts | **Step 11's primary entity.** One row per admission episode; readiness, consent and transfer are sub-status fields on this same episode (see below). |
| `OTRoom`, `Procedure` | types.ts | Reserved for Step 13. |
| `WorkflowEvent` | types.ts | Append-only timeline; reserved for traceability views in later steps. |
| `InstrumentPack`, `SterilizationBatch` | types.ts | Reserved for Step 14. |
| `Alert`, `Notification` | types.ts | Reserved for Step 15. |
| `ReportRun` | types.ts | Reserved for Step 17. |
| `AuditLogEntry` | types.ts | Reserved for Step 18/24. |

## Why readiness/consent/transfer live on `Admission`, not separate tables

They share one lifecycle, are always read together on the Admissions board,
and never need independent pagination or their own detail route. Splitting
them into three tables would mean three joins on every read for no query
benefit. If a future step needs a full audit trail of *changes* to any of
these fields specifically (not just their current value), that trail lives
in `WorkflowEvent` (type `readiness_changed` / `consent_changed` /
`transfer_changed`) rather than by normalizing the status fields themselves.

## Conventions

- **Timestamps**: ISO 8601 UTC strings on every record that has a lifecycle
  (`createdAt`, `admittedAt`, `updatedAt`, etc). No epoch numbers, no
  server-local time.
- **IDs**: opaque strings. Demo IDs use readable prefixes (`adm_1001`,
  `pat_1001`) purely so this file and code reviews are legible — no code
  should ever parse an ID's prefix to infer type.
- **Status fields**: closed string-literal unions (e.g. `ReadinessStatus =
  "pending" | "in_progress" | "ready" | "blocked"`), never free text, so
  every badge/filter in the UI stays exhaustive and TypeScript catches an
  unhandled status at compile time.

## Authorization boundary

Every query function in `lib/data/queries.ts` takes `orgId` as its first
argument and filters on it. `getCurrentOrgId()` is the single choke point
that currently returns the one demo org (`org_meridian`) — there is only one
tenant in this build. When Step 21 adds Firebase Authentication and real
sessions, `getCurrentOrgId()` becomes the only function that needs to change
(resolve org from the authenticated session instead of a constant); no
query function's signature or filtering logic changes. This is also where
Step 20's route-protection middleware and any future role check plug in —
both sit in front of this same choke point rather than being re-implemented
per page.

## Source of truth per dashboard metric (Admissions, Step 11)

| Metric | Computed from |
|---|---|
| Active admissions count | `getAdmissionsStats` — count of `getAdmissionsBoard` rows excluding `completed`/`cancelled` stage |
| Ready now | Same active set, filtered `readiness === "ready"` |
| Blocked | Same active set, filtered `readiness === "blocked"` OR `stage === "cancelled"` |
| Consent pending | Same active set, filtered `consent` in `not_started` / `pending_signature` |

Stat cards never compute their own numbers from a separate query — they all
derive from the same `getAdmissionsBoard` result the table renders, so the
counts and the rows on screen can never disagree. Later dashboards (Step 16
Analytics, Step 9 Dashboard home) that need an "admissions today" figure
must call `getAdmissionsBoard`/`getAdmissionsStats` rather than
re-deriving the count from a different path.

## What Step 11 connected

- `app/(dashboard)/admissions/page.tsx` — real server-rendered data via
  `getAdmissionsBoard` + `getAdmissionsStats`.
- `app/(dashboard)/admissions/AdmissionsBoard.tsx` — client component:
  search (patient/MRN/department/ward), readiness filter, sort, blocker
  visual treatment (row highlight + inline delay reason), patient detail
  navigation (`/patients/[id]`, still a Step 9 shell — Step 11 only wires
  the link, not the detail page).
- `app/(dashboard)/admissions/loading.tsx` — route-level skeleton matching
  the final layout (stat cards + filter bar + table rows).
- `app/(dashboard)/admissions/error.tsx` — route-level error boundary; logs
  only `error.digest`/`error.message`, never patient data.
- Empty states: no admissions at all, vs. no admissions matching the
  current filters (with a "clear filters" action) — these are two distinct
  messages, not one generic empty state.

All patient/admission data in `lib/data/seed.ts` is synthetic demo data,
clearly labeled as such in that file's header comment, per the contract's
requirement that no unlabeled fake production metric ship.

## Source of truth per dashboard metric (Wards + Patient Workflow, Step 12)

| Metric | Computed from |
|---|---|
| Per-ward occupancy % | `getWardsOverview` — `occupied` bed count / `totalBeds`, rounded. Same bed list renders in the bed grid below the number, so they can't disagree. |
| Overall occupancy % | Wards page sums `totalBeds`/`occupied` across all `getWardsOverview` rows — not a separate query. |
| Beds available / blocked | Same `getWardsOverview` bed list, filtered by `status`. |
| Transfer queue count | `getTransferQueue` — `Admission` rows where `transfer` is `requested` or `in_transit`, org-scoped. The per-ward "in transfer" count on each ward card and the cross-ward queue table both read this one function. |
| Operational blockers (Wards) | Two sources combined, both already shown elsewhere so nothing is invented here: beds with `status === "blocked"` (from `getWardsOverview`), and admissions with `readiness === "blocked"` grouped by ward (`blockedAdmissionsCount`, same field the Admissions board's "Blocked" stat uses). |
| Workflow timeline | `getPatientWorkflowTimeline` — `WorkflowEvent` rows joined to their parent `Admission` and `Patient`. Every event traces back to a real Admission record; the timeline narrates the same `stage`/`readiness`/`consent`/`transfer` transitions visible on the Admissions board, it does not maintain an independent narrative. |
| Blocker events (timeline) | `WorkflowTimelineEntry.isBlocker` — `true` when the event message describes a blocked state, so the timeline's red-dot treatment lines up with the same blocked admissions counted above. |

## What Step 12 connected

- `app/(dashboard)/wards/page.tsx` + `WardsBoard.tsx` — real ward occupancy
  (`getWardsOverview`), bed-level status grid, patient assignment shown per
  occupied bed (links to `/patients/[id]`), cross-ward transfer queue
  (`getTransferQueue`), combined blocker list, search across ward/bed/patient,
  loading skeleton and error boundary matching the Step 11 pattern.
- `app/(dashboard)/patient-workflow/page.tsx` + `WorkflowTimeline.tsx` — a
  single cross-patient timeline (`getPatientWorkflowTimeline`) with search
  and event-type filter, blocker events visually distinguished, loading
  skeleton and error boundary.
- `lib/data/seed.ts` — added a third ward (`ward_c`), more beds, two more
  patients to fill them, and `DEMO_WORKFLOW_EVENTS`: every event traces back
  to one of the eight existing Step 11 admissions so the timeline can never
  contradict the Admissions board. No new entity types were needed — `Ward`,
  `Bed` and `WorkflowEvent` were already fully modeled in Step 10.

## Source of truth per dashboard metric (Operating Theatre, Step 13)

| Metric | Computed from |
|---|---|
| Room status (available/preparation/in_procedure/turnover/closed) | `getOTRooms` — the seeded `OTRoom.status`, joined with whichever `Procedure` currently occupies that room (`actualEnd === null` and not `available`). The OT overview cards and the Command Dashboard's "rooms available" count both read this one function. |
| Active procedures | `getOTDashboard`, filtered from `getOTSchedule` where `stage` is `procedure` or `in_room` — the same rows rendered in the "Current active procedures" list. |
| Upcoming procedures | Same `getOTSchedule` result, filtered to `preparation`/`ready`. |
| Critical delays | Same `getOTSchedule` result, filtered to `isDelayed` (i.e. `delayReason !== null`) — the OT Schedule table's red-row highlighting and the dashboard's "Critical delays" list read the identical flag. |
| Room utilization % | `getOTDashboard` — `(roomsTotal − roomsAvailable) / roomsTotal`, derived from the same `getOTRooms` result shown on the OT overview page. |
| Procedure timeline (case detail) | `getProcedureDetail` — `WorkflowEvent` rows with `entityType: "procedure"` matching the case id, same append-only event log Step 12 established for admissions. |

## What Step 13 connected

- `app/(dashboard)/ot/page.tsx` + `OTBoard.tsx` — real room status cards
  (`getOTRooms`) with the current procedure, patient, surgeon, stage and
  delay reason shown per room; links into the case detail route.
- `app/(dashboard)/ot/[id]/page.tsx` — real case detail (`getProcedureDetail`):
  status, schedule vs. actual times, delay reason, and the procedure's
  workflow timeline. Returns a real Next.js `notFound()` for an unknown
  case id rather than a placeholder page.
- `app/(dashboard)/ot/schedule/page.tsx` + `ScheduleBoard.tsx` — every
  procedure across all rooms, chronological, with a room filter and the
  same delayed-row highlighting used elsewhere.
- `app/(dashboard)/ot-dashboard/page.tsx` — the OT Command Dashboard: the
  four stats named in the contract (active procedures, upcoming, critical
  delays, room utilization) plus active/upcoming/delayed procedure lists,
  all derived from `getOTSchedule`/`getOTRooms` so nothing here is computed
  independently of the pages it links to.
- `lib/data/seed.ts` — added a third OT room (`ot_3`) and `DEMO_PROCEDURES`
  (4 cases spanning `preparation` through `turnover`, including one on-time
  and two delayed cases), plus workflow events for two of those cases.
  AI-based stage detection was intentionally **not** added — the contract
  reserves that for after Step 13, this only builds the event architecture
  that could support it later (the same `WorkflowEvent` log already used
  for admissions).

## Source of truth per dashboard metric (CSSD, Step 14)

| Metric | Computed from |
|---|---|
| Total / available / in-use packs | `getCSSDOverview`, counted from `getInstrumentPacks` by `lifecycle`. |
| Flagged / problem packs | `getInstrumentPacks` — a pack is flagged when `isExpired`, `expiringSoon` (within 72h of `expiresAt`), or `blockedFromUse` (expired, `held`, or `reprocessing`). The CSSD overview's "packs needing attention" table and its stat card count the identical set — nothing is recomputed. |
| Batches in cycle / held / failed | `getCSSDOverview`, counted from `getSterilizationBatches` by `status`. |
| Pack availability for assignment | `InstrumentPackRow.blockedFromUse` — the single flag the contract's "block use of expired/unavailable packs" rule hangs off. The Instrument Packs table renders a "Blocked from use" vs. "Available for assignment" badge straight from this flag rather than re-deriving it from lifecycle/expiry inline. |
| Batch cycle time | `getSterilizationBatches` — `completedAt − startedAt` in minutes, `null` while a batch is still `in_cycle`. |

## What Step 14 connected

- `app/(dashboard)/cssd/page.tsx` — real CSSD overview: the six stats named
  in the contract plus a "packs needing attention" table, all derived from
  `getInstrumentPacks`/`getSterilizationBatches`.
- `app/(dashboard)/cssd/instrument-packs/page.tsx` + `PacksBoard.tsx` —
  full pack inventory with a lifecycle filter, expiry display (expired /
  expiring-soon called out inline), assigned room, and an explicit
  Blocked-from-use vs. Available-for-assignment badge per row.
- `app/(dashboard)/cssd/sterilization/page.tsx` + `SterilizationBoard.tsx` —
  batch list with status, the pack codes in each batch, start/complete
  timestamps and cycle duration; held/failed batches get the same red-row
  treatment used for blockers elsewhere.
- `lib/data/seed.ts` — expanded `DEMO_INSTRUMENT_PACKS` from 2 to 6 packs so
  every `PackLifecycle` state (including `expired` and `held`) has a real
  example, and added `DEMO_STERILIZATION_BATCHES` (4 batches spanning
  `released`, `in_cycle`, `held`, `failed`), each `packIds` traceable back
  to a seeded pack so a batch never references a pack the inventory
  doesn't recognize.
- **Deliberately deferred to Step 15, per the contract:** full `Alert`
  *records* for pack problems. `Alert`/`Notification` were already typed in
  Step 10 but nothing in this build writes to them yet — CSSD instead
  exposes the same "problem" condition inline via `problemPacks` so the
  overview page is useful now without building the Alerts data model out
  of order.
