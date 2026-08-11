"use client";

export interface InstrumentPack {
  id: string;
  code: string;
  name: string;
  category: "General Surgery" | "Orthopedic" | "Endoscopy" | "Cardiology";
  lifecycle: "available" | "in_use" | "reprocessing" | "held" | "expired";
  statusTone: "success" | "info" | "warning" | "critical";
  expiresAt: string;
  expiryStatus: "normal" | "expiring_soon" | "expired";
  assignedRoom: string;
  lastSterilized: string;
  cyclesCount: number;
  blockedFromUse: boolean;
  operator: string;
}

export interface SterilizationBatch {
  id: string;
  batchCode: string;
  status: "in_cycle" | "released" | "held" | "failed" | "pending_qc";
  autoclaveId: string;
  autoclaveName: string;
  packCodes: string[];
  startedAt: string;
  completedAt: string | null;
  cycleMinutes: number | null;
  targetMinutes: number;
  operator: string;
  qcResult: "Passed" | "Failed" | "Pending" | "Review";
  temperature: number;
  pressure: number;
}

export interface AutoclaveMachine {
  id: string;
  name: string;
  status: "active" | "maintenance" | "idle";
  currentBatch: string | null;
  progressPct: number;
  temperature: number;
  pressure: number;
  elapsedMin: number;
  remainingMin: number;
  operator: string;
  lastService: string;
}

export const INITIAL_PACKS: InstrumentPack[] = [
  {
    id: "pack_01",
    code: "GEN-SET-02",
    name: "General Laparoscopy Set B",
    category: "General Surgery",
    lifecycle: "available",
    statusTone: "success",
    expiresAt: "2026-08-18",
    expiryStatus: "normal",
    assignedRoom: "Unassigned",
    lastSterilized: "2026-08-10",
    cyclesCount: 42,
    blockedFromUse: false,
    operator: "Dr. Anika Rao",
  },
  {
    id: "pack_02",
    code: "GEN-SET-09",
    name: "Abdominal Surgery Tray A",
    category: "General Surgery",
    lifecycle: "expired",
    statusTone: "critical",
    expiresAt: "2026-08-07",
    expiryStatus: "expired",
    assignedRoom: "Unassigned",
    lastSterilized: "2026-08-05",
    cyclesCount: 61,
    blockedFromUse: true,
    operator: "Kevin Mathew",
  },
  {
    id: "pack_03",
    code: "SCOPE-SET-07",
    name: "Flexible Endoscopy Pack",
    category: "Endoscopy",
    lifecycle: "reprocessing",
    statusTone: "warning",
    expiresAt: "2026-08-12",
    expiryStatus: "expiring_soon",
    assignedRoom: "CSSD Wash",
    lastSterilized: "2026-08-11",
    cyclesCount: 28,
    blockedFromUse: false,
    operator: "Sana Iyer",
  },
  {
    id: "pack_04",
    code: "GEN-SET-04",
    name: "Major Surgery Tool Kit",
    category: "General Surgery",
    lifecycle: "in_use",
    statusTone: "info",
    expiresAt: "2026-08-20",
    expiryStatus: "normal",
    assignedRoom: "OT 01",
    lastSterilized: "2026-08-10",
    cyclesCount: 34,
    blockedFromUse: false,
    operator: "Dr. Anika Rao",
  },
  {
    id: "pack_05",
    code: "ORTHO-SET-11",
    name: "Arthroplasty Instrument Set",
    category: "Orthopedic",
    lifecycle: "available",
    statusTone: "success",
    expiresAt: "2026-08-22",
    expiryStatus: "normal",
    assignedRoom: "OT 02",
    lastSterilized: "2026-08-09",
    cyclesCount: 52,
    blockedFromUse: false,
    operator: "Kevin Mathew",
  },
  {
    id: "pack_06",
    code: "CARD-SET-03",
    name: "Vascular Clamp Bundle",
    category: "Cardiology",
    lifecycle: "available",
    statusTone: "success",
    expiresAt: "2026-08-15",
    expiryStatus: "normal",
    assignedRoom: "Unassigned",
    lastSterilized: "2026-08-08",
    cyclesCount: 19,
    blockedFromUse: false,
    operator: "Dr. Anika Rao",
  },
  {
    id: "pack_07",
    code: "ORTHO-SET-04",
    name: "Trauma Bone Fixation Set",
    category: "Orthopedic",
    lifecycle: "held",
    statusTone: "warning",
    expiresAt: "2026-08-13",
    expiryStatus: "expiring_soon",
    assignedRoom: "CSSD Quarantine",
    lastSterilized: "2026-08-06",
    cyclesCount: 45,
    blockedFromUse: true,
    operator: "Sana Iyer",
  },
  {
    id: "pack_08",
    code: "ENDO-SET-15",
    name: "Bronchoscopy Diagnostic Pack",
    category: "Endoscopy",
    lifecycle: "available",
    statusTone: "success",
    expiresAt: "2026-08-19",
    expiryStatus: "normal",
    assignedRoom: "OT 03",
    lastSterilized: "2026-08-11",
    cyclesCount: 31,
    blockedFromUse: false,
    operator: "Kevin Mathew",
  },
];

