export interface OTRoomRecord {
  id: string; // e.g. "ot_01"
  name: string; // e.g. "OT 01"
  department: string; // e.g. "Cardiology"
  status: "IN PROCEDURE" | "TURNOVER" | "AVAILABLE" | "PREPARING" | "DELAYED";
  currentProcedure: string;
  surgeon: string;
  patientName: string;
  patientId: string;
  startedAt: string; // e.g. "08:40 AM"
  elapsedSeconds: number; // e.g. 5058
  expectedCompletion: string; // e.g. "10:15 AM"
  nextProcedure: string;
  nextPatient: string;
  progressPct: number; // e.g. 76
  delayMinutes: number; // 0 if on schedule
  delayReason?: string;
  roomUtilizationPct: number; // e.g. 82
  turnoverMinutes: number; // e.g. 24
  stageProgress: {
    preparation: "completed" | "active" | "pending";
    anesthesia: "completed" | "active" | "pending";
    procedure: "completed" | "active" | "pending";
    closure: "completed" | "active" | "pending";
    turnover: "completed" | "active" | "pending";
  };
}

export interface OTProcedureScheduleRecord {
  id: string;
  room: string; // "OT 01"
  procedure: string;
  patientName: string;
  surgeon: string;
  startTime: string; // e.g. "08:00 AM"
  endTime: string; // e.g. "10:15 AM"
  startHour: number; // e.g. 8.0
  durationHours: number; // e.g. 2.25
  status: "active" | "completed" | "turnover" | "delayed" | "preparing";
  preOpStatus: "Ready" | "Pending Consent" | "Lab Held";
  packCode: string; // e.g. "STZ-902"
  anesthesiaStatus: "Clear" | "In Progress" | "Pending";
}

export interface OTActivityLog {
  id: string;
  time: string;
  description: string;
  room: string;
  type: "start" | "complete" | "turnover" | "delay" | "pack";
}

export const DEMO_OT_ROOMS: OTRoomRecord[] = [
  {
    id: "ot_01",
    name: "OT 01",
    department: "Cardiology",
    status: "IN PROCEDURE",
    currentProcedure: "Laparoscopic Cholecystectomy",
    surgeon: "Dr. Marcus Lee",
    patientName: "Meera Joshi",
    patientId: "PT-10482",
    startedAt: "08:40 AM",
    elapsedSeconds: 5058, // 01:24:18
    expectedCompletion: "10:15 AM",
    nextProcedure: "CABG Surgical Procedure",
    nextPatient: "Ravi Deshmukh",
    progressPct: 76,
    delayMinutes: 0,
    roomUtilizationPct: 82,
    turnoverMinutes: 28,
    stageProgress: {
      preparation: "completed",
      anesthesia: "completed",
      procedure: "active",
      closure: "pending",
      turnover: "pending",
    },
  },
  {
    id: "ot_02",
    name: "OT 02",
    department: "Orthopedics",
    status: "DELAYED",
    currentProcedure: "Total Knee Replacement",
    surgeon: "Dr. Vikram Seth",
    patientName: "Wei Chen",
    patientId: "PT-10484",
    startedAt: "10:15 AM",
    elapsedSeconds: 2400,
    expectedCompletion: "13:30 PM",
    nextProcedure: "Hip Arthroscopy",
    nextPatient: "Aarav Mehta",
    progressPct: 45,
    delayMinutes: 20,
    delayReason: "Previous room turnover overran by 20 minutes.",
    roomUtilizationPct: 91,
    turnoverMinutes: 38,
    stageProgress: {
      preparation: "completed",
      anesthesia: "completed",
      procedure: "active",
      closure: "pending",
      turnover: "pending",
    },
  },
  {
    id: "ot_03",
    name: "OT 03",
    department: "General Surgery",
    status: "TURNOVER",
    currentProcedure: "Diagnostic Endoscopy",
    surgeon: "Dr. Ananya Roy",
    patientName: "Priya Subramaniam",
    patientId: "PT-10487",
    startedAt: "07:30 AM",
    elapsedSeconds: 7200,
    expectedCompletion: "09:30 AM",
    nextProcedure: "Inguinal Hernia Repair",
    nextPatient: "Rahul Joshi",
    progressPct: 100,
    delayMinutes: 12,
    delayReason: "Instrument pack STZ-903 awaiting CSSD sterilization release code.",
    roomUtilizationPct: 67,
    turnoverMinutes: 32,
    stageProgress: {
      preparation: "completed",
      anesthesia: "completed",
      procedure: "completed",
      closure: "completed",
      turnover: "active",
    },
  },
  {
    id: "ot_04",
    name: "OT 04",
    department: "Neurology",
    status: "PREPARING",
    currentProcedure: "Craniotomy Preparation",
    surgeon: "Dr. S. Mukherjee",
    patientName: "Aarav Mehta",
    patientId: "PT-10486",
    startedAt: "11:00 AM",
    elapsedSeconds: 600,
    expectedCompletion: "15:30 PM",
    nextProcedure: "Spinal Decompression",
    nextPatient: "Sneha Kulkarni",
    progressPct: 15,
    delayMinutes: 0,
    roomUtilizationPct: 74,
    turnoverMinutes: 22,
    stageProgress: {
      preparation: "active",
      anesthesia: "pending",
      procedure: "pending",
      closure: "pending",
      turnover: "pending",
    },
  },
  {
    id: "ot_05",
    name: "OT 05",
    department: "Pediatric Surgery",
    status: "AVAILABLE",
    currentProcedure: "Room Sanitized & Ready",
    surgeon: "Dr. Sana Iyer",
    patientName: "N/A (Ready)",
    patientId: "N/A",
    startedAt: "--:--",
    elapsedSeconds: 0,
    expectedCompletion: "13:00 PM",
    nextProcedure: "Pediatric Appendectomy",
    nextPatient: "Neha Desai",
    progressPct: 0,
    delayMinutes: 0,
    roomUtilizationPct: 76,
    turnoverMinutes: 18,
    stageProgress: {
      preparation: "pending",
      anesthesia: "pending",
      procedure: "pending",
      closure: "pending",
      turnover: "pending",
    },
  },
];

