import { Camera, Coffee, Instagram, MapPin, Book, Globe, Cpu } from "lucide-react";
import SectionPanel from "../components/SectionPanel";
import SectionTitle from "../components/SectionTitle";

function QuickStats({ stats }) {
  return (
    <div className="surface-muted p-6">
      <h3 className="font-bold text-gray-900 mb-4 flex items-center">
        <Coffee className="w-4 h-4 mr-2" />
        Quick Stats
      </h3>
      <div className="space-y-3">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {stat.label}
            </span>
            <span className="text-gray-800 font-medium">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MilestonesTimeline({ milestones }) {
  return (
    <div>
      <h3 className="font-bold text-xl mb-6 flex items-center">
        <MapPin className="w-5 h-5 mr-2" />
        Life Milestones
      </h3>
      <div>
        {milestones.map((m) => (
          <div key={m.date + m.title} className="timeline-item group">
            <div className="timeline-dot" />
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-1">
              <h4 className="font-semibold text-(--text-strong)">{m.title}</h4>
              <span className="text-sm text-(--text-muted)">{m.date}</span>
            </div>
            <p className="text-sm text-(--text-muted)">{m.description}</p>
            {m.location && (
              <p className="text-xs text-gray-400 mt-1">{m.location}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const FAVORITES_CONFIG = [
  { key: "books", label: "Books", Icon: Book },
  { key: "websites", label: "Websites", Icon: Globe },
  { key: "technologies", label: "Technologies", Icon: Cpu },
];

function FavoritesLists({ favorites }) {
  return (
    <div>
      <h3 className="font-bold text-xl mb-6">Favorites</h3>
      <div className="grid gap-6 sm:grid-cols-3">
        {FAVORITES_CONFIG.map((config) => (
          <div key={config.key} className="surface-muted p-5">
            <h4 className="text-sm font-semibold text-(--text-strong) mb-3 flex items-center gap-2">
              <config.Icon className="w-4 h-4 text-(--primary)" />
              {config.label}
            </h4>
            <ul className="space-y-2">
              {favorites[config.key].map((item) => (
                <li key={item} className="text-sm text-(--text-muted)">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function Gallery({ gallery, instagram }) {
  return (
    <div>
      <h3 className="px-4 font-bold text-xl mb-6 flex items-center justify-between">
        <span className="flex items-center">
          <Camera className="w-5 h-5 mr-2" />
          Gallery
        </span>

        {instagram && (
          <a
            href={instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-sm hover:text-(--primary) transition-colors"
            aria-label="Instagram"
          >
            jameskidd__
            <Instagram className="w-5 h-5 ml-1" />
          </a>
        )}
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {gallery.map((img) => (
          <div
            key={img.src}
            className="relative overflow-hidden rounded-xl bg-gray-100"
          >
            <img
              src={img.src}
              alt={img.alt || ""}
              className="w-full h-full object-cover min-h-48"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PersonalSection({ data }) {
  return (
    <SectionPanel>
      {/* TOP: TEXT + STATS */}
      <div className="grid md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-2">
          <SectionTitle className="mb-6">Offline Mode</SectionTitle>
          <p className="section-lead">{data.description}</p>
        </div>
        <QuickStats stats={data.stats} />
      </div>

      {/* MILESTONES TIMELINE */}
      {data.milestones?.length > 0 && (
        <MilestonesTimeline milestones={data.milestones} />
      )}

      {/* FAVORITES */}
      {data.favorites && (
        <FavoritesLists favorites={data.favorites} />
      )}

      {/* GALLERY */}
      <Gallery gallery={data.gallery} instagram={data.instagram} />
    </SectionPanel>
  );
}
