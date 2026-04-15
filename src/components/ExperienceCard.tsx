"use client";

import Image from "next/image";

interface Project {
  name: string;
  bullets: string[];
}

interface ExperienceCardProps {
  title: string;
  subtitle: string;
  date: string;
  description?: string;
  link?: string;
  index: number;
  logo?: React.ReactNode;
  logoUrl?: string;
  projects?: Project[];
}

export default function ExperienceCard({
  title,
  subtitle,
  date,
  description,
  link,
  logo,
  logoUrl,
  projects,
}: ExperienceCardProps) {
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
