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
      labels = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`);
    } else if (timeRange === "30d") {
      labels = Array.from({ length: 30 }, (_, i) => String(i + 1).padStart(2, "0"));
    } else {
      labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    }

    // 1. ADMISSIONS DEPARTMENT DATASET
    if (deptFilter === "Admissions") {
      return labels.map((label, idx) => {
        const s1 = Math.round(18 + Math.sin(idx + deptSeed) * 6 + (idx % 3) * 2);
        const s2 = Math.round(12 + Math.cos(idx + deptSeed) * 4);
        const s3 = Math.round(4 + (idx % 4));
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

    // 2. WARDS DEPARTMENT DATASET
    if (deptFilter === "Wards") {
      return labels.map((label, idx) => {
        const s1 = Math.min(98, Math.round(82 + (idx * 2) % 12 + (deptSeed % 3)));
        const s2 = Math.round(14 + (idx * 3) % 9);
        const s3 = Math.round(10 + (idx * 2) % 7);
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

    // 3. OPERATING THEATRE (OT) DEPARTMENT DATASET
    if (deptFilter === "OT") {
      return labels.map((label, idx) => {
        const s1 = Math.min(96, Math.round(72 + (idx * 4) % 22 + (deptSeed % 4)));
        const s2 = Math.round(4 + (idx % 4));
        const s3 = Math.round(18 + (idx * 5) % 15);
        return {
          label,
          admissions: s1,
          discharges: s2 * 4,
          transfers: s3,
          occupancy: 85,
          otUtilization: s1,
          netFlow: s1 - 70,
          changePct: Math.round(s1 - 70),
          series1Label: "OT Utilization %",
          series2Label: "Active Cases",
          series3Label: "Turnover Latency (min)",
          series1Val: s1,
          series2Val: s2,
          series3Val: s3,
        };
      });
    }

    // 4. CSSD STERILIZATION DEPARTMENT DATASET
    if (deptFilter === "CSSD") {
      return labels.map((label, idx) => {
        const s1 = Math.min(99, Math.round(90 + (idx * 2) % 8 + (deptSeed % 2)));
        const s2 = Math.round(12 + (idx * 2) % 6);
        const s3 = Math.round(1 + (idx % 3));
        return {
          label,
          admissions: s1,
          discharges: s2 * 3,
          transfers: s3,
          occupancy: 90,
          otUtilization: 84,
          netFlow: s1 - 85,
          changePct: Math.round(s1 - 85),
          series1Label: "Pack Readiness %",
          series2Label: "Batches Processed",
          series3Label: "Problem Packs",
          series1Val: s1,
          series2Val: s2,
          series3Val: s3,
        };
      });
    }

    // 5. ALL DEPARTMENTS (DEFAULT HOSPITAL-WIDE DATASET)
    return labels.map((label, idx) => {
      const s1 = Math.round(20 + (idx * 3) % 12 + (deptSeed % 4));
      const s2 = Math.round(15 + (idx * 2) % 9);
      const s3 = Math.round(5 + (idx % 5));
      return {
        label,
        admissions: s1,
        discharges: s2,
        transfers: s3,
        occupancy: Math.round(80 + (idx % 8)),
        otUtilization: Math.round(75 + (idx % 12)),
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

  const totalBeds = 192;
  const occupiedBeds = baseBedsOccupied * 4 - 29;
  const availableBeds = totalBeds - occupiedBeds;
  const bedOccupancyPct = Math.round((occupiedBeds / totalBeds) * 100);

  const value: OperationalDataState = {
    admissionsToday: baseAdmissions,
    readyAdmissions: Math.round(baseAdmissions * 0.75),
    blockedAdmissions: Math.round(baseAdmissions * 0.15),
    pendingConsent: 3,
    totalBeds,
    occupiedBeds,
    availableBeds,
    bedOccupancyPct,
    otUtilizationPct: baseOtUtil,
    otActiveCases: 4,
    otUpcomingToday: 8,
    otCriticalDelays: 1,
    cssdAvailabilityPct: baseCssd,
    criticalAlertsCount: 2,
    patientTransfers: 17,
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
    throw new Error("useOperationalData must be used within an OperationalDataProvider");
  }
  return context;
}
