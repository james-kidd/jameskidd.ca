import { GraduationCap } from "lucide-react";
import { MDXProvider } from "@mdx-js/react";
import SectionPanel from "../components/SectionPanel";
import SectionTitle from "../components/SectionTitle";
import EducationCard from "./components/EducationCard";
import AboutIntro, { frontmatter as aboutFrontmatter } from "../content/about.mdx";
import { mdxComponents } from "../components/mdx/mdxComponents";

export default function AboutSection({ data }) {
  const { education } = data;

  return (
    <SectionPanel>
      <div className="mb-12">
        <MDXProvider components={mdxComponents}>
          <div className="section-lead space-y-4 [&>p]:m-0">
            <AboutIntro />
          </div>
        </MDXProvider>
      </div>

      <div>
        <SectionTitle icon={GraduationCap} className="mb-12">
          Education Timeline
        </SectionTitle>

        <div className="ml-2">
          {education.details.map((edu) => (
            <EducationCard key={`${edu.school}-${edu.year}`} edu={edu} />
          ))}
        </div>
      </div>
    </SectionPanel>
  );
}
