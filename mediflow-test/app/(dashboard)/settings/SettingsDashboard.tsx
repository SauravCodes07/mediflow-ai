"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { HOSPITAL_NAME } from "@/lib/config/hospital";

export type SettingsTab =
  | "all"
  | "operational"
  | "alerts"
  | "notifications"
  | "ot"
  | "wards"
  | "cssd"
  | "ai"
  | "security"
  | "system";

export interface AlertRule {
  id: string;
  condition: string;
  severity: "Normal" | "Warning" | "Critical";
  action: string;
  enabled: boolean;
}

export interface WardConfig {
  id: string;
  name: string;
  dept: string;
  capacity: number;
  occupied: number;
  warning: number;
  critical: number;
}

const STORAGE_KEY = "mediflow_operational_settings_v2";

const DEFAULT_ALERT_RULES: AlertRule[] = [
  {
    id: "rule_1",
    condition: "Ward occupancy > 80%",
    severity: "Warning",
    action: "Notify Ward Manager",
    enabled: true,
  },
  {
    id: "rule_2",
    condition: "OT turnover > 30 min",
    severity: "Warning",
    action: "Notify OT Manager",
    enabled: true,
  },
  {
    id: "rule_3",
    condition: "Critical alert unacknowledged > 15 min",
    severity: "Critical",
    action: "Escalate to Administrator",
    enabled: true,
  },
  {
    id: "rule_4",
    condition: "CSSD pack expires < 3 days",
    severity: "Warning",
    action: "Notify CSSD Supervisor",
    enabled: true,
  },
];

const DEFAULT_WARDS: WardConfig[] = [
  { id: "ward_a", name: "Ward A", dept: "General Medicine", capacity: 48, occupied: 39, warning: 80, critical: 90 },
  { id: "ward_b", name: "Ward B", dept: "Surgical ICU", capacity: 36, occupied: 22, warning: 80, critical: 90 },
  { id: "ward_c", name: "Ward C", dept: "High Dependency", capacity: 42, occupied: 38, warning: 85, critical: 95 },
];

