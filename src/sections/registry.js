// src/sections/registry.js
import AboutSection from "./AboutSection";
import ExperienceSection from "./ExperienceSection";
import SkillsSection from "./SkillsSection";
import ProjectsSection from "./ProjectsSection";
import PersonalSection from "./PersonalSection";

export const SECTIONS = [
  {
    id: "about",
    label: "About",
    Component: AboutSection,
    nav: true,
  },
  {
    id: "experience",
    label: "Experience",
    Component: ExperienceSection,
    nav: true,
  },
  {
    id: "skills",
    label: "Skills",
    Component: SkillsSection,
    nav: true,
  },
  {
    id: "projects",
    label: "Projects",
    Component: ProjectsSection,
    nav: true,
  },
  {
    id: "personal",
    label: "Personal",
    Component: PersonalSection,
    nav: true,
  },
];
