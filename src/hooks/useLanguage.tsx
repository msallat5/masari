import { createContext, useContext, useState, useEffect } from 'react';
import type { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

/** Supported language codes */
export type Language = 'ar' | 'en';
/** Corresponding text direction */
export type Direction = 'rtl' | 'ltr';

/** Context shape providing language settings and a toggler */
interface LanguageContextType {
  language: Language;
  direction: Direction;
  toggleLanguage: () => void;
}

/** React Context for language; undefined when used outside a provider */
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/**
 * Wrap your app in LanguageProvider to:
 * - Persist the chosen language in localStorage
 * - Sync i18next language
 * - Provide `language`, `direction`, and `toggleLanguage` to descendants
 */
export const LanguageProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();

  // Load saved language or default to Arabic
  const stored = localStorage.getItem('language') as Language | null;
  const [language, setLanguage] = useState<Language>(stored ?? 'ar');
  const direction: Direction = language === 'ar' ? 'rtl' : 'ltr';

  // Whenever `language` changes, update i18next and localStorage
  useEffect(() => {
    i18n.changeLanguage(language);
    localStorage.setItem('language', language);
  }, [language, i18n]);

  /** Toggle between 'ar' and 'en' */
  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'ar' ? 'en' : 'ar'));
  };

  return (
    <LanguageContext.Provider value={{ language, direction, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

/**
 * Hook to access language settings.
 * Throws if used outside of LanguageProvider.
 */
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
