import React, { useState } from "react";
import { ArrowLeft, Globe, MapPin, Camera, GraduationCap } from "lucide-react";
import TravelMap from "./TravelMap";
import { travelData } from "../data/travel";
import { sectionData } from "../data";

const CONTINENTS = [
  {
    name: "British Isles",
    codes: ["GB", "IE"],
  },
  {
    name: "Western Europe",
    codes: ["FR", "NL", "DE"],
  },
  {
    name: "Iberian Peninsula",
    codes: ["ES", "PT"],
  },
  {
    name: "Central Europe",
    codes: ["HU", "AT", "SK", "CH"],
  },
  {
    name: "Nordics",
    codes: ["SE"],
  },
  {
    name: "Italy",
    codes: ["IT", "VA"],
  },
  {
    name: "Adriatic & Balkans",
    codes: ["HR", "BA", "AL"],
  },
  {
    name: "Greece",
    codes: ["GR"],
  },
  {
    name: "Turkey",
    codes: ["TR"],
  },
  {
    name: "South America",
    codes: ["CO"],
  },
  {
    name: "Central America & Caribbean",
    codes: ["PA", "CU", "DO"],
  },
  {
    name: "North America",
    codes: ["CA", "US"],
  },
  {
    name: "Asia",
    codes: ["TH", "MY", "JP"],
  },
];

function groupCities(cities) {
  return CONTINENTS.map((g) => ({
    ...g,
    cities: cities.filter((c) => g.codes.includes(c.countryCode)),
  })).filter((g) => g.cities.length > 0);
}

export default function PersonalPage() {
  const { stats, cities, countries } = travelData;
  const personal = sectionData.personal;
  const groups = groupCities(cities);
  const [expandedGroup, setExpandedGroup] = useState(null);

  return (
    <div className="min-h-screen" style={{ background: "var(--surface-muted)" }}>
      <div className="max-w-5xl mx-auto px-6 py-12 md:px-12 md:py-16">
        {/* Back */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.location.hash = "";
            window.scrollTo({ top: 0 });
          }}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-gray-700 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </a>

        {/* Hero */}
        <div className="section-panel mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Offline Mode
          </h1>
          <p className="section-lead max-w-2xl">{personal.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { label: "Countries", value: stats.countriesVisited, icon: Globe },
              { label: "Cities", value: stats.citiesExplored, icon: MapPin },
              { label: "Photos", value: stats.totalPhotos.toLocaleString(), icon: Camera },
              { label: "Years", value: stats.dateRange, icon: GraduationCap },
            ].map((s) => (
              <div key={s.label} className="text-center p-4 surface-muted">
                <s.icon className="w-5 h-5 mx-auto mb-2" style={{ color: "var(--primary)" }} />
                <div className="text-xl font-bold text-gray-900">{s.value}</div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="section-panel mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5" style={{ color: "var(--primary)" }} />
            Where I've Been
          </h2>
          <TravelMap cities={cities} countries={countries} />
        </div>

        {/* Grouped by continent / sub-region */}
        <div className="section-panel mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Places</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {groups.map((g) => {
              const isOpen = expandedGroup === g.name;
              const totalPhotos = g.cities.reduce((sum, c) => sum + c.photos, 0);
              return (
                <div key={g.name}>
                  <button
                    onClick={() => setExpandedGroup(isOpen ? null : g.name)}
                    className="w-full text-left p-4 rounded-xl border transition-all hover:shadow-sm"
                    style={{
                      background: isOpen ? "var(--secondary)" : "var(--surface)",
                      borderColor: isOpen ? "var(--primary)" : "var(--border)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">
                        {g.name}
                      </span>
                      <span className="text-xs text-gray-400">
                        {g.cities.length} {g.cities.length === 1 ? "city" : "cities"} / {totalPhotos} photos
                      </span>
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-4 py-3 flex flex-wrap gap-2">
                      {g.cities.map((c) => (
                        <span key={c.city} className="tag-pill">
                          {c.city}
                          <span className="text-gray-300 ml-1">{c.photos}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Gallery */}
        {personal.gallery?.length > 0 && (
          <div className="section-panel">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Camera className="w-5 h-5" style={{ color: "var(--primary)" }} />
              Gallery
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {personal.gallery.map((img) => (
                <div
                  key={img.src}
                  className="relative overflow-hidden rounded-xl bg-gray-100 group aspect-[4/3]"
                >
                  <img
                    src={img.src}
                    alt={img.alt || ""}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
