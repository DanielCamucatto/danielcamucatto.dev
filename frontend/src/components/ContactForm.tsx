import { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { getTranslations } from '../utils/translations';
import { registrar } from '../utils/analytics-eventos';

interface Props {
  onClose?: () => void;
}

export default function ContactForm({ onClose }: Props) {
  const { language } = useLanguage();
  const translations = getTranslations(language).contactForm;
  const { assuntos } = getTranslations(language).home.contato;
  
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
        
        registrar('contato_enviado', { assunto: subject });
        setSent(true);
        setTimeout(() => onClose?.(), 2000);
      } catch {
        setError(translations.errorSending);
      } finally {
        setLoading(false);
      }
    })();
  }

  if (sent) {
    return (
      <div className="p-4 text-center" role="status">
        {translations.successMessage}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <label htmlFor="contact-name" className="text-sm">
          {translations.nameLabel} <span className="text-red-500">*</span>
        </label>
        <input
          id="contact-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={translations.namePlaceholder}
          required
        />
      </div>

      <div>
        <label htmlFor="contact-email" className="text-sm">
          {translations.emailLabel} <span className="text-red-500">*</span>
        </label>
        <input
          id="contact-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={translations.emailPlaceholder}
          required
        />
      </div>

      <div>
        <label htmlFor="contact-subject" className="text-sm">
          {translations.subjectLabel} <span className="text-red-500">*</span>
        </label>
        <select
          id="contact-subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        >
          <option value="">{translations.subjectPlaceholder}</option>
          {assuntos.map((assunto) => (
            <option key={assunto} value={assunto}>{assunto}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="contact-message" className="text-sm">
          {translations.messageLabel} <span className="text-red-500">*</span>
        </label>
        <textarea
          id="contact-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
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
          className="inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold disabled:opacity-60"
        >
          {loading ? translations.sending : translations.send}
        </button>
      </div>
    </form>
  );
}
