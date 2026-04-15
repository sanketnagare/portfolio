"use client";

import { motion } from "framer-motion";

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  link?: string;
  gradient: string;
  index: number;
}

export default function ProjectCard({
  title,
  description,
  tags,
  link,
  gradient,
  index,
}: ProjectCardProps) {
  return (
    <motion.a
      href={link || "#"}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.15,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      whileHover={{ y: -6 }}
      className="group block rounded-2xl overflow-hidden border border-border bg-surface hover:border-accent/30 transition-colors"
    >
      {/* Preview area */}
      <div
        className={`relative h-44 ${gradient} flex items-center justify-center overflow-hidden`}
      >
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
        <motion.h3
          className="relative z-10 text-2xl font-heading font-bold text-white text-center px-6 leading-tight"
          whileHover={{ scale: 1.03 }}
        >
          {title}
        </motion.h3>
      </div>

      {/* Info area */}
      <div className="p-5">
        <p className="text-sm text-muted leading-relaxed mb-4">{description}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-block text-xs px-2.5 py-1 rounded-full bg-surface-light border border-border text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.a>
  );
}
