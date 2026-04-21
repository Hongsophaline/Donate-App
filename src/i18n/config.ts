import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslation from "./locales/en/translation.json";
import kmTranslation from "./locales/km/translation.json";
import zhTranslation from "./locales/zh/translation.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslation },
    km: { translation: kmTranslation },
    zh: { translation: zhTranslation },
  },
  lng: localStorage.getItem("lang") || "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
