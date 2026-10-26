import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import fr from "./locales/fr.json";
import ar from "./locales/ar.json";

export const SUPPORTED_LANGUAGES = [
  { code: "fr", label: "Français", dir: "ltr" },
  { code: "en", label: "English", dir: "ltr" },
  { code: "ar", label: "العربية", dir: "rtl" },
];

export function applyLanguageSettings(lang) {
  const requested = (lang || i18n.resolvedLanguage || "fr").split("-")[0];
  const currentLang = ["en", "fr", "ar"].includes(requested) ? requested : "fr";
  const isRtl = currentLang === "ar";
  document.documentElement.lang = currentLang;
  document.documentElement.dir = isRtl ? "rtl" : "ltr";
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      ar: { translation: ar },
    },
    fallbackLng: "fr",
    supportedLngs: ["en", "fr", "ar"],
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "lang",
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false, // React already safe from XSS
    },
  });

// Keep legacy preference storage synchronized with the shared language engine.
localStorage.setItem("language", i18n.resolvedLanguage || "en");
i18n.on("languageChanged", lng => localStorage.setItem("language", lng));

// Apply document attributes on load & change
applyLanguageSettings(i18n.language);
i18n.on("languageChanged", (lng) => {
  applyLanguageSettings(lng);
});

export function formatPrice(amount, lng = i18n.language) {
  const num = Number(amount) || 0;
  try {
    return new Intl.NumberFormat(lng === "ar" ? "ar-MA-u-nu-latn" : lng || "fr-FR", {
      style: "currency",
      currency: "USD",
      numberingSystem: "latn",
    }).format(num);
  } catch {
    return `$${num.toFixed(2)}`;
  }
}

export function formatDate(date, lng = i18n.language, options = {}) {
  if (!date) return "";
  try {
    const d = new Date(date);
    return new Intl.DateTimeFormat(lng === "ar" ? "ar-MA-u-nu-latn" : lng || "fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      numberingSystem: "latn",
      ...options,
    }).format(d);
  } catch {
    return String(date);
  }
}

export default i18n;
