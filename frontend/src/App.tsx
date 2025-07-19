import './App.css';
import { useEffect, useRef } from 'react';
import { Header, Navigation, Footer, About, Experience, Projects } from './components';

function App() {
  const highlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      if (highlightRef.current) {
        highlightRef.current.style.background = `
          radial-gradient(600px at ${x}px ${y}px, rgba(29, 78, 216, 0.15), transparent 80%)
        `;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative z-10 min-h-screen bg-slate-900 text-slate-100">
      <div
        ref={highlightRef}
        className="fixed inset-0 pointer-events-none z-0 transition-all duration-200"
        aria-hidden
      />
      <div className="mx-auto max-w-screen-xl px-6 py-12 md:px-12 md:py-20 lg:px-24 lg:py-0">
        <div className="lg:flex lg:justify-between lg:gap-4">
          <div className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-1/2 lg:flex-col lg:justify-between lg:py-24">
            <Header />
            <Navigation />
            <Footer />
          </div>
          <div className="pt-24 lg:w-1/2 lg:py-24">
            <About />
            <Experience />
            <Projects />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
