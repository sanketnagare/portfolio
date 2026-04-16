import Navbar from "@/components/Navbar";
import ProfileAvatar from "@/components/ProfileAvatar";
import SocialLinks from "@/components/SocialLinks";
import ExperienceCard from "@/components/ExperienceCard";
import SkillBadge from "@/components/SkillBadge";
import ProjectCard from "@/components/ProjectCard";
import SectionWrapper from "@/components/SectionWrapper";
import data from "@/data/portfolio.json";

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
                  logoType={exp.logoType}
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
                logoType="education"
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
