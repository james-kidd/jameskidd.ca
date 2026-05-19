import React, { useState } from "react";
import { ArrowLeft, Book, Cpu, Globe, MapPin, Camera, GraduationCap } from "lucide-react";
import TravelMap from "./TravelMap";
import GalleryLightbox from "../components/GalleryLightbox";
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
  const [lightboxIndex, setLightboxIndex] = useState(null);

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

        {/* Life Story + Gallery */}
        {personal.milestones?.length > 0 && (
          <div className="section-panel mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5" style={{ color: "var(--primary)" }} />
              Life Story
            </h2>
            <div className="grid md:grid-cols-[1fr_260px] gap-10 items-start">
              {/* Timeline */}
              <div>
                {personal.milestones.map((m) => (
                  <div key={m.date + m.title} className="timeline-item group">
                    <div className="timeline-dot" />
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-1">
                      <h4 className="font-semibold" style={{ color: "var(--text-strong)" }}>{m.title}</h4>
                      <span className="text-sm font-medium shrink-0 ml-3" style={{ color: "var(--primary)" }}>{m.date}</span>
                    </div>
                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>{m.description}</p>
                    {m.location && (
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {m.location}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Gallery — linear vertical stack */}
              <div className="space-y-3 md:sticky md:top-6">
                {personal.gallery.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setLightboxIndex(i)}
                    className="relative overflow-hidden rounded-xl bg-gray-100 group w-full aspect-[4/3] cursor-pointer"
                  >
                    <img
                      src={img.src}
                      alt={img.alt || ""}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-end">
                      {img.caption && (
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-sm font-medium px-3 py-2">
                          {img.caption}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {lightboxIndex !== null && (
              <GalleryLightbox
                images={personal.gallery}
                index={lightboxIndex}
                onClose={() => setLightboxIndex(null)}
              />
            )}
          </div>
        )}

        {/* Favorites */}
        {personal.favorites && (
          <div className="section-panel mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Favorites</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                { key: "books", label: "Books", Icon: Book },
                { key: "websites", label: "Websites", Icon: Globe },
                { key: "technologies", label: "Technologies", Icon: Cpu },
              ].map((config) => (
                <div key={config.key} className="surface-muted p-5">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <config.Icon className="w-4 h-4" style={{ color: "var(--primary)" }} />
                    {config.label}
                  </h4>
                  <ul className="space-y-2">
                    {personal.favorites[config.key].map((item) => (
                      <li key={item} className="text-sm text-gray-600">{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
