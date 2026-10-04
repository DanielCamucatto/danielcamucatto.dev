
import { useLanguage } from '../hooks/useLanguage';
import { getTranslations } from '../utils/translations';
import { useSmoothScroll } from '../hooks/useSmoothScroll';
import { useActiveSection } from '../hooks/useActiveSection';

interface NavigationTranslations {
  about: string;
  experience: string;
  projects: string;
  education: string;
}

export default function Navigation() {
  const { language } = useLanguage();
  const translations = getTranslations(language).navigation as NavigationTranslations;
  const { handleNavClick } = useSmoothScroll();
  const activeSection = useActiveSection();

  return (
    <nav className="nav hidden lg:block" aria-label="In-page jump links">
      <ul className="mt-8 w-max">
        <li>
          <a 
            className={`group flex items-center py-3 ${activeSection === 'about' ? 'active' : ''}`}
            href="#about"
            onClick={(e) => handleNavClick(e, 'about')}
          >
            <span className={`nav-indicator mr-4 h-px transition-all motion-reduce:transition-none ${
              activeSection === 'about' 
                ? 'w-16 bg-slate-800 dark:bg-slate-200' 
                : 'w-8 bg-slate-400 dark:bg-slate-600 group-hover:w-16 group-hover:bg-slate-800 dark:group-hover:bg-slate-200 group-focus-visible:w-16 group-focus-visible:bg-slate-800 dark:group-focus-visible:bg-slate-200'
            }`}></span>
            <span className={`nav-text text-xs font-bold uppercase tracking-widest transition-colors ${
              activeSection === 'about'
                ? 'text-slate-900 dark:text-slate-200'
                : 'text-slate-600 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-slate-200 group-focus-visible:text-slate-900 dark:group-focus-visible:text-slate-200'
            }`}>
              {translations.about}
            </span>
          </a>
        </li>
        <li>
          <a 
            className={`group flex items-center py-3 ${activeSection === 'experience' ? 'active' : ''}`}
            href="#experience"
            onClick={(e) => handleNavClick(e, 'experience')}
          >
            <span className={`nav-indicator mr-4 h-px transition-all motion-reduce:transition-none ${
              activeSection === 'experience' 
                ? 'w-16 bg-slate-800 dark:bg-slate-200' 
                : 'w-8 bg-slate-400 dark:bg-slate-600 group-hover:w-16 group-hover:bg-slate-800 dark:group-hover:bg-slate-200 group-focus-visible:w-16 group-focus-visible:bg-slate-800 dark:group-focus-visible:bg-slate-200'
            }`}></span>
            <span className={`nav-text text-xs font-bold uppercase tracking-widest transition-colors ${
              activeSection === 'experience'
                ? 'text-slate-900 dark:text-slate-200'
                : 'text-slate-600 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-slate-200 group-focus-visible:text-slate-900 dark:group-focus-visible:text-slate-200'
            }`}>
              {translations.experience}
            </span>
          </a>
        </li>
        <li>
          <a 
            className={`group flex items-center py-3 ${activeSection === 'projects' ? 'active' : ''}`}
            href="#projects"
            onClick={(e) => handleNavClick(e, 'projects')}
          >
            <span className={`nav-indicator mr-4 h-px transition-all motion-reduce:transition-none ${
              activeSection === 'projects' 
                ? 'w-16 bg-slate-800 dark:bg-slate-200' 
                : 'w-8 bg-slate-400 dark:bg-slate-600 group-hover:w-16 group-hover:bg-slate-800 dark:group-hover:bg-slate-200 group-focus-visible:w-16 group-focus-visible:bg-slate-800 dark:group-focus-visible:bg-slate-200'
            }`}></span>
            <span className={`nav-text text-xs font-bold uppercase tracking-widest transition-colors ${
              activeSection === 'projects'
                ? 'text-slate-900 dark:text-slate-200'
                : 'text-slate-600 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-slate-200 group-focus-visible:text-slate-900 dark:group-focus-visible:text-slate-200'
            }`}>
              {translations.projects}
            </span>
          </a>
        </li>
        <li>
          <a 
            className={`group flex items-center py-3 ${activeSection === 'education' ? 'active' : ''}`}
            href="#education"
            onClick={(e) => handleNavClick(e, 'education')}
          >
            <span className={`nav-indicator mr-4 h-px transition-all motion-reduce:transition-none ${
              activeSection === 'education' 
                ? 'w-16 bg-slate-800 dark:bg-slate-200' 
                : 'w-8 bg-slate-400 dark:bg-slate-600 group-hover:w-16 group-hover:bg-slate-800 dark:group-hover:bg-slate-200 group-focus-visible:w-16 group-focus-visible:bg-slate-800 dark:group-focus-visible:bg-slate-200'
            }`}></span>
            <span className={`nav-text text-xs font-bold uppercase tracking-widest transition-colors ${
              activeSection === 'education'
                ? 'text-slate-900 dark:text-slate-200'
                : 'text-slate-600 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-slate-200 group-focus-visible:text-slate-900 dark:group-focus-visible:text-slate-200'
            }`}>
              {translations.education}
            </span>
          </a>
        </li>
      </ul>
    </nav>
  );
}
