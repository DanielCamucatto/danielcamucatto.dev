import { useLanguage } from '../hooks/useLanguage';
import { generatePDF } from '../services/pdfGenerator';
import GhostButton from './GhostButton';

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
    <GhostButton
      onClick={handleDownload}
      className={className}
      ariaLabel={tooltipTexts[language]}
      icon={(
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
      )}
      fullWidthMobile
      tooltip={tooltipTexts[language]}
    >
      {buttonTexts[language]}
    </GhostButton>
  );
}