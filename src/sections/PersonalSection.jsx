import { createElement } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Book,
  Camera,
  Coffee,
  Cpu,
  Globe,
  Instagram,
  MapPin,
} from "lucide-react";
import SectionPanel from "../components/SectionPanel";
import SectionTitle from "../components/SectionTitle";
import { travelData } from "../data/travel";

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

function TravelPreview() {
  const { stats } = travelData;
  const topCities = travelData.cities
    .filter((city) => !["CA", "US"].includes(city.countryCode))
    .slice(0, 6);

  return (
    <div className="surface-muted p-6 space-y-5">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Countries", value: stats.countriesVisited, Icon: Globe },
          { label: "Cities", value: stats.citiesExplored, Icon: MapPin },
          {
            label: "Photos",
            value: stats.totalPhotos.toLocaleString(),
            Icon: Camera,
          },
        ].map(({ label, value, Icon }) => (
          <div key={label} className="text-center">
            {createElement(Icon, {
              className: "w-5 h-5 mx-auto mb-2 text-(--primary)",
            })}
            <div className="text-xl font-bold text-gray-900">{value}</div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wider">
              {label}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {topCities.map((city) => (
          <span key={`${city.city}-${city.countryCode}`} className="tag-pill">
            {city.city}, {city.country}
          </span>
        ))}
        <span className="tag-pill">+{travelData.cities.length - topCities.length} more</span>
      </div>

      <Link to="/personal" className="btn btn-outline w-full group">
        Explore where I've been
        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
      </Link>
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
      <div className="grid md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-2">
          <SectionTitle className="mb-6">Offline Mode</SectionTitle>
          <p className="section-lead">{data.description}</p>
        </div>
        <QuickStats stats={data.stats} />
      </div>

      <TravelPreview />

      {data.milestones?.length > 0 && (
        <MilestonesTimeline milestones={data.milestones} />
      )}

      {data.favorites && <FavoritesLists favorites={data.favorites} />}

      <Gallery gallery={data.gallery} instagram={data.instagram} />
    </SectionPanel>
  );
}
