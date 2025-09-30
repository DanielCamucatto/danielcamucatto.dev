import { useLanguage } from '../hooks/useLanguage';
import { generatePDF } from '../services/pdfGenerator';

interface DownloadCVButtonProps {
  className?: string;
}

export default function DownloadCVButton({ className = '' }: DownloadCVButtonProps) {
  const { language } = useLanguage();

  const handleDownload = () => {
    try {
      generatePDF(language);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      // Aqui você pode adicionar uma notificação de erro para o usuário
    }
  };

  const buttonTexts = {
    pt: 'Baixar CV',
    en: 'Download CV', 
    es: 'Descargar CV'
  };

  const tooltipTexts = {
    pt: 'Baixar currículo em PDF',
    en: 'Download resume in PDF',
    es: 'Descargar currículum en PDF'
  };

  return (
    <div className={`relative group ${className}`}>
      <button
        onClick={handleDownload}
        className="inline-flex items-center gap-2 px-3 py-2 text-slate-600 dark:text-slate-400 hover:text-teal-500 dark:hover:text-teal-400 font-medium border border-slate-300 dark:border-slate-600 hover:border-teal-500 dark:hover:border-teal-400 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50"
        aria-label={tooltipTexts[language]}
      >
        {/* Ícone de download */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={1.5} 
          stroke="currentColor" 
          className="w-4 h-4"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" 
          />
        </svg>
        
        <span className="text-sm font-normal">
          {buttonTexts[language]}
        </span>
      </button>
      
      {/* Tooltip */}
      <span className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 transition-opacity group-hover:opacity-100 bg-slate-800 dark:bg-slate-700 text-slate-200 dark:text-slate-300 px-3 py-1 text-xs rounded whitespace-nowrap pointer-events-none z-10 shadow-lg">
        {tooltipTexts[language]}
      </span>
    </div>
  );
}