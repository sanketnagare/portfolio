"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import AnimatedText from "@/components/AnimatedText";
import ProfileAvatar from "@/components/ProfileAvatar";
import SocialLinks from "@/components/SocialLinks";
import ExperienceCard from "@/components/ExperienceCard";
import SkillBadge from "@/components/SkillBadge";
import ProjectCard from "@/components/ProjectCard";
import SectionWrapper from "@/components/SectionWrapper";

const skills = [
  { name: "Next.js", icon: "▲" },
  { name: "TypeScript", icon: "🔷" },
  { name: "Node.js", icon: "🟢" },
  { name: "Python", icon: "🐍" },
  { name: "PostgreSQL", icon: "🐘" },
  { name: "Docker", icon: "🐳" },
  { name: "AWS", icon: "☁️" },
  { name: "React", icon: "⚛️" },
  { name: "MongoDB", icon: "🍃" },
  { name: "GraphQL", icon: "◈" },
  { name: "Redis", icon: "🔴" },
  { name: "Git", icon: "🔀" },
  { name: "Tailwind CSS", icon: "🎨" },
  { name: "Supabase", icon: "⚡" },
  { name: "Figma", icon: "🎯" },
  { name: "Linux", icon: "🐧" },
];

const experiences = [
  {
    title: "Full Stack Developer",
    subtitle: "Building scalable web applications and APIs",
    date: "2024 - Present",
    description:
      "Developing end-to-end solutions using modern web technologies. Focused on performance optimization, clean architecture, and exceptional user experiences.",
    link: "#",
  },
  {
    title: "Freelance Developer",
    subtitle: "Web Development & Design Consulting",
    date: "2023 - 2024",
    description:
      "Delivered custom web solutions for startups and businesses. Specialized in responsive design, SEO optimization, and full-stack development.",
  },
];

const education = [
  {
    title: "Computer Science",
    subtitle: "Bachelor of Technology",
    date: "2021 - 2025",
  },
];

