import ptExperience from '../locales/pt/experience.json';
import enExperience from '../locales/en/experience.json';
import esExperience from '../locales/es/experience.json';
import ptProjects from '../locales/pt/projects.json';
import enProjects from '../locales/en/projects.json';
import esProjects from '../locales/es/projects.json';
import ptHeader from '../locales/pt/header.json';
import enHeader from '../locales/en/header.json';
import esHeader from '../locales/es/header.json';
import ptAbout from '../locales/pt/about.json';
import enAbout from '../locales/en/about.json';
import esAbout from '../locales/es/about.json';
import ptFooter from '../locales/pt/footer.json';
import enFooter from '../locales/en/footer.json';
import esFooter from '../locales/es/footer.json';
import ptEducation from '../locales/pt/education.json';
import enEducation from '../locales/en/education.json';
import esEducation from '../locales/es/education.json';
import ptNavigation from '../locales/pt/navigation.json';
import enNavigation from '../locales/en/navigation.json';
import esNavigation from '../locales/es/navigation.json';

const translations = {
  pt: {
    experience: ptExperience,
    projects: ptProjects,
    header: ptHeader,
    about: ptAbout,
    footer: ptFooter,
    education: ptEducation,
    navigation: ptNavigation
  },
  en: {
    experience: enExperience,
    projects: enProjects,
    header: enHeader,
    about: enAbout,
    footer: enFooter,
    education: enEducation,
    navigation: enNavigation
  },
  es: {
    experience: esExperience,
    projects: esProjects,
    header: esHeader,
    about: esAbout,
    footer: esFooter,
    education: esEducation,
    navigation: esNavigation
  }
} as const;

import { useLanguage } from '../contexts/LanguageContext';

export type Language = keyof typeof translations;
export type TranslationKeys = typeof translations[Language];

// Hook para uso dentro de componentes: usa o contexto
export function useTranslations(): TranslationKeys {
  const { language } = useLanguage();
  return translations[language as Language];
}

export function getTranslations(defaultLang: 'pt' | 'en' | 'es' = 'pt') {
  // Use apenas o idioma padrão para evitar usar hook fora de componente
  return translations[defaultLang];
}

export default translations;