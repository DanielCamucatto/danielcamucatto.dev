
import { getTranslations } from '../utils/translations';

interface HeaderTranslations {
  name: string;
  role: string;
  description: string;
}

export default function Header() {
  const translations = getTranslations('pt').header as HeaderTranslations;

  return (
    <header className="lg:sticky lg:top-0 lg:max-h-screen lg:w-1/2 lg:flex lg:flex-col lg:justify-between lg:py-24">
      <div>
        <div className="mb-4">
          <h1 className="text-4xl font-bold tracking-tight text-slate-800 dark:text-slate-200 sm:text-5xl">
            {translations.name}
          </h1>
          <h2 className="mt-3 text-lg font-medium tracking-tight text-slate-700 dark:text-slate-200 sm:text-xl">
            {translations.role}
          </h2>
          <p className="mt-4 max-w-xs leading-normal text-slate-600 dark:text-slate-400">
            {translations.description}
          </p>
        </div>
      </div>
    </header>
  );
}