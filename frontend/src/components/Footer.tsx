
import { useLanguage } from '../hooks/useLanguage';
import { getTranslations } from '../utils/translations';
import { useState } from 'react';
import ContactModal from './ContactModal';
import ContactForm from './ContactForm';

interface FooterTranslations {
  contact: string;
  contactButton: string;
  modalTitle: string;
  builtWith: string;
  and: string;
  copyright: string;
}

export default function Footer() {
  const { language } = useLanguage();
  const translations = getTranslations(language).footer as FooterTranslations;
  const [open, setOpen] = useState(false);

  return (
    <footer className="max-w-md pb-16 text-sm text-slate-500 sm:pb-0">
      <div className="space-y-3">
        <p className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
          {/* <span>
            {translations.contact}
          </span> */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            aria-label={translations.contactButton}
            className="mt-2 sm:mt-0 inline-flex items-center gap-2 px-3 py-2 text-slate-600 dark:text-slate-400 hover:text-teal-500 dark:hover:text-teal-400 font-medium border border-slate-300 dark:border-slate-600 hover:border-teal-500 dark:hover:border-teal-400 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50"
          >
            {/* mail icon */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.25v7.5A2.25 2.25 0 005.25 18h13.5A2.25 2.25 0 0021 15.75V8.25M3 8.25L12 13.5m9-5.25L12 13.5" />
            </svg>
            <span className="text-sm font-normal">{translations.contactButton}</span>
          </button>
        </p>

        <p className="text-xs">
          {translations.copyright}
        </p>
      </div>

      <ContactModal open={open} onClose={() => setOpen(false)} title={translations.modalTitle}>
        <ContactForm onClose={() => setOpen(false)} />
      </ContactModal>
    </footer>
  );
}