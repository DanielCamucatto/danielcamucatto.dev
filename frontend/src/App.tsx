import './App.css';
import './styles/artigos.css';
import './styles/home.css';
import { useEffect, useRef } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Topo, { Menu } from './components/home/Topo';
import { Numeros, InteligenciaArtificial, Seguranca, Ajuda, Casos, ChamadaArtigos } from './components/home/Secoes';
import Projetos from './components/home/Projetos';
import Experiencia from './components/home/Experiencia';
import Contato from './components/home/Contato';

function Pagina() {
  const raiz = useRef<HTMLDivElement>(null);

  // Seções surgem na rolagem. A classe só entra com JavaScript, então sem ele tudo aparece.
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const elemento = raiz.current!;
    elemento.classList.add('animar');
    const observador = new IntersectionObserver(
      (entradas) =>
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting) return;
          entrada.target.classList.add('visivel');
          observador.unobserve(entrada.target);
        }),
      { threshold: 0.05 }
    );
    elemento.querySelectorAll('.revela').forEach((secao) => observador.observe(secao));
    return () => observador.disconnect();
  }, []);

  return (
    <div className="tema-cobre inicio" ref={raiz}>
      <div className="wrap">
        <Menu />
        <Topo />
      </div>
      <main>
        <div className="wrap">
          <Numeros />
          <InteligenciaArtificial />
          <Seguranca />
          <Ajuda />
          <Casos />
        </div>
        <Projetos />
        <div className="wrap" id="depois-projetos">
          <ChamadaArtigos />
          <Experiencia />
          <Contato />
        </div>
      </main>
      <footer className="wrap rodape">© {new Date().getFullYear()}</footer>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Pagina />
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
