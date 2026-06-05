import React, { createContext, useState, useContext, useEffect } from 'react';
import { translations } from '../utils/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [locale, setLocale] = useState(() => {
    return localStorage.getItem('kisanurea_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('kisanurea_lang', locale);
  }, [locale]);

  const t = (key) => {
    const translationSet = translations[locale] || translations['en'];
    return translationSet[key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language: locale, setLanguage: setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
