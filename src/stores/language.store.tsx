/* eslint-disable react-refresh/only-export-components */
import i18n from 'lam-frontend/i18n/i18n';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const LanguageTypes = ['pl', 'en'] as const;
export type LanguageType = (typeof LanguageTypes)[number];

export type LanguageStore = {
  language: LanguageType;
  setLanguage: (language: LanguageType) => void;
};

export const useLanguageStore = create(
  persist<LanguageStore>(
    (set) => ({
      language: 'en',
      setLanguage: (language) => {
        set({ language });
        i18n.changeLanguage(language);
      },
    }),
    { name: 'language-storage' }
  )
);
