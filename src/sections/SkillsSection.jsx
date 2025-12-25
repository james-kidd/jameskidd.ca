import React from "react";
import { Terminal, Database, Cloud, TrendingUp } from "lucide-react";

const getIcon = (title) => {
  if (title.includes("Language")) return <Terminal className="w-5 h-5" />;
  if (title.includes("Data")) return <Database className="w-5 h-5" />;
  if (title.includes("Infra")) return <Cloud className="w-5 h-5" />;
  if (title.includes("Finance")) return <TrendingUp className="w-5 h-5" />;
  return <Terminal className="w-5 h-5" />;
};

export default function SkillsSection({ data }) {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-8 text-gray-900">
        Technical Arsenal
      </h2>

      <div className="grid gap-6 sm:grid-cols-2">
        {data.categories.map((cat, idx) => (
          <div key={idx} className="card card-hover group flex flex-col">
            {/* Header with Icon */}
            <div className="flex items-center mb-5">
                <div className="icon-box">
                {getIcon(cat.title)}
              </div>
              <h3 className="ml-3 font-bold text-lg text-gray-900">
                {cat.title}
              </h3>
            </div>

            {/* Skills Container */}
            <div className="flex flex-wrap gap-2">
              {cat.skills.map((skill) => (
                <span key={skill} className="tag-pill">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