const projects = [
  {
    title: "AEO Visibility Bot",
    description:
      "AI-powered visibility audit tool that analyzes websites and provides actionable insights for improving search engine presence.",
    tags: ["Next.js", "OpenAI", "Supabase", "Streaming"],
    link: "https://www.aivisibilitybot.com",
    gradient: "bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700",
  },
  {
    title: "PR Review Copier",
    description:
      "Chrome extension that scrapes GitHub PR data, diffs, and review comments for easy offline analysis and sharing.",
    tags: ["Chrome Extension", "TypeScript", "DOM Scraping"],
    link: "#",
    gradient: "bg-gradient-to-br from-amber-500 via-orange-500 to-red-500",
  },
  {
    title: "Portfolio Website",
    description:
      "This very website — a dark-themed, animation-rich portfolio built with Next.js, Framer Motion, and a custom design system.",
    tags: ["Next.js", "Framer Motion", "Tailwind"],
    link: "#",
    gradient: "bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600",
  },
  {
    title: "Cloud Dashboard",
    description:
      "Real-time monitoring dashboard for cloud infrastructure with alerting, metrics visualization, and team collaboration.",
    tags: ["React", "WebSocket", "D3.js", "Node.js"],
    link: "#",
    gradient: "bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-600",
  },
];

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 pb-24">
        {/* ===== HERO ===== */}
        <section
          id="hero"
          className="pt-32 pb-16 flex flex-col-reverse sm:flex-row items-start sm:items-center justify-between gap-8"
        >
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4">
                Hi, I&apos;m{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-accent-light to-accent">
                  Sanket
                </span>
              </h1>
            </motion.div>
            <motion.p
              className="text-lg text-muted max-w-lg leading-relaxed"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              A developer building cool solutions with{" "}
              <strong className="text-foreground">full-stack</strong>,{" "}
              <strong className="text-foreground">cloud</strong>, and{" "}
              <strong className="text-foreground">AI</strong> technologies.
            </motion.p>
            <motion.div
              className="mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <SocialLinks />
            </motion.div>
          </div>
          <ProfileAvatar />
        </section>

        {/* ===== DIVIDER ===== */}
        <motion.hr
          className="border-border mb-14"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ transformOrigin: "left" }}
        />

        {/* ===== ABOUT ===== */}
        <SectionWrapper id="about" className="mb-16">
          <h2 className="font-heading text-2xl font-bold mb-4">About</h2>
          <p className="text-muted leading-relaxed max-w-2xl">
            I&apos;m a passionate developer who enjoys building things at the
            intersection of{" "}
            <strong className="text-foreground">design</strong> and{" "}
            <strong className="text-foreground">engineering</strong>. I like
            working across the stack — from crafting pixel-perfect UIs to
            architecting backend systems and deploying them to the cloud.
          </p>
        </SectionWrapper>

        {/* ===== EXPERIENCE ===== */}
        <SectionWrapper id="experience" className="mb-16">
          <h2 className="font-heading text-2xl font-bold mb-6">
            Work Experience
          </h2>
          <div className="space-y-1">
            {experiences.map((exp, i) => (
              <ExperienceCard key={exp.title} index={i} {...exp} />
            ))}
          </div>
        </SectionWrapper>

        {/* ===== EDUCATION ===== */}
        <SectionWrapper id="education" className="mb-16">
          <h2 className="font-heading text-2xl font-bold mb-6">Education</h2>
          <div className="space-y-1">
            {education.map((edu, i) => (
              <ExperienceCard key={edu.title} index={i} {...edu} />
            ))}
          </div>
        </SectionWrapper>

        <motion.hr
          className="border-border mb-14"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ transformOrigin: "left" }}
        />

        {/* ===== SKILLS ===== */}
        <SectionWrapper id="skills" className="mb-16">
          <h2 className="font-heading text-2xl font-bold mb-6">Skills</h2>
          <div className="flex flex-wrap gap-2.5">
            {skills.map((skill, i) => (
              <SkillBadge key={skill.name} index={i} {...skill} />
            ))}
          </div>
        </SectionWrapper>

        <motion.hr
          className="border-border mb-14"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ transformOrigin: "left" }}
        />

        {/* ===== PROJECTS ===== */}
        <SectionWrapper id="projects" className="mb-16">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="font-heading text-2xl font-bold">Projects</h2>
            <a
              href="#"
              className="text-sm text-muted hover:text-accent flex items-center gap-1 transition-colors"
            >
              View all
              <svg
                className="w-4 h-4"
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
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {projects.map((project, i) => (
              <ProjectCard key={project.title} index={i} {...project} />
            ))}
          </div>
        </SectionWrapper>

        {/* ===== CONTACT CTA ===== */}
        <SectionWrapper id="contact" className="mb-8">
          <motion.div
            className="rounded-2xl border border-border bg-surface p-8 sm:p-10 text-center"
            whileHover={{ borderColor: "rgba(212, 168, 83, 0.3)" }}
          >
            <h2 className="font-heading text-2xl font-bold mb-3">
              Let&apos;s work together
            </h2>
            <p className="text-muted mb-6 max-w-md mx-auto">
              I&apos;m currently open for new opportunities. Whether you have a
              project idea or just want to say hi — I&apos;d love to hear from
              you.
            </p>
            <motion.a
              href="mailto:sanketnagare@outlook.com"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-accent text-background font-heading font-semibold hover:bg-accent-light transition-colors"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Say Hello
              <svg
                className="w-4 h-4"
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
            </motion.a>
          </motion.div>
        </SectionWrapper>

        {/* ===== FOOTER ===== */}
        <motion.footer
          className="text-center text-sm text-muted/50 pt-8 pb-4 border-t border-border/30"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Built with Next.js, Framer Motion & a lot of ☕
        </motion.footer>
      </main>
    </>
  );
}
