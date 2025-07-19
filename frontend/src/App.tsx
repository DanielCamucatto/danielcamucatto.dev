
import './App.css';

function App() {
  return (
    <div className="container">
      <div className="left-column">
        <header>
          <h1>Daniel Santana Camuçatto</h1>
          <h2>Desenvolvedor Full Stack</h2>
          <p>Sou apaixonado por tecnologia, e ideias disruptivas.</p>
        </header>
        <nav>
          <ul>
            <li><a href="#about">SOBRE</a></li>
            <li><a href="#experience">EXPERIÊNCIA</a></li>
            <li><a href="#projects">PROJETOS</a></li>
          </ul>
        </nav>
        <footer>
          {/* Adicionar ícones de redes sociais aqui */}
        </footer>
      </div>
      <div className="right-column">
        <section id="about">
          <h2>Sobre</h2>
          <p>
            Sou um desenvolvedor full stack com vasta experiência na criação de aplicações web robustas e escaláveis. Minha paixão por tecnologia me impulsiona a buscar constantemente novas soluções e aprimorar minhas habilidades. Tenho um forte interesse em arquiteturas de software, desenvolvimento de APIs e na criação de interfaces de usuário intuitivas e eficientes.
          </p>
          <p>
            No meu tempo livre, gosto de explorar novas tecnologias, contribuir para projetos de código aberto e compartilhar meu conhecimento com a comunidade de desenvolvimento.
          </p>
        </section>
        <section id="experience">
          <h2>Experiência</h2>
          {/* Adicionar experiências profissionais aqui */}
        </section>
        <section id="projects">
          <h2>Projetos</h2>
          {/* Adicionar projetos aqui */}
        </section>
      </div>
    </div>
  );
}

export default App;
