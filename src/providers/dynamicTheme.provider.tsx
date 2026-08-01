import React, { useCallback, useEffect } from "react";
import { DynamicThemeContext } from "@/context/dynamicTheme.context";

interface DynamicThemeProviderProps {
  children: React.ReactNode;
}

const getContrastColor = (hex: string): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#0a0a0a" : "#ffffff";
};

export const DynamicThemeProvider: React.FC<DynamicThemeProviderProps> = ({ children }) => {
  const updateThemeColors = useCallback((
    primaryColor: string,
    secondaryColor: string,
    primaryTextColor?: string,
    secondaryTextColor?: string
  ) => {
    const root = document.documentElement;
    const primaryForeground = primaryTextColor || getContrastColor(primaryColor);
    const secondaryForeground = secondaryTextColor || getContrastColor(secondaryColor);

    root.style.setProperty("--primary", primaryColor);
    root.style.setProperty("--primary-foreground", primaryForeground);
    root.style.setProperty("--secondary", secondaryColor);
    root.style.setProperty("--secondary-foreground", secondaryForeground);
    root.style.setProperty("--primary-text", primaryForeground);
    root.style.setProperty("--secondary-text", secondaryForeground);
    root.style.setProperty("--sidebar-primary", primaryColor);
    root.style.setProperty("--sidebar-primary-foreground", primaryForeground);
    root.style.setProperty("--ring", primaryColor);
    root.style.setProperty("--sidebar-ring", primaryColor);
    root.style.setProperty("--chart-1", primaryColor);

    localStorage.setItem("dynamic-theme-primary", primaryColor);
    localStorage.setItem("dynamic-theme-secondary", secondaryColor);
    localStorage.setItem("dynamic-theme-primary-text", primaryForeground);
    localStorage.setItem("dynamic-theme-secondary-text", secondaryForeground);
  }, []);

  const resetThemeColors = useCallback((
    customPrimary?: string,
    customSecondary?: string,
    customPrimaryText?: string,
    customSecondaryText?: string
  ) => {
    updateThemeColors(
      customPrimary || "#3B5E3D",
      customSecondary || "#DBB700",
      customPrimaryText || "#FFFFFF",
      customSecondaryText || "#000000"
    );
  }, [updateThemeColors]);

  useEffect(() => {
    const savedPrimary = localStorage.getItem("dynamic-theme-primary");
    const savedSecondary = localStorage.getItem("dynamic-theme-secondary");
    const savedPrimaryText = localStorage.getItem("dynamic-theme-primary-text");
    const savedSecondaryText = localStorage.getItem("dynamic-theme-secondary-text");

    if (savedPrimary && savedSecondary) {
      updateThemeColors(
        savedPrimary,
        savedSecondary,
        savedPrimaryText || undefined,
        savedSecondaryText || undefined
      );
    }
  }, [updateThemeColors]);

  return (
    <DynamicThemeContext.Provider value={{ updateThemeColors, resetThemeColors }}>
      {children}
    </DynamicThemeContext.Provider>
  );
};
