import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

function loadResources() {
  const context = require.context('./locales', false, /\.json$/);

  return context.keys().reduce((resources, key) => {
    const language = key.replace('./', '').replace('.json', '');
    resources[language] = { translation: context(key) };
    return resources;
  }, {});
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: loadResources(),
    fallbackLng: 'en',
    detection: {
      order: ['localStorage', 'cookie', 'navigator', 'htmlTag'],
      caches: ['localStorage', 'cookie'],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;