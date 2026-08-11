"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, ReactNode } from "react";
import { useAuth } from "@/lib/auth-context";

export type TimeRange = "24h" | "7d" | "30d";
export type DepartmentFilter = "all" | "Admissions" | "Wards" | "OT" | "CSSD";

export interface TimeSeriesPoint {
  label: string;
  admissions: number;
  discharges: number;
  transfers: number;
  occupancy: number;
  otUtilization: number;
  netFlow: number;
  changePct: number;
  // Department-specific labels and metric fields
  series1Label?: string;
  series2Label?: string;
  series3Label?: string;
  series1Val?: number;
  series2Val?: number;
  series3Val?: number;
}

export interface OperationalDataState {
  admissionsToday: number;
  readyAdmissions: number;
  blockedAdmissions: number;
  pendingConsent: number;
  totalBeds: number;
  occupiedBeds: number;
  availableBeds: number;
  bedOccupancyPct: number;
  otUtilizationPct: number;
  otActiveCases: number;
  otUpcomingToday: number;
  otCriticalDelays: number;
  cssdAvailabilityPct: number;
  criticalAlertsCount: number;
  patientTransfers: number;
  secondsSinceUpdate: number;
  timeRange: TimeRange;
  deptFilter: DepartmentFilter;
  setTimeRange: (range: TimeRange) => void;
  setDeptFilter: (dept: DepartmentFilter) => void;
  getTimeSeries: () => TimeSeriesPoint[];
}

function hashSeed(seedStr: string): number {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash << 5) - hash + seedStr.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

const OperationalDataContext = createContext<OperationalDataState | null>(null);

