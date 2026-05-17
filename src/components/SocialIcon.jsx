import { Github, Linkedin, Instagram } from "lucide-react";

const ICONS = {
  github: Github,
  linkedin: Linkedin,
  instagram: Instagram,
};

export default function SocialIcon({ type, url }) {
  const Icon = ICONS[type];
  if (!url || !Icon) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="icon-box hover:scale-110 transition-transform duration-200"
    >
      <Icon className="w-5 h-5" />
    </a>
  );
}