export const INITIAL_BATCHES: SterilizationBatch[] = [
  {
    id: "bt_01",
    batchCode: "STZ-0811-A",
    status: "in_cycle",
    autoclaveId: "auto_01",
    autoclaveName: "Autoclave 01",
    packCodes: ["GEN-SET-02", "CARD-SET-03", "ENDO-SET-15"],
    startedAt: "2026-08-11T22:00:00.000Z",
    completedAt: null,
    cycleMinutes: null,
    targetMinutes: 120,
    operator: "Dr. Anika Rao",
    qcResult: "Pending",
    temperature: 134,
    pressure: 2.1,
  },
  {
    id: "bt_02",
    batchCode: "STZ-0811-B",
    status: "in_cycle",
    autoclaveId: "auto_02",
    autoclaveName: "Autoclave 02",
    packCodes: ["SCOPE-SET-07", "ORTHO-SET-11"],
    startedAt: "2026-08-11T22:25:00.000Z",
    completedAt: null,
    cycleMinutes: null,
    targetMinutes: 110,
    operator: "Kevin Mathew",
    qcResult: "Pending",
    temperature: 132,
    pressure: 2.0,
  },
  {
    id: "bt_03",
    batchCode: "STZ-0810-A",
    status: "released",
    autoclaveId: "auto_02",
    autoclaveName: "Autoclave 02",
    packCodes: ["GEN-SET-04", "ORTHO-SET-04"],
    startedAt: "2026-08-11T06:30:00.000Z",
    completedAt: "2026-08-11T08:40:00.000Z",
    cycleMinutes: 130,
    targetMinutes: 120,
    operator: "Kevin Mathew",
    qcResult: "Passed",
    temperature: 134,
    pressure: 2.1,
  },
  {
    id: "bt_04",
    batchCode: "STZ-0810-C",
    status: "held",
    autoclaveId: "auto_03",
    autoclaveName: "Autoclave 03",
    packCodes: ["ORTHO-SET-04"],
    startedAt: "2026-08-11T03:30:00.000Z",
    completedAt: "2026-08-11T05:45:00.000Z",
    cycleMinutes: 135,
    targetMinutes: 120,
    operator: "Sana Iyer",
    qcResult: "Review",
    temperature: 128,
    pressure: 1.8,
  },
  {
    id: "bt_05",
    batchCode: "STZ-0809-D",
    status: "failed",
    autoclaveId: "auto_01",
    autoclaveName: "Autoclave 01",
    packCodes: ["GEN-SET-09"],
    startedAt: "2026-08-10T01:30:00.000Z",
    completedAt: "2026-08-10T03:00:00.000Z",
    cycleMinutes: 90,
    targetMinutes: 120,
    operator: "Dr. Anika Rao",
    qcResult: "Failed",
    temperature: 121,
    pressure: 1.5,
  },
];

export const INITIAL_AUTOCLAVES: AutoclaveMachine[] = [
  {
    id: "auto_01",
    name: "Autoclave 01",
    status: "active",
    currentBatch: "STZ-0811-A",
    progressPct: 78,
    temperature: 134,
    pressure: 2.1,
    elapsedMin: 92,
    remainingMin: 28,
    operator: "Dr. Anika Rao",
    lastService: "2026-08-01",
  },
  {
    id: "auto_02",
    name: "Autoclave 02",
    status: "active",
    currentBatch: "STZ-0811-B",
    progressPct: 42,
    temperature: 132,
    pressure: 2.0,
    elapsedMin: 49,
    remainingMin: 51,
    operator: "Kevin Mathew",
    lastService: "2026-08-03",
  },
  {
    id: "auto_03",
    name: "Autoclave 03",
    status: "maintenance",
    currentBatch: null,
    progressPct: 0,
    temperature: 24,
    pressure: 0.0,
    elapsedMin: 0,
    remainingMin: 0,
    operator: "Service Team",
    lastService: "2026-07-15",
  },
];
