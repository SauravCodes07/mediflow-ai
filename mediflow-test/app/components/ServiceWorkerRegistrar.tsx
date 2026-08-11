"use client";

import { useEffect } from "react";

/**
 * ServiceWorkerRegistrar
 * Registers /sw.js on mount so Chrome's beforeinstallprompt event fires,
 * enabling the PWA "Install App" prompt on desktop and Android.
 * Must be a client component since it uses browser APIs.
 */
export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((registration) => {
          console.log("[PWA] Service worker registered, scope:", registration.scope);
        })
        .catch((error) => {
          console.warn("[PWA] Service worker registration failed:", error);
        });
    }
  }, []);

  return null; // renders nothing
}
