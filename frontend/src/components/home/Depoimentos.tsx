import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useTranslations } from '../../utils/translations';
import { registrar } from '../../utils/analytics-eventos';

interface Depoimento {
  id: string;
  nome: string;
  cargo: string;
  empresa: string;
  linkedin: string;
  texto: string;
  temFoto: boolean;
}

interface Estado {
  chave: string;
  lista: Depoimento[];
}

interface Turnstile {
  render(alvo: HTMLElement, opcoes: { sitekey: string }): string;
  reset(id: string): void;
  remove(id: string): void;
}

const janela = () => window as unknown as { turnstile?: Turnstile };
const SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
const USUARIO_GITHUB = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

// Recorta em quadrado e regrava em JPEG, o que também descarta metadados como a localização
async function prepararFoto(arquivo: File): Promise<Blob> {
  if (!/^image\/(jpeg|png|webp)$/.test(arquivo.type) || arquivo.size > 5 * 1024 * 1024) throw new Error('foto');
  const imagem = await createImageBitmap(arquivo);
  const lado = Math.min(imagem.width, imagem.height);
  const tela = document.createElement('canvas');
  tela.width = tela.height = 256;
  const desenho = tela.getContext('2d')!;
  desenho.fillStyle = '#fff';
  desenho.fillRect(0, 0, 256, 256);
  desenho.drawImage(imagem, (imagem.width - lado) / 2, (imagem.height - lado) / 2, lado, lado, 0, 0, 256, 256);
  return new Promise((ok, falha) => tela.toBlob((b) => (b ? ok(b) : falha(new Error('foto'))), 'image/jpeg', 0.85));
}

function Formulario({ chave }: { chave: string }) {
  const t = useTranslations().home.depoimentos;
  const caixa = useRef<HTMLDivElement>(null);
  const widget = useRef<string>('');
  const [texto, setTexto] = useState('');
  const [github, setGithub] = useState('');
  const [previa, setPrevia] = useState('');
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [aviso, setAviso] = useState<{ tipo: 'ok' | 'erro'; codigo: string } | null>(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const montar = () => {
      if (caixa.current && janela().turnstile && !widget.current) {
        widget.current = janela().turnstile!.render(caixa.current, { sitekey: chave });
      }
    };
    if (janela().turnstile) montar();
    else {
      let script = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT}"]`);
      if (!script) {
        script = document.createElement('script');
        script.src = SCRIPT;
        script.async = true;
        document.head.appendChild(script);
      }
      script.addEventListener('load', montar);
    }
    return () => {
      if (widget.current) janela().turnstile?.remove(widget.current);
      widget.current = '';
    };
  }, [chave]);

  // Prévia: a foto enviada tem prioridade sobre a do GitHub
  useEffect(() => {
    if (arquivo) {
      const url = URL.createObjectURL(arquivo);
      setPrevia(url);
      return () => URL.revokeObjectURL(url);
    }
    const usuario = github.trim().replace(/^@/, '');
    setPrevia('');
    if (!USUARIO_GITHUB.test(usuario)) return;
    // Espera a pessoa parar de digitar antes de buscar
    const espera = setTimeout(() => setPrevia(`https://github.com/${usuario}.png?size=256`), 600);
    return () => clearTimeout(espera);
  }, [arquivo, github]);

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const formulario = evento.currentTarget;
    if (!formulario.checkValidity()) return setAviso({ tipo: 'erro', codigo: 'campos' });
    setEnviando(true);
    setAviso(null);
    try {
      const dados = new FormData(formulario);
      dados.delete('foto');
      if (arquivo) dados.set('foto', await prepararFoto(arquivo), 'foto.jpg');
      const resposta = await fetch('/api/depoimentos', { method: 'POST', body: dados });
      const corpo = (await resposta.json()) as { erro?: string };
      if (!resposta.ok) throw new Error(corpo.erro);
      registrar('depoimento_enviado');
      // Aviso por e-mail, pelo mesmo serviço do contato. Se falhar, o envio continua válido.
      fetch('https://formspree.io/f/xyznpdbz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: 'Novo depoimento pendente no site',
          message: `${String(dados.get('nome'))} enviou um depoimento. Revise em https://danielcamucatto.dev.br/admin/depoimentos/`,
        }),
      }).catch(() => {});
      formulario.reset();
      setTexto('');
      setGithub('');
      setArquivo(null);
      setAviso({ tipo: 'ok', codigo: 'enviado' });
    } catch (falha) {
      setAviso({ tipo: 'erro', codigo: falha instanceof Error ? falha.message : 'geral' });
    } finally {
      setEnviando(false);
      if (widget.current) janela().turnstile?.reset(widget.current);
    }
  }

  const mensagens = t.mensagens as Record<string, string>;
  const opcional = <small>{t.opcional}</small>;

  return (
    <form id="form-depoimento" className="form-depoimento" onSubmit={enviar} noValidate>
      <label>{t.nome} *<input name="nome" required maxLength={80} autoComplete="name" /></label>
      <label>{t.cargo} {opcional}<input name="cargo" maxLength={80} /></label>
      <label>{t.empresa} *<input name="empresa" required maxLength={80} /></label>
      <label>{t.linkedin} *<input name="linkedin" type="url" required maxLength={200} placeholder="https://www.linkedin.com/in/..." /></label>
      <label>{t.email} * <small>{t.emailNota}</small><input name="email" type="email" required maxLength={120} autoComplete="email" /></label>
      <label>{t.github} <small>{t.githubNota}</small>
        <input name="github" maxLength={40} autoComplete="off" autoCapitalize="off" spellCheck={false} value={github} onChange={(e) => setGithub(e.target.value)} />
      </label>
      <label className="largo">{t.foto} <small>{t.fotoNota}</small>
        <input name="foto" type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setArquivo(e.target.files?.[0] ?? null)} />
      </label>
      {previa && <img className="largo previa" src={previa} alt={t.previa} onError={() => setPrevia('')} />}
      <label className="largo">{t.texto} *
        <textarea name="texto" required maxLength={500} rows={4} value={texto} onChange={(e) => setTexto(e.target.value)} />
        <small>{texto.length}/500</small>
      </label>
      <label className="largo aceite"><input type="checkbox" name="autorizo" value="sim" required /><span>{t.autorizo}</span></label>
      {/* Armadilha para robôs: fica fora da tela e ninguém preenche */}
      <input className="armadilha" name="site" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="largo" ref={caixa} />
      <div className="largo"><button type="submit" className="botao principal" disabled={enviando}>{enviando ? t.enviando : t.enviar}</button></div>
      <p className={`largo aviso ${aviso?.tipo ?? ''}`} role="status">{aviso ? (mensagens[aviso.codigo] ?? mensagens.geral) : ''}</p>
    </form>
  );
}

