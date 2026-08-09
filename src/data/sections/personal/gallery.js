// src/data/sections/personal/gallery.js
// Photo gallery entries for sectionData.personal.gallery
// The files live in public/photos/, but `src` has no leading slash, so the browser
// resolves it against the current document URL. That only works on single-segment
// routes ("/" and "/personal"); rendering this gallery under a nested route would
// 404 until the values are root-anchored with a leading "/".
// Consumed by src/sections/PersonalSection.jsx and src/pages/PersonalPage.jsx

export const gallery = [
  { id: "skiing-alps", src: "photos/about-me-0.jpg", alt: "Skiing in the Alps", caption: "Alps" },
  { id: "nyc", src: "photos/about-me-1.jpg", alt: "New York City", caption: "New York" },
  { id: "portrait-glasgow", src: "photos/about-me-2.jpg", alt: "James Kidd in Glasgow", caption: "Glasgow" },
  { id: "scala-dei-turchi", src: "photos/about-me-3.jpg", alt: "Scala dei Turchi, Sicily", caption: "Sicily" },
  { id: "scottish-highlands", src: "photos/about-me-4.jpg", alt: "Scottish Highlands with Saltire flag", caption: "Scotland" },
  { id: "family-italy", src: "photos/about-me-5.jpg", alt: "Family in Italy", caption: "Italy" },
  { id: "croatia-coast", src: "photos/about-me-6.jpg", alt: "Croatian coastline", caption: "Croatia" },
  { id: "colombia-beach", src: "photos/about-me-7.jpg", alt: "Beach in Colombia", caption: "Colombia" },
];
