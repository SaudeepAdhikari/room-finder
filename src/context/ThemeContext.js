import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Always use dark theme
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    // Set data-theme attribute for custom CSS variables
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
    
    // Update Tailwind dark mode class
    document.documentElement.classList.add('dark');
  }, []); // No dependency needed as theme is always dark

  // Placeholder function that does nothing (kept for API compatibility)
  const toggleTheme = () => {};

  const isDark = theme === "dark";

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
