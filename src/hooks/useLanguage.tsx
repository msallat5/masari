import { useState, createContext, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

type Language = 'ar' | 'en';
type Direction = 'rtl' | 'ltr';

interface LanguageContextType {
  language: Language;
  direction: Direction;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const { i18n } = useTranslation();
  // Check if user has previously set language
  const storedLanguage = localStorage.getItem('language') as Language | null;
  const defaultLanguage = storedLanguage || 'ar';
  
  const [language, setLanguage] = useState<Language>(defaultLanguage);
  const direction: Direction = language === 'ar' ? 'rtl' : 'ltr';
  
  // Update document direction when language changes
  useEffect(() => {
    // Change i18n language
    i18n.changeLanguage(language);
    
    // Save language preference
    localStorage.setItem('language', language);
  }, [language, direction, i18n]);
  
  // Toggle between Arabic and English
  const toggleLanguage = () => {
    setLanguage(prevLang => prevLang === 'ar' ? 'en' : 'ar');
  };
  
  return (
    <LanguageContext.Provider value={{ language, direction, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 