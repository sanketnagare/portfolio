"use client";

import { motion } from "framer-motion";

interface SkillBadgeProps {
  name: string;
  icon?: string;
  index: number;
}

export default function SkillBadge({ name, icon, index }: SkillBadgeProps) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.4,
        delay: index * 0.04,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      whileHover={{
        scale: 1.05,
        backgroundColor: "rgba(212, 168, 83, 0.15)",
        borderColor: "rgba(212, 168, 83, 0.5)",
      }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-surface text-sm text-foreground font-medium cursor-default transition-colors"
    >
      {icon && <span className="text-base">{icon}</span>}
      {name}
    </motion.span>
  );
}
