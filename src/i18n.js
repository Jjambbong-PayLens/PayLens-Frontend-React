import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

function loadLocales(lang) {
  const context = require.context('./locales', true, /\.json$/);
  let translations = {};

  context.keys().forEach(key => {
    if (key.includes(`/${lang}/`)) {
      const jsonData = context(key);
      translations = { ...translations, ...jsonData };
    }
  });

  return translations;
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ko: { translation: loadLocales('ko') },
      en: { translation: loadLocales('en') },
    },
    lng: 'ko', // 기본 언어
    fallbackLng: 'ko', // 번역이 없을 경우
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;