"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, ReactNode } from "react";
import { useAuth } from "@/lib/auth-context";

export type TimeRange = "24h" | "7d" | "30d";
export type DepartmentFilter = "all" | "Admissions" | "Wards" | "OT" | "CSSD";

export interface TimeSeriesPoint {
  label: string;
  admissions: number;
  discharges: number;
  occupancy: number;
  otUtilization: number;
  netFlow: number;
  changePct: number;
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

// Simple deterministic seed hash
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

  // Core metrics derived from seed with realistic defaults
  const [baseAdmissions, setBaseAdmissions] = useState<number>(28 + (seed % 5) - 2);
  const [baseBedsOccupied, setBaseBedsOccupied] = useState<number>(44 + (seed % 3) - 1);
  const [baseOtUtil, setBaseOtUtil] = useState<number>(82 + (seed % 5) - 2);
  const [baseCssd, setBaseCssd] = useState<number>(96);

  // Live timer tick & controlled simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsSinceUpdate((prev) => {
        if (prev >= 18) {
          // Simulation tick every 18s: subtle variation
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

  // Time-series dataset generator derived from current timeRange & deptFilter
  const getTimeSeries = (): TimeSeriesPoint[] => {
    if (timeRange === "24h") {
      const hours = ["00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00"];
      return hours.map((label, idx) => {
        const factor = idx % 2 === 0 ? 1 : 1.2;
        const adm = Math.round((12 + (idx * 3) % 10) * factor);
        const dis = Math.round((8 + (idx * 2) % 8) * factor);
        return {
          label,
          admissions: adm,
          discharges: dis,
          occupancy: Math.min(98, 85 + idx * 1.5),
          otUtilization: Math.min(95, 75 + (idx % 3) * 6),
          netFlow: adm - dis,
          changePct: Math.round(((adm - dis) / (dis || 1)) * 100),
        };
      });
    }

    if (timeRange === "30d") {
      const points: TimeSeriesPoint[] = [];
      for (let i = 1; i <= 30; i += 3) {
        const adm = Math.round(18 + Math.sin(i) * 6 + (i % 4));
        const dis = Math.round(15 + Math.cos(i) * 5);
        points.push({
          label: `Day ${i}`,
          admissions: adm,
          discharges: dis,
          occupancy: Math.min(96, 82 + (i % 5) * 2),
          otUtilization: Math.min(94, 78 + (i % 4) * 3),
          netFlow: adm - dis,
          changePct: Math.round(((adm - dis) / (dis || 1)) * 100),
        });
      }
      return points;
    }

    // Default: 7d
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map((day, idx) => {
      const adm = [18, 24, 19, 28, 31, 22, 16][idx];
      const dis = [14, 18, 16, 22, 25, 18, 12][idx];
      return {
        label: day,
        admissions: adm,
        discharges: dis,
        occupancy: [85, 88, 91, 93, 91, 86, 82][idx],
        otUtilization: [76, 82, 85, 89, 84, 72, 65][idx],
        netFlow: adm - dis,
        changePct: Math.round(((adm - dis) / (dis || 1)) * 100),
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
    // Fallback safe state if accessed outside provider
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
        { label: "Mon", admissions: 18, discharges: 14, occupancy: 85, otUtilization: 76, netFlow: 4, changePct: 28 },
        { label: "Tue", admissions: 24, discharges: 18, occupancy: 88, otUtilization: 82, netFlow: 6, changePct: 33 },
        { label: "Wed", admissions: 19, discharges: 16, occupancy: 91, otUtilization: 85, netFlow: 3, changePct: 18 },
        { label: "Thu", admissions: 28, discharges: 22, occupancy: 93, otUtilization: 89, netFlow: 6, changePct: 27 },
        { label: "Fri", admissions: 31, discharges: 25, occupancy: 91, otUtilization: 84, netFlow: 6, changePct: 24 },
        { label: "Sat", admissions: 22, discharges: 18, occupancy: 86, otUtilization: 72, netFlow: 4, changePct: 22 },
        { label: "Sun", admissions: 16, discharges: 12, occupancy: 82, otUtilization: 65, netFlow: 4, changePct: 33 },
      ],
    };
  }
  return context;
}
