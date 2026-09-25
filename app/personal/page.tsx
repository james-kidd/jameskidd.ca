import type { Metadata } from "next";
import { ArrowUpRight, ChevronDown, MapPin } from "lucide-react";
import { Gallery } from "@/components/gallery";
import { TravelMap } from "@/components/travel-map";
import { favorites, gallery, milestones, personal } from "@/content/personal";
import { site } from "@/content/site";
import { cities, countries, regions, totalPhotos, travelYears } from "@/content/travel";

export const metadata: Metadata = {
  // "Offline Mode" alone reads like an error in a search result.
  title: `${personal.title}: Travel & Photography`,
  description: `Life beyond the terminal — a travel map, photo gallery, and life story covering ${cities.length} cities across ${countries.length} countries.`,
  alternates: { canonical: "/personal" },
};

const stats = [
  { label: "Countries", value: String(countries.length) },
  { label: "Cities", value: String(cities.length) },
  { label: "Photos", value: totalPhotos.toLocaleString("en-CA") },
  { label: "Years", value: travelYears },
];

const places = regions
  .map((region) => ({
    ...region,
    cities: cities.filter((city) => region.countries.includes(city.country)),
  }))
  .filter((region) => region.cities.length > 0);

export default function PersonalPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14 md:py-20">
      <header>
        <p className="t-label">Personal</p>
        <h1 className="t-title mt-3">{personal.title}</h1>
        <p className="t-lead mt-4 max-w-2xl text-ink-muted">{personal.intro}</p>
        <a
          href={site.socials.instagram}
          target="_blank"
          rel="noreferrer"
          className="t-label mt-4 inline-flex items-center gap-1 text-accent hover:underline"
        >
          @{personal.instagramHandle}
          <ArrowUpRight className="size-3.5" aria-hidden />
        </a>

        <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="card p-4">
              <dd className="t-title">{stat.value}</dd>
              <dt className="t-label mt-1">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </header>

      <section className="mt-16" aria-labelledby="map-heading">
        <h2 id="map-heading" className="t-title mb-6">
          Where I&apos;ve been
        </h2>
        <TravelMap />
      </section>

      <section className="mt-16" aria-labelledby="places-heading">
        <h2 id="places-heading" className="t-title mb-6">
          Places
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {places.map((region) => {
            const photos = region.cities.reduce((sum, city) => sum + city.photos, 0);
            return (
              <li key={region.name}>
                <details className="card group">
                  <summary className="flex items-center justify-between gap-3 p-4">
                    <span>
                      <span className="t-small block text-ink">{region.name}</span>
                      <span className="t-label mt-0.5 block">
                        {region.cities.length} {region.cities.length === 1 ? "city" : "cities"} · {photos} photos
                      </span>
                    </span>
                    <ChevronDown
                      className="size-4 shrink-0 text-ink-muted motion-safe:transition-transform group-open:rotate-180"
                      aria-hidden
                    />
                  </summary>
                  <ul className="flex flex-wrap gap-1.5 border-t border-line p-4">
                    {region.cities.map((city) => (
                      <li key={city.name} className="tag t-small">
                        {city.name}
                        <span className="ml-1.5 text-ink-muted">{city.photos}</span>
                      </li>
                    ))}
                  </ul>
                </details>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-16" aria-labelledby="story-heading">
        <h2 id="story-heading" className="t-title mb-6">
          Life story
        </h2>
        <div className="grid gap-10 md:grid-cols-[1fr_15rem]">
          <Gallery photos={gallery} className="md:order-2 md:self-start md:sticky md:top-20" />
          <ol className="timeline space-y-8">
            {milestones.map((milestone) => (
              <li key={`${milestone.date}-${milestone.title}`} className="relative">
                <span className="timeline-dot" aria-hidden />
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="t-heading">{milestone.title}</h3>
                  <p className="t-label">{milestone.date}</p>
                </div>
                <p className="t-small mt-2 text-ink-muted">{milestone.description}</p>
                {milestone.location && (
                  <p className="t-label mt-2 inline-flex items-center gap-1">
                    <MapPin className="size-3" aria-hidden />
                    {milestone.location}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mt-16" aria-labelledby="favorites-heading">
        <h2 id="favorites-heading" className="t-title mb-6">
          Favorites
        </h2>
        <div className="grid gap-8 sm:grid-cols-3">
          {favorites.map((group) => (
            <div key={group.title}>
              <h3 className="t-label mb-3">{group.title}</h3>
              <ul className="t-small space-y-1.5 text-ink-muted">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="t-small mt-8 border-t border-line pt-6 text-ink-muted">
          <span className="text-ink">Currently reading</span> {personal.currentRead}
        </p>
      </section>
    </div>
  );
}
