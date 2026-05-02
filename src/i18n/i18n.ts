import i18n, { type ResourceLanguage } from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './locales/en/translation';
import plTranslations from './locales/pl/translation';
import { deepMerge } from 'lam-frontend/utils/deep-merge';

export type InitTranslationOptions = {
  additionalResources?: Record<string, ResourceLanguage>
}

export function initTranslations({ additionalResources = {} } : InitTranslationOptions) {
    let lang: string;

    try {
        lang = JSON.parse(localStorage.getItem('language-storage')!).state.language;
    } catch {
        lang = 'en';
    }

    const resources = deepMerge(
      {
            en: enTranslations,
            pl: plTranslations
      },
      additionalResources
    ) as Record<string, ResourceLanguage>;

    i18n.use(initReactI18next).init({
        resources: resources,
        lng: lang,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });
}

export default i18n;