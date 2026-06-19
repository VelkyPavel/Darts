import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Language, TranslationKey, translations } from '../utils/translations';

export type { Language } from '../utils/translations';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/storage';

interface LanguageContextType {
  language: Language;
  setLanguage: (l: Language) => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() =>
    loadFromStorage(STORAGE_KEYS.LANGUAGE, 'en' as Language)
  );

  const setLanguage = (l: Language) => {
    setLanguageState(l);
    saveToStorage(STORAGE_KEYS.LANGUAGE, l);
  };

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>): string => {
      let text = translations[language]?.[key] ?? translations.en[key] ?? key;
      if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
          text = text.replace(`{${k}}`, String(v));
        });
      }
      return text;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
