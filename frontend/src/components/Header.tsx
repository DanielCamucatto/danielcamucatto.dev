interface HeaderProps {}

export default function Header({}: HeaderProps) {
  return (
    <header className="lg:sticky lg:top-0 lg:max-h-screen lg:w-1/2 lg:flex lg:flex-col lg:justify-between lg:py-24">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-200 sm:text-5xl">
          Daniel Santana Camuçatto
        </h1>
        <h2 className="mt-3 text-lg font-medium tracking-tight text-slate-200 sm:text-xl">
          Desenvolvedor Full Stack
        </h2>
        <p className="mt-4 max-w-xs leading-normal text-slate-400">
          Sou apaixonado por tecnologia, e ideias disruptivas.
        </p>
      </div>
    </header>
  );
}