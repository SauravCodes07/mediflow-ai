export interface PatientVitals {
  heartRate: number; // BPM
  bp: string; // e.g. "124/82"
  spO2: number; // %
  temp: number; // °F
  rr: number; // breaths/min
}

export interface PatientTimelineEvent {
  time: string;
  title: string;
  description: string;
  actor: string;
  type: "admission" | "vital" | "lab" | "medication" | "consult" | "transfer";
}

export interface PatientRecord {
  id: string; // e.g. "PT-10482"
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  phone: string;
  department: "Emergency" | "Cardiology" | "General Medicine" | "Orthopedics" | "Neurology" | "Surgery" | "Pediatrics" | "ICU";
  assignedDoctor: string;
  admissionDate: string; // e.g. "10 Aug 2026"
  status: "Admitted" | "Discharged" | "Critical" | "Under Observation" | "Scheduled";
  vitals: PatientVitals;
  vitalsStatus: "Normal" | "Warning" | "Critical";
  roomBed: string; // e.g. "Ward A - Bed 04"
  emergencyContact: string;
  timeline: PatientTimelineEvent[];
}

export const DEMO_PATIENTS_LIST: PatientRecord[] = [
  {
    id: "PT-10482",
    name: "Ravi Deshmukh",
    age: 46,
    gender: "Male",
    phone: "+91 98201 44521",
    department: "Cardiology",
    assignedDoctor: "Dr. Anika Rao",
    admissionDate: "10 Aug 2026",
    status: "Admitted",
    vitals: { heartRate: 78, bp: "124/82", spO2: 98, temp: 98.4, rr: 16 },
    vitalsStatus: "Normal",
    roomBed: "Ward A - Bed 04",
    emergencyContact: "Sunita Deshmukh (Wife) - +91 98201 44522",
    timeline: [
      { time: "08:45 AM", title: "Patient Admitted", description: "Transferred from ER intake after initial cardiac evaluation.", actor: "Nurse Kevin Mathew", type: "admission" },
      { time: "09:20 AM", title: "Initial Assessment Completed", description: "12-lead ECG completed. Normal sinus rhythm recorded.", actor: "Dr. Anika Rao", type: "consult" },
      { time: "10:10 AM", title: "Blood Panels Ordered", description: "Troponin I and lipid panel sent to laboratory.", actor: "Lab Tech Suresh", type: "lab" },
      { time: "12:30 PM", title: "Medication Administered", description: "Aspirin 75mg and Atorvastatin 40mg given.", actor: "Nurse Kevin Mathew", type: "medication" },
    ],
  },
  {
    id: "PT-10483",
    name: "Priya Sharma",
    age: 32,
    gender: "Female",
    phone: "+91 98334 11209",
    department: "Emergency",
    assignedDoctor: "Dr. Rajesh Kumar",
    admissionDate: "11 Aug 2026",
    status: "Critical",
    vitals: { heartRate: 118, bp: "92/60", spO2: 91, temp: 101.2, rr: 24 },
    vitalsStatus: "Critical",
    roomBed: "ICU Suite 02",
    emergencyContact: "Vikram Sharma (Husband) - +91 98334 11210",
    timeline: [
      { time: "06:15 AM", title: "Emergency ER Intake", description: "Patient brought in with severe acute abdominal pain and high fever.", actor: "ER Response Team", type: "admission" },
      { time: "07:00 AM", title: "STAT Abdominal CT Scan", description: "Contrast CT ordered to rule out appendiceal perforation.", actor: "Dr. Rajesh Kumar", type: "consult" },
      { time: "08:30 AM", title: "Transferred to ICU Suite 02", description: "Continuous telemetry and IV antibiotic infusion initiated.", actor: "ICU Nursing Team", type: "transfer" },
    ],
  },
  {
    id: "PT-10484",
    name: "Aarav Mehta",
    age: 28,
    gender: "Male",
    phone: "+91 97112 88401",
    department: "Orthopedics",
    assignedDoctor: "Dr. Vikram Seth",
    admissionDate: "09 Aug 2026",
    status: "Under Observation",
    vitals: { heartRate: 72, bp: "118/76", spO2: 99, temp: 98.6, rr: 14 },
    vitalsStatus: "Normal",
    roomBed: "Ward B - Bed 12",
    emergencyContact: "Meena Mehta (Mother) - +91 97112 88402",
    timeline: [
      { time: "11:00 AM", title: "Post-Op Knee Arthroscopy", description: "Patient resting comfortably in Ward B after successful procedure.", actor: "Dr. Vikram Seth", type: "consult" },
      { time: "02:00 PM", title: "Physiotherapy Assessment", description: "Passive range of motion exercise plan outlined.", actor: "Physio Team", type: "consult" },
    ],
  },
  {
    id: "PT-10485",
    name: "Sneha Kulkarni",
    age: 54,
    gender: "Female",
    phone: "+91 98450 77123",
    department: "General Medicine",
    assignedDoctor: "Dr. Sana Iyer",
    admissionDate: "07 Aug 2026",
    status: "Discharged",
    vitals: { heartRate: 68, bp: "120/80", spO2: 98, temp: 98.2, rr: 15 },
    vitalsStatus: "Normal",
    roomBed: "Discharged (Home)",
    emergencyContact: "Anand Kulkarni (Husband) - +91 98450 77124",
    timeline: [
      { time: "10:00 AM", title: "Discharge Summary Signed", description: "Discharge paperwork and prescription instructions provided.", actor: "Dr. Sana Iyer", type: "consult" },
      { time: "11:30 AM", title: "Patient Escorted Out", description: "Patient discharged in stable condition.", actor: "Front Desk Staff", type: "admission" },
    ],
  },
  {
    id: "PT-10486",
    name: "Vikram Patil",
    age: 62,
    gender: "Male",
    phone: "+91 99204 33190",
    department: "Neurology",
    assignedDoctor: "Dr. S. Mukherjee",
    admissionDate: "10 Aug 2026",
    status: "Admitted",
    vitals: { heartRate: 82, bp: "138/88", spO2: 96, temp: 98.8, rr: 18 },
    vitalsStatus: "Warning",
    roomBed: "Ward C - Bed 08",
    emergencyContact: "Kavita Patil (Daughter) - +91 99204 33191",
    timeline: [
      { time: "01:15 PM", title: "Neurology Consult", description: "MRI Brain review completed for ischemic stroke follow-up.", actor: "Dr. S. Mukherjee", type: "consult" },
    ],
  },
  {
    id: "PT-10487",
    name: "Ananya Rao",
    age: 39,
    gender: "Female",
    phone: "+91 98765 43210",
    department: "Surgery",
    assignedDoctor: "Dr. Ananya Roy",
    admissionDate: "11 Aug 2026",
    status: "Scheduled",
    vitals: { heartRate: 74, bp: "122/78", spO2: 99, temp: 98.4, rr: 16 },
    vitalsStatus: "Normal",
    roomBed: "OT Prep Bay 03",
    emergencyContact: "Rohan Rao (Husband) - +91 98765 43211",
    timeline: [
      { time: "07:30 AM", title: "Pre-Op Surgical Prep", description: "NPO protocol verified and CSSD sterilised pack STZ-902 assigned.", actor: "OT Nursing Staff", type: "admission" },
    ],
  },
  {
    id: "PT-10488",
    name: "Rahul Joshi",
    age: 51,
    gender: "Male",
    phone: "+91 98112 55432",
    department: "ICU",
    assignedDoctor: "Dr. Rajesh Kumar",
    admissionDate: "08 Aug 2026",
    status: "Critical",
    vitals: { heartRate: 124, bp: "88/54", spO2: 89, temp: 102.1, rr: 28 },
    vitalsStatus: "Critical",
    roomBed: "ICU Bed 01",
    emergencyContact: "Pooja Joshi (Wife) - +91 98112 55433",
    timeline: [
      { time: "04:00 AM", title: "Sepsis Alert Triggered", description: "Broad-spectrum IV antibiotic regimen escalated.", actor: "ICU Attending Physician", type: "vital" },
    ],
  },
  {
    id: "PT-10489",
    name: "Neha Desai",
    age: 24,
    gender: "Female",
    phone: "+91 97654 11890",
    department: "Pediatrics",
    assignedDoctor: "Dr. Sana Iyer",
    admissionDate: "10 Aug 2026",
    status: "Admitted",
    vitals: { heartRate: 88, bp: "110/70", spO2: 98, temp: 99.1, rr: 20 },
    vitalsStatus: "Normal",
    roomBed: "Pediatric Ward - Bed 02",
    emergencyContact: "Sanjay Desai (Father) - +91 97654 11891",
    timeline: [
      { time: "03:45 PM", title: "Pediatric Observation", description: "IV hydration protocol running smoothly.", actor: "Nurse Kevin Mathew", type: "vital" },
    ],
  },
  {
    id: "PT-10490",
    name: "Aditya Verma",
    age: 35,
    gender: "Male",
    phone: "+91 98987 65432",
    department: "General Medicine",
    assignedDoctor: "Dr. Anika Rao",
    admissionDate: "09 Aug 2026",
    status: "Under Observation",
    vitals: { heartRate: 76, bp: "126/82", spO2: 97, temp: 98.6, rr: 16 },
    vitalsStatus: "Normal",
    roomBed: "Ward A - Bed 14",
    emergencyContact: "Divya Verma (Wife) - +91 98987 65433",
    timeline: [
      { time: "11:20 AM", title: "Routine Vitals Logged", description: "Patient reports feeling significantly better.", actor: "Nurse Staff", type: "vital" },
    ],
  },
  {
    id: "PT-10491",
    name: "Kavya Nair",
    age: 41,
    gender: "Female",
    phone: "+91 98223 99887",
    department: "Cardiology",
    assignedDoctor: "Dr. Anika Rao",
    admissionDate: "10 Aug 2026",
    status: "Admitted",
    vitals: { heartRate: 84, bp: "132/86", spO2: 96, temp: 98.4, rr: 17 },
    vitalsStatus: "Warning",
    roomBed: "Ward A - Bed 09",
    emergencyContact: "Arun Nair (Husband) - +91 98223 99888",
    timeline: [
      { time: "09:00 AM", title: "Echocardiogram Completed", description: "Ejection fraction calculated at 55%.", actor: "Cardiology Lab", type: "lab" },
    ],
  },
  {
    id: "PT-10492",
    name: "Manish Agarwal",
    age: 58,
    gender: "Male",
    phone: "+91 98199 44332",
    department: "Surgery",
    assignedDoctor: "Dr. Ananya Roy",
    admissionDate: "08 Aug 2026",
    status: "Discharged",
    vitals: { heartRate: 70, bp: "122/78", spO2: 98, temp: 98.1, rr: 15 },
    vitalsStatus: "Normal",
    roomBed: "Discharged (Home)",
    emergencyContact: "Ritu Agarwal (Wife) - +91 98199 44333",
    timeline: [
      { time: "02:15 PM", title: "Post-Gallbladder Surgery Discharge", description: "Discharged with oral analgesics.", actor: "Dr. Ananya Roy", type: "consult" },
    ],
  },
  {
    id: "PT-10493",
    name: "Deepika Sen",
    age: 49,
    gender: "Female",
    phone: "+91 98311 22990",
    department: "Orthopedics",
    assignedDoctor: "Dr. Vikram Seth",
    admissionDate: "11 Aug 2026",
    status: "Scheduled",
    vitals: { heartRate: 76, bp: "124/80", spO2: 99, temp: 98.6, rr: 16 },
    vitalsStatus: "Normal",
    roomBed: "Pre-Op Room 01",
    emergencyContact: "Amit Sen (Husband) - +91 98311 22991",
    timeline: [
      { time: "08:00 AM", title: "Scheduled Hip Replacement", description: "Surgical team prepped for 01:00 PM case.", actor: "Dr. Vikram Seth", type: "admission" },
    ],
  },
];
