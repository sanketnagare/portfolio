"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useRef, useState } from "react";

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
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // For the tilt effect
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useMotionValue(0);
  const springRotateY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    // Subtle: max 4deg tilt
    rotateX.set(-dy * 4);
    rotateY.set(dx * 4);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    animate(rotateX, 0, { duration: 0.5, ease: "easeOut" });
    animate(rotateY, 0, { duration: 0.5, ease: "easeOut" });
  };

  return (
    <motion.a
      ref={cardRef}
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
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 800,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group block rounded-2xl overflow-hidden border border-border bg-surface transition-colors relative"
    >
      {/* Animated gradient border glow on hover */}
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

      {/* Preview area */}
      <div
        className={`relative h-44 ${gradient} flex items-center justify-center overflow-hidden`}
      >
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

        {/* Subtle shimmer overlay on hover */}
        <motion.div
          className="absolute inset-0"
          animate={
            isHovered
              ? { opacity: 1, background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%)" }
              : { opacity: 0, background: "linear-gradient(135deg, rgba(255,255,255,0) 0%, transparent 60%)" }
          }
          transition={{ duration: 0.4 }}
        />

        <h3 className="relative z-10 text-2xl font-heading font-bold text-white text-center px-6 leading-tight">
          {title}
        </h3>
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
