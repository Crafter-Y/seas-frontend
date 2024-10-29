import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";
import deTranslation from "@/locales/de.json";
import enTranslation from "@/locales/en.json";

i18n.use(initReactI18next).init({
    debug: __DEV__,
    resources: {
        de: { translation: deTranslation },
        en: { translation: enTranslation },
    },
    lng: getLocales()[0].languageTag,
    fallbackLng: "de",
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;