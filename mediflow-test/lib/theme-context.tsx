"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type ThemeMode = "light" | "dark";

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("dark");
  const [isDark, setIsDark] = useState<boolean>(true);

  useEffect(() => {
    // Read saved preference from localStorage
    const saved = localStorage.getItem("mediflow-theme") as ThemeMode | null;
    if (saved === "light" || saved === "dark") {
      setThemeState(saved);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const activeDark = theme === "dark";

    setIsDark(activeDark);
    if (activeDark) {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
    }

    localStorage.setItem("mediflow-theme", theme);
  }, [theme]);

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode === "light" ? "light" : "dark");
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: "dark" as ThemeMode,
      setTheme: () => {},
      isDark: true,
      toggleTheme: () => {},
    };
  }
  return context;
}
