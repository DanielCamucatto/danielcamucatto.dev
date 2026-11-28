// Registra no GA4 os cliques nos botões de contato, para medir de onde vêm as conversas.
document.querySelectorAll<HTMLElement>('[data-contato]').forEach((link) => {
  link.addEventListener('click', () => {
    (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag?.('event', 'contato_click', {
      origem: link.dataset.contato,
    });
  });
});
