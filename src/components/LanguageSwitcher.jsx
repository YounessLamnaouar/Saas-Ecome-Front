import React from "react";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import { applyLanguageSettings } from "@/i18n";

const LANGUAGES = [
  { code: "fr", label: "FR", full: "Français" },
  { code: "en", label: "EN", full: "English" },
  { code: "ar", label: "عر", full: "العربية" },
];

export default function LanguageSwitcher({ variant = "storefront", className = "" }) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language?.substring(0, 2) || "fr";

  const handleChange = (code) => {
    i18n.changeLanguage(code);
    applyLanguageSettings(code);
    localStorage.setItem("lang", code);
  };

  if (variant === "admin") {
    return (
      <div className={`flex items-center gap-1 bg-gray-100 p-1 rounded-lg text-xs ${className}`}>
        <Globe size={14} className="text-gray-500 mx-1 shrink-0" />
        {LANGUAGES.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => handleChange(l.code)}
            className={`px-2 py-0.5 rounded-md font-semibold transition-all cursor-pointer ${
              currentLang === l.code
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>
    );
  }

  // Storefront variant (works over colored navbars)
  return (
    <div className={`flex items-center gap-0.5 bg-white/10 p-1 rounded-full text-xs text-white ${className}`}>
      <Globe size={13} className="opacity-70 ms-1.5 me-0.5 shrink-0" />
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => handleChange(l.code)}
          className={`px-2 py-0.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            currentLang === l.code
              ? "bg-white text-gray-900 shadow-sm font-bold"
              : "text-white/80 hover:text-white hover:bg-white/10"
          }`}
          title={l.full}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
