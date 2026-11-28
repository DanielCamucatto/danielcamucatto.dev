import { useEffect, useRef, useState } from 'react';
import { useTranslations } from '../../utils/translations';

interface Projeto {
  title: string;
  description: string;
  link: string;
  imageUrl: string;
  details: string[];
  discontinued?: boolean;
}

// Altura de rolagem gasta em cada projeto, em fração da tela
const PASSO = 0.7;
// O efeito só vale em tela grande e para quem não pediu menos movimento
const CONSULTA = '(min-width: 900px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)';

export default function Projetos() {
  const traducoes = useTranslations();
  const t = traducoes.home.projetos;
  const titulo = traducoes.projects.title;
  const projetos = traducoes.projects.projects as readonly unknown[] as Projeto[];
  const secao = useRef<HTMLElement>(null);
  const [animado, setAnimado] = useState(false);
  const [atual, setAtual] = useState(0);
  const total = projetos.length;

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const consulta = window.matchMedia(CONSULTA);
    const elemento = secao.current!;
    const itens = [...elemento.querySelectorAll<HTMLElement>('.proj')];

    const desenhar = () => {
      if (!consulta.matches) return;
      const passo = window.innerHeight * PASSO;
      const bruto = Math.min(total - 1, Math.max(0, -elemento.getBoundingClientRect().top / passo));
      // Cada projeto "descansa" na tela antes de passar para o próximo
      const inteiro = Math.floor(bruto);
      const f = Math.min(1, Math.max(0, (bruto - inteiro - 0.2) / 0.6));
      const posicao = inteiro + f * f * (3 - 2 * f);
      itens.forEach((item, i) => {
        const deslocamento = i - posicao;
        const distancia = Math.min(1, Math.abs(deslocamento));
        item.style.setProperty('--o', String(deslocamento));
        item.style.setProperty('--g', String(distancia));
        item.style.setProperty('--vis', String(Math.max(0, 1 - distancia * 2)));
      });
      setAtual(Math.round(posicao));
    };
    const ajustar = () => {
      setAnimado(consulta.matches);
      elemento.style.height = consulta.matches
        ? `${(total - 1) * window.innerHeight * PASSO + window.innerHeight}px`
        : '';
      desenhar();
    };

    ajustar();
    window.addEventListener('scroll', desenhar, { passive: true });
    window.addEventListener('resize', ajustar);
    consulta.addEventListener('change', ajustar);
    return () => {
      window.removeEventListener('scroll', desenhar);
      window.removeEventListener('resize', ajustar);
      consulta.removeEventListener('change', ajustar);
    };
    // refaz as posições quando o idioma troca os textos
  }, [total, projetos]);

  const irPara = (i: number) => {
    const topo = secao.current!.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: topo + i * window.innerHeight * PASSO });
  };

  return (
    <section id="projetos" ref={secao} className={animado ? 'vitrine viva' : 'vitrine'}>
      <div className="palco">
        <h2 className="vitrine-titulo">{titulo}</h2>
        {projetos.map((projeto, i) => (
          <article
            // a imagem não muda com o idioma; o título muda, e recriaria o item sem a posição
            key={projeto.imageUrl}
            className={`proj${i === atual ? ' ativo' : ''}${projeto.title.length > 21 ? ' longo' : ''}`}
            onFocus={() => animado && i !== atual && irPara(i)}
          >
            <div className="info">
              <p className="rotulo">{String(i + 1).padStart(2, '0')} / {total}</p>
              <h3>{projeto.title}</h3>
              <p className="descricao">{projeto.description}</p>
              <ul>
                {projeto.details.slice(0, 3).map((detalhe) => <li key={detalhe}>{detalhe}</li>)}
              </ul>
              {projeto.discontinued ? (
                <p><strong>{t.descontinuado}</strong></p>
              ) : (
                <a href={projeto.link} target="_blank" rel="noopener noreferrer">{t.visitar}</a>
              )}
            </div>
            <div className="tela">
              <img src={`/${projeto.imageUrl}`} alt={`${t.tela}: ${projeto.title}`} loading="lazy" />
            </div>
          </article>
        ))}
        {animado && (
          <>
            <div className="marcas">
              {projetos.map((projeto, i) => (
                <button key={projeto.imageUrl} type="button" aria-label={projeto.title} aria-current={i === atual} onClick={() => irPara(i)} />
              ))}
            </div>
            <a className="pular" href="#depois-projetos">{t.pular}</a>
          </>
        )}
      </div>
    </section>
  );
}
