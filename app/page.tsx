import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Education } from "@/components/education";
import { Experience } from "@/components/experience";
import { Hero } from "@/components/hero";
import { Projects } from "@/components/projects";
import { Section } from "@/components/section";
import { Skills } from "@/components/skills";
import { TryItOut } from "@/components/try-it-out";
import { about } from "@/content/about";
import { personal } from "@/content/personal";
import { playground } from "@/content/playground";
import { skillsLead } from "@/content/skills";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />

      <Section id="about" title="About">
        <div className="t-body space-y-4">
          {about.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </Section>

      <Section id="experience" title="Experience">
        <Experience />
      </Section>

      <Section id="projects" title="Projects">
        <Projects />
      </Section>

      <Section id="try-it-out" title="Try it out" lead={playground.lead} wide>
        <TryItOut />
      </Section>

      <Section id="skills" title="Skills" lead={skillsLead}>
        <Skills />
      </Section>

      <Section id="education" title="Education">
        <Education />
      </Section>

      <section className="border-t border-line py-14 md:py-20">
        <div className="mx-auto max-w-2xl px-5">
          <p className="t-label">{personal.title}</p>
          <p className="t-lead mt-3">{personal.intro}</p>
          <Link href="/personal" className="btn-ghost t-label mt-6">
            Where I&apos;ve been
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </section>
    </>
  );
}
