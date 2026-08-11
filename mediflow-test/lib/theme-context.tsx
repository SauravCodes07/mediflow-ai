"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type ThemeMode = "light" | "dark" | "system";

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("light");
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    // Read saved preference from localStorage
    const saved = localStorage.getItem("mediflow-theme") as ThemeMode | null;
    if (saved && (saved === "light" || saved === "dark" || saved === "system")) {
      setThemeState(saved);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (mode: ThemeMode) => {
      let activeDark = false;
      if (mode === "dark") {
        activeDark = true;
      } else if (mode === "system") {
        activeDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      }

      setIsDark(activeDark);
      if (activeDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };

    applyTheme(theme);
    localStorage.setItem("mediflow-theme", theme);
  }, [theme]);

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: "light" as ThemeMode,
      setTheme: () => {},
      isDark: false,
    };
  }
  return context;
}
