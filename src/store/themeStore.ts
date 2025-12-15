import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  success: string;
  warning: string;
  error: string;
}

export interface ThemeTypography {
  headingFont: string;
  bodyFont: string;
  h1Size: string;
  h2Size: string;
  h3Size: string;
  bodySize: string;
}

export interface CustomFont {
  name: string;
  url: string;
}

interface ThemeStore {
  colors: ThemeColors;
  typography: ThemeTypography;
  setColors: (colors: Partial<ThemeColors>) => void;
  setTypography: (typography: Partial<ThemeTypography>) => void;
  customCSS: string;
  customFonts: CustomFont[];
  setCustomCSS: (css: string) => void;
  addCustomFont: (font: CustomFont) => void;
  removeCustomFont: (name: string) => void;
  resetTheme: () => void;
}

const defaultColors: ThemeColors = {
  primary: '#3b82f6',
  secondary: '#6b7280',
  accent: '#a855f7',
  background: '#ffffff',
  text: '#1f2937',
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
};

const defaultTypography: ThemeTypography = {
  headingFont: 'Inter, sans-serif',
  bodyFont: 'Inter, sans-serif',
  h1Size: '2.5rem',
  h2Size: '2rem',
  h3Size: '1.75rem',
  bodySize: '1rem',
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      colors: defaultColors,
      typography: defaultTypography,
      customCSS: '',
      customFonts: [],
      
      setColors: (updates) => set((state) => ({ 
        colors: { ...state.colors, ...updates } 
      })),
      
      setTypography: (updates) => set((state) => ({ 
        typography: { ...state.typography, ...updates } 
      })),

      // Custom CSS Actions
      setCustomCSS: (css) => set({ customCSS: css }),

      // Custom Font Actions
      addCustomFont: (font) => set((state) => ({
        customFonts: [...state.customFonts, font]
      })),
      
      removeCustomFont: (name) => set((state) => ({
        customFonts: state.customFonts.filter(f => f.name !== name)
      })),

      resetTheme: () => set({ 
        colors: defaultColors, 
        typography: defaultTypography,
        customCSS: '',
        customFonts: []
      })
    }),
    {
      name: 'builderx-theme'
    }
  )
);
