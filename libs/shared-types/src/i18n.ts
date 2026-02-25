import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import all translations manually (bundler friendly for Vite)
import arAuth from './locales/ar/auth.json';
import arCommon from './locales/ar/common.json';
import enAuth from './locales/en/auth.json';
import enCommon from './locales/en/common.json';
import idAuth from './locales/id/auth.json';
import idCommon from './locales/id/common.json';

const resources = {
  id: {
    common: idCommon,
    auth: idAuth,
  },
  en: {
    common: enCommon,
    auth: enAuth,
  },
  ar: {
    common: arCommon,
    auth: arAuth,
  },
};

const savedLanguage =
  typeof window !== 'undefined' ? window.localStorage.getItem('synapse-lang') || 'id' : 'id';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: savedLanguage, // Read from localStorage
    fallbackLng: 'en', // Fallback to English if key missing

    // Have a common namespace used around the full app
    ns: ['common', 'auth'],
    defaultNS: 'common',

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

if (typeof window !== 'undefined') {
  i18n.on('languageChanged', (lng) => {
    window.localStorage.setItem('synapse-lang', lng);
  });
}

export default i18n;