export default function Depoimentos() {
  const t = useTranslations().home.depoimentos;
  const [estado, setEstado] = useState<Estado | null>(null);
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    let vivo = true;
    // Sem a API (recurso não configurado), a seção simplesmente não aparece
    (async () => {
      try {
        const resposta = await fetch('/api/depoimentos');
        const dados = await resposta.json();
        if (vivo && resposta.ok && dados.ativo) setEstado({ chave: dados.chaveTurnstile, lista: dados.lista });
      } catch {
        /* segue sem a seção */
      }
    })();
    return () => { vivo = false; };
  }, []);

  if (!estado) return null;

  return (
    <section id="depoimentos">
      <header className="dep-topo">
        <h2 className="grande">{t.titulo}</h2>
        <p className="muted">{t.intro}</p>
      </header>
      {estado.lista.length > 0 && (
        <div className="citacoes">
          {estado.lista.map((d) => (
            <figure className="citacao" key={d.id}>
              <blockquote>{d.texto}</blockquote>
              <figcaption>
                {d.temFoto
                  ? <img src={`/api/depoimentos/foto/${d.id}`} alt="" width={56} height={56} loading="lazy" />
                  : <span className="inicial" aria-hidden="true">{d.nome.charAt(0).toUpperCase()}</span>}
                <div>
                  <a href={d.linkedin} target="_blank" rel="noopener noreferrer nofollow">{d.nome}</a>
                  <div className="muted">{[d.cargo, d.empresa].filter(Boolean).join(' · ')}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
      <div className="convite">
        <div>
          <h3>{t.convite}</h3>
          <p className="muted">{t.conviteTexto}</p>
        </div>
        <button type="button" className="botao principal" aria-expanded={aberto} aria-controls="form-depoimento" onClick={() => setAberto(!aberto)}>
          {t.abrir}
        </button>
      </div>
      {aberto && <Formulario chave={estado.chave} />}
    </section>
  );
}
