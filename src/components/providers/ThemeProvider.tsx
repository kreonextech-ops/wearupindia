'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from 'next-themes';

/**
 * Custom ThemeProvider wrapper for next-themes.
 * Ensures hydration safety and centralized theme configuration.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider 
      attribute="class" 
      defaultTheme="dark" 
      enableSystem={false}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
