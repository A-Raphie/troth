"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type ThemeMode = "fintech" | "terminal";

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("fintech");

  useEffect(() => {
    const saved = localStorage.getItem("troth-theme") as ThemeMode | null;
    if (saved === "fintech" || saved === "terminal") {
      setThemeState(saved);
      document.documentElement.setAttribute("data-theme", saved);
    } else {
      document.documentElement.setAttribute("data-theme", "fintech");
    }
  }, []);

  const setTheme = (next: ThemeMode) => {
    setThemeState(next);
    localStorage.setItem("troth-theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  const toggleTheme = () => {
    const next = theme === "fintech" ? "terminal" : "fintech";
    setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
