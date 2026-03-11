import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './locales/en/translation';
import plTranslations from './locales/pl/translation';

export function initTranslations() {
    i18n.use(initReactI18next).init({
        resources: {
            en: enTranslations,
            pl: plTranslations
        },
        lng: 'en',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });
}