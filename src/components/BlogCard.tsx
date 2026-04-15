"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface BlogCardProps {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  link?: string;
  index: number;
}

export default function BlogCard({
  title,
  excerpt,
  date,
  readTime,
  tags,
  link = "#",
  index,
}: BlogCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group block rounded-2xl border border-border bg-surface p-6 transition-colors relative overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none z-10"
        animate={
          isHovered
            ? {
                boxShadow:
                  "0 0 0 1px rgba(212,168,83,0.4), 0 8px 32px -8px rgba(212,168,83,0.15)",
              }
            : {
                boxShadow: "0 0 0 1px var(--color-border), 0 0 0 0 transparent",
              }
        }
        transition={{ duration: 0.35 }}
      />

      <div className="flex items-center gap-3 mb-3">
        <span className="text-xs text-muted">{date}</span>
        <span className="text-muted/30">•</span>
        <span className="text-xs text-muted">{readTime}</span>
      </div>

      <h3 className="font-heading text-xl font-bold mb-2 group-hover:text-accent transition-colors">
        {title}
      </h3>

      <p className="text-sm text-muted leading-relaxed mb-4">{excerpt}</p>

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

      <div className="mt-4 flex items-center gap-1 text-accent text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
        Read more
        <svg
          className="w-4 h-4 transition-transform group-hover:translate-x-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
          />
        </svg>
      </div>
    </motion.a>
  );
}
