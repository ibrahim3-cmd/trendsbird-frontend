import { createContext, useContext } from 'react';

interface DynamicThemeContextType {
  updateThemeColors: (primaryColor: string, secondaryColor: string, primaryTextColor?: string, secondaryTextColor?: string) => void;
  resetThemeColors: (customPrimary?: string, customSecondary?: string, customPrimaryText?: string, customSecondaryText?: string) => void;
}

export const DynamicThemeContext = createContext<DynamicThemeContextType | null>(null);

export const useDynamicTheme = () => {
  const context = useContext(DynamicThemeContext);
  if (!context) {
    throw new Error('useDynamicTheme must be used within a DynamicThemeProvider');
  }
  return context;
};
