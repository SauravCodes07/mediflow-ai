"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/lib/theme-context";

// Extend BeforeInstallPromptEvent for TypeScript
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

interface InstallAppButtonProps {
  variant?: "navbar" | "compact" | "full" | "menu";
  className?: string;
}

export function InstallAppButton({ variant = "navbar", className = "" }: InstallAppButtonProps) {
  const { theme, setTheme, isDark } = useTheme();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deviceType, setDeviceType] = useState<"ios" | "android" | "desktop" | "other">("desktop");

  useEffect(() => {
    // Check if app is already running in standalone mode (installed)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
    }

    // Detect OS / Browser
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setDeviceType("ios");
    } else if (/android/.test(userAgent)) {
      setDeviceType("android");
    } else {
      setDeviceType("desktop");
    }

    // Listen for PWA beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isInstalled) {
      setIsModalOpen(true);
      return;
    }

    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === "accepted") {
          setIsInstalled(true);
        }
        setDeferredPrompt(null);
      } catch (err) {
        console.error("Install prompt error:", err);
        setIsModalOpen(true);
      }
    } else {
      // Prompt not available natively -> show browser specific modal instructions
      setIsModalOpen(true);
    }
  };

  const toggleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  return (
    <>
      {/* BUTTON RENDERING */}
      {isInstalled ? (
        <button
          type="button"
          onClick={handleInstallClick}
          className={`px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${className}`}
          title="Mediflow-AI App Installed"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="hidden sm:inline">App Installed</span>
          <span className="sm:hidden">Installed</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={handleInstallClick}
          aria-label="Install Mediflow-AI Application"
          className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-gradient-to-r from-cyan-500/15 to-blue-600/15 hover:from-cyan-500/25 hover:to-blue-600/25 text-cyan-700 dark:text-cyan-300 border border-cyan-400/30 hover:border-cyan-400/60 text-xs font-extrabold flex items-center space-x-1.5 transition-all duration-200 cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 shadow-xs ${className}`}
        >
          <svg className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span className="whitespace-nowrap">Install App</span>
        </button>
      )}

      {/* INSTALLATION INSTRUCTION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#0B2545] border border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-5 text-slate-900 dark:text-white relative">
            
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              aria-label="Close modal"
            >
              ✕
            </button>

            {/* Header Icon & Title */}
            <div className="flex items-center space-x-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center text-xl font-bold shadow-md shrink-0">
                ⚡
              </div>
              <div>
                <h3 className="text-lg font-extrabold tracking-tight">Install Mediflow-AI</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {isInstalled ? "Mediflow-AI is installed on this device." : "Hospital Command Center App"}
                </p>
              </div>
            </div>

            {/* Content Based on Device */}
            <div className="space-y-3 text-xs leading-relaxed">
              {isInstalled ? (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 space-y-1">
                  <div className="font-extrabold flex items-center space-x-1.5">
                    <span>✓ App Already Installed</span>
                  </div>
                  <p className="text-[11px] font-medium text-emerald-800 dark:text-emerald-300">
                    You can launch Mediflow-AI directly from your home screen or application menu for full standalone experience.
                  </p>
                </div>
              ) : deviceType === "ios" ? (
                <div className="space-y-3">
                  <p className="font-semibold text-slate-700 dark:text-slate-300">
                    To install Mediflow-AI on Safari (iOS / iPadOS):
                  </p>
                  <ol className="space-y-2 font-medium bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <li className="flex items-start space-x-2">
                      <span className="font-bold text-blue-600">1.</span>
                      <span>Tap the <b>Share button</b> ( <span className="inline-block px-1 bg-slate-200 dark:bg-slate-700 rounded">⎋</span> or <span className="inline-block px-1 bg-slate-200 dark:bg-slate-700 rounded">↑</span> ) in Safari.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="font-bold text-blue-600">2.</span>
                      <span>Scroll down and select <b>&quot;Add to Home Screen&quot;</b>.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="font-bold text-blue-600">3.</span>
                      <span>Tap <b>Add</b> to launch Mediflow-AI as a standalone app.</span>
                    </li>
                  </ol>
                </div>
              ) : deviceType === "android" ? (
                <div className="space-y-3">
                  <p className="font-semibold text-slate-700 dark:text-slate-300">
                    To install Mediflow-AI on Android / Chrome:
                  </p>
                  <ol className="space-y-2 font-medium bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <li className="flex items-start space-x-2">
                      <span className="font-bold text-blue-600">1.</span>
                      <span>Tap the menu icon (<b>⋮</b>) in the top right corner.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="font-bold text-blue-600">2.</span>
                      <span>Select <b>&quot;Install app&quot;</b> or <b>&quot;Add to Home Screen&quot;</b>.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="font-bold text-blue-600">3.</span>
                      <span>Confirm installation prompt to complete.</span>
                    </li>
                  </ol>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="font-semibold text-slate-700 dark:text-slate-300">
                    Browser App Installation:
                  </p>
                  <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
                    <p className="text-slate-600 dark:text-slate-300">
                      If your browser supports PWAs (Chrome, Edge, Brave), click the <b>Install</b> icon in the browser address bar.
                    </p>
                    <p className="text-slate-500 text-[11px]">
                      You can continue using Mediflow-AI directly in your web browser with full functionality.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
