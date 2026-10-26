import { Sun, Moon } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
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
    <Select value={language} onValueChange={setLanguage} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <SelectTrigger aria-label={t('Language')} className="h-8 w-auto text-xs"><SelectValue /></SelectTrigger>
      <SelectContent>
        <SelectItem value="en">EN</SelectItem>
        <SelectItem value="fr">FR</SelectItem>
        <SelectItem value="ar">عر</SelectItem>
      </SelectContent>
    </Select>
    <button type="button" aria-label={t(theme === 'dark' ? 'Light mode' : 'Dark mode')} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="glass-select-trigger flex h-8 w-8 shrink-0 items-center justify-center" title={t(theme === 'dark' ? 'Light mode' : 'Dark mode')}>{theme === 'dark' ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}</button>
  </div>;
}
