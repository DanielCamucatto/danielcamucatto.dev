
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslations } from '../utils/translations';

interface FooterTranslations {
  contact: string;
  builtWith: string;
  and: string;
  copyright: string;
}

export default function Footer() {
  const { language } = useLanguage();
  const translations = getTranslations(language).footer as FooterTranslations;

  return (
    <footer className="max-w-md pb-16 text-sm text-slate-500 sm:pb-0">
      <div className="space-y-3">
        <p>
          {translations.contact}{" "}
          <a
            href="mailto:daniel.camucatto@gmail.com"
            className="font-medium text-slate-400 hover:text-teal-300 focus-visible:text-teal-300"
            aria-label="Enviar email para Daniel Camucatto"
          >
            daniel.camucatto@gmail.com
          </a>
        </p>
        
        <p>
          {translations.builtWith}{" "}
          <a
            href="https://reactjs.org/"
            className="font-medium text-slate-400 hover:text-teal-300 focus-visible:text-teal-300"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="React (opens in a new tab)"
          >
            React
          </a>{" "}
          {translations.and}{" "}
          <a
            href="https://tailwindcss.com/"
            className="font-medium text-slate-400 hover:text-teal-300 focus-visible:text-teal-300"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Tailwind CSS (opens in a new tab)"
          >
            Tailwind CSS
          </a>
          .
        </p>
        
        <p className="text-xs">
          {translations.copyright}
        </p>
      </div>
    </footer>
  );
}