import { useTranslations } from '../../utils/translations';
import { registrar } from '../../utils/analytics-eventos';

export function Numeros() {
  const t = useTranslations().home.numeros;
  return (
    <section className="revela" aria-label={t.rotulo}>
      <div className="colunas tres">
        {t.itens.map((item) => (
          <div className="bloco" key={item.numero}>
            <div className="numero">{item.numero}</div>
            <p>{item.texto}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function InteligenciaArtificial() {
  const t = useTranslations().home.ia;
  return (
    <section id="ia" className="revela">
      <p className="rotulo">{t.rotulo}</p>
      <h2 className="grande">{t.titulo}</h2>
      <p className="muted intro">{t.intro}</p>
      <div className="colunas duas">
        {t.itens.map((item) => (
          <div className="bloco marcado" key={item.titulo}>
            <h3>{item.titulo}</h3>
            <p>{item.texto}</p>
          </div>
        ))}
      </div>
      <p className="muted">{t.pratica}</p>
    </section>
  );
}

export function Seguranca() {
  const t = useTranslations().home.seguranca;
  return (
    <section id="seguranca" className="revela">
      <p className="rotulo">{t.rotulo}</p>
      <h2 className="grande">{t.titulo}</h2>
      <div className="colunas tres">
        {t.itens.map((item) => (
          <div className="bloco" key={item.titulo}>
            <h3>{item.titulo}</h3>
            <p>
              {item.texto}{' '}
              {'artigo' in item && <a href={`/artigos/${item.artigo}/`}>{item.leia}</a>}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Ajuda() {
  const t = useTranslations().home.ajuda;
  return (
    <section id="ajuda" className="revela">
      <h2>{t.titulo}</h2>
      <div className="colunas duas">
        {t.itens.map((item) => (
          <div className="bloco" key={item.titulo}>
            <h3>{item.titulo}</h3>
            <p>{item.texto}</p>
            <a href="#contato" onClick={() => registrar('contato_click', { origem: 'servicos' })}>{item.acao}</a>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Casos() {
  const t = useTranslations().home.casos;
  return (
    <section id="casos" className="revela">
      <h2>{t.titulo}</h2>
      <div className="colunas tres">
        {t.itens.map((caso) => (
          <article className="bloco" key={caso.titulo}>
            <h3>{caso.titulo}</h3>
            {'problema' in caso && (
              <>
                <p className="rotulo">{t.problema}</p>
                <p>{caso.problema}</p>
              </>
            )}
            <p className="rotulo">{t.decisao}</p>
            <p>{caso.decisao}</p>
            <p className="rotulo">{t.resultado}</p>
            <p>{caso.resultado}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ChamadaArtigos() {
  const t = useTranslations().home.artigos;
  return (
    <section className="revela">
      <div className="convite">
        <div>
          <h2>{t.titulo}</h2>
          <p className="muted">{t.texto}</p>
        </div>
        <a className="botao principal" href="/artigos/">{t.acao}</a>
      </div>
    </section>
  );
}
