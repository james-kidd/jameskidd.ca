"use client";

import { Camera } from "lucide-react";
import { useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import type { City } from "@/content/schema";
import { cities, countries, regions } from "@/content/travel";

// Country outlines: world-atlas@2 countries-110m, copied into public/ so the
// map has no runtime dependency on a CDN. Geometries are keyed by numeric ISO
// code, which is what Country.mapId holds.
const GEO_URL = "/world-110m.json";
const WIDTH = 800;
const HEIGHT = 480;
const SCALE = 130;

const continents = Array.from(new Set(regions.map((region) => region.continent)));
const filters = ["All", ...continents] as const;
type Filter = (typeof filters)[number];

const visitedIds = new Set(countries.flatMap((c) => (c.mapId ? [c.mapId] : [])));
const countryName = new Map(countries.map((c) => [c.code, c.name]));

function markerRadius(photos: number) {
  if (photos > 200) return 7;
  if (photos > 80) return 5.5;
  if (photos > 30) return 4;
  return 3;
}

/** Mercator y for a latitude, in projection units before scaling. */
const mercatorY = (lat: number) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));

/** Centre and zoom that frame a set of cities inside the map. */
function frame(points: City[]): { center: [number, number]; zoom: number } {
  if (points.length === 0) return { center: [10, 20], zoom: 1 };
  const lngs = points.map((p) => p.lng);
  const lats = points.map((p) => p.lat);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);

  // Pixel extent of the bounding box at zoom 1, then how much it can grow.
  const spanX = ((maxLng - minLng) * Math.PI * SCALE) / 180;
  const spanY = (mercatorY(maxLat) - mercatorY(minLat)) * SCALE;
  const fit = Math.min((WIDTH * 0.7) / Math.max(spanX, 1), (HEIGHT * 0.7) / Math.max(spanY, 1));
  const zoom = Math.min(6, Math.max(1, fit));

  // Centre on the middle of the box in projected space so latitude is not skewed.
  const midY = (mercatorY(maxLat) + mercatorY(minLat)) / 2;
  const midLat = ((2 * Math.atan(Math.exp(midY)) - Math.PI / 2) * 180) / Math.PI;
  return { center: [(minLng + maxLng) / 2, midLat], zoom };
}

export function TravelMap() {
  const [filter, setFilter] = useState<Filter>("All");
  const [tooltip, setTooltip] = useState<City | null>(null);

  const shown = useMemo(() => {
    if (filter === "All") return cities;
    const codes = new Set(regions.filter((r) => r.continent === filter).flatMap((r) => r.countries));
    return cities.filter((city) => codes.has(city.country));
  }, [filter]);

  const countryCount = useMemo(() => new Set(shown.map((city) => city.country)).size, [shown]);
  const view = useMemo(() => frame(shown), [shown]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Map region">
        {filters.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => setFilter(name)}
            aria-pressed={filter === name}
            className="chip t-label"
          >
            {name}
          </button>
        ))}
      </div>

      <div className="card relative overflow-hidden">
        <ComposableMap
          width={WIDTH}
          height={HEIGHT}
          projection="geoMercator"
          projectionConfig={{ scale: SCALE }}
          aria-label="World map of cities visited"
        >
          <ZoomableGroup
            center={view.center}
            zoom={view.zoom}
            minZoom={1}
            maxZoom={8}
            // Drag with the mouse only: the wheel keeps scrolling the page and
            // touch keeps scrolling on phones. The filter chips do the zooming.
            filterZoomEvent={(event) => event.type === "mousedown"}
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const visited = visitedIds.has(String(geo.id));
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      tabIndex={-1}
                      className={`stroke-line outline-none ${
                        visited ? "fill-accent/25 hover:fill-accent/45" : "fill-surface-raised"
                      }`}
                      strokeWidth={0.5}
                    />
                  );
                })
              }
            </Geographies>

            {shown.map((city) => {
              const r = markerRadius(city.photos);
              return (
                <Marker
                  key={`${city.name}-${city.country}`}
                  coordinates={[city.lng, city.lat]}
                  onMouseEnter={() => setTooltip(city)}
                  onMouseLeave={() => setTooltip(null)}
                  onFocus={() => setTooltip(city)}
                  onBlur={() => setTooltip(null)}
                  tabIndex={0}
                  role="img"
                  aria-label={`${city.name}, ${countryName.get(city.country) ?? city.country}`}
                  className="cursor-pointer outline-none"
                >
                  <circle r={r + 3} className="fill-accent/20" />
                  <circle r={r} className="fill-accent stroke-surface" strokeWidth={1.5} />
                </Marker>
              );
            })}
          </ZoomableGroup>
        </ComposableMap>

        <p className="t-label absolute bottom-3 left-3 rounded-sm border border-line bg-surface/90 px-2.5 py-1.5 backdrop-blur">
          {shown.length} cities · {countryCount} countries
        </p>

        {tooltip && (
          <div className="card pointer-events-none absolute right-3 top-3 min-w-40 p-3">
            <p className="t-small text-ink">{tooltip.name}</p>
            <p className="t-small text-ink-muted">{countryName.get(tooltip.country) ?? tooltip.country}</p>
            <p className="t-label mt-2 flex items-center gap-3">
              <span className="inline-flex items-center gap-1">
                <Camera className="size-3.5 text-accent" aria-hidden />
                {tooltip.photos}
              </span>
              <span>{tooltip.visited}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
