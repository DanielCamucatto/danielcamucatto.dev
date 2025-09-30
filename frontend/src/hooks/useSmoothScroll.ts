import { useCallback } from 'react';

export const useSmoothScroll = () => {
  const scrollToElement = useCallback((elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      // Calcula a posição considerando o offset para header sticky
      const headerHeight = 100; // Ajuste conforme necessário
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }, []);

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    scrollToElement(targetId);
    
    // Atualiza a URL sem recarregar a página
    if (history.pushState) {
      history.pushState(null, '', `#${targetId}`);
    }
  }, [scrollToElement]);

  return { scrollToElement, handleNavClick };
};