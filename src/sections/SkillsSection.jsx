import React from "react";
import {
  Terminal,
  Database,
  Cloud,
  TrendingUp,
  Star,
} from "lucide-react";

const ICONS = {
  terminal: <Terminal className="w-5 h-5" />,
  database: <Database className="w-5 h-5" />,
  cloud: <Cloud className="w-5 h-5" />,
  trending: <TrendingUp className="w-5 h-5" />,
  star: <Star className="w-5 h-5" />,
};

export default function SkillsSection({ data }) {
  return (
    <div>
      <h2 className="section-title mb-12">
        Technical Arsenal
      </h2>

      <div className="grid gap-6 sm:grid-cols-2">
        {data.blocks.map((block) => (
          <div
            key={block.id}
            className="card card-hover group flex flex-col"
          >
            {/* HEADER */}
            <div className="flex items-center mb-5">
              <div className="icon-box">
                {ICONS[block.icon] ?? ICONS.terminal}
              </div>

              <h3 className="ml-3 font-bold text-lg text-gray-900">
                {block.title}
              </h3>
            </div>

            {/* ITEMS */}
            <div className="flex flex-wrap gap-2">
              {block.items.map((item) => (
                <span key={item} className="tag-pill">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
