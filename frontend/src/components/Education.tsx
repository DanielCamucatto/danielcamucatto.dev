import { useLanguage } from '../contexts/LanguageContext';
import { getTranslations } from '../utils/translations';

interface EducationItem {
  period: string;
  institution: string;
  degree: string;
  type: string;
}

interface EducationTranslations {
  title: string;
  education: EducationItem[];
}

export default function Education() {
  const { language } = useLanguage();
  const translations = getTranslations(language).education as EducationTranslations;

  return (
    <section id="education" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24" aria-label="Formação acadêmica">
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-slate-900/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200 lg:sr-only">
          {translations.title}
        </h2>
      </div>
      <div>
        <ol className="group/list">
          {translations.education.map((item, index) => (
            <li key={index} className="mb-12">
              <div className="group relative grid pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:!opacity-100 lg:group-hover/list:opacity-50">
                <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:bg-slate-100/50 dark:lg:group-hover:bg-slate-800/50 lg:group-hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:group-hover:drop-shadow-lg"></div>
                
                <header className="z-10 mb-2 mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-500 sm:col-span-2" aria-label={`${item.period}`}>
                  {item.period}
                </header>
                
                <div className="z-10 sm:col-span-6">
                  <h3 className="font-medium leading-snug">
                    <div>
                      <span className="inline-flex items-baseline font-semibold leading-tight text-teal-300 hover:text-teal-400 focus-visible:text-teal-400 dark:text-slate-200 dark:hover:text-teal-300 dark:focus-visible:text-teal-300 group/link text-base">
                        <span className="absolute -inset-x-4 -inset-y-2.5 hidden rounded md:-inset-x-6 md:-inset-y-4 lg:block"></span>
                        <span>
                          {item.degree} · <span className="inline-block">{item.institution}</span>
                        </span>
                      </span>
                    </div>
                  </h3>
                  
                  <p className="mt-2 text-sm leading-normal text-slate-600 dark:text-slate-400">
                    {item.type}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}