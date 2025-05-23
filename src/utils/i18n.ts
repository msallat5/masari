import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation JSON files
import arTranslation from '../locales/ar.json';
import enTranslation from '../locales/en.json';

/**
 * Resource bundle mapping language codes to translation data.
 */
const resources = {
  ar: {
    translation: arTranslation,
  },
  en: {
    translation: enTranslation,
  },
};

/**
 * Initialize i18next with React integration.
 * - resources: our translation bundles
 * - lng: default language (Arabic for RTL by default)
 * - fallbackLng: language to fall back to if a key is missing
 * - interpolation.escapeValue: disable escaping, since React does it
 */
i18n
  .use(initReactI18next) // binds react-i18next to the i18next instance
  .init({
    resources,
    lng: 'ar',
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
