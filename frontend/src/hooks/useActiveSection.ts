import { useState, useEffect, useRef } from 'react';
import { pageview } from '../services/analytics';

export const useActiveSection = () => {
  const [activeSection, setActiveSection] = useState('about');
  const initialLoad = useRef(true);

  useEffect(() => {
    const sections = ['about', 'experience', 'projects', 'education'];
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '-100px 0px -50% 0px'
      }
    );

    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false;
      return;
    }
    pageview(`/#${activeSection}`);
  }, [activeSection]);

  return activeSection;
};