"use client";

import { motion } from "framer-motion";

interface ExperienceCardProps {
  title: string;
  subtitle: string;
  date: string;
  description?: string;
  link?: string;
  index: number;
}

export default function ExperienceCard({
  title,
  subtitle,
  date,
  description,
  link,
  index,
}: ExperienceCardProps) {
  const Content = (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      whileHover={{
        backgroundColor: "rgba(26, 26, 37, 0.8)",
        x: 4,
      }}
      className="group flex items-start justify-between gap-4 p-4 -mx-4 rounded-xl transition-colors cursor-pointer"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-heading font-semibold text-foreground group-hover:text-accent transition-colors">
            {title}
          </h3>
          {link && (
            <svg
              className="w-4 h-4 text-muted group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 17L17 7M17 7H7M17 7v10"
              />
            </svg>
          )}
        </div>
        <p className="text-sm text-muted mt-0.5">{subtitle}</p>
        {description && (
          <p className="text-sm text-muted/70 mt-2 leading-relaxed">{description}</p>
        )}
      </div>
      <span className="text-sm text-muted whitespace-nowrap shrink-0 mt-0.5">
        {date}
      </span>
    </motion.div>
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
