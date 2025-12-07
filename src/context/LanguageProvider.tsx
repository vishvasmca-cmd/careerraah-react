'use client';

import { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { translations } from '@/lib/translations';

export type Language = 'en' | 'hi' | 'bn' | 'ta' | 'te' | 'mr';

export const languageOptions: { code: Language; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी (Hindi)' },
  { code: 'bn', name: 'বাংলা (Bengali)' },
  { code: 'ta', name: 'தமிழ் (Tamil)' },
  { code: 'te', name: 'తెలుగు (Telugu)' },
  { code: 'mr', name: 'मराठी (Marathi)' },
];

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: keyof typeof translations.en) => string;
};

export const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: () => '',
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('career-raah-language') as Language;
    if (savedLanguage && languageOptions.some(opt => opt.code === savedLanguage)) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('career-raah-language', lang);
  };

  const t = useCallback(
    (key: keyof (typeof translations)['en']) => {
      return translations[language]?.[key] || translations.en[key];
    },
    [language]
  );
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