export function OperationalDataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const seed = useMemo(() => hashSeed(user?.uid || "demo_session_meridian"), [user?.uid]);

  const [timeRange, setTimeRange] = useState<TimeRange>("7d");
  const [deptFilter, setDeptFilter] = useState<DepartmentFilter>("all");
  const [secondsSinceUpdate, setSecondsSinceUpdate] = useState<number>(0);

  // Core metrics derived from seed
  const [baseAdmissions, setBaseAdmissions] = useState<number>(28 + (seed % 5) - 2);
  const [baseBedsOccupied, setBaseBedsOccupied] = useState<number>(44 + (seed % 3) - 1);
  const [baseOtUtil, setBaseOtUtil] = useState<number>(82 + (seed % 5) - 2);
  const [baseCssd, setBaseCssd] = useState<number>(96);

  // Live timer tick & controlled simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsSinceUpdate((prev) => {
        if (prev >= 18) {
          setBaseAdmissions((curr) => Math.min(35, Math.max(22, curr + (Math.random() > 0.5 ? 1 : -1))));
          setBaseBedsOccupied((curr) => Math.min(47, Math.max(40, curr + (Math.random() > 0.6 ? 1 : Math.random() < 0.4 ? -1 : 0))));
          setBaseOtUtil((curr) => Math.min(95, Math.max(70, curr + (Math.random() > 0.5 ? 2 : -2))));
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Department & Time-series dataset generator
  const getTimeSeries = (): TimeSeriesPoint[] => {
    const deptSeed = hashSeed(`${seed}_${deptFilter}_${timeRange}`);

    // X-Axis Labels based on timeRange
    let labels: string[] = [];
    if (timeRange === "24h") {
      labels = ["00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00"];
    } else if (timeRange === "30d") {
      labels = ["01", "03", "05", "07", "09", "11", "13", "15", "17", "19", "21", "23", "25", "27", "29"];
    } else {
      labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    }

    // -------------------------------------------------------------------------
    // 1. ADMISSIONS DEPARTMENT DATASET
    // -------------------------------------------------------------------------
    if (deptFilter === "Admissions") {
      return labels.map((label, idx) => {
        const s1 = Math.round(18 + Math.sin(idx + deptSeed) * 6 + (idx % 3) * 2); // Intake Rate
        const s2 = Math.round(12 + Math.cos(idx + deptSeed) * 4); // Discharges
        const s3 = Math.round(4 + (idx % 4)); // Pending Forms
        return {
          label,
          admissions: s1,
          discharges: s2,
          transfers: s3,
          occupancy: 88,
          otUtilization: 80,
          netFlow: s1 - s2,
          changePct: Math.round(((s1 - s2) / (s2 || 1)) * 100),
          series1Label: "Intake Rate",
          series2Label: "Discharges",
          series3Label: "Pending Forms",
          series1Val: s1,
          series2Val: s2,
          series3Val: s3,
        };
      });
    }

    // -------------------------------------------------------------------------
    // 2. WARDS DEPARTMENT DATASET
    // -------------------------------------------------------------------------
    if (deptFilter === "Wards") {
      return labels.map((label, idx) => {
        const s1 = Math.min(98, Math.round(82 + (idx * 2) % 12 + (deptSeed % 3))); // Occupancy %
        const s2 = Math.round(14 + (idx * 3) % 9); // Ward Transfers
        const s3 = Math.round(10 + (idx * 2) % 7); // Discharges
        return {
          label,
          admissions: s1,
          discharges: s3,
          transfers: s2,
          occupancy: s1,
          otUtilization: 78,
          netFlow: s2 - s3,
          changePct: Math.round((s2 / (s3 || 1)) * 100),
          series1Label: "Occupancy %",
          series2Label: "Ward Transfers",
          series3Label: "Discharges",
          series1Val: s1,
          series2Val: s2,
          series3Val: s3,
        };
      });
    }

    // -------------------------------------------------------------------------
    // 3. OPERATING THEATRE (OT) DEPARTMENT DATASET
    // -------------------------------------------------------------------------
    if (deptFilter === "OT") {
      return labels.map((label, idx) => {
        const s1 = Math.min(96, Math.round(72 + (idx * 4) % 22 + (deptSeed % 4))); // OT Utilization %
        const s2 = Math.round(4 + (idx % 4)); // Active Procedures
        const s3 = Math.round(18 + (idx * 5) % 15); // Turnover Latency (min)
        return {
          label,
          admissions: s1,
          discharges: s2 * 4,
          transfers: s3,
          occupancy: 85,
          otUtilization: s1,
          netFlow: s1 - 70,
          changePct: Math.round((s1 - 70)),
          series1Label: "OT Utilization %",
          series2Label: "Active Cases",
          series3Label: "Turnover Latency (min)",
          series1Val: s1,
          series2Val: s2,
          series3Val: s3,
        };
      });
    }

    // -------------------------------------------------------------------------
    // 4. CSSD STERILIZATION DEPARTMENT DATASET
    // -------------------------------------------------------------------------
    if (deptFilter === "CSSD") {
      return labels.map((label, idx) => {
        const s1 = Math.min(99, Math.round(90 + (idx * 2) % 8 + (deptSeed % 2))); // Pack Readiness %
        const s2 = Math.round(12 + (idx * 2) % 6); // Batches Processed
        const s3 = Math.round(1 + (idx % 3)); // Problem Packs
        return {
          label,
          admissions: s1,
          discharges: s2 * 3,
          transfers: s3,
          occupancy: 90,
          otUtilization: 84,
          netFlow: s1 - 85,
          changePct: Math.round((s1 - 85)),
          series1Label: "Pack Readiness %",
          series2Label: "Batches Processed",
          series3Label: "Problem Packs",
          series1Val: s1,
          series2Val: s2,
          series3Val: s3,
        };
      });
    }

    // -------------------------------------------------------------------------
    // 5. ALL DEPARTMENTS (DEFAULT HOSPITAL-WIDE DATASET)
    // -------------------------------------------------------------------------
    return labels.map((label, idx) => {
      const s1 = Math.round(20 + (idx * 3) % 12 + (deptSeed % 4)); // Admissions
      const s2 = Math.round(15 + (idx * 2) % 9); // Discharges
      const s3 = Math.round(8 + (idx % 5)); // Transfers
      return {
        label,
        admissions: s1,
        discharges: s2,
        transfers: s3,
        occupancy: 91,
        otUtilization: 82,
        netFlow: s1 - s2,
        changePct: Math.round(((s1 - s2) / (s2 || 1)) * 100),
        series1Label: "Admissions Queue",
        series2Label: "Discharges Completed",
        series3Label: "Patient Transfers",
        series1Val: s1,
        series2Val: s2,
        series3Val: s3,
      };
    });
  };

  const totalBeds = 48;
  const occupiedBeds = baseBedsOccupied;
  const availableBeds = totalBeds - occupiedBeds;
  const bedOccupancyPct = Math.round((occupiedBeds / totalBeds) * 100);

  const value: OperationalDataState = {
    admissionsToday: baseAdmissions,
    readyAdmissions: Math.max(1, baseAdmissions - 6),
    blockedAdmissions: 4,
    pendingConsent: 2,
    totalBeds,
    occupiedBeds,
    availableBeds,
    bedOccupancyPct,
    otUtilizationPct: baseOtUtil,
    otActiveCases: 4,
    otUpcomingToday: 8,
    otCriticalDelays: 1,
    cssdAvailabilityPct: baseCssd,
    criticalAlertsCount: 3,
    patientTransfers: 7,
    secondsSinceUpdate,
    timeRange,
    deptFilter,
    setTimeRange,
    setDeptFilter,
    getTimeSeries,
  };

  return (
    <OperationalDataContext.Provider value={value}>
      {children}
    </OperationalDataContext.Provider>
  );
}

