import { useLanguage } from '../../hooks/useLanguage';
import { useTheme } from '../../hooks/useTheme';
import { useTranslations } from '../../utils/translations';
import { generatePDF } from '../../services/pdfGenerator';
import { registrar } from '../../utils/analytics-eventos';

const IDIOMAS = ['pt', 'en', 'es'] as const;

const ICONES = {
  github: 'M8 0C3.6 0 0 3.6 0 8c0 3.5 2.3 6.5 5.5 7.6.4.1.5-.2.5-.4v-1.5c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.2 1.9.9 2.3.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.1-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8a7.5 7.5 0 014 0c1.5-1 2.2-.8 2.2-.8.4 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.1 0 3.1-1.9 3.7-3.6 3.9.3.3.5.8.5 1.5v2.2c0 .2.1.5.6.4A8 8 0 0016 8c0-4.4-3.6-8-8-8z',
  linkedin: 'M0 1.1C0 .5.5 0 1.2 0h13.6C15.5 0 16 .5 16 1.1v13.8c0 .6-.5 1.1-1.2 1.1H1.2C.5 16 0 15.5 0 14.9V1.1zM4.9 13.4V6.2H2.5v7.2h2.4zM3.7 5.2c.8 0 1.4-.6 1.4-1.2C5 3.2 4.5 2.7 3.7 2.7S2.3 3.2 2.3 3.9c0 .7.5 1.3 1.3 1.3h.1zm4.9 8.2v-4c0-.2 0-.4.1-.6.2-.4.6-.9 1.3-.9.9 0 1.2.7 1.2 1.7v3.8h2.4V9.3c0-2.2-1.2-3.2-2.7-3.2-1.2 0-1.8.7-2.1 1.2V6.2H6.4v7.2h2.2z',
};

export function Menu() {
  const { language, setLanguage } = useLanguage();
  const { toggleTheme } = useTheme();
  const t = useTranslations().home.nav;
  const secoes = [
    ['#ia', t.ia],
    ['#ajuda', t.ajuda],
    ['#casos', t.casos],
    ['#projetos', t.projetos],
    ['#experiencia', t.experiencia],
  ];

  return (
    <nav className="menu" aria-label="Menu">
      <a className="menu-artigos" href="/artigos/">{t.artigos}</a>
      {secoes.map(([href, nome]) => (
        <a key={href} href={href}>{nome}</a>
      ))}
      <span className="idiomas" role="group" aria-label={t.rotulo}>
        {IDIOMAS.map((idioma) => (
          <button key={idioma} type="button" aria-pressed={language === idioma} onClick={() => setLanguage(idioma)}>
            {idioma.toUpperCase()}
          </button>
        ))}
      </span>
      <button type="button" className="botao" onClick={toggleTheme}>{t.tema}</button>
    </nav>
  );
}

export default function Topo() {
  const { language } = useLanguage();
  const traducoes = useTranslations();
  const t = traducoes.home.topo;
  const { name, socialLinks } = traducoes.header;
  // O nome de exibição é o curto: "Daniel Camuçatto"
  const partes = name.split(' ');
  const [primeiro, ultimo] = [partes[0], partes[partes.length - 1]];

  const baixar = () => {
    registrar('cv_download', { idioma: language });
    try {
      generatePDF(language);
    } catch (erro) {
      console.error('Erro ao gerar PDF:', erro);
    }
  };

  return (
    <header className="abre">
      <div>
        <h1 className="nome">
          {primeiro} <br />
          {ultimo}
        </h1>
        <p className="frase">
          {t.frase} <span>{t.complemento}</span>
        </p>
        <p className="muted">{t.resumo}</p>
        <div className="acoes">
          <a className="botao principal" href="#contato" onClick={() => registrar('contato_click', { origem: 'topo' })}>{t.falar}</a>
          <a className="botao contorno" href="/artigos/">{t.ler}</a>
          <button type="button" className="botao" onClick={baixar}>{t.cv}</button>
        </div>
        <div className="redes">
          {(['github', 'linkedin'] as const).map((rede) => (
            <a key={rede} className="botao" href={socialLinks[rede].url} target="_blank" rel="noopener noreferrer me">
              <svg viewBox="0 0 16 16" width="18" height="18" fill="currentColor" aria-hidden="true"><path d={ICONES[rede]} /></svg>
              {socialLinks[rede].label}
            </a>
          ))}
        </div>
      </div>
      <img className="foto" src="/avatar.webp" alt={t.foto} width={480} height={480} fetchPriority="high" />
    </header>
  );
}
