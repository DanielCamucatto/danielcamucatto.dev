
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="max-w-md pb-16 text-sm text-slate-500 sm:pb-0"
      role="contentinfo"
      aria-label="Rodapé do site"
    >
      <address className="not-italic">
        <p>
          Se quiser entrar em contato mande um email para:{' '}
          <a
            href="mailto:daniel.camucatto@gmail.com"
            className="font-medium text-slate-400 hover:text-teal-300 focus-visible:text-teal-300"
            aria-label="Enviar email para daniel.camucatto@gmail.com"
          >
            daniel.camucatto@gmail.com
          </a>
        </p>
        <p className="mt-4 text-xs text-slate-400">© {year} Daniel Camucatto</p>
      </address>
    </footer>
  );
}