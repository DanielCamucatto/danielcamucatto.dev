import { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { getTranslations } from '../utils/translations';

interface Props {
  onClose?: () => void;
}

export default function ContactForm({ onClose }: Props) {
  const { language } = useLanguage();
  const translations = getTranslations(language).contactForm;
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  function validate() {
    if (!name || !email || !subject || !message) {
      return translations.errorRequired;
    }
    // simples validação de email
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return translations.errorInvalidEmail;
    }
    return null;
  }

  function onSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    const v = validate();
    setError(v);
    if (v) return;
    setError(null);
    setLoading(true);
    (async () => {
      try {
        const res = await fetch('https://formspree.io/f/xyznpdbz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            name, 
            email, 
            subject, 
            message,
            _replyto: email,
            _subject: `Novo contato: ${subject}`
          }),
        });
        
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Falha no envio');
        }
        
        setSent(true);
        setTimeout(() => onClose?.(), 2000);
      } catch (err) {
        setError(translations.errorSending);
      } finally {
        setLoading(false);
      }
    })();
  }

  if (sent) {
    return (
      <div className="rounded border border-slate-200 bg-slate-50 p-4 text-center text-slate-800 dark:bg-slate-900 dark:text-slate-100">
        {translations.successMessage}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <label className="text-sm text-slate-700 dark:text-slate-200">
          {translations.nameLabel} <span className="text-red-500">*</span>
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded border px-3 py-2 text-sm text-slate-900 dark:bg-slate-800 dark:text-slate-100"
          placeholder={translations.namePlaceholder}
          required
        />
      </div>

      <div>
        <label className="text-sm text-slate-700 dark:text-slate-200">
          {translations.emailLabel} <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded border px-3 py-2 text-sm text-slate-900 dark:bg-slate-800 dark:text-slate-100"
          placeholder={translations.emailPlaceholder}
          required
        />
      </div>

      <div>
        <label className="text-sm text-slate-700 dark:text-slate-200">
          {translations.subjectLabel} <span className="text-red-500">*</span>
        </label>
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="mt-1 w-full rounded border px-3 py-2 text-sm text-slate-900 dark:bg-slate-800 dark:text-slate-100"
          placeholder={translations.subjectPlaceholder}
          required
        />
      </div>

      <div>
        <label className="text-sm text-slate-700 dark:text-slate-200">
          {translations.messageLabel} <span className="text-red-500">*</span>
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1 w-full rounded border px-3 py-2 text-sm text-slate-900 dark:bg-slate-800 dark:text-slate-100"
          rows={5}
          placeholder={translations.messagePlaceholder}
          required
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center rounded-md bg-teal-500 px-3 py-1 text-white text-sm font-medium hover:bg-teal-400 disabled:opacity-60"
        >
          {loading ? translations.sending : translations.send}
        </button>
      </div>
    </form>
  );
}
