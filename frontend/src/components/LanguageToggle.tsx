import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const languages = {
  pt: { name: 'Português', flag: '🇧🇷' },
  en: { name: 'English', flag: '🇺🇸' },
  es: { name: 'Español', flag: '🇪🇸' },
} as const;

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (newLanguage: 'pt' | 'en' | 'es') => {
    setLanguage(newLanguage);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="flex items-center rounded-lg p-2 text-sm text-slate-400 hover:text-teal-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
        aria-label="Selecionar idioma"
        onClick={toggleDropdown}
      >
        <span className="sr-only">Selecionar idioma</span>
        <span className="text-xl">{languages[language].flag}</span>
      </button>
      
      <div className={`absolute right-0 mt-2 w-48 rounded-md bg-white dark:bg-slate-800 shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-200 ${
        isOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-2 invisible'
      }`}>
        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="language-menu">
          {Object.entries(languages).map(([code, { name, flag }]) => (
            <button
              key={code}
              onClick={() => handleLanguageChange(code as 'pt' | 'en' | 'es')}
              className={`flex w-full items-center px-4 py-2 text-sm transition-colors ${
                language === code
                  ? 'bg-slate-100 dark:bg-slate-700 text-teal-300'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
              role="menuitem"
            >
              <span className="mr-2">{flag}</span>
              <span>{name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
