import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './locales/en/translation';
import plTranslations from './locales/pl/translation';

export function initTranslations() {
    let lang: string;

    try {
        lang = JSON.parse(localStorage.getItem('language-storage')!).state.language;
    } catch {
        lang = 'en';
    }

    i18n.use(initReactI18next).init({
        resources: {
            en: enTranslations,
            pl: plTranslations
        },
        lng: lang,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });
}

export default i18n;