export function useOperationalData() {
  const context = useContext(OperationalDataContext);
  if (!context) {
    return {
      admissionsToday: 28,
      readyAdmissions: 22,
      blockedAdmissions: 4,
      pendingConsent: 2,
      totalBeds: 48,
      occupiedBeds: 45,
      availableBeds: 3,
      bedOccupancyPct: 91,
      otUtilizationPct: 82,
      otActiveCases: 4,
      otUpcomingToday: 8,
      otCriticalDelays: 1,
      cssdAvailabilityPct: 96,
      criticalAlertsCount: 3,
      patientTransfers: 7,
      secondsSinceUpdate: 8,
      timeRange: "7d" as TimeRange,
      deptFilter: "all" as DepartmentFilter,
      setTimeRange: () => {},
      setDeptFilter: () => {},
      getTimeSeries: () => [
        { label: "Mon", admissions: 24, discharges: 18, transfers: 8, occupancy: 85, otUtilization: 76, netFlow: 6, changePct: 33, series1Label: "Admissions Queue", series2Label: "Discharges Completed", series3Label: "Patient Transfers", series1Val: 24, series2Val: 18, series3Val: 8 },
        { label: "Tue", admissions: 29, discharges: 21, transfers: 11, occupancy: 88, otUtilization: 82, netFlow: 8, changePct: 38, series1Label: "Admissions Queue", series2Label: "Discharges Completed", series3Label: "Patient Transfers", series1Val: 29, series2Val: 21, series3Val: 11 },
        { label: "Wed", admissions: 27, discharges: 23, transfers: 9, occupancy: 91, otUtilization: 85, netFlow: 4, changePct: 17, series1Label: "Admissions Queue", series2Label: "Discharges Completed", series3Label: "Patient Transfers", series1Val: 27, series2Val: 23, series3Val: 9 },
        { label: "Thu", admissions: 34, discharges: 25, transfers: 13, occupancy: 93, otUtilization: 89, netFlow: 9, changePct: 36, series1Label: "Admissions Queue", series2Label: "Discharges Completed", series3Label: "Patient Transfers", series1Val: 34, series2Val: 25, series3Val: 13 },
        { label: "Fri", admissions: 31, discharges: 27, transfers: 10, occupancy: 91, otUtilization: 84, netFlow: 4, changePct: 15, series1Label: "Admissions Queue", series2Label: "Discharges Completed", series3Label: "Patient Transfers", series1Val: 31, series2Val: 27, series3Val: 10 },
        { label: "Sat", admissions: 22, discharges: 19, transfers: 7, occupancy: 86, otUtilization: 72, netFlow: 3, changePct: 16, series1Label: "Admissions Queue", series2Label: "Discharges Completed", series3Label: "Patient Transfers", series1Val: 22, series2Val: 19, series3Val: 7 },
        { label: "Sun", admissions: 28, discharges: 24, transfers: 12, occupancy: 82, otUtilization: 65, netFlow: 4, changePct: 17, series1Label: "Admissions Queue", series2Label: "Discharges Completed", series3Label: "Patient Transfers", series1Val: 28, series2Val: 24, series3Val: 12 },
      ],
    };
  }
  return context;
}
