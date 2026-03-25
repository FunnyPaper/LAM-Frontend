import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'system' | 'light' | 'dark';

export type ThemeStore = {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  getProcessedThemeMode: () => Omit<ThemeMode, 'system'>;
};

export const useThemeStore = create(
  persist<ThemeStore>(
    (set, get) => ({
      themeMode: 'system',
      setThemeMode: (mode) => set({ themeMode: mode }),
      getProcessedThemeMode: () => {
        if (get().themeMode == 'system') {
          return window.matchMedia('') ? 'dark' : 'light';
        }

        return get().themeMode;
      },
    }),
    { name: 'theme-storage' }
  )
);
