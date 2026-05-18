import { useMemo, useState } from "react";
import { Camera, GraduationCap } from "lucide-react";

const VIEWBOX = {
  width: 800,
  height: 450,
};

const FILTERS = [
  { key: "all", label: "All" },
  {
    key: "europe",
    label: "Europe",
    codes: [
      "AL",
      "AT",
      "BA",
      "CH",
      "DE",
      "ES",
      "FR",
      "GB",
      "GR",
      "HR",
      "HU",
      "IE",
      "IT",
      "NL",
      "PT",
      "RO",
      "SE",
      "SK",
      "TR",
      "VA",
    ],
  },
  {
    key: "americas",
    label: "Americas",
    codes: ["CA", "CO", "CU", "DO", "PA", "US"],
  },
  {
    key: "asia",
    label: "Asia",
    codes: ["JP", "MY", "TH"],
  },
];

function project({ lat, lng }) {
  return {
    x: ((lng + 180) / 360) * VIEWBOX.width,
    y: ((90 - lat) / 180) * VIEWBOX.height,
  };
}

function markerSize(photos) {
  if (photos > 200) return 9;
  if (photos > 80) return 7;
  if (photos > 30) return 5.5;
  return 4;
}

function formatVisitRange(city) {
  if (city.firstVisit === city.lastVisit) return city.firstVisit;
  return `${city.firstVisit}-${city.lastVisit}`;
}

export default function TravelMap({ cities, countries }) {
  const [tooltip, setTooltip] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  const activeConfig = FILTERS.find((filter) => filter.key === activeFilter);
  const filteredCities = useMemo(() => {
    if (!activeConfig?.codes) return cities;
    return cities.filter((city) => activeConfig.codes.includes(city.countryCode));
  }, [activeConfig, cities]);

  const plottedCities = useMemo(
    () =>
      filteredCities.map((city) => ({
        ...city,
        ...project(city),
      })),
    [filteredCities]
  );

  const countryCount = useMemo(
    () => new Set(filteredCities.map((city) => city.countryCode)).size,
    [filteredCities]
  );

  return (
    <div className="relative">
      <div className="flex gap-2 mb-4 flex-wrap">
        {FILTERS.map((filter) => (
          <button
            key={filter.key}
            type="button"
            onClick={() => setActiveFilter(filter.key)}
            className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
              activeFilter === filter.key
                ? "bg-(--primary) text-white border-(--primary)"
                : "bg-white text-gray-500 border-gray-200 hover:border-(--primary) hover:text-(--primary)"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div
        className="relative overflow-hidden rounded-xl border bg-white"
        style={{ borderColor: "var(--border)" }}
      >
        <svg
          viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
          className="block w-full h-auto"
          role="img"
          aria-label={`Travel map showing ${filteredCities.length} cities across ${countryCount} countries`}
        >
          <rect width={VIEWBOX.width} height={VIEWBOX.height} fill="var(--surface-muted)" />

          {[-120, -60, 0, 60, 120].map((lng) => {
            const { x } = project({ lat: 0, lng });
            return (
              <line
                key={`lng-${lng}`}
                x1={x}
                x2={x}
                y1="0"
                y2={VIEWBOX.height}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            );
          })}

          {[-45, 0, 45].map((lat) => {
            const { y } = project({ lat, lng: 0 });
            return (
              <line
                key={`lat-${lat}`}
                x1="0"
                x2={VIEWBOX.width}
                y1={y}
                y2={y}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            );
          })}

          <g fill="#e2e8f0" opacity="0.75">
            <ellipse cx="156" cy="155" rx="86" ry="58" />
            <ellipse cx="232" cy="268" rx="56" ry="94" />
            <ellipse cx="392" cy="170" rx="82" ry="52" />
            <ellipse cx="424" cy="238" rx="52" ry="84" />
            <ellipse cx="548" cy="187" rx="118" ry="74" />
            <ellipse cx="644" cy="326" rx="44" ry="30" />
          </g>

          <g>
            {plottedCities.map((city) => {
              const radius = markerSize(city.photos);
              const isUniversity = city.tag === "university";
              return (
                <g
                  key={`${city.city}-${city.countryCode}`}
                  transform={`translate(${city.x} ${city.y})`}
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
                    r={radius + 4}
                    fill={isUniversity ? "#f59e0b" : "var(--primary)"}
                    opacity="0.12"
                  />
                  <circle
                    r={radius}
                    fill={isUniversity ? "#f59e0b" : "var(--primary)"}
                    stroke="#fff"
                    strokeWidth="2"
                  />
                  {isUniversity && (
                    <GraduationCap
                      x={-7}
                      y={-radius - 20}
                      width="14"
                      height="14"
                      color="#f59e0b"
                      strokeWidth="2.5"
                    />
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        <div className="absolute left-4 bottom-4 rounded-lg border bg-white/90 px-3 py-2 shadow-sm">
          <p className="text-xs font-semibold text-gray-900">
            {filteredCities.length} cities
          </p>
          <p className="text-[11px] text-gray-500">
            {countryCount || countries.length} countries
          </p>
        </div>
      </div>

      {tooltip && (
        <div
          className="absolute top-12 right-4 z-10 bg-white border rounded-lg shadow-lg px-4 py-3 min-w-48"
          style={{ borderColor: "var(--border)" }}
        >
          <p className="font-semibold text-sm text-gray-900">{tooltip.city}</p>
          <p className="text-xs text-gray-500">{tooltip.country}</p>
          <div className="flex gap-4 mt-2">
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Camera className="w-3 h-3" />
              {tooltip.photos}
            </span>
            <span className="text-xs text-gray-400">
              {formatVisitRange(tooltip)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
