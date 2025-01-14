import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import translation from './en/translation.json';
import translationKo from './ko/translation.json';

i18next.use(initReactI18next).init({
  lng: navigator.language,
  fallbackLng: 'en',
  debug: true,
  resources: {
    en: {
      translation
    },
    ko: {
      translation: translationKo
    }
  }
});
