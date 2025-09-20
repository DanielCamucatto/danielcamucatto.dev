import ptExperience from '../locales/pt/experience.json';
import enExperience from '../locales/en/experience.json';
import esExperience from '../locales/es/experience.json';

const translations = {
  pt: ptExperience,
  en: enExperience,
  es: esExperience,
} as const;

export type Language = keyof typeof translations;
export type TranslationKeys = typeof translations[Language];

export const getTranslations = (lang: Language = 'pt') => {
  return translations[lang];
};

export default translations;