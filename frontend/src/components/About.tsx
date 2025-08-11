
export default function About() {
  return (
    <section id="about" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24">
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-white/75 dark:bg-slate-900/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-800 dark:text-slate-200 lg:sr-only">
          Sobre
        </h2>
      </div>
      <div className="space-y-4">
        <p className="text-slate-700 dark:text-slate-400 leading-relaxed">
          Sou um desenvolvedor full stack com vasta experiência na criação de aplicações web robustas e escaláveis. Minha paixão por tecnologia me impulsiona a buscar constantemente novas soluções e aprimorar minhas habilidades. Tenho um forte interesse em arquiteturas de software, desenvolvimento de APIs e na criação de interfaces de usuário intuitivas e eficientes.
        </p>
        <p className="text-slate-700 dark:text-slate-400 leading-relaxed">
          No meu tempo livre, gosto de explorar novas tecnologias, contribuir para projetos de código aberto e compartilhar meu conhecimento com a comunidade de desenvolvimento.
        </p>
      </div>
    </section>
  );
}
