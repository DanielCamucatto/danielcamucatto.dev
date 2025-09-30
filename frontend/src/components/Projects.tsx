import React from 'react';
import { useTranslations } from '../utils/translations';

interface Project {
  title: string;
  description: string;
  link: string;
  technologies: string[];
  featured: boolean;
  imageUrl: string;
  details: string[];
}

interface ProjectsTranslations {
  title: string;
  projects: Project[];
}

const ProjectCard: React.FC<Project> = ({
  title,
  description,
  link,
  imageUrl,
  details
}) => {
  return (
    <li className="mb-12">
      <div className="group relative grid gap-4 pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:!opacity-100 lg:group-hover/list:opacity-50">
  <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:bg-white/40 lg:group-hover:shadow-md lg:group-hover:drop-shadow-sm dark:lg:group-hover:bg-slate-800/50 dark:lg:group-hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] dark:lg:group-hover:drop-shadow-lg"></div>
        
        {/* Coluna da Imagem */}
        <div className="z-10 sm:col-span-3">
          <div className="aspect-[16/10] overflow-hidden rounded-lg bg-slate-900">
            <img 
              src={imageUrl} 
              alt={`Screenshot do projeto ${title}`}
              className="h-full w-full object-cover object-top transition group-hover:scale-105"
            />
          </div>
        </div>

        {/* Coluna do Conteúdo */}
        <div className="z-10 sm:col-span-5">
          <h3 className="font-medium leading-snug text-slate-200">
            <div>
              <a 
                className="inline-flex items-baseline font-semibold leading-tight text-teal-300 hover:text-teal-400 focus-visible:text-teal-400 dark:text-slate-200 dark:hover:text-teal-300 dark:focus-visible:text-teal-300 group/link text-base" 
                href={link} 
                target="_blank" 
                rel="noreferrer"
                aria-label={title}
              >
                <span className="absolute -inset-x-4 -inset-y-2.5 hidden rounded md:-inset-x-6 md:-inset-y-4 lg:block"></span>
                <span>
                  {title}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="inline-block h-4 w-4 shrink-0 transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1 group-focus-visible/link:-translate-y-1 group-focus-visible/link:translate-x-1 motion-reduce:transition-none ml-1 translate-y-px" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
                  </svg>
                </span>
              </a>
            </div>
          </h3>

          <p className="mt-2 text-sm leading-normal text-slate-400">
            {description}
          </p>

          <ul className="mt-2 text-sm leading-normal text-slate-400">
            {details.map((detail, index) => (
              <li key={index} className="mb-2 flex items-center">
                <span className="mr-2 text-teal-300">▹</span> {detail}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </li>
  );
};

export default function Projects() {
  const translations = useTranslations().projects as ProjectsTranslations;

  return (
    <section id="projects" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24">
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-slate-900/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200 lg:sr-only">
          {translations.title}
        </h2>
      </div>
      <div>
        <ul className="group/list">
          {translations.projects.map((project: Project) => (
            <ProjectCard
              key={project.title}
              {...project}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}