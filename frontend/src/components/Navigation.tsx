
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslations } from '../utils/translations';

interface NavigationTranslations {
  about: string;
  experience: string;
  projects: string;
  education: string;
}

export default function Navigation() {
  const { language } = useLanguage();
  const translations = getTranslations(language).navigation as NavigationTranslations;

  return (
    <nav className="nav hidden lg:block" aria-label="In-page jump links">
      <ul className="mt-8 w-max">
        <li>
          <a className="group flex items-center py-3 active" href="#about">
            <span className="nav-indicator mr-4 h-px w-8 bg-slate-400 dark:bg-slate-600 transition-all group-hover:w-16 group-hover:bg-slate-800 dark:group-hover:bg-slate-200 group-focus-visible:w-16 group-focus-visible:bg-slate-800 dark:group-focus-visible:bg-slate-200 motion-reduce:transition-none"></span>
            <span className="nav-text text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-slate-200 group-focus-visible:text-slate-900 dark:group-focus-visible:text-slate-200">
              {translations.about}
            </span>
          </a>
        </li>
        <li>
          <a className="group flex items-center py-3" href="#experience">
            <span className="nav-indicator mr-4 h-px w-8 bg-slate-400 dark:bg-slate-600 transition-all group-hover:w-16 group-hover:bg-slate-800 dark:group-hover:bg-slate-200 group-focus-visible:w-16 group-focus-visible:bg-slate-800 dark:group-focus-visible:bg-slate-200 motion-reduce:transition-none"></span>
            <span className="nav-text text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-slate-200 group-focus-visible:text-slate-900 dark:group-focus-visible:text-slate-200">
              {translations.experience}
            </span>
          </a>
        </li>
        <li>
          <a className="group flex items-center py-3" href="#projects">
            <span className="nav-indicator mr-4 h-px w-8 bg-slate-400 dark:bg-slate-600 transition-all group-hover:w-16 group-hover:bg-slate-800 dark:group-hover:bg-slate-200 group-focus-visible:w-16 group-focus-visible:bg-slate-800 dark:group-focus-visible:bg-slate-200 motion-reduce:transition-none"></span>
            <span className="nav-text text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-slate-200 group-focus-visible:text-slate-900 dark:group-focus-visible:text-slate-200">
              {translations.projects}
            </span>
          </a>
        </li>
        <li>
          <a className="group flex items-center py-3" href="#education">
            <span className="nav-indicator mr-4 h-px w-8 bg-slate-400 dark:bg-slate-600 transition-all group-hover:w-16 group-hover:bg-slate-800 dark:group-hover:bg-slate-200 group-focus-visible:w-16 group-focus-visible:bg-slate-800 dark:group-focus-visible:bg-slate-200 motion-reduce:transition-none"></span>
            <span className="nav-text text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-slate-200 group-focus-visible:text-slate-900 dark:group-focus-visible:text-slate-200">
              {translations.education}
            </span>
          </a>
        </li>
      </ul>
    </nav>
  );
}
