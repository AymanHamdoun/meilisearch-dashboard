import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
// Import your translation files
import translationEN from '../public/locales/en/translation.json';
import translationAR from '../public/locales/ar/translation.json';

i18n
    // .use(Backend) // Load translations using http (default: /public/locales)
    .use(LanguageDetector) // Detects the user language
    .use(initReactI18next) // Passes i18n down to react-i18next
    .init({
        resources: {
            en: {
                translation: translationEN,
            },
            ar: {
                translation: translationAR,
            }
        },
        fallbackLng: 'en', // Default language
        debug: true, // Enable debug mode in development

        interpolation: {
            escapeValue: false, // React already safes from XSS
        },

        detection: {
            // Options for language detection
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'], // Store the selected language in localStorage
        },
    });

export default i18n;