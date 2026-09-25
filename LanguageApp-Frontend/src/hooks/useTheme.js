import { useEffect, useState } from "react";

// index.html sets data-theme before React loads (saved choice, else the system setting),
// so the page never flashes the wrong theme. This hook reads it and keeps it in sync.
export function useTheme() {
  const [theme, setTheme] = useState(
    () => document.documentElement.dataset.theme || "light"
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage can be blocked (private mode); the toggle still works for this visit
    }
  };

  return [theme, toggleTheme];
}
