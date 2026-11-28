// Eventos de conversão no GA4. Sem o gtag (desenvolvimento ou bloqueador), não faz nada.
export function registrar(evento: string, dados: Record<string, string> = {}) {
  (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag?.('event', evento, dados);
}
