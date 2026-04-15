"use client";

interface SkillBadgeProps {
  name: string;
  icon?: string;
}

export default function SkillBadge({ name }: SkillBadgeProps) {
  return (
    <span className="inline-block text-sm text-foreground/70 px-2.5 py-1 rounded border border-border/60 bg-surface-light hover:border-accent/40 hover:text-accent transition-colors cursor-default">
      {name}
    </span>
  );
}
