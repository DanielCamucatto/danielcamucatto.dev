import { useState } from 'react';
import { useTranslations } from '../../utils/translations';

interface Item {
  period: string;
  role: string;
  company: string;
  description: string[];
  technologies?: string[];
  link?: string;
}

export default function Experiencia() {
  const traducoes = useTranslations();
  const t = traducoes.home.experiencia;
  const itens = traducoes.experience.experiences as readonly unknown[] as Item[];
  const [aberta, setAberta] = useState(0);

  return (
    <section id="experiencia" className="revela">
      <h2 className="grande">{t.titulo}</h2>
      <p className="muted">{t.instrucao}</p>
      <div className="xp">
        <div className="xp-lista" role="group" aria-label={t.empresas}>
          {itens.map((item, i) => (
            <button key={item.company} type="button" aria-pressed={i === aberta} aria-controls={`xp-${i}`} onClick={() => setAberta(i)}>
              <strong>{item.company}</strong>
              <span>{item.period}</span>
            </button>
          ))}
        </div>
        {/* Todas saem no HTML, para busca; só a escolhida fica visível */}
        <div>
          {itens.map((item, i) => (
            <article key={item.company} id={`xp-${i}`} className="bloco xp-painel" hidden={i !== aberta}>
              <p className="rotulo">{item.period}</p>
              <h3>{item.role} · {item.company}</h3>
              <h4>{t.entregas}</h4>
              <ul className="feito">
                {item.description.map((linha) => <li key={linha}>{linha}</li>)}
              </ul>
              <ul className="tecnologias">
                {item.technologies?.map((tecnologia) => <li key={tecnologia}>{tecnologia}</li>)}
              </ul>
              {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer">{t.site}</a>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
