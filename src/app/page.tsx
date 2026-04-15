"use client";

import Navbar from "@/components/Navbar";
import ProfileAvatar from "@/components/ProfileAvatar";
import SocialLinks from "@/components/SocialLinks";
import ExperienceCard from "@/components/ExperienceCard";
import SkillBadge from "@/components/SkillBadge";
import ProjectCard from "@/components/ProjectCard";
import SectionWrapper from "@/components/SectionWrapper";
import data from "@/data/portfolio.json";

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

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 pb-24 relative z-10">
        <section
          id="hero"
          className="pt-28 pb-12 flex flex-col-reverse sm:flex-row items-start sm:items-center justify-between gap-6"
        >
          <div className="flex-1">
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 text-accent">
              Sanket Nagare
            </h1>
            <p className="text-foreground/70 text-lg leading-relaxed max-w-md">
              {data.meta.about.split(". ").slice(0, 2).join(". ")}.
            </p>
            <div className="mt-5">
              <SocialLinks />
            </div>
          </div>
          <ProfileAvatar />
        </section>

        <hr className="border-border mb-12" />

        <SectionWrapper id="about" className="mb-14">
          <h2 className="font-heading text-lg font-bold mb-3">About</h2>
          <p className="text-foreground/70 leading-relaxed max-w-2xl">
            {data.meta.about}
          </p>
        </SectionWrapper>

        <SectionWrapper id="experience" className="mb-14">
          <h2 className="font-heading text-lg font-bold mb-4">Experience</h2>
          <div className="space-y-0">
            {data.experiences.map((exp, i) => {
              const desc = exp.summary || exp.description || "";

              return (
                <ExperienceCard
                  key={exp.title + exp.company}
                  index={i}
                  title={exp.title}
                  subtitle={`${exp.company}, ${exp.location}`}
                  date={exp.date}
                  description={desc}
                  projects={exp.projects}
                  logo={logoIcons[exp.logoType] || logoIcons.company}
                  logoUrl={exp.logoUrl}
                />
              );
            })}
          </div>
        </SectionWrapper>

        <hr className="border-border mb-12" />

        <SectionWrapper id="projects" className="mb-14">
          <h2 className="font-heading text-lg font-bold mb-6">Projects</h2>
          <div className="space-y-6">
            {data.projects.map((project) => (
              <ProjectCard key={project.title} {...project} />
            ))}
          </div>
        </SectionWrapper>

        <SectionWrapper id="skills" className="mb-14">
          <h2 className="font-heading text-lg font-bold mb-4">Skills</h2>
          <div className="space-y-4">
            {data.skills.map((category) => (
              <div key={category.category}>
                <h3 className="text-xs font-semibold text-accent mb-2 uppercase tracking-wide">
                  {category.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {category.items.map((skill) => (
                    <SkillBadge key={skill.name} {...skill} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SectionWrapper>

        <SectionWrapper id="education" className="mb-14">
          <h2 className="font-heading text-lg font-bold mb-4">Education</h2>
          <div className="space-y-0">
            {data.education.map((edu, i) => (
              <ExperienceCard
                key={edu.title}
                index={i}
                title={edu.title}
                subtitle={`${edu.institution}${
                  edu.cgpa ? ` (CGPA: ${edu.cgpa})` : 
                  edu.percentage ? ` (Percentage: ${edu.percentage})` : ""
                }`}
                date={edu.date}
                logo={logoIcons.education}
                logoUrl={edu.logoUrl}
              />
            ))}
          </div>
        </SectionWrapper>

        {(data.achievements.length > 0 || data.certifications.length > 0) && (
          <>
            <hr className="border-border mb-12" />

            <SectionWrapper id="achievements" className="mb-14">
              {data.achievements.length > 0 && (
                <div className="mb-8">
                  <h2 className="font-heading text-lg font-bold mb-3">Achievements</h2>
                  <ul className="space-y-1.5">
                    {data.achievements.map((a, i) => (
                      <li key={i} className="text-foreground/70 leading-relaxed pl-4 border-l-2 border-accent/40">
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {data.certifications.length > 0 && (
                <div>
                  <h2 className="font-heading text-lg font-bold mb-3">Certifications</h2>
                  <ul className="space-y-1.5">
                    {data.certifications.map((cert) => (
                      <li key={cert.name} className="pl-4 border-l-2 border-accent/40">
                        <a href={cert.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-foreground/70 hover:text-accent transition-colors group">
                          {cert.name}
                          {cert.link !== "#" && (
                            <svg className="w-3 h-3 opacity-40 group-hover:opacity-70 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                            </svg>
                          )}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </SectionWrapper>
          </>
        )}

        <SectionWrapper id="contact" className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-6 border-t border-border">
            <div>
              <h2 className="font-heading text-lg font-bold">Get in touch</h2>
              <p className="text-foreground/70 text-sm mt-1 max-w-md">
                {data.meta.contactMessage}
              </p>
            </div>
            <a
              href={`mailto:${data.meta.email}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-accent text-white text-sm font-medium hover:bg-accent-light transition-colors shrink-0"
            >
              {data.meta.email}
            </a>
          </div>
        </SectionWrapper>

        <footer className="text-center text-xs text-foreground/40 pt-6 pb-4 border-t border-border/50">
          {data.meta.footer}
        </footer>
      </main>
    </>
  );
}
