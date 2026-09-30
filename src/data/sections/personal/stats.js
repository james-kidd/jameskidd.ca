// src/data/sections/personal/stats.js
// Quick Stats rows for sectionData.personal.stats
// Only consumer: the QuickStats card in src/sections/PersonalSection.jsx (home page).
// /personal does NOT read this — its counters come from src/data/travel.js.

export const stats = [
  // TODO(James): true country count. This row said 39 while the travel counters
  // (src/data/travel.js, generated from photo EXIF) say 29. The row is removed so
  // the number appears once; if 39 is right, travel.js only counts countries you
  // have geotagged photos from, and the stat should be fixed at its source.
  { label: "Current Read", value: "Options, Futures, and Other Derivatives — John Hull" },
];
