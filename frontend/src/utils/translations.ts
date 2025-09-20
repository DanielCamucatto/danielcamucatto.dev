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

const translations = {
  pt: {
    experience: ptExperience,
    projects: ptProjects,
    header: ptHeader,
    about: ptAbout
  },
  en: {
    experience: enExperience,
    projects: enProjects,
    header: enHeader,
    about: enAbout
  },
  es: {
    experience: esExperience,
    projects: esProjects,
    header: esHeader,
    about: esAbout
  }
} as const;

export type Language = keyof typeof translations;
export type TranslationKeys = typeof translations[Language];

export const getTranslations = (lang: Language = 'pt') => {
  return translations[lang];
};

export default translations;