export function SettingsDashboard() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("all");
  const [mounted, setMounted] = useState(false);

  // 1. Operational Thresholds State
  const [turnoverThreshold, setTurnoverThreshold] = useState<number>(30);
  const [wardOccupancyThreshold, setWardOccupancyThreshold] = useState<number>(80);
  const [packExpiryLeadDays, setPackExpiryLeadDays] = useState<number>(3);
  const [autoEscalateMinutes, setAutoEscalateMinutes] = useState<number>(15);

  // 2. Alert Rules State
  const [alertRules, setAlertRules] = useState<AlertRule[]>(DEFAULT_ALERT_RULES);

  // 3. Notification Matrix State
  const [channels, setChannels] = useState({
    inApp: true,
    email: true,
    sms: true,
    push: true,
  });

  const [notificationCategories, setNotificationCategories] = useState([
    { id: "critical", name: "Critical Clinical Alerts", inApp: true, email: true, sms: true, push: true },
    { id: "operational", name: "Operational Alerts", inApp: true, email: true, sms: false, push: true },
    { id: "ot", name: "OT Delays", inApp: true, email: true, sms: false, push: false },
    { id: "ward", name: "Ward Capacity", inApp: true, email: true, sms: true, push: false },
    { id: "cssd", name: "CSSD Expiry", inApp: true, email: true, sms: false, push: false },
    { id: "transfers", name: "Patient Transfers", inApp: true, email: false, sms: false, push: false },
    { id: "reports", name: "Daily Reports", inApp: false, email: true, sms: false, push: false },
    { id: "ai", name: "AI Insights", inApp: true, email: true, sms: false, push: false },
  ]);

  // 4. OT Configuration State
  const [otRooms, setOtRooms] = useState(3);
  const [otTurnoverTarget, setOtTurnoverTarget] = useState(30);
  const [otCriticalDelay, setOtCriticalDelay] = useState(20);
  const [otMaxCases, setOtMaxCases] = useState(8);
  const [otAutoDelayDetect, setOtAutoDelayDetect] = useState(true);
  const [otRealtimeMonitoring, setOtRealtimeMonitoring] = useState(true);
  const [hoveredOtRoom, setHoveredOtRoom] = useState<string | null>(null);

  // 5. Ward Capacity State
  const [wards, setWards] = useState<WardConfig[]>(DEFAULT_WARDS);

  // 6. CSSD Configuration State
  const [cssdExpiryDays, setCssdExpiryDays] = useState(3);
  const [cssdCriticalDays, setCssdCriticalDays] = useState(1);
  const [cssdCycleTimeout, setCssdCycleTimeout] = useState(45);
  const [cssdFailedEscalation, setCssdFailedEscalation] = useState("Immediately");
  const [cssdAutoclaveMonitoring, setCssdAutoclaveMonitoring] = useState(true);
  const [cssdAutoExpiryAlerts, setCssdAutoExpiryAlerts] = useState(true);

  // 7. AI Configuration State
  const [aiAssistant, setAiAssistant] = useState(true);
  const [aiOperationalInsights, setAiOperationalInsights] = useState(true);
  const [aiPredictiveAlerts, setAiPredictiveAlerts] = useState(true);
  const [aiAutoRecommendations, setAiAutoRecommendations] = useState(true);
  const [aiResponseStyle, setAiResponseStyle] = useState("Balanced");
  const [aiInsightPriority, setAiInsightPriority] = useState("Important + Critical");
  const [aiConfidenceThreshold, setAiConfidenceThreshold] = useState(85);

  // 8. Security Settings State
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [maxLoginAttempts, setMaxLoginAttempts] = useState(5);
  const [autoAccountLock, setAutoAccountLock] = useState(true);
  const [twoFactorAdmin, setTwoFactorAdmin] = useState(true);
  const [auditLogging, setAuditLogging] = useState(true);
  const [ipMonitoring, setIpMonitoring] = useState(true);
  const [passwordExpiry, setPasswordExpiry] = useState(90);

  // 9. System Configuration State
  const [hospitalName, setHospitalName] = useState(HOSPITAL_NAME);
  const [orgId] = useState("ORG-01");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [dateFormat, setDateFormat] = useState("DD MMM YYYY");
  const [timeFormat, setTimeFormat] = useState("12-hour");
  const [refreshInterval, setRefreshInterval] = useState(30);

  // UI Modals & Feedback State
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isAddRuleModalOpen, setIsAddRuleModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<AlertRule | null>(null);
  const [isAddWardModalOpen, setIsAddWardModalOpen] = useState(false);
  const [editingWard, setEditingWard] = useState<WardConfig | null>(null);
  const [isSecurityAuditModalOpen, setIsSecurityAuditModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSavedText, setLastSavedText] = useState("Just now");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Add/Edit Rule Form
  const [ruleConditionInput, setRuleConditionInput] = useState("");
  const [ruleSeverityInput, setRuleSeverityInput] = useState<"Normal" | "Warning" | "Critical">("Warning");
  const [ruleActionInput, setRuleActionInput] = useState("");

  // Add/Edit Ward Form
  const [wardNameInput, setWardNameInput] = useState("");
  const [wardDeptInput, setWardDeptInput] = useState("");
  const [wardCapInput, setWardCapInput] = useState(40);
  const [wardWarningInput, setWardWarningInput] = useState(80);
  const [wardCriticalInput, setWardCriticalInput] = useState(90);

  // Persistent Hydration
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.turnoverThreshold) setTurnoverThreshold(parsed.turnoverThreshold);
        if (parsed.wardOccupancyThreshold) setWardOccupancyThreshold(parsed.wardOccupancyThreshold);
        if (parsed.packExpiryLeadDays) setPackExpiryLeadDays(parsed.packExpiryLeadDays);
        if (parsed.autoEscalateMinutes) setAutoEscalateMinutes(parsed.autoEscalateMinutes);
        if (parsed.alertRules) setAlertRules(parsed.alertRules);
        if (parsed.channels) setChannels(parsed.channels);
        if (parsed.notificationCategories) setNotificationCategories(parsed.notificationCategories);
        if (parsed.otRooms) setOtRooms(parsed.otRooms);
        if (parsed.otTurnoverTarget) setOtTurnoverTarget(parsed.otTurnoverTarget);
        if (parsed.otCriticalDelay) setOtCriticalDelay(parsed.otCriticalDelay);
        if (parsed.otMaxCases) setOtMaxCases(parsed.otMaxCases);
        if (parsed.otAutoDelayDetect !== undefined) setOtAutoDelayDetect(parsed.otAutoDelayDetect);
        if (parsed.otRealtimeMonitoring !== undefined) setOtRealtimeMonitoring(parsed.otRealtimeMonitoring);
        if (parsed.wards) setWards(parsed.wards);
        if (parsed.cssdExpiryDays) setCssdExpiryDays(parsed.cssdExpiryDays);
        if (parsed.cssdCriticalDays) setCssdCriticalDays(parsed.cssdCriticalDays);
        if (parsed.cssdCycleTimeout) setCssdCycleTimeout(parsed.cssdCycleTimeout);
        if (parsed.cssdFailedEscalation) setCssdFailedEscalation(parsed.cssdFailedEscalation);
        if (parsed.cssdAutoclaveMonitoring !== undefined) setCssdAutoclaveMonitoring(parsed.cssdAutoclaveMonitoring);
        if (parsed.cssdAutoExpiryAlerts !== undefined) setCssdAutoExpiryAlerts(parsed.cssdAutoExpiryAlerts);
        if (parsed.aiAssistant !== undefined) setAiAssistant(parsed.aiAssistant);
        if (parsed.aiOperationalInsights !== undefined) setAiOperationalInsights(parsed.aiOperationalInsights);
        if (parsed.aiPredictiveAlerts !== undefined) setAiPredictiveAlerts(parsed.aiPredictiveAlerts);
        if (parsed.aiAutoRecommendations !== undefined) setAiAutoRecommendations(parsed.aiAutoRecommendations);
        if (parsed.aiResponseStyle) setAiResponseStyle(parsed.aiResponseStyle);
        if (parsed.aiInsightPriority) setAiInsightPriority(parsed.aiInsightPriority);
        if (parsed.aiConfidenceThreshold) setAiConfidenceThreshold(parsed.aiConfidenceThreshold);
        if (parsed.sessionTimeout) setSessionTimeout(parsed.sessionTimeout);
        if (parsed.maxLoginAttempts) setMaxLoginAttempts(parsed.maxLoginAttempts);
        if (parsed.autoAccountLock !== undefined) setAutoAccountLock(parsed.autoAccountLock);
        if (parsed.twoFactorAdmin !== undefined) setTwoFactorAdmin(parsed.twoFactorAdmin);
        if (parsed.auditLogging !== undefined) setAuditLogging(parsed.auditLogging);
        if (parsed.ipMonitoring !== undefined) setIpMonitoring(parsed.ipMonitoring);
        if (parsed.passwordExpiry) setPasswordExpiry(parsed.passwordExpiry);
        if (parsed.hospitalName) setHospitalName(parsed.hospitalName);
        if (parsed.timezone) setTimezone(parsed.timezone);
        if (parsed.dateFormat) setDateFormat(parsed.dateFormat);
        if (parsed.timeFormat) setTimeFormat(parsed.timeFormat);
        if (parsed.refreshInterval) setRefreshInterval(parsed.refreshInterval);
      }
    } catch {
      // Fallback silently if storage unavailable
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Save System Function
  const handleSaveChanges = () => {
    setSaving(true);
    const dataToSave = {
      turnoverThreshold,
      wardOccupancyThreshold,
      packExpiryLeadDays,
      autoEscalateMinutes,
      alertRules,
      channels,
      notificationCategories,
      otRooms,
      otTurnoverTarget,
      otCriticalDelay,
      otMaxCases,
      otAutoDelayDetect,
      otRealtimeMonitoring,
      wards,
      cssdExpiryDays,
      cssdCriticalDays,
      cssdCycleTimeout,
      cssdFailedEscalation,
      cssdAutoclaveMonitoring,
      cssdAutoExpiryAlerts,
      aiAssistant,
      aiOperationalInsights,
      aiPredictiveAlerts,
      aiAutoRecommendations,
      aiResponseStyle,
      aiInsightPriority,
      aiConfidenceThreshold,
      sessionTimeout,
      maxLoginAttempts,
      autoAccountLock,
      twoFactorAdmin,
      auditLogging,
      ipMonitoring,
      passwordExpiry,
      hospitalName,
      timezone,
      dateFormat,
      timeFormat,
      refreshInterval,
      savedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch {
      // storage quota error fallback
    }

    setTimeout(() => {
      setSaving(false);
      setLastSavedText("Just now");
      showToast("Settings updated successfully.");
    }, 600);
  };

  // Reset System Function
  const handleResetDefaults = () => {
    setTurnoverThreshold(30);
    setWardOccupancyThreshold(80);
    setPackExpiryLeadDays(3);
    setAutoEscalateMinutes(15);
    setAlertRules(DEFAULT_ALERT_RULES);
    setChannels({ inApp: true, email: true, sms: true, push: true });
    setNotificationCategories([
      { id: "critical", name: "Critical Clinical Alerts", inApp: true, email: true, sms: true, push: true },
      { id: "operational", name: "Operational Alerts", inApp: true, email: true, sms: false, push: true },
      { id: "ot", name: "OT Delays", inApp: true, email: true, sms: false, push: false },
      { id: "ward", name: "Ward Capacity", inApp: true, email: true, sms: true, push: false },
      { id: "cssd", name: "CSSD Expiry", inApp: true, email: true, sms: false, push: false },
      { id: "transfers", name: "Patient Transfers", inApp: true, email: false, sms: false, push: false },
      { id: "reports", name: "Daily Reports", inApp: false, email: true, sms: false, push: false },
      { id: "ai", name: "AI Insights", inApp: true, email: true, sms: false, push: false },
    ]);
    setOtRooms(3);
    setOtTurnoverTarget(30);
    setOtCriticalDelay(20);
    setOtMaxCases(8);
    setOtAutoDelayDetect(true);
    setOtRealtimeMonitoring(true);
    setWards(DEFAULT_WARDS);
    setCssdExpiryDays(3);
    setCssdCriticalDays(1);
    setCssdCycleTimeout(45);
    setCssdFailedEscalation("Immediately");
    setCssdAutoclaveMonitoring(true);
    setCssdAutoExpiryAlerts(true);
    setAiAssistant(true);
    setAiOperationalInsights(true);
    setAiPredictiveAlerts(true);
    setAiAutoRecommendations(true);
    setAiResponseStyle("Balanced");
    setAiInsightPriority("Important + Critical");
    setAiConfidenceThreshold(85);
    setSessionTimeout(30);
    setMaxLoginAttempts(5);
    setAutoAccountLock(true);
    setTwoFactorAdmin(true);
    setAuditLogging(true);
    setIpMonitoring(true);
    setPasswordExpiry(90);
    setHospitalName(HOSPITAL_NAME);
    setTimezone("Asia/Kolkata");
    setDateFormat("DD MMM YYYY");
    setTimeFormat("12-hour");
    setRefreshInterval(30);

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // storage clear fallback
    }

    setIsResetModalOpen(false);
    showToast("Settings reset to operational defaults.");
  };

  // Rule Handlers
  const handleToggleRule = (ruleId: string) => {
    setAlertRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleDeleteRule = (ruleId: string) => {
    setAlertRules((prev) => prev.filter((r) => r.id !== ruleId));
    showToast("Alert rule removed.");
  };

  const handleDuplicateRule = (rule: AlertRule) => {
    const duplicated: AlertRule = {
      ...rule,
      id: `rule_${Date.now()}`,
      condition: `${rule.condition} (Copy)`,
    };
    setAlertRules((prev) => [...prev, duplicated]);
    showToast("Alert rule duplicated.");
  };

  const handleOpenAddRuleModal = () => {
    setEditingRule(null);
    setRuleConditionInput("");
    setRuleSeverityInput("Warning");
    setRuleActionInput("");
    setIsAddRuleModalOpen(true);
  };

  const handleOpenEditRuleModal = (rule: AlertRule) => {
    setEditingRule(rule);
    setRuleConditionInput(rule.condition);
    setRuleSeverityInput(rule.severity);
    setRuleActionInput(rule.action);
    setIsAddRuleModalOpen(true);
  };

  const handleSaveRuleForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleConditionInput.trim() || !ruleActionInput.trim()) return;

    if (editingRule) {
      setAlertRules((prev) =>
        prev.map((r) =>
          r.id === editingRule.id
            ? {
                ...r,
                condition: ruleConditionInput.trim(),
                severity: ruleSeverityInput,
                action: ruleActionInput.trim(),
              }
            : r
        )
      );
      showToast("Alert rule updated.");
    } else {
      const newRule: AlertRule = {
        id: `rule_${Date.now()}`,
        condition: ruleConditionInput.trim(),
        severity: ruleSeverityInput,
        action: ruleActionInput.trim(),
        enabled: true,
      };
      setAlertRules((prev) => [...prev, newRule]);
      showToast("New alert rule created.");
    }

    setIsAddRuleModalOpen(false);
  };

  // Ward Handlers
  const handleOpenAddWardModal = () => {
    setEditingWard(null);
    setWardNameInput("");
    setWardDeptInput("");
    setWardCapInput(40);
    setWardWarningInput(80);
    setWardCriticalInput(90);
    setIsAddWardModalOpen(true);
  };

  const handleOpenEditWardModal = (w: WardConfig) => {
    setEditingWard(w);
    setWardNameInput(w.name);
    setWardDeptInput(w.dept);
    setWardCapInput(w.capacity);
    setWardWarningInput(w.warning);
    setWardCriticalInput(w.critical);
    setIsAddWardModalOpen(true);
  };

  const handleSaveWardForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wardNameInput.trim() || !wardDeptInput.trim()) return;

    if (editingWard) {
      setWards((prev) =>
        prev.map((w) =>
          w.id === editingWard.id
            ? {
                ...w,
                name: wardNameInput.trim(),
                dept: wardDeptInput.trim(),
                capacity: Number(wardCapInput),
                warning: Number(wardWarningInput),
                critical: Number(wardCriticalInput),
              }
            : w
        )
      );
      showToast("Ward capacity configuration updated.");
    } else {
      const newWard: WardConfig = {
        id: `ward_${Date.now()}`,
        name: wardNameInput.trim(),
        dept: wardDeptInput.trim(),
        capacity: Number(wardCapInput),
        occupied: Math.round(Number(wardCapInput) * 0.75),
        warning: Number(wardWarningInput),
        critical: Number(wardCriticalInput),
      };
      setWards((prev) => [...prev, newWard]);
      showToast("New ward capacity rule added.");
    }

    setIsAddWardModalOpen(false);
  };

  const handleDeleteWard = (wardId: string) => {
    setWards((prev) => prev.filter((w) => w.id !== wardId));
    showToast("Ward capacity rule removed.");
  };

  const handleToggleCategoryChannel = (catId: string, ch: "inApp" | "email" | "sms" | "push") => {
    setNotificationCategories((prev) =>
      prev.map((cat) => (cat.id === catId ? { ...cat, [ch]: !cat[ch] } : cat))
    );
  };

  if (!mounted) {
    return null;
  }

  const isTabVisible = (tabKey: SettingsTab) => {
    return activeTab === "all" || activeTab === tabKey;
  };

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto font-sans select-none pb-24 text-slate-800 dark:text-slate-100">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-[70] px-4 py-3 rounded-2xl bg-[#071B34] text-white font-bold text-xs shadow-2xl border border-cyan-400/40 flex items-center space-x-2.5 animate-in slide-in-from-top-4 duration-200">
          <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs">✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. PAGE HEADER CONTROL CENTER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#071B34] text-white border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.35)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-20 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

        <div className="space-y-2 z-10">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-semibold text-slate-400">
            <Link href="/dashboard" className="hover:text-cyan-300 transition-colors">
              Command Center
            </Link>
            <span className="text-slate-500">/</span>
            <span className="text-white font-bold">Settings</span>
          </nav>

          {/* Page Title & Subtitle */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
            Operational Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-normal leading-relaxed">
            Configure hospital-wide thresholds, alerts, workflows, security and system behavior across {hospitalName}.
          </p>

          {/* Live Status Indicator */}
          <div className="inline-flex items-center space-x-2 text-[11px] font-bold text-cyan-400 pt-1">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#18D8E8]" />
            <span>● All settings saved · Last updated: {lastSavedText}</span>
          </div>
        </div>

        {/* Top-Right Action Controls */}
        <div className="flex items-center space-x-3 z-10 w-full md:w-auto shrink-0">
          <button
            type="button"
            onClick={() => setIsResetModalOpen(true)}
            className="flex-1 md:flex-initial px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-xs sm:text-sm transition-all cursor-pointer hover:shadow-md active:scale-95"
          >
            Reset to Defaults
          </button>

          <button
            type="button"
            onClick={handleSaveChanges}
            disabled={saving}
            className="flex-1 md:flex-initial px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm shadow-[0_4px_25px_rgba(22,119,255,0.4)] transition-all cursor-pointer disabled:opacity-50 active:scale-95 flex items-center justify-center space-x-2"
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>
      </div>

      {/* 2. SETTINGS NAVIGATION TABS */}
      <div className="overflow-x-auto no-scrollbar border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center space-x-2 min-w-max">
          {[
            { id: "all", label: "All Sections", icon: "📋" },
            { id: "operational", label: "Operational", icon: "⚡" },
            { id: "alerts", label: "Alerts & Escalation", icon: "🔔" },
            { id: "notifications", label: "Notifications", icon: "📬" },
            { id: "ot", label: "OT Configuration", icon: "🔬" },
            { id: "wards", label: "Ward Capacity", icon: "🛏️" },
            { id: "cssd", label: "CSSD", icon: "🏥" },
            { id: "ai", label: "AI Configuration", icon: "✨" },
            { id: "security", label: "Security", icon: "🛡️" },
            { id: "system", label: "System", icon: "⚙️" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as SettingsTab)}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center space-x-2 cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-400/40"
                    : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300"
                }`}
              >
                <span className="text-sm">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN SETTINGS CONTENT CONTAINER */}
      <div className="space-y-8">
        
        {/* 3. OPERATIONAL THRESHOLDS CARD */}
        {isTabVisible("operational") && (
          <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-white/10 shadow-xs hover:border-blue-300/80 dark:hover:border-cyan-500/30 transition-all duration-200 space-y-6">
            <div className="border-b border-slate-100 dark:border-white/10 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Operational Alert Thresholds
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  Set baseline parameters for automated hospital operational warning alerts
                </p>
              </div>
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[11px]">
                  ● Live Guardrails Active
                </span>
              </div>
            </div>

            {/* Compact 2-Column Settings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Row 1: OT Turnover Alert */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3.5 hover:border-blue-400 dark:hover:border-cyan-500/50 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white block">OT Turnover Alert</span>
                    <span className="text-[11px] text-slate-500">Max allowed turnover duration</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setTurnoverThreshold(Math.max(10, turnoverThreshold - 5))}
                      className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 font-bold text-sm hover:bg-slate-100 text-slate-800 dark:text-white cursor-pointer active:scale-95"
                    >
                      −
                    </button>
                    <span className="text-xl font-extrabold text-blue-600 dark:text-cyan-400 font-mono min-w-[55px] text-center">
                      {turnoverThreshold} min
                    </span>
                    <button
                      type="button"
                      onClick={() => setTurnoverThreshold(Math.min(90, turnoverThreshold + 5))}
                      className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 font-bold text-sm hover:bg-slate-100 text-slate-800 dark:text-white cursor-pointer active:scale-95"
                    >
                      +
                    </button>
                  </div>
                </div>

                <input
                  type="range"
                  min="10"
                  max="90"
                  step="5"
                  value={turnoverThreshold}
                  onChange={(e) => setTurnoverThreshold(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Trigger a warning when room turnover exceeds this duration.
                </p>

                <div className="flex items-center justify-between text-xs font-bold p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  <div className="flex items-center space-x-1.5">
                    <span>▲ Warning</span>
                    <span>· OT turnover &gt; {turnoverThreshold} min</span>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-200/50 dark:bg-amber-900/50">Preview</span>
                </div>
              </div>

              {/* Row 2: Ward High Occupancy */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3.5 hover:border-blue-400 dark:hover:border-cyan-500/50 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white block">Ward High Occupancy</span>
                    <span className="text-[11px] text-slate-500">Bed capacity warning threshold</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setWardOccupancyThreshold(Math.max(50, wardOccupancyThreshold - 5))}
                      className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 font-bold text-sm hover:bg-slate-100 text-slate-800 dark:text-white cursor-pointer active:scale-95"
                    >
                      −
                    </button>
                    <span className="text-xl font-extrabold text-blue-600 dark:text-cyan-400 font-mono min-w-[55px] text-center">
                      {wardOccupancyThreshold}%
                    </span>
                    <button
                      type="button"
                      onClick={() => setWardOccupancyThreshold(Math.min(98, wardOccupancyThreshold + 5))}
                      className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 font-bold text-sm hover:bg-slate-100 text-slate-800 dark:text-white cursor-pointer active:scale-95"
                    >
                      +
                    </button>
                  </div>
                </div>

                <input
                  type="range"
                  min="50"
                  max="98"
                  step="1"
                  value={wardOccupancyThreshold}
                  onChange={(e) => setWardOccupancyThreshold(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Trigger a capacity warning alert when ward bed occupancy reaches or exceeds this percentage.
                </p>

                <div className="flex items-center justify-between text-xs font-bold p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  <div className="flex items-center space-x-1.5">
                    <span>▲ Warning</span>
                    <span>· Ward occupancy reaches {wardOccupancyThreshold}%</span>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-200/50 dark:bg-amber-900/50">Preview</span>
                </div>
              </div>

              {/* Row 3: CSSD Expiry Warning */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3.5 hover:border-blue-400 dark:hover:border-cyan-500/50 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white block">CSSD Pack Expiry Warning</span>
                    <span className="text-[11px] text-slate-500">Lead time before sterility loss</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setPackExpiryLeadDays(Math.max(1, packExpiryLeadDays - 1))}
                      className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 font-bold text-sm hover:bg-slate-100 text-slate-800 dark:text-white cursor-pointer active:scale-95"
                    >
                      −
                    </button>
                    <span className="text-xl font-extrabold text-blue-600 dark:text-cyan-400 font-mono min-w-[55px] text-center">
                      {packExpiryLeadDays} days
                    </span>
                    <button
                      type="button"
                      onClick={() => setPackExpiryLeadDays(Math.min(14, packExpiryLeadDays + 1))}
                      className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 font-bold text-sm hover:bg-slate-100 text-slate-800 dark:text-white cursor-pointer active:scale-95"
                    >
                      +
                    </button>
                  </div>
                </div>

                <input
                  type="range"
                  min="1"
                  max="14"
                  step="1"
                  value={packExpiryLeadDays}
                  onChange={(e) => setPackExpiryLeadDays(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Flag instrument packs as expiring soon when expiry date is within this lead window.
                </p>

                <div className="flex items-center justify-between text-xs font-bold p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  <div className="flex items-center space-x-1.5">
                    <span>▲ Warning</span>
                    <span>· Pack expires &lt; {packExpiryLeadDays} days</span>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-200/50 dark:bg-amber-900/50">Preview</span>
                </div>
              </div>

              {/* Row 4: Unacknowledged Alert Escalation */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3.5 hover:border-blue-400 dark:hover:border-cyan-500/50 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white block">Unacknowledged Escalation</span>
                    <span className="text-[11px] text-slate-500">Auto-escalation timer limit</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setAutoEscalateMinutes(Math.max(5, autoEscalateMinutes - 5))}
                      className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 font-bold text-sm hover:bg-slate-100 text-slate-800 dark:text-white cursor-pointer active:scale-95"
                    >
                      −
                    </button>
                    <span className="text-xl font-extrabold text-blue-600 dark:text-cyan-400 font-mono min-w-[55px] text-center">
                      {autoEscalateMinutes} min
                    </span>
                    <button
                      type="button"
                      onClick={() => setAutoEscalateMinutes(Math.min(60, autoEscalateMinutes + 5))}
                      className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 font-bold text-sm hover:bg-slate-100 text-slate-800 dark:text-white cursor-pointer active:scale-95"
                    >
                      +
                    </button>
                  </div>
                </div>

                <input
                  type="range"
                  min="5"
                  max="60"
                  step="5"
                  value={autoEscalateMinutes}
                  onChange={(e) => setAutoEscalateMinutes(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Escalate open critical alerts to department administrator if unacknowledged.
                </p>

                <div className="flex items-center justify-between text-xs font-bold p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                  <div className="flex items-center space-x-1.5">
                    <span>🚨 Critical</span>
                    <span>· Unacknowledged alert &gt; {autoEscalateMinutes} min</span>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-rose-200/50 dark:bg-rose-900/50">Escalate</span>
                </div>
              </div>

            </div>
          </section>
        )}

        {/* 4. ALERT RULE BUILDER */}
        {isTabVisible("alerts") && (
          <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-white/10 shadow-xs hover:border-blue-300/80 dark:hover:border-cyan-500/30 transition-all duration-200 space-y-6">
            <div className="border-b border-slate-100 dark:border-white/10 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Alert & Escalation Rules
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  Automated routing rules for clinical and operational emergency conditions
                </p>
              </div>
              <button
                type="button"
                onClick={handleOpenAddRuleModal}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer active:scale-95 flex items-center space-x-1.5"
              >
                <span>+ Add Alert Rule</span>
              </button>
            </div>

            <div className="space-y-3">
              {alertRules.map((rule) => (
                <div
                  key={rule.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    rule.enabled
                      ? "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-cyan-500/50"
                      : "bg-slate-100/60 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-60"
                  }`}
                >
                  <div className="flex items-start sm:items-center space-x-4">
                    {/* Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => handleToggleRule(rule.id)}
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                        rule.enabled ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600"
                      }`}
                      aria-label="Toggle rule status"
                    >
                      <span
                        className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                          rule.enabled ? "right-0.5" : "left-0.5"
                        }`}
                      />
                    </button>

                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white flex flex-wrap items-center gap-2">
                        <span>{rule.condition}</span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            rule.severity === "Critical"
                              ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                              : rule.severity === "Warning"
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                              : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                          }`}
                        >
                          {rule.severity}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 flex items-center space-x-1">
                        <span>→ Action:</span>
                        <span className="text-blue-600 dark:text-cyan-400 font-semibold">{rule.action}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 text-xs font-semibold self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => handleOpenEditRuleModal(rule)}
                      className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDuplicateRule(rule)}
                      className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer"
                    >
                      Duplicate
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteRule(rule.id)}
                      className="px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. NOTIFICATION SETTINGS */}
        {isTabVisible("notifications") && (
          <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-white/10 shadow-xs hover:border-blue-300/80 dark:hover:border-cyan-500/30 transition-all duration-200 space-y-6">
            <div className="border-b border-slate-100 dark:border-white/10 pb-4">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Notification Channel Routing
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Configure delivery channels across clinical alert categories
              </p>
            </div>

            {/* Channels Master Toggles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { key: "inApp", label: "In-App Notifications", icon: "🔔" },
                { key: "email", label: "Email Notifications", icon: "📧" },
                { key: "sms", label: "SMS Alerts", icon: "💬" },
                { key: "push", label: "Push Notifications", icon: "📱" },
              ].map((ch) => {
                const isChEnabled = channels[ch.key as keyof typeof channels];
                return (
                  <div
                    key={ch.key}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 dark:text-white">
                      <span className="text-base">{ch.icon}</span>
                      <span>{ch.label}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setChannels((prev) => ({
                          ...prev,
                          [ch.key]: !prev[ch.key as keyof typeof prev],
                        }))
                      }
                      className={`w-10 h-5.5 rounded-full transition-colors relative cursor-pointer ${
                        isChEnabled ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600"
                      }`}
                    >
                      <span
                        className={`w-4.5 h-4.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                          isChEnabled ? "right-0.5" : "left-0.5"
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Notification Matrix Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-200">
                    <th className="p-4">Notification Category</th>
                    <th className="p-4 text-center">In-App</th>
                    <th className="p-4 text-center">Email</th>
                    <th className="p-4 text-center">SMS</th>
                    <th className="p-4 text-center">Push</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-800 dark:text-slate-200">
                  {notificationCategories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                        <span>{cat.name}</span>
                      </td>
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={cat.inApp}
                          onChange={() => handleToggleCategoryChannel(cat.id, "inApp")}
                          className="w-4 h-4 accent-blue-600 cursor-pointer rounded"
                        />
                      </td>
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={cat.email}
                          onChange={() => handleToggleCategoryChannel(cat.id, "email")}
                          className="w-4 h-4 accent-blue-600 cursor-pointer rounded"
                        />
                      </td>
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={cat.sms}
                          onChange={() => handleToggleCategoryChannel(cat.id, "sms")}
                          className="w-4 h-4 accent-blue-600 cursor-pointer rounded"
                        />
                      </td>
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={cat.push}
                          onChange={() => handleToggleCategoryChannel(cat.id, "push")}
                          className="w-4 h-4 accent-blue-600 cursor-pointer rounded"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* 6. OT CONFIGURATION */}
        {isTabVisible("ot") && (
          <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-white/10 shadow-xs hover:border-blue-300/80 dark:hover:border-cyan-500/30 transition-all duration-200 space-y-6">
            <div className="border-b border-slate-100 dark:border-white/10 pb-4">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Operating Theatre Configuration
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Operating room limits, turnover targets, and live utilization monitoring
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: OT Form Controls */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Total Operating Rooms</label>
                    <input
                      type="number"
                      min="1"
                      max="12"
                      value={otRooms}
                      onChange={(e) => setOtRooms(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Default Turnover Target</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="10"
                        max="90"
                        value={otTurnoverTarget}
                        onChange={(e) => setOtTurnoverTarget(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none pr-12"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">min</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Critical Delay Threshold</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="5"
                        max="60"
                        value={otCriticalDelay}
                        onChange={(e) => setOtCriticalDelay(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none pr-12"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">min</span>
                    </div>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Max Daily Cases / Room</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={otMaxCases}
                      onChange={(e) => setOtMaxCases(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Automatic Delay Detection</span>
                    <span className="text-[11px] text-slate-500">Auto-flag procedures running overtime</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOtAutoDelayDetect(!otAutoDelayDetect)}
                    className={`w-10 h-5.5 rounded-full transition-colors relative cursor-pointer ${
                      otAutoDelayDetect ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600"
                    }`}
                  >
                    <span className={`w-4.5 h-4.5 rounded-full bg-white absolute top-0.5 transition-transform ${otAutoDelayDetect ? "right-0.5" : "left-0.5"}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Real-time Room Monitoring</span>
                    <span className="text-[11px] text-slate-500">Sync with OT telemetry sensors</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOtRealtimeMonitoring(!otRealtimeMonitoring)}
                    className={`w-10 h-5.5 rounded-full transition-colors relative cursor-pointer ${
                      otRealtimeMonitoring ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600"
                    }`}
                  >
                    <span className={`w-4.5 h-4.5 rounded-full bg-white absolute top-0.5 transition-transform ${otRealtimeMonitoring ? "right-0.5" : "left-0.5"}`} />
                  </button>
                </div>
              </div>

              {/* Right Column: Utilization Visualization */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2 mb-3">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Live OT Utilization Visualization
                    </h3>
                    <span className="text-[11px] text-cyan-500 font-bold">● Active Telemetry</span>
                  </div>

                  <div className="space-y-4 text-xs">
                    {[
                      { id: "ot1", name: "OT 01", pct: 82, color: "bg-blue-600", casesToday: 14, avgTurnover: "22 min", status: "In Operation" },
                      { id: "ot2", name: "OT 02", pct: 67, color: "bg-cyan-500", casesToday: 11, avgTurnover: "32 min", status: "Preparing" },
                      { id: "ot3", name: "OT 03", pct: 54, color: "bg-purple-600", casesToday: 9, avgTurnover: "28 min", status: "Cleaning" },
                    ].map((room) => (
                      <div
                        key={room.id}
                        onMouseEnter={() => setHoveredOtRoom(room.id)}
                        onMouseLeave={() => setHoveredOtRoom(null)}
                        className="relative p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-400 transition-all cursor-default space-y-1.5"
                      >
                        <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                          <span>{room.name}</span>
                          <span className="font-mono text-blue-600 dark:text-cyan-400">{room.pct}%</span>
                        </div>
                        
                        <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                          <div className={`h-full rounded-full ${room.color}`} style={{ width: `${room.pct}%` }} />
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                          <span>Cases: {room.casesToday}</span>
                          <span>Turnover: {room.avgTurnover}</span>
                        </div>

                        {/* Interactive Tooltip */}
                        {hoveredOtRoom === room.id && (
                          <div className="absolute left-1/2 -translate-x-1/2 -top-12 bg-slate-900 text-white text-[11px] px-3 py-1.5 rounded-xl shadow-xl z-30 font-semibold whitespace-nowrap animate-in fade-in border border-cyan-400/40 flex items-center space-x-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                            <span>Room: {room.name} | Util: {room.pct}% | Cases: {room.casesToday} | Avg Turnover: {room.avgTurnover} | Status: {room.status}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 dark:text-slate-400 p-2.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900">
                  ℹ️ Hover over any OT room bar to view live telemetry breakdown and turnover statistics.
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 7. WARD CAPACITY */}
        {isTabVisible("wards") && (
          <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-white/10 shadow-xs hover:border-blue-300/80 dark:hover:border-cyan-500/30 transition-all duration-200 space-y-6">
            <div className="border-b border-slate-100 dark:border-white/10 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Ward Capacity Rules
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  Configure maximum bed capacity and high-occupancy warning limits per ward
                </p>
              </div>
              <button
                type="button"
                onClick={handleOpenAddWardModal}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer active:scale-95 flex items-center space-x-1.5"
              >
                <span>+ Add Ward</span>
              </button>
            </div>

            <div className="space-y-4">
              {wards.map((w) => {
                const pct = Math.round((w.occupied / w.capacity) * 100);
                const isCritical = pct >= w.critical;
                const isWarning = pct >= w.warning;

                return (
                  <div
                    key={w.id}
                    className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3.5 hover:border-blue-400 dark:hover:border-cyan-500/50 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-extrabold text-slate-900 dark:text-white text-base">{w.name}</span>
                          <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-bold">
                            {w.dept}
                          </span>
                        </div>
                      </div>

                      {/* Threshold Values & Edit Actions */}
                      <div className="flex items-center space-x-4 font-semibold text-slate-700 dark:text-slate-300">
                        <div className="flex items-center space-x-3 text-xs">
                          <span>Capacity: <b className="text-slate-900 dark:text-white font-mono">{w.capacity} beds</b></span>
                          <span className="text-amber-600 dark:text-amber-400">Warning: <b className="font-mono">{w.warning}%</b></span>
                          <span className="text-rose-600 dark:text-rose-400">Critical: <b className="font-mono">{w.critical}%</b></span>
                        </div>

                        <div className="flex items-center space-x-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditWardModal(w)}
                            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteWard(w.id)}
                            className="px-2 py-1 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 text-xs font-semibold border border-rose-200 dark:border-rose-800 hover:bg-rose-100 cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Capacity Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                        <span>Current Occupancy</span>
                        <span className="font-mono">
                          {w.occupied} / {w.capacity} beds ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-3.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isCritical ? "bg-rose-500" : isWarning ? "bg-amber-500" : "bg-emerald-500"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 8. CSSD CONFIGURATION */}
        {isTabVisible("cssd") && (
          <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-white/10 shadow-xs hover:border-blue-300/80 dark:hover:border-cyan-500/30 transition-all duration-200 space-y-6">
            <div className="border-b border-slate-100 dark:border-white/10 pb-4">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                CSSD Monitoring Configuration
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Central Sterile Supply Department pack lifecycle and autoclave tracking
              </p>
            </div>

            {/* Compact KPI Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-300">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Available Packs</div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono mt-1">1,420</div>
                <div className="text-[11px] font-medium mt-0.5 text-emerald-600 dark:text-emerald-400">Ready for surgery</div>
              </div>
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-blue-900 dark:text-blue-300">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 dark:text-blue-400">In Processing</div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono mt-1">18</div>
                <div className="text-[11px] font-medium mt-0.5 text-blue-600 dark:text-blue-400">Autoclave batch active</div>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-300">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400">Flagged</div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono mt-1">4</div>
                <div className="text-[11px] font-medium mt-0.5 text-amber-600 dark:text-amber-400">Expiring &lt; {cssdExpiryDays} days</div>
              </div>
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-900 dark:text-rose-300">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-rose-700 dark:text-rose-400">Failed</div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono mt-1">2</div>
                <div className="text-[11px] font-medium mt-0.5 text-rose-600 dark:text-rose-400">Requires recertification</div>
              </div>
            </div>

            {/* CSSD Config Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-4">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>Pack Expiry Warning</span>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setCssdExpiryDays(Math.max(1, cssdExpiryDays - 1))}
                      className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 font-bold hover:bg-slate-100"
                    >
                      −
                    </button>
                    <span className="text-blue-600 dark:text-cyan-400 font-mono text-sm">{cssdExpiryDays} days</span>
                    <button
                      type="button"
                      onClick={() => setCssdExpiryDays(Math.min(14, cssdExpiryDays + 1))}
                      className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 font-bold hover:bg-slate-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-bold">
                  <span>Critical Expiry</span>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setCssdCriticalDays(Math.max(1, cssdCriticalDays - 1))}
                      className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 font-bold hover:bg-slate-100"
                    >
                      −
                    </button>
                    <span className="text-rose-600 font-mono text-sm">{cssdCriticalDays} day</span>
                    <button
                      type="button"
                      onClick={() => setCssdCriticalDays(Math.min(7, cssdCriticalDays + 1))}
                      className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 font-bold hover:bg-slate-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-bold">
                  <span>Sterilization Cycle Timeout</span>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={cssdCycleTimeout}
                      onChange={(e) => setCssdCycleTimeout(Number(e.target.value))}
                      className="w-20 px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-600 text-center font-mono font-bold"
                    />
                    <span className="text-slate-500">min</span>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-4 text-xs font-semibold">
                <div>
                  <label className="block mb-1 text-slate-700 dark:text-slate-300">Failed Batch Escalation</label>
                  <select
                    value={cssdFailedEscalation}
                    onChange={(e) => setCssdFailedEscalation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="Immediately">Immediately (Instant Alert)</option>
                    <option value="15 minutes">After 15 minutes</option>
                    <option value="30 minutes">After 30 minutes</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span>Autoclave Monitoring</span>
                  <button
                    type="button"
                    onClick={() => setCssdAutoclaveMonitoring(!cssdAutoclaveMonitoring)}
                    className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                      cssdAutoclaveMonitoring ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600"
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${cssdAutoclaveMonitoring ? "right-0.5" : "left-0.5"}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span>Automatic Expiry Alerts</span>
                  <button
                    type="button"
                    onClick={() => setCssdAutoExpiryAlerts(!cssdAutoExpiryAlerts)}
                    className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                      cssdAutoExpiryAlerts ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600"
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${cssdAutoExpiryAlerts ? "right-0.5" : "left-0.5"}`} />
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 9. AI CONFIGURATION */}
        {isTabVisible("ai") && (
          <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-white/10 shadow-xs hover:border-blue-300/80 dark:hover:border-cyan-500/30 transition-all duration-200 space-y-6">
            <div className="border-b border-slate-100 dark:border-white/10 pb-4">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
                <span>Mediflow-AI Configuration</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Configure contextual AI assistant parameters, confidence thresholds, and operational insight routing
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Toggles & Dropdowns */}
              <div className="space-y-3.5 text-xs font-semibold">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-900 dark:text-white font-bold">AI Assistant</span>
                  <button
                    type="button"
                    onClick={() => setAiAssistant(!aiAssistant)}
                    className={`w-10 h-5.5 rounded-full transition-colors relative cursor-pointer ${aiAssistant ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600"}`}
                  >
                    <span className={`w-4.5 h-4.5 rounded-full bg-white absolute top-0.5 transition-transform ${aiAssistant ? "right-0.5" : "left-0.5"}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-900 dark:text-white font-bold">AI Operational Insights</span>
                  <button
                    type="button"
                    onClick={() => setAiOperationalInsights(!aiOperationalInsights)}
                    className={`w-10 h-5.5 rounded-full transition-colors relative cursor-pointer ${aiOperationalInsights ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600"}`}
                  >
                    <span className={`w-4.5 h-4.5 rounded-full bg-white absolute top-0.5 transition-transform ${aiOperationalInsights ? "right-0.5" : "left-0.5"}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-900 dark:text-white font-bold">Predictive Alerts</span>
                  <button
                    type="button"
                    onClick={() => setAiPredictiveAlerts(!aiPredictiveAlerts)}
                    className={`w-10 h-5.5 rounded-full transition-colors relative cursor-pointer ${aiPredictiveAlerts ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600"}`}
                  >
                    <span className={`w-4.5 h-4.5 rounded-full bg-white absolute top-0.5 transition-transform ${aiPredictiveAlerts ? "right-0.5" : "left-0.5"}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-900 dark:text-white font-bold">Automatic Recommendations</span>
                  <button
                    type="button"
                    onClick={() => setAiAutoRecommendations(!aiAutoRecommendations)}
                    className={`w-10 h-5.5 rounded-full transition-colors relative cursor-pointer ${aiAutoRecommendations ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600"}`}
                  >
                    <span className={`w-4.5 h-4.5 rounded-full bg-white absolute top-0.5 transition-transform ${aiAutoRecommendations ? "right-0.5" : "left-0.5"}`} />
                  </button>
                </div>
              </div>

              {/* Style & Advisory Box */}
              <div className="space-y-4 text-xs font-semibold">
                <div>
                  <label className="block mb-1 text-slate-700 dark:text-slate-300">AI Response Style</label>
                  <select
                    value={aiResponseStyle}
                    onChange={(e) => setAiResponseStyle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="Balanced">Balanced</option>
                    <option value="Concise">Concise</option>
                    <option value="Detailed">Detailed</option>
                    <option value="Clinical">Clinical</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-slate-700 dark:text-slate-300">Insight Priority</label>
                  <select
                    value={aiInsightPriority}
                    onChange={(e) => setAiInsightPriority(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="Critical Only">Critical Only</option>
                    <option value="Important + Critical">Important + Critical</option>
                    <option value="All Operational Insights">All Operational Insights</option>
                  </select>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span>AI Confidence Threshold</span>
                    <span className="text-blue-600 dark:text-cyan-400 font-mono text-sm">{aiConfidenceThreshold}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="99"
                    value={aiConfidenceThreshold}
                    onChange={(e) => setAiConfidenceThreshold(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

                {/* Information Box */}
                <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 text-blue-900 dark:text-slate-200 space-y-1.5">
                  <div className="flex items-center space-x-2 font-bold text-blue-700 dark:text-cyan-300">
                    <span className="text-base">ℹ️</span>
                    <span>Clinical Advisory Guardrail</span>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 font-normal">
                    AI recommendations are advisory in nature and require clinical or administrative review prior to operational execution.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 10. SECURITY SETTINGS */}
        {isTabVisible("security") && (
          <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-white/10 shadow-xs hover:border-blue-300/80 dark:hover:border-cyan-500/30 transition-all duration-200 space-y-6">
            <div className="border-b border-slate-100 dark:border-white/10 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Security & Access
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  Configure authentication guardrails, session timeouts, and audit logging parameters
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsSecurityAuditModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors"
              >
                Review Security Events
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-semibold">
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                  <span>Session Timeout</span>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={sessionTimeout}
                      onChange={(e) => setSessionTimeout(Number(e.target.value))}
                      className="w-16 px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-600 text-center font-mono font-bold"
                    />
                    <span className="text-slate-500">minutes</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                  <span>Maximum Login Attempts</span>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={maxLoginAttempts}
                      onChange={(e) => setMaxLoginAttempts(Number(e.target.value))}
                      className="w-16 px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-600 text-center font-mono font-bold"
                    />
                    <span className="text-slate-500">attempts</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                  <span>Password Expiry Policy</span>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={passwordExpiry}
                      onChange={(e) => setPasswordExpiry(Number(e.target.value))}
                      className="w-16 px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-600 text-center font-mono font-bold"
                    />
                    <span className="text-slate-500">days</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span>Automatic Account Lock</span>
                  <button
                    type="button"
                    onClick={() => setAutoAccountLock(!autoAccountLock)}
                    className={`w-10 h-5.5 rounded-full transition-colors relative cursor-pointer ${
                      autoAccountLock ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600"
                    }`}
                  >
                    <span className={`w-4.5 h-4.5 rounded-full bg-white absolute top-0.5 transition-transform ${autoAccountLock ? "right-0.5" : "left-0.5"}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span>Two-Factor Authentication</span>
                  <button
                    type="button"
                    onClick={() => setTwoFactorAdmin(!twoFactorAdmin)}
                    className={`w-10 h-5.5 rounded-full transition-colors relative cursor-pointer ${
                      twoFactorAdmin ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600"
                    }`}
                  >
                    <span className={`w-4.5 h-4.5 rounded-full bg-white absolute top-0.5 transition-transform ${twoFactorAdmin ? "right-0.5" : "left-0.5"}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span>Audit Logging</span>
                  <button
                    type="button"
                    onClick={() => setAuditLogging(!auditLogging)}
                    className={`w-10 h-5.5 rounded-full transition-colors relative cursor-pointer ${
                      auditLogging ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600"
                    }`}
                  >
                    <span className={`w-4.5 h-4.5 rounded-full bg-white absolute top-0.5 transition-transform ${auditLogging ? "right-0.5" : "left-0.5"}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Security Status Box */}
            <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-300 text-xs space-y-3">
              <div className="font-extrabold text-sm flex items-center space-x-2 text-emerald-800 dark:text-emerald-300">
                <span>✓</span>
                <span>Security Status Summary</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold">
                <div className="flex items-center space-x-1.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Authentication protected</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Audit logging active</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Session protection active</span>
                </div>
                <div className="flex items-center space-x-1.5 text-amber-700 dark:text-amber-400">
                  <span>⚠</span>
                  <span>2 administrators without 2FA</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 11. SYSTEM SETTINGS */}
        {isTabVisible("system") && (
          <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-white/10 shadow-xs hover:border-blue-300/80 dark:hover:border-cyan-500/30 transition-all duration-200 space-y-6">
            <div className="border-b border-slate-100 dark:border-white/10 pb-4">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                System Configuration
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Hospital identity, organization IDs, timezone, and data refresh rates
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs font-semibold">
              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1">Hospital Name</label>
                <input
                  type="text"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1">Organization ID</label>
                <input
                  type="text"
                  disabled
                  value={orgId}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono font-bold cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1">Timezone</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                  <option value="Europe/London">Europe/London (GMT)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1">Date Format</label>
                <select
                  value={dateFormat}
                  onChange={(e) => setDateFormat(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                >
                  <option value="DD MMM YYYY">DD MMM YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1">Time Format</label>
                <select
                  value={timeFormat}
                  onChange={(e) => setTimeFormat(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                >
                  <option value="12-hour">12-hour (AM/PM)</option>
                  <option value="24-hour">24-hour</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1">Data Refresh Interval</label>
                <div className="relative">
                  <input
                    type="number"
                    min="5"
                    max="300"
                    value={refreshInterval}
                    onChange={(e) => setRefreshInterval(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold pr-16"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">seconds</span>
                </div>
              </div>
            </div>

            {/* System Connection Indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-100 dark:border-white/10 pt-5 text-xs font-semibold">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 block text-[11px]">System Version</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">Mediflow-AI 1.0</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 block text-[11px]">Database</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">● Connected</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 block text-[11px]">Authentication</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">● Connected</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 block text-[11px]">AI Services</span>
                <span className="text-cyan-500 font-bold text-sm">● Operational</span>
              </div>
            </div>
          </section>
        )}

      </div>

      {/* 13. RESET DEFAULTS MODAL */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950 flex items-center justify-center text-xl shrink-0 font-bold">
                ⚠️
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Reset operational settings?</h3>
                <span className="text-xs text-slate-500 font-medium">Hospital configuration baseline</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              This will restore all threshold values to the hospital&apos;s default configuration. Any unsaved custom parameters will be permanently discarded.
            </p>

            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsResetModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetDefaults}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/30 cursor-pointer active:scale-95"
              >
                Reset Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT ALERT RULE MODAL */}
      {isAddRuleModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {editingRule ? "Edit Alert & Escalation Rule" : "+ Add Alert & Escalation Rule"}
              </h3>
              <button onClick={() => setIsAddRuleModalOpen(false)} className="text-slate-400 font-bold text-lg hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveRuleForm} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block mb-1 text-slate-700 dark:text-slate-300">Condition</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ward occupancy > 80%"
                  value={ruleConditionInput}
                  onChange={(e) => setRuleConditionInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-700 dark:text-slate-300">Severity Level</label>
                <select
                  value={ruleSeverityInput}
                  onChange={(e) => setRuleSeverityInput(e.target.value as "Normal" | "Warning" | "Critical")}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                >
                  <option value="Normal">Normal</option>
                  <option value="Warning">Warning</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-slate-700 dark:text-slate-300">Target Notification Action</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Notify Ward Manager"
                  value={ruleActionInput}
                  onChange={(e) => setRuleActionInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddRuleModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md cursor-pointer"
                >
                  Save Alert Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT WARD MODAL */}
      {isAddWardModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {editingWard ? "Edit Ward Capacity Rule" : "+ Add Ward Capacity Rule"}
              </h3>
              <button onClick={() => setIsAddWardModalOpen(false)} className="text-slate-400 font-bold text-lg hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveWardForm} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-slate-700 dark:text-slate-300">Ward Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ward A"
                    value={wardNameInput}
                    onChange={(e) => setWardNameInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-700 dark:text-slate-300">Department</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. General Medicine"
                    value={wardDeptInput}
                    onChange={(e) => setWardDeptInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block mb-1 text-slate-700 dark:text-slate-300">Bed Capacity</label>
                  <input
                    type="number"
                    required
                    min="5"
                    max="200"
                    value={wardCapInput}
                    onChange={(e) => setWardCapInput(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-700 dark:text-slate-300">Warning Threshold</label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min="50"
                      max="95"
                      value={wardWarningInput}
                      onChange={(e) => setWardWarningInput(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold pr-7"
                    />
                    <span className="absolute right-2 top-2 text-slate-400 font-bold">%</span>
                  </div>
                </div>
                <div>
                  <label className="block mb-1 text-slate-700 dark:text-slate-300">Critical Threshold</label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min="60"
                      max="99"
                      value={wardCriticalInput}
                      onChange={(e) => setWardCriticalInput(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold pr-7"
                    />
                    <span className="absolute right-2 top-2 text-slate-400 font-bold">%</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddWardModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md cursor-pointer"
                >
                  Save Ward Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SECURITY AUDIT EVENTS MODAL */}
      {isSecurityAuditModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🛡️</span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Security Event Log Audit</h3>
              </div>
              <button onClick={() => setIsSecurityAuditModalOpen(false)} className="text-slate-400 font-bold text-lg hover:text-white">
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              {[
                { time: "Today 21:44", event: "Admin login authenticated", user: "admin@mediflow.com", status: "Success" },
                { time: "Today 18:20", event: "Threshold policy modified", user: "dr.sarah@mediflow.com", status: "Updated" },
                { time: "Yesterday 14:15", event: "2FA challenge passed", user: "supervisor@mediflow.com", status: "Verified" },
                { time: "10 Aug 11:02", event: "Session auto-timeout", user: "nurse.john@mediflow.com", status: "Expired" },
              ].map((log, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between font-semibold">
                  <div>
                    <span className="text-slate-900 dark:text-white font-bold block">{log.event}</span>
                    <span className="text-slate-500 text-[11px]">{log.user} · {log.time}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono text-[10px] font-bold">
                    {log.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsSecurityAuditModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
              >
                Close Audit Log
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
