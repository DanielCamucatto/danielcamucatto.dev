import React, { createContext, useEffect, useState } from 'react';

export type Language = 'pt' | 'en' | 'es';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export { LanguageContext };

const CHAVE = 'idioma';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('pt');

  // O HTML do build sai em português; o idioma salvo entra depois de montar,
  // para o primeiro render no navegador bater com o que veio do servidor.
  useEffect(() => {
    const salvo = localStorage.getItem(CHAVE);
    if (salvo === 'en' || salvo === 'es') setLanguageState(salvo);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === 'pt' ? 'pt-BR' : language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    localStorage.setItem(CHAVE, lang);
    setLanguageState(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
