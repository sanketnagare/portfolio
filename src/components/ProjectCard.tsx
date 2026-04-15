"use client";

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  link?: string;
  gradient: string;
  subtitle: string;
}

export default function ProjectCard({
  title,
  description,
  tags,
  link,
  subtitle,
}: ProjectCardProps) {
  const Content = (
    <div className="group">
      <div className="flex items-baseline justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-heading font-semibold text-foreground group-hover:text-accent transition-colors">
            {title}
          </h3>
          <p className="text-xs text-muted mt-0.5">{subtitle}</p>
        </div>
        {link && link !== "#" && (
          <svg
            className="w-3.5 h-3.5 text-muted shrink-0 group-hover:text-accent transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
            />
          </svg>
        )}
      </div>
      <p className="text-sm text-foreground/70 mt-2 leading-relaxed">{description}</p>
        <div className="flex flex-wrap gap-2.5 mt-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-md bg-surface border border-border/60 text-[10px] font-medium text-foreground/80 uppercase tracking-widest shadow-sm"
            >
              {tag}
            </span>
          ))}
        </div>
    </div>
  );

  if (link && link !== "#") {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer" className="block py-4 border-b border-border/60 last:border-b-0">
        {Content}
      </a>
    );
  }

  return <div className="py-4 border-b border-border/60 last:border-b-0">{Content}</div>;
}
