"use client";

import Image from "next/image";

interface Project {
  name: string;
  bullets: string[];
}

const logoIcons: Record<string, React.ReactNode> = {
  company: (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
    </svg>
  ),
  content: (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
    </svg>
  ),
  internship: (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25A2.25 2.25 0 0 1 5.25 3h13.5A2.25 2.25 0 0 1 21 5.25Z" />
    </svg>
  ),
  education: (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
    </svg>
  ),
};

interface ExperienceCardProps {
  title: string;
  subtitle: string;
  date: string;
  description?: string;
  link?: string;
  index: number;
  logoType?: string;
  logoUrl?: string;
  projects?: Project[];
}

export default function ExperienceCard({
  title,
  subtitle,
  date,
  description,
  link,
  logoType,
  logoUrl,
  projects,
}: ExperienceCardProps) {
  const logo = logoType ? logoIcons[logoType] : null;

  const Content = (
    <div className="group py-4 border-b border-border/60 last:border-b-0">
      <div className="flex items-start gap-4">
        {(logo || logoUrl) && (
          <div className="shrink-0 w-14 h-14 rounded bg-surface-light border border-border flex items-center justify-center text-muted relative overflow-hidden">
            {logoUrl ? (
              <Image 
                src={logoUrl} 
                alt={title} 
                fill 
                className="object-contain p-1"
              />
            ) : (
              logo
            )}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <h3 className="font-heading font-semibold text-foreground text-sm">
                {title}
              </h3>
              <p className="text-xs text-foreground/50 mt-0.5">{subtitle}</p>
            </div>
            <span className="text-xs text-foreground/40 whitespace-nowrap shrink-0">
              {date}
            </span>
          </div>
          {description && (
            <p className="text-xs text-foreground/50 mt-2 leading-relaxed">
              {description}
            </p>
          )}
          {projects && projects.length > 0 && (
            <div className="mt-4 space-y-4">
              {projects.map((project) => (
                <div key={project.name}>
                  <h4 className="text-xs font-semibold text-foreground/80 mb-1.5">
                    {project.name}
                  </h4>
                  <ul className="space-y-1">
                    {project.bullets.map((bullet, j) => (
                      <li key={j} className="text-xs text-foreground/60 leading-relaxed pl-3 relative before:content-[''] before:absolute before:left-0 before:top-[7px] before:w-1 before:h-1 before:rounded-full before:bg-accent/50">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (link) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer">
        {Content}
      </a>
    );
  }

  return Content;
}
