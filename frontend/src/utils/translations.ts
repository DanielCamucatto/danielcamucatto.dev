import ptExperience from '../locales/pt/experience.json';
import enExperience from '../locales/en/experience.json';
import esExperience from '../locales/es/experience.json';
import ptProjects from '../locales/pt/projects.json';
import enProjects from '../locales/en/projects.json';
import esProjects from '../locales/es/projects.json';

const translations = {
  pt: {
    experience: ptExperience,
    projects: ptProjects
  },
  en: {
    experience: enExperience,
    projects: enProjects
  },
  es: {
    experience: esExperience,
    projects: esProjects
  }
} as const;

export type Language = keyof typeof translations;
export type TranslationKeys = typeof translations[Language];

export const getTranslations = (lang: Language = 'pt') => {
  return translations[lang];
};

export default translations;