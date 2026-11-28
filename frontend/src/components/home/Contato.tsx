import { useState } from 'react';
import { useTranslations } from '../../utils/translations';
import { registrar } from '../../utils/analytics-eventos';
import ContactModal from '../ContactModal';
import ContactForm from '../ContactForm';

export default function Contato() {
  const traducoes = useTranslations();
  const t = traducoes.home.contato;
  const [aberto, setAberto] = useState(false);

  return (
    <section id="contato" className="revela">
      <h2>{t.titulo}</h2>
      <p className="muted">{t.texto}</p>
      <button
        type="button"
        className="botao principal"
        aria-haspopup="dialog"
        onClick={() => { registrar('contato_click', { origem: 'contato' }); setAberto(true); }}
      >
        {t.acao}
      </button>
      <ContactModal open={aberto} onClose={() => setAberto(false)} title={traducoes.footer.modalTitle}>
        <ContactForm onClose={() => setAberto(false)} />
      </ContactModal>
    </section>
  );
}
