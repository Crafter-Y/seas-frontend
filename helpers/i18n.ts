import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";
import deTranslation from "@/locales/de.json";
import enTranslation from "@/locales/en.json";

i18n.use(initReactI18next).init({
    debug: __DEV__,
    compatibilityJSON: "v3",
    resources: {
        de: { translation: deTranslation },
        en: { translation: enTranslation }
    },
    lng: getLocales()[0]?.languageTag,
    fallbackLng: "de",
    interpolation: {
        escapeValue: false,
    },
    missingKeyHandler: (lng, ns, key, fallbackValue) => {
        const message = `Missing translation key [${key}] for [${lng}/${ns}], fallbackValue: ${fallbackValue}`;
        if (__DEV__) console.warn(message);
        return fallbackValue;
    },
    saveMissing: __DEV__
});

export default i18n;