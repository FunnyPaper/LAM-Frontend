import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'system' | 'light' | 'dark';

export type ThemeStore = {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
};

export const useThemeStore = create(
  persist<ThemeStore>(
    (set) => ({
      themeMode: 'system',
      setThemeMode: (mode) => set({ themeMode: mode }),
    }),
    { name: 'theme-storage' }
  )
);

export function getProcessedThemeMode(mode: ThemeMode): Omit<ThemeMode, 'system'> {
  if (mode === 'system') {
    return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
  return mode;
}
