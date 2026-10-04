import { useTranslations } from '../utils/translations';

interface SkillGroup {
  name: string;
  items: string[];
}

interface SkillsTranslations {
  title: string;
  groups: SkillGroup[];
}

export default function Skills() {
  const translations = useTranslations().skills as SkillsTranslations;

  return (
    <section id="skills" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24" aria-label={translations.title}>
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-slate-900/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200 lg:sr-only">
          {translations.title}
        </h2>
      </div>
      <dl className="space-y-6">
        {translations.groups.map((group) => (
          <div key={group.name} className="sm:grid sm:grid-cols-8 sm:gap-4">
            <dt className="mb-2 mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:col-span-2">
              {group.name}
            </dt>
            <dd className="sm:col-span-6">
              <ul className="flex flex-wrap" aria-label={group.name}>
                {group.items.map((item) => (
                  <li key={item} className="mr-1.5 mt-2">
                    <div className="flex items-center rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium leading-5 text-teal-300">
                      {item}
                    </div>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
