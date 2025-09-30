import jsPDF from 'jspdf';
import { getTranslations } from '../utils/translations';

export interface CVData {
  header: {
    name: string;
    role: string;
    description: string;
    socialLinks: {
      linkedin: { url: string; label: string };
      github: { url: string; label: string };
      devto: { url: string; label: string };
    };
  };
  about: {
    title: string;
    paragraphs: string[];
  };
  experience: {
    title: string;
    experiences: Array<{
      period: string;
      role: string;
      company: string;
      description: string;
      technologies: string[];
    }>;
    technologiesLabel?: string;
  };
  education: {
    title: string;
    education: Array<{
      period: string;
      institution: string;
      degree: string;
      type: string;
    }>;
  };
}

export function generatePDF(language: 'pt' | 'en' | 'es'): void {
  // Obtém as traduções baseadas no idioma
  const translations = getTranslations(language);
  
  const cvData: CVData = {
    header: translations.header,
    about: translations.about,
    experience: translations.experience,
    education: translations.education,
  };

  // Cria um novo documento PDF
  const doc = new jsPDF();
  
  // Configurações de fonte e cores (hex convertidos para RGB)
  const primaryColor = '#0f172a'; // slate-900
  const secondaryColor = '#475569'; // slate-600
  const accentColor = '#14b8a6'; // teal-500

  // Converte hex ("#rrggbb" ou "rrggbb") para tupla RGB [r,g,b]
  function hexToRgb(hex: string): [number, number, number] {
    const sanitized = hex.replace('#', '');
    const bigint = parseInt(sanitized, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
  }

  const primaryRgb = hexToRgb(primaryColor);
  const secondaryRgb = hexToRgb(secondaryColor);
  const accentRgb = hexToRgb(accentColor);
  
  let yPosition = 20;
  const leftMargin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentWidth = pageWidth - (leftMargin * 2);
  // Margin from bottom to consider for page break (keeps footer space)
  const bottomMargin = 20;
  // Threshold for when we should insert a page break. Calculated from page height
  const pageBreakThreshold = pageHeight - bottomMargin - 30; // 30 accounts for text block height
  
  // Header Section
  doc.setFontSize(24);
  doc.setTextColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
  doc.text(cvData.header.name, leftMargin, yPosition);
  yPosition += 10;
  
  doc.setFontSize(16);
  doc.setTextColor(accentRgb[0], accentRgb[1], accentRgb[2]);
  doc.text(cvData.header.role, leftMargin, yPosition);
  yPosition += 8;
  
  doc.setFontSize(11);
  doc.setTextColor(secondaryRgb[0], secondaryRgb[1], secondaryRgb[2]);
  const descriptionLines = doc.splitTextToSize(cvData.header.description, contentWidth);
  doc.text(descriptionLines, leftMargin, yPosition);
  yPosition += descriptionLines.length * 5 + 5;
  
  // Contact Information
  doc.setFontSize(10);
  doc.setTextColor(secondaryRgb[0], secondaryRgb[1], secondaryRgb[2]);
  doc.text(`LinkedIn: ${cvData.header.socialLinks.linkedin.url}`, leftMargin, yPosition);
  yPosition += 5;
  doc.text(`GitHub: ${cvData.header.socialLinks.github.url}`, leftMargin, yPosition);
  yPosition += 5;
  doc.text(`Dev.to: ${cvData.header.socialLinks.devto.url}`, leftMargin, yPosition);
  yPosition += 15;
  
  // About Section
  doc.setFontSize(16);
  doc.setTextColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
  doc.text(cvData.about.title, leftMargin, yPosition);
  yPosition += 8;
  
  doc.setFontSize(11);
  doc.setTextColor(secondaryRgb[0], secondaryRgb[1], secondaryRgb[2]);
  cvData.about.paragraphs.forEach(paragraph => {
    const paragraphLines = doc.splitTextToSize(paragraph, contentWidth);
    doc.text(paragraphLines, leftMargin, yPosition);
    yPosition += paragraphLines.length * 5 + 5;
  });
  
  yPosition += 5;
  
  // Experience Section
  doc.setFontSize(16);
  doc.setTextColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
  doc.text(cvData.experience.title, leftMargin, yPosition);
  yPosition += 10;
  
  cvData.experience.experiences.forEach((exp, index) => {
    // Verifica se precisa de nova página
    if (yPosition > pageBreakThreshold) {
      doc.addPage();
      yPosition = 20;
    }
    
    // Período
  doc.setFontSize(10);
  doc.setTextColor(accentRgb[0], accentRgb[1], accentRgb[2]);
    doc.text(exp.period, leftMargin, yPosition);
    yPosition += 6;
    
    // Cargo e Empresa
  doc.setFontSize(12);
  doc.setTextColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
    doc.text(`${exp.role} - ${exp.company}`, leftMargin, yPosition);
    yPosition += 7;
    
    // Descrição
  doc.setFontSize(10);
  doc.setTextColor(secondaryRgb[0], secondaryRgb[1], secondaryRgb[2]);
    const descLines = doc.splitTextToSize(exp.description, contentWidth);
    doc.text(descLines, leftMargin, yPosition);
    yPosition += descLines.length * 4 + 3;
    
    // Tecnologias
    if (exp.technologies && exp.technologies.length > 0) {
      const techLabel = cvData.experience.technologiesLabel || 'Technologies';
  doc.setFontSize(9);
  doc.setTextColor(accentRgb[0], accentRgb[1], accentRgb[2]);
      doc.text(`${techLabel}: `, leftMargin, yPosition);
      
  doc.setTextColor(secondaryRgb[0], secondaryRgb[1], secondaryRgb[2]);
      const techText = exp.technologies.join(', ');
      const techLines = doc.splitTextToSize(techText, contentWidth - 30);
      doc.text(techLines, leftMargin + 30, yPosition);
      yPosition += techLines.length * 4 + 8;
    } else {
      yPosition += 8;
    }
    
    // Linha separadora (exceto para o último item)
    if (index < cvData.experience.experiences.length - 1) {
      doc.setDrawColor(200, 200, 200);
      doc.line(leftMargin, yPosition - 3, pageWidth - leftMargin, yPosition - 3);
      yPosition += 5;
    }
  });
  
  yPosition += 10;
  
  // Education Section
  doc.setFontSize(16);
  doc.setTextColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
  doc.text(cvData.education.title, leftMargin, yPosition);
  yPosition += 10;
  
  cvData.education.education.forEach((item, index) => {
    // Verifica se precisa de nova página
    if (yPosition > pageBreakThreshold) {
      doc.addPage();
      yPosition = 20;
    }
    
    // Período
  doc.setFontSize(10);
  doc.setTextColor(accentRgb[0], accentRgb[1], accentRgb[2]);
    doc.text(item.period, leftMargin, yPosition);
    yPosition += 6;
    
    // Curso e Instituição
  doc.setFontSize(12);
  doc.setTextColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
    doc.text(`${item.degree} - ${item.institution}`, leftMargin, yPosition);
    yPosition += 7;
    
    // Tipo
  doc.setFontSize(10);
  doc.setTextColor(secondaryRgb[0], secondaryRgb[1], secondaryRgb[2]);
    doc.text(item.type, leftMargin, yPosition);
    yPosition += 8;
    
    // Linha separadora (exceto para o último item)
    if (index < cvData.education.education.length - 1) {
      doc.setDrawColor(200, 200, 200);
      doc.line(leftMargin, yPosition - 3, pageWidth - leftMargin, yPosition - 3);
      yPosition += 5;
    }
  });
  
  // Footer com data de geração
  const currentDate = new Date().toLocaleDateString(
    language === 'pt' ? 'pt-BR' : language === 'es' ? 'es-ES' : 'en-US'
  );
  
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `${cvData.header.name} - CV - ${currentDate} - Página ${i}/${pageCount}`,
      leftMargin,
      doc.internal.pageSize.getHeight() - 10
    );
  }
  
  // Nome do arquivo baseado no idioma
  const fileNames = {
    pt: 'Daniel_Camucatto_CV_Portugues.pdf',
    en: 'Daniel_Camucatto_CV_English.pdf',
    es: 'Daniel_Camucatto_CV_Espanol.pdf'
  };
  
  // Faz o download do PDF
  doc.save(fileNames[language]);
}