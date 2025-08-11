
export default function Footer() {
  return (
    <footer className="max-w-md pb-16 text-sm text-slate-500 sm:pb-0">
      <p>
        Construído com{" "}
        <a
          href="https://reactjs.org/"
          className="font-medium text-slate-400 hover:text-teal-300 focus-visible:text-teal-300"
          target="_blank"
          rel="noreferrer noopener"
          aria-label="React (opens in a new tab)"
        >
          React
        </a>{" "}
        e{" "}
        <a
          href="https://tailwindcss.com/"
          className="font-medium text-slate-400 hover:text-teal-300 focus-visible:text-teal-300"
          target="_blank"
          rel="noreferrer noopener"
          aria-label="Tailwind CSS (opens in a new tab)"
        >
          Tailwind CSS
        </a>
        .
      </p>
    </footer>
  );
}