import { useMemo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { Camera } from "lucide-react";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const FILTERS = [
  { key: "all", label: "All", center: [10, 20], zoom: 1 },
  {
    key: "europe",
    label: "Europe",
    codes: [
      "AL", "AT", "BA", "CH", "DE", "ES", "FR", "GB", "GR", "HR",
      "HU", "IE", "IT", "NL", "PT", "RO", "SE", "SK", "TR", "VA",
    ],
    center: [15, 50],
    zoom: 3.5,
  },
  {
    key: "americas",
    label: "Americas",
    codes: ["CA", "CO", "CU", "DO", "PA", "US"],
    center: [-75, 25],
    zoom: 2,
  },
  {
    key: "asia",
    label: "Asia",
    codes: ["JP", "MY", "TH"],
    center: [105, 20],
    zoom: 2.5,
  },
];

const VISITED_CODES = new Set([
  "ALB", "AUT", "BIH", "CAN", "CHE", "COL", "CUB", "DEU", "DOM", "ESP",
  "FRA", "GBR", "GRC", "HRV", "HUN", "IRL", "ITA", "JPN", "MYS", "NLD",
  "PAN", "PRT", "ROU", "SWE", "SVK", "THA", "TUR", "USA", "VAT",
]);

function markerSize(photos) {
  if (photos > 200) return 7;
  if (photos > 80) return 5.5;
  if (photos > 30) return 4;
  return 3;
}

function formatVisitRange(city) {
  if (city.firstVisit === city.lastVisit) return city.firstVisit;
  return `${city.firstVisit}-${city.lastVisit}`;
}

export default function TravelMap({ cities, countries }) {
  const [tooltip, setTooltip] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  const activeConfig = FILTERS.find((f) => f.key === activeFilter);
  const filteredCities = useMemo(() => {
    if (!activeConfig?.codes) return cities;
    return cities.filter((c) => activeConfig.codes.includes(c.countryCode));
  }, [activeConfig, cities]);

  const countryCount = useMemo(
    () => new Set(filteredCities.map((c) => c.countryCode)).size,
    [filteredCities]
  );

  return (
    <div className="relative space-y-4">
      <div className="flex gap-2 flex-wrap" role="group" aria-label="Map region filters">
        {FILTERS.map((filter) => {
          const isActive = activeFilter === filter.key;
          return (
            <button
              key={filter.key}
              type="button"
              onClick={() => setActiveFilter(filter.key)}
              aria-pressed={isActive}
              className={`tag-pill px-4 py-1.5 ${
                isActive ? "!bg-(--primary) !text-white !border-(--primary)" : ""
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <div className="relative overflow-hidden section-surface">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 130 }}
          style={{ width: "100%", height: "auto" }}
        >
          <ZoomableGroup
            center={activeConfig.center}
            zoom={activeConfig.zoom}
            minZoom={1}
            maxZoom={8}
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const isVisited = VISITED_CODES.has(geo.properties?.ISO_A3 || geo.id);
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={isVisited ? "var(--secondary)" : "var(--surface)"}
                      stroke="var(--border)"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: {
                          fill: isVisited
                            ? "color-mix(in srgb, var(--primary) 25%, var(--surface))"
                            : "var(--surface-muted)",
                          outline: "none",
                        },
                        pressed: { outline: "none" },
                      }}
                    />
                  );
                })
              }
            </Geographies>

            {filteredCities.map((city) => {
              const radius = markerSize(city.photos);
              return (
                <Marker
                  key={`${city.city}-${city.countryCode}`}
                  coordinates={[city.lng, city.lat]}
                  onMouseEnter={() => setTooltip(city)}
                  onMouseLeave={() => setTooltip(null)}
                  onFocus={() => setTooltip(city)}
                  onBlur={() => setTooltip(null)}
                  tabIndex="0"
                  role="button"
                  aria-label={`${city.city}, ${city.country}`}
                  className="cursor-pointer outline-none"
                >
                  <circle
                    r={radius + 3}
                    fill="var(--primary)"
                    opacity={0.15}
                    className="transition-opacity duration-200"
                  />
                  <circle
                    r={radius}
                    fill={city.tag === "university" ? "#f59e0b" : "var(--primary)"}
                    stroke="var(--surface)"
                    strokeWidth={1.5}
                    className="transition-transform duration-200"
                  />
                </Marker>
              );
            })}
          </ZoomableGroup>
        </ComposableMap>

        <div className="absolute left-4 bottom-4 badge badge-neutral bg-white/90 backdrop-blur-sm shadow-sm flex items-center gap-2 px-3 py-2">
          <span className="font-semibold text-(--text-strong)">
            {filteredCities.length} cities
          </span>
          <span className="text-(--border)">|</span>
          <span className="text-(--text-muted)">
            {countryCount || countries.length} countries
          </span>
        </div>
      </div>

      {tooltip && (
        <div className="absolute top-16 right-4 z-10 section-panel !p-4 min-w-48 pointer-events-none">
          <p className="font-semibold text-sm text-(--text-strong)">{tooltip.city}</p>
          <p className="text-xs text-(--text-muted)">{tooltip.country}</p>
          <div className="flex gap-4 mt-3">
            <span className="text-xs font-medium text-(--text-muted) flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-(--primary)" />
              {tooltip.photos}
            </span>
            <span className="text-xs font-medium text-(--text-muted) flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-(--border)" />
              {formatVisitRange(tooltip)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
