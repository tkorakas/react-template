import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

export const supportedLanguages = ['en', 'el'] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

export const namespaces = [
  'common',
  'auth',
  'login',
  'register',
  'mfa',
  'team-members',
] as const;

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: supportedLanguages,
    defaultNS: 'common',
    ns: namespaces,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['querystring', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupQuerystring: 'lng',
      lookupLocalStorage: 'i18nextLng',
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
  });

export default i18n;
