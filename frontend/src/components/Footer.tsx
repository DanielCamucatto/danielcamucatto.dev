
import { useLanguage } from '../hooks/useLanguage';
import { getTranslations } from '../utils/translations';
import { useState } from 'react';
import ContactModal from './ContactModal';
import ContactForm from './ContactForm';
import GhostButton from './GhostButton';

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
          <GhostButton
            onClick={() => setOpen(true)}
            ariaLabel={translations.contactButton}
            icon={(
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.25v7.5A2.25 2.25 0 005.25 18h13.5A2.25 2.25 0 0021 15.75V8.25M3 8.25L12 13.5m9-5.25L12 13.5" />
              </svg>
            )}
            fullWidthMobile
          >
            {translations.contactButton}
          </GhostButton>
        </p>

      </div>

      <ContactModal open={open} onClose={() => setOpen(false)} title={translations.modalTitle}>
        <ContactForm onClose={() => setOpen(false)} />
      </ContactModal>
    </footer>
  );
}