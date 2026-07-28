import React, { useCallback, useEffect } from 'react';
import { DynamicThemeContext } from '@/context/dynamicTheme.context';
import { useUserInfoQuery } from '@/redux/features/auth/auth.api';
import { useGetOrgSettingByIdQuery } from '@/redux/features/orgSetting/orgSettingApiSlice';

interface DynamicThemeProviderProps {
  children: React.ReactNode;
}

// Helper function to get contrasting text color
const getContrastColor = (hex: string): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return white for dark colors, dark for light colors
  return luminance > 0.5 ? '#0a0a0a' : '#ffffff';
};

export const DynamicThemeProvider: React.FC<DynamicThemeProviderProps> = ({ children }) => {
  // Fetch user info to get organization ID
  const { data: userInfo } = useUserInfoQuery(undefined);
  const orgId = userInfo?.data?.org?._id;

  // Fetch organization settings
  const { data: orgSettings } = useGetOrgSettingByIdQuery(orgId, {
    skip: !orgId
  });

  const updateThemeColors = useCallback((primaryColor: string, secondaryColor: string, primaryTextColor?: string, secondaryTextColor?: string) => {
    const root = document.documentElement;
    
    // Get contrasting foreground colors or use provided ones
    const primaryForeground = primaryTextColor || getContrastColor(primaryColor);
    const secondaryForeground = secondaryTextColor || getContrastColor(secondaryColor);
    
    // Update CSS custom properties for both light and dark modes
    root.style.setProperty('--primary', primaryColor);
    root.style.setProperty('--primary-foreground', primaryForeground);
    root.style.setProperty('--secondary', secondaryColor);
    root.style.setProperty('--secondary-foreground', secondaryForeground);
    
    // Add primary and secondary text colors as custom CSS variables
    root.style.setProperty('--primary-text', primaryForeground);
    root.style.setProperty('--secondary-text', secondaryForeground);
    
    // Update sidebar colors to match primary
    root.style.setProperty('--sidebar-primary', primaryColor);
    root.style.setProperty('--sidebar-primary-foreground', primaryForeground);
    
    // Update ring and chart colors to match primary
    root.style.setProperty('--ring', primaryColor);
    root.style.setProperty('--sidebar-ring', primaryColor);
    root.style.setProperty('--chart-1', primaryColor);
    
    // Store colors in localStorage for persistence
    localStorage.setItem('dynamic-theme-primary', primaryColor);
    localStorage.setItem('dynamic-theme-secondary', secondaryColor);
    localStorage.setItem('dynamic-theme-primary-text', primaryForeground);
    localStorage.setItem('dynamic-theme-secondary-text', secondaryForeground);
    
    // Dispatch custom event for other components to listen
    window.dispatchEvent(new CustomEvent('themeColorsChanged', {
      detail: { primaryColor, secondaryColor, primaryTextColor: primaryForeground, secondaryTextColor: secondaryForeground }
    }));
  }, []);

  const resetThemeColors = useCallback((customPrimary?: string, customSecondary?: string, customPrimaryText?: string, customSecondaryText?: string) => {
    // Reset to default colors or custom ones
    const defaultPrimary = customPrimary || '#3B5E3D';
    const defaultSecondary = customSecondary || '#DBB700';
    const defaultPrimaryText = customPrimaryText || '#FFFFFF';
    const defaultSecondaryText = customSecondaryText || '#000000';
    
    updateThemeColors(defaultPrimary, defaultSecondary, defaultPrimaryText, defaultSecondaryText);
    
    // Remove from localStorage
    localStorage.removeItem('dynamic-theme-primary');
    localStorage.removeItem('dynamic-theme-secondary');
    localStorage.removeItem('dynamic-theme-primary-text');
    localStorage.removeItem('dynamic-theme-secondary-text');
  }, [updateThemeColors]);

  // Initialize theme colors from localStorage on mount
  React.useEffect(() => {
    const savedPrimary = localStorage.getItem('dynamic-theme-primary');
    const savedSecondary = localStorage.getItem('dynamic-theme-secondary');
    const savedPrimaryText = localStorage.getItem('dynamic-theme-primary-text');
    const savedSecondaryText = localStorage.getItem('dynamic-theme-secondary-text');
    
    if (savedPrimary && savedSecondary) {
      updateThemeColors(savedPrimary, savedSecondary, savedPrimaryText || undefined, savedSecondaryText || undefined);
    }
  }, [updateThemeColors]);

  // Apply organization theme colors when org settings are loaded
  useEffect(() => {
    if (orgSettings?.data?.branding) {
      const { primaryColor, secondaryColor, primaryTextColor, secondaryTextColor } = orgSettings.data.branding;
      
      if (primaryColor && secondaryColor) {
        // console.log('Applying organization theme colors:', { primaryColor, secondaryColor, primaryTextColor, secondaryTextColor });
        updateThemeColors(primaryColor, secondaryColor, primaryTextColor, secondaryTextColor);
      }
    }
  }, [orgSettings, updateThemeColors]);

  const value = {
    updateThemeColors,
    resetThemeColors
  };

  return (
    <DynamicThemeContext.Provider value={value}>
      {children}
    </DynamicThemeContext.Provider>
  );
};
