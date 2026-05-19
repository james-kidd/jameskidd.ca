import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Camera,
  Coffee,
  Globe,
  Instagram,
  MapPin,
} from "lucide-react";
import SectionPanel from "../components/SectionPanel";
import SectionTitle from "../components/SectionTitle";
import GalleryLightbox from "../components/GalleryLightbox";
import { travelData } from "../data/travel";

function QuickStats({ stats }) {
  return (
    <div className="surface-muted p-6">
      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Coffee className="w-4 h-4" />
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

function Gallery({ gallery, instagram }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  return (
    <div>
      <h3 className="font-bold text-xl mb-6 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <Camera className="w-5 h-5" />
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
        {gallery.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setLightboxIndex(i)}
            className="relative overflow-hidden rounded-xl bg-gray-100 group aspect-[4/3] cursor-pointer"
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

      {lightboxIndex !== null && (
        <GalleryLightbox
          images={gallery}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
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
          { label: "Photos", value: stats.totalPhotos.toLocaleString(), Icon: Camera },
        ].map((stat) => {
          const StatIcon = stat.Icon;

          return (
            <div key={stat.label} className="text-center">
              <StatIcon className="w-5 h-5 mx-auto mb-2 text-(--primary)" />
              <div className="text-xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          );
        })}
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
        Explore where I&apos;ve been
        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
      </Link>
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

      <Gallery gallery={data.gallery} instagram={data.instagram} />

      <TravelPreview />
    </SectionPanel>
  );
}
