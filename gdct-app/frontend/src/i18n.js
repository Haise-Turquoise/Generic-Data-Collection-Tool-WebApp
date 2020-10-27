import i18n from "i18next";
import {initReactI18next} from 'react-i18next';
import EN from './locales/en.json';
import FR from './locales/fr.json';

const resources = {
    en:{
        translation: EN
    },
    fr:{
        translation: FR
    }
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en",
    // fallbackLng: "en",
    keySeparator:false,
    interpolation: {
      escapeValue: false
    }
  });

  export default i18n;