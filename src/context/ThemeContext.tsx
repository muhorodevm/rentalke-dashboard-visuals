import { createContext, useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export const ThemeContext = createContext({
  theme: "system",
  setTheme: (theme: string) => {},
  accentColor: "default",
  setAccentColor: (color: string) => {},
  fontSize: "medium",
  setFontSize: (size: string) => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Initialize with saved preferences or defaults
  const [accentColor, setAccentColor] = useState("default");
  const [fontSize, setFontSize] = useState("medium");

  // Load saved preferences on mount
  useEffect(() => {
    const savedAccentColor = localStorage.getItem("accentColor") || "default";
    const savedFontSize = localStorage.getItem("fontSize") || "medium";
    
    setAccentColor(savedAccentColor);
    setFontSize(savedFontSize);
    
    // Apply font size
    applyFontSize(savedFontSize);

    // Apply data attribute for accent color
    document.documentElement.setAttribute("data-accent", savedAccentColor);
  }, []);

  // Function to apply font size
  const applyFontSize = (size: string) => {
    switch (size) {
      case "small":
        document.documentElement.style.fontSize = "14px";
        break;
      case "medium":
        document.documentElement.style.fontSize = "16px";
        break;
      case "large":
        document.documentElement.style.fontSize = "18px";
        break;
      default:
        document.documentElement.style.fontSize = "16px";
    }
  };

  // Update preferences when they change
  const handleAccentColorChange = (color: string) => {
    setAccentColor(color);
    localStorage.setItem("accentColor", color);
    document.documentElement.setAttribute("data-accent", color);
  };

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
    localStorage.setItem("fontSize", size);
    applyFontSize(size);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: "system", // This will be overridden by NextThemesProvider
        setTheme: () => {}, // This will be overridden by NextThemesProvider
        accentColor,
        setAccentColor: handleAccentColorChange,
        fontSize,
        setFontSize: handleFontSizeChange,
      }}
    >
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
      >
        {children}
      </NextThemesProvider>
    </ThemeContext.Provider>
  );
}
