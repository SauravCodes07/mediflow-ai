"use client";

import React, { useState, useEffect } from "react";

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

  // Shared modal render helper
  const modal = isModalOpen && (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={() => setIsModalOpen(false)}
    >
      <div
        className="bg-[#0B2545] border border-slate-700 rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-5 text-white relative animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          aria-label="Close modal"
        >
          ✕
        </button>
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center text-xl font-bold shadow-md shrink-0">
            ⚡
          </div>
          <div>
            <h3 className="text-lg font-extrabold tracking-tight">Install Mediflow-AI</h3>
            <p className="text-xs text-slate-400 font-medium">
              {isInstalled ? "Mediflow-AI is installed on this device." : "Hospital Command Center App"}
            </p>
          </div>
        </div>
        <div className="space-y-3 text-xs leading-relaxed">
          {isInstalled ? (
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800 text-emerald-200 space-y-1">
              <div className="font-extrabold">✓ App Already Installed</div>
              <p className="text-[11px] font-medium text-emerald-300">
                Launch Mediflow-AI from your home screen or app menu for the full standalone experience.
              </p>
            </div>
          ) : deviceType === "ios" ? (
            <div className="space-y-3">
              <p className="font-semibold text-slate-300">Install on Safari (iOS / iPadOS):</p>
              <ol className="space-y-2 font-medium bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                <li className="flex items-start space-x-2">
                  <span className="font-bold text-blue-400 shrink-0">1.</span>
                  <span>Tap the <b>Share button</b> ( <span className="inline-block px-1 bg-slate-700 rounded">⎋</span> or <span className="inline-block px-1 bg-slate-700 rounded">↑</span> ) in Safari.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-bold text-blue-400 shrink-0">2.</span>
                  <span>Scroll down and select <b>&quot;Add to Home Screen&quot;</b>.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-bold text-blue-400 shrink-0">3.</span>
                  <span>Tap <b>Add</b> to launch Mediflow-AI as a standalone app.</span>
                </li>
              </ol>
            </div>
          ) : deviceType === "android" ? (
            <div className="space-y-3">
              <p className="font-semibold text-slate-300">Install on Android / Chrome:</p>
              <ol className="space-y-2 font-medium bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                <li className="flex items-start space-x-2">
                  <span className="font-bold text-blue-400 shrink-0">1.</span>
                  <span>Tap the menu icon (<b>⋮</b>) in the top right of Chrome.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-bold text-blue-400 shrink-0">2.</span>
                  <span>Select <b>&quot;Install app&quot;</b> or <b>&quot;Add to Home Screen&quot;</b>.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-bold text-blue-400 shrink-0">3.</span>
                  <span>Confirm the installation prompt to complete.</span>
                </li>
              </ol>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="font-semibold text-slate-300">Desktop (Chrome / Edge / Brave):</p>
              <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-start space-x-2">
                  <span className="font-bold text-blue-400 shrink-0">1.</span>
                  <span className="text-slate-300">Look for the <b>Install</b> icon ( <span className="inline-block px-1 bg-slate-700 rounded">⊕</span> ) in the browser address bar.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-bold text-blue-400 shrink-0">2.</span>
                  <span className="text-slate-300">Click it and select <b>&quot;Install&quot;</b> when prompted.</span>
                </div>
                <p className="text-slate-500 text-[11px] pt-1 border-t border-slate-800">
                  You can also continue using Mediflow-AI in your browser with full functionality.
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="pt-3 border-t border-slate-800 flex items-center justify-end">
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md cursor-pointer transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );

  // "full" variant: wide button for mobile drawer
  if (variant === "full") {
    return (
      <>
        {isInstalled ? (
          <button
            type="button"
            onClick={handleInstallClick}
            className={`w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all cursor-pointer ${className}`}
            title="Mediflow-AI App Installed"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>App Installed ✓</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleInstallClick}
            aria-label="Install Mediflow-AI Application"
            className={`w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-600/20 hover:from-cyan-500/30 hover:to-blue-600/30 text-cyan-300 border border-cyan-400/30 hover:border-cyan-400/60 text-xs font-extrabold transition-all duration-200 cursor-pointer active:scale-95 ${className}`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Install App</span>
          </button>
        )}
        {modal}
      </>
    );
  }

  // "compact" variant: small pill for tight spaces
  if (variant === "compact") {
    return (
      <>
        {isInstalled ? (
          <button
            type="button"
            onClick={handleInstallClick}
            className={`px-2.5 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${className}`}
            title="Mediflow-AI App Installed"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">Installed</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleInstallClick}
            aria-label="Install Mediflow-AI Application"
            className={`px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/15 to-blue-600/15 hover:from-cyan-500/25 hover:to-blue-600/25 text-cyan-300 border border-cyan-400/30 hover:border-cyan-400/60 text-xs font-extrabold flex items-center space-x-1.5 transition-all duration-200 cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 ${className}`}
          >
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="hidden sm:inline">Install</span>
          </button>
        )}
        {modal}
      </>
    );
  }

  // Default "navbar" variant
  return (
    <>
      {isInstalled ? (
        <button
          type="button"
          onClick={handleInstallClick}
          className={`px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${className}`}
          title="Mediflow-AI App Installed"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="hidden sm:inline">App Installed</span>
          <span className="sm:hidden">Installed</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={handleInstallClick}
          aria-label="Install Mediflow-AI Application"
          className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-gradient-to-r from-cyan-500/15 to-blue-600/15 hover:from-cyan-500/25 hover:to-blue-600/25 text-cyan-300 border border-cyan-400/30 hover:border-cyan-400/60 text-xs font-extrabold flex items-center space-x-1.5 transition-all duration-200 cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 shadow-xs ${className}`}
        >
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span className="whitespace-nowrap">Install App</span>
        </button>
      )}
      {modal}
    </>
  );
}