export const DEMO_SCHEDULE_PROCEDURES: OTProcedureScheduleRecord[] = [
  {
    id: "sch_01",
    room: "OT 01",
    procedure: "Laparoscopic Cholecystectomy",
    patientName: "Meera Joshi",
    surgeon: "Dr. Marcus Lee",
    startTime: "08:00 AM",
    endTime: "10:15 AM",
    startHour: 8.0,
    durationHours: 2.25,
    status: "active",
    preOpStatus: "Ready",
    packCode: "STZ-902",
    anesthesiaStatus: "Clear",
  },
  {
    id: "sch_02",
    room: "OT 01",
    procedure: "CABG Surgical Procedure",
    patientName: "Ravi Deshmukh",
    surgeon: "Dr. Marcus Lee",
    startTime: "11:00 AM",
    endTime: "15:00 PM",
    startHour: 11.0,
    durationHours: 4.0,
    status: "preparing",
    preOpStatus: "Ready",
    packCode: "STZ-908",
    anesthesiaStatus: "Clear",
  },
  {
    id: "sch_03",
    room: "OT 02",
    procedure: "Total Knee Replacement",
    patientName: "Wei Chen",
    surgeon: "Dr. Vikram Seth",
    startTime: "09:30 AM",
    endTime: "12:30 PM",
    startHour: 9.5,
    durationHours: 3.0,
    status: "delayed",
    preOpStatus: "Pending Consent",
    packCode: "STZ-884",
    anesthesiaStatus: "In Progress",
  },
  {
    id: "sch_04",
    room: "OT 03",
    procedure: "Diagnostic Endoscopy",
    patientName: "Priya Subramaniam",
    surgeon: "Dr. Ananya Roy",
    startTime: "07:30 AM",
    endTime: "09:30 AM",
    startHour: 7.5,
    durationHours: 2.0,
    status: "turnover",
    preOpStatus: "Ready",
    packCode: "STZ-903",
    anesthesiaStatus: "Clear",
  },
  {
    id: "sch_05",
    room: "OT 03",
    procedure: "Inguinal Hernia Repair",
    patientName: "Rahul Joshi",
    surgeon: "Dr. Ananya Roy",
    startTime: "10:30 AM",
    endTime: "12:30 PM",
    startHour: 10.5,
    durationHours: 2.0,
    status: "preparing",
    preOpStatus: "Ready",
    packCode: "STZ-912",
    anesthesiaStatus: "Clear",
  },
  {
    id: "sch_06",
    room: "OT 04",
    procedure: "Craniotomy Preparation",
    patientName: "Aarav Mehta",
    surgeon: "Dr. S. Mukherjee",
    startTime: "11:00 AM",
    endTime: "15:30 PM",
    startHour: 11.0,
    durationHours: 4.5,
    status: "preparing",
    preOpStatus: "Ready",
    packCode: "STZ-940",
    anesthesiaStatus: "Clear",
  },
  {
    id: "sch_07",
    room: "OT 05",
    procedure: "Pediatric Appendectomy",
    patientName: "Neha Desai",
    surgeon: "Dr. Sana Iyer",
    startTime: "13:00 PM",
    endTime: "14:45 PM",
    startHour: 13.0,
    durationHours: 1.75,
    status: "preparing",
    preOpStatus: "Ready",
    packCode: "STZ-915",
    anesthesiaStatus: "Clear",
  },
];

export const DEMO_OT_ACTIVITY_LOGS: OTActivityLog[] = [
  { id: "act_01", time: "09:42 AM", description: "OT 02 Total Knee Replacement delay escalated to surgical supervisor.", room: "OT 02", type: "delay" },
  { id: "act_02", time: "09:38 AM", description: "OT 01 turnover inspection passed; room cleared for CABG procedure.", room: "OT 01", type: "turnover" },
  { id: "act_03", time: "09:31 AM", description: "OT 03 instrument pack STZ-903 sterilization batch confirmed.", room: "OT 03", type: "pack" },
  { id: "act_04", time: "09:24 AM", description: "OT 03 Diagnostic Endoscopy closure completed.", room: "OT 03", type: "complete" },
  { id: "act_05", time: "08:40 AM", description: "OT 01 Laparoscopic Cholecystectomy started on schedule.", room: "OT 01", type: "start" },
];
