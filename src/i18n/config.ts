import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import translation from './en/translation.json';
import translationKo from './ko/translation.json';

export const resources = {
  en: {
    translation
  },
  ko: {
    translation: translationKo
  }
};

i18next.use(initReactI18next).init({
  lng: localStorage.getItem('lang') || navigator.language,
  fallbackLng: 'en',
  resources
});
