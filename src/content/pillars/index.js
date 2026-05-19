import { Settings, Rocket, BarChart3, Sparkles } from "lucide-react";
import { byOrder, collectMdx } from "../mdxCollection";

const modules = import.meta.glob("./*.mdx", { eager: true });

const PILLAR_ICONS = {
  settings: Settings,
  rocket: Rocket,
  barChart: BarChart3,
};

export const pillars = collectMdx(modules, {
  componentName: "Description",
  sort: byOrder,
}).map((p) => ({ ...p, Icon: PILLAR_ICONS[p.icon] ?? Sparkles }));
