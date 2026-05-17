import IconBox from "../../components/IconBox";
import TagPill from "../../components/TagPill";
import {
  Terminal,
  Database,
  Cloud,
  TrendingUp,
  Star,
  Cpu,
  Globe,
  Layers,
} from "lucide-react";

const ICONS = {
  terminal: <Terminal className="w-5 h-5" />,
  database: <Database className="w-5 h-5" />,
  cloud: <Cloud className="w-5 h-5" />,
  trending: <TrendingUp className="w-5 h-5" />,
  star: <Star className="w-5 h-5" />,
  systems: <Cpu className="w-5 h-5" />,
  web: <Globe className="w-5 h-5" />,
  tooling: <Layers className="w-5 h-5" />,
};

export default function SkillCard({ block }) {
  return (
    <div className="card card-hover flex flex-col">
      <div className="flex items-center mb-5">
        <IconBox>{ICONS[block.icon] ?? ICONS.terminal}</IconBox>
        <h3 className="ml-3 font-bold text-lg text-(--text-strong)">
          {block.title}
        </h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {block.items.map((item) => (
          <TagPill key={item}>{item}</TagPill>
        ))}
      </div>
    </div>
  );
}
