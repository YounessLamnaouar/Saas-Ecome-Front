import { useTranslation } from "react-i18next";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { translate } from '../lib/translations';
const Preferences = createContext();
export function PreferencesProvider({ children }) {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage || 'en';
  const setLanguage = (value) => i18n.changeLanguage(value);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  useEffect(() => { localStorage.setItem('language', language); document.documentElement.lang = language; }, [language]);
  useEffect(() => { localStorage.setItem('theme', theme); document.documentElement.classList.toggle('dark', theme === 'dark'); document.documentElement.style.colorScheme = theme; }, [theme]);
  const t = (text) => translate(text, language);
  return <Preferences.Provider value={{ language, setLanguage, theme, setTheme, t }}>{children}</Preferences.Provider>;
}
export const usePreferences = () => useContext(Preferences);
export function T({ children }) { const { t } = usePreferences(); return t(children); }
export function PreferenceControls() {
  const { language, setLanguage, theme, setTheme, t } = usePreferences();
  return <div className="flex items-center gap-2 text-xs">
    <select aria-label={t('Language')} value={language} onChange={e => setLanguage(e.target.value)} className="bg-transparent border border-current rounded-full px-2 py-1 cursor-pointer"><option className="bg-background text-foreground" value="en">EN</option><option className="bg-background text-foreground" value="fr">FR</option><option className="bg-background text-foreground" value="ar">عر</option></select>
    <button type="button" aria-label={t(theme === 'dark' ? 'Light mode' : 'Dark mode')} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="rounded-full border border-current px-2 py-1 cursor-pointer">{theme === 'dark' ? '☀' : '☾'}</button>
  </div>;
}
