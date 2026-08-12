"use client";

import React, { useState, useEffect } from "react";

// Extend BeforeInstallPromptEvent for TypeScript
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

declare global {
  interface Window {
    __mediflowInstallPrompt?: BeforeInstallPromptEvent | null;
    __mediflowAppInstalled?: boolean;
  }
}

interface InstallAppButtonProps {
  variant?: "navbar" | "compact" | "full" | "menu";
  className?: string;
}

export function InstallAppButton({ variant = "navbar", className = "" }: InstallAppButtonProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deviceType, setDeviceType] = useState<"ios" | "android" | "desktop">("desktop");

  useEffect(() => {
    // ── Register Service Worker (required for PWA install capability) ──
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .catch((err) => {
          console.warn("[PWA] Service worker registration error:", err);
        });
    }

    // Check if app is already running in standalone mode (installed)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
      window.__mediflowAppInstalled === true;

    if (isStandalone) {
      setIsInstalled(true);
    }

    // Check if global prompt was already captured on window
    if (window.__mediflowInstallPrompt) {
      setDeferredPrompt(window.__mediflowInstallPrompt);
    }

    // Detect OS / Device
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
      const promptEvent = e as BeforeInstallPromptEvent;
      window.__mediflowInstallPrompt = promptEvent;
      setDeferredPrompt(promptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      window.__mediflowAppInstalled = true;
      window.__mediflowInstallPrompt = null;
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();

    if (isInstalled) {
      setIsModalOpen(true);
      return;
    }

    // Direct Native Desktop & Mobile Installation Flow
    const promptToUse = deferredPrompt || window.__mediflowInstallPrompt;

    if (promptToUse) {
      setIsInstalling(true);
      try {
        await promptToUse.prompt();
        const choiceResult = await promptToUse.userChoice;
        if (choiceResult.outcome === "accepted") {
          setIsInstalled(true);
          window.__mediflowAppInstalled = true;
          window.__mediflowInstallPrompt = null;
          setDeferredPrompt(null);
        }
      } catch (err) {
        console.error("[PWA] Installation prompt error:", err);
        setIsModalOpen(true);
      } finally {
        setIsInstalling(false);
      }
    } else {
      // Native prompt not exposed by browser -> show clear fallback instructions
      setIsModalOpen(true);
    }
  };

  // Fallback / Info Modal
  const modal = isModalOpen && (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={() => setIsModalOpen(false)}
    >
      <div
        className="bg-[#0B2545] border border-slate-700 rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-5 text-white relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          aria-label="Close modal"
        >
          ✕
        </button>
        
        <div className="flex items-center space-x-3.5 border-b border-slate-800 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 text-white flex items-center justify-center text-xl font-bold shadow-md shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-extrabold tracking-tight">Install Mediflow-AI</h3>
            <p className="text-xs text-slate-400 font-medium">
              {isInstalled ? "Mediflow-AI is installed on this device." : "Hospital Command Center Desktop & Mobile App"}
            </p>
          </div>
        </div>

        <div className="space-y-3 text-xs leading-relaxed">
          {isInstalled ? (
            <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-800 text-emerald-200 space-y-1">
              <div className="font-extrabold text-sm flex items-center space-x-2">
                <span>✓ App Installed</span>
              </div>
              <p className="text-[11px] font-medium text-emerald-300">
                Mediflow-AI is already installed. Launch it directly from your desktop app menu or taskbar.
              </p>
            </div>
          ) : deviceType === "desktop" ? (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-blue-800/60 text-blue-200">
                <p className="font-semibold text-xs text-cyan-300 mb-1">Desktop Installation Guide:</p>
                <p className="text-[11px] text-slate-300 leading-normal">
                  If native installation did not trigger automatically, your browser can install Mediflow-AI directly:
                </p>
              </div>

              <ol className="space-y-2.5 font-medium bg-slate-900/70 p-4 rounded-2xl border border-slate-800">
                <li className="flex items-start space-x-2.5">
                  <span className="font-bold text-cyan-400 shrink-0">1.</span>
                  <span>Look for the <b>Install Icon</b> ( <span className="inline-block px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-cyan-400 font-bold">⊕</span> or <span className="inline-block px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-cyan-400 font-bold">⬇</span> ) in your browser address bar.</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <span className="font-bold text-cyan-400 shrink-0">2.</span>
                  <span>Or click the <b>3 dots menu (⋮)</b> in Chrome / Edge → Select <b>&quot;Save and share&quot;</b> → <b>&quot;Install Mediflow-AI&quot;</b>.</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <span className="font-bold text-cyan-400 shrink-0">3.</span>
                  <span>Click <b>Install</b> to launch Mediflow-AI as a standalone desktop app.</span>
                </li>
              </ol>
            </div>
          ) : deviceType === "ios" ? (
            <div className="space-y-3">
              <p className="font-semibold text-slate-300">Install on iOS / Safari:</p>
              <ol className="space-y-2 font-medium bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                <li className="flex items-start space-x-2">
                  <span className="font-bold text-cyan-400 shrink-0">1.</span>
                  <span>Tap the <b>Share button</b> ( <span className="inline-block px-1 bg-slate-700 rounded">⎋</span> or <span className="inline-block px-1 bg-slate-700 rounded">↑</span> ) in Safari.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-bold text-cyan-400 shrink-0">2.</span>
                  <span>Scroll down and select <b>&quot;Add to Home Screen&quot;</b>.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-bold text-cyan-400 shrink-0">3.</span>
                  <span>Tap <b>Add</b> to complete installation.</span>
                </li>
              </ol>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="font-semibold text-slate-300">Install on Android / Chrome:</p>
              <ol className="space-y-2 font-medium bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                <li className="flex items-start space-x-2">
                  <span className="font-bold text-cyan-400 shrink-0">1.</span>
                  <span>Tap the menu icon (<b>⋮</b>) in the top right of Chrome.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-bold text-cyan-400 shrink-0">2.</span>
                  <span>Select <b>&quot;Install app&quot;</b> or <b>&quot;Add to Home Screen&quot;</b>.</span>
                </li>
              </ol>
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

  // "full" variant (mobile drawer / settings)
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
            disabled={isInstalling}
            aria-label="Install Mediflow-AI Application"
            className={`w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-600/20 hover:from-cyan-500/30 hover:to-blue-600/30 text-cyan-300 border border-cyan-400/30 hover:border-cyan-400/60 text-xs font-extrabold transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-50 ${className}`}
          >
            <svg className={`w-4 h-4 shrink-0 ${isInstalling ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>{isInstalling ? "Installing..." : "Install App"}</span>
          </button>
        )}
        {modal}
      </>
    );
  }

  // "compact" variant (topbar / pill)
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
            disabled={isInstalling}
            aria-label="Install Mediflow-AI Application"
            className={`px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/15 to-blue-600/15 hover:from-cyan-500/25 hover:to-blue-600/25 text-cyan-300 border border-cyan-400/30 hover:border-cyan-400/60 text-xs font-extrabold flex items-center space-x-1.5 transition-all duration-200 cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 disabled:opacity-50 ${className}`}
          >
            <svg className={`w-3.5 h-3.5 shrink-0 ${isInstalling ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="hidden sm:inline">{isInstalling ? "Installing..." : "Install App"}</span>
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
          disabled={isInstalling}
          aria-label="Install Mediflow-AI Application"
          className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-gradient-to-r from-cyan-500/15 to-blue-600/15 hover:from-cyan-500/25 hover:to-blue-600/25 text-cyan-300 border border-cyan-400/30 hover:border-cyan-400/60 text-xs font-extrabold flex items-center space-x-1.5 transition-all duration-200 cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 shadow-xs disabled:opacity-50 ${className}`}
        >
          <svg className={`w-3.5 h-3.5 shrink-0 ${isInstalling ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span className="whitespace-nowrap">{isInstalling ? "Installing..." : "Install App"}</span>
        </button>
      )}
      {modal}
    </>
  );
}

