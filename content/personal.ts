// content/personal.ts
// Everything on /personal except the travel data (see travel.ts).
// To add a photo: drop it in public/photos/ and add a line to `gallery`.
import type { Milestone, Photo } from "./schema";

export const personal = {
  title: "Offline Mode",
  intro:
    "There's life beyond coding. As much as I enjoy building software, I value time spent outdoors, traveling, and real human connection.",
  instagramHandle: "jameskidd__",
  currentRead: "Options, Futures, and Other Derivatives — John Hull",
};

export const gallery: Photo[] = [
  { src: "/photos/about-me-0.jpg", alt: "Skiing in the Alps", caption: "Alps" },
  { src: "/photos/about-me-1.jpg", alt: "New York City", caption: "New York" },
  { src: "/photos/about-me-2.jpg", alt: "James Kidd in Glasgow", caption: "Glasgow" },
  { src: "/photos/about-me-3.jpg", alt: "Scala dei Turchi, Sicily", caption: "Sicily" },
  { src: "/photos/about-me-4.jpg", alt: "Scottish Highlands with Saltire flag", caption: "Scotland" },
  { src: "/photos/about-me-5.jpg", alt: "Family in Italy", caption: "Italy" },
  { src: "/photos/about-me-6.jpg", alt: "Croatian coastline", caption: "Croatia" },
  { src: "/photos/about-me-7.jpg", alt: "Beach in Colombia", caption: "Colombia" },
];

export const milestones: Milestone[] = [
  {
    date: "2000s",
    title: "Childhood in the Philippines",
    description: 'Grew up in the Philippines and attended Lycée Français de Manille. I still say "Salamat" to Filipinos I meet today because the country gave me some of my strongest early memories.',
    location: "Manila, Philippines",
  },
  {
    date: "2010s",
    title: "Kuala Lumpur, Malaysia",
    description: '"Malaysia, Truly Asia" holds true. I miss Bastari and the people I grew up with there.',
    location: "Kuala Lumpur, Malaysia",
  },
  {
    date: "2016",
    title: "PADI Scuba Licence",
    description: "Earned my PADI scuba diving licence in Malaysia, which started a lifelong interest in diving and exploring new places properly.",
    location: "Malaysia",
  },
  {
    date: "2010s",
    title: "Moved to Montreal",
    description: "Moved to Montreal and attended Loyola High School and Lower Canada College, where I built strong roots in Canada.",
    location: "Montreal, Canada",
  },
  {
    date: "2018",
    title: "Iquitos, Peru — Service Trip",
    description: "Travelled to Iquitos, Peru for a service trip in the Amazon. It was one of my first major experiences seeing a different part of the world with purpose.",
    location: "Iquitos, Peru",
  },
  {
    date: "2018",
    title: "Lead Role — Lord of the Flies",
    description: "Played Jack Merridew in Lord of the Flies, a demanding lead role that challenged me to explore leadership, fear, and power on stage.",
    location: "Montreal, Canada",
  },
  {
    date: "2018",
    title: "GMAA Varsity Volleyball MVP",
    description: "Named GMAA Juvenile Boys Varsity Finals MVP — one of my proudest high school athletic moments.",
    location: "Montreal, Canada",
  },
  {
    date: "2020",
    title: "Queen's University",
    description: "Moved to Kingston to study Computer Engineering at Queen's University, where I became more interested in math, software, and AI.",
    location: "Kingston, Canada",
  },
  {
    date: "Summer 2023",
    title: "Colombia",
    description: "Spent the summer in Colombia, where I learned Spanish, continued scuba diving, and lived in a new culture firsthand.",
    location: "Colombia",
  },
  {
    date: "2023",
    title: "McGill University",
    description: "Transferred to McGill University for a B.Sc. Joint Major in Mathematics and Computer Science, focusing on AI, algorithms, systems, and applied mathematics.",
    location: "Montreal, Canada",
  },
  {
    date: "2025",
    title: "Glasgow, Scotland",
    description: "Moved to Glasgow for an exchange semester at the University of Glasgow. I connected back to my Scottish roots, met family, and learned to play golf on the links.",
    location: "Glasgow, UK",
  },
  {
    date: "2026",
    title: "Toronto — CI Global Asset Management",
    description: "Moved to Toronto to work at CI Global Asset Management, combining technology, finance, automation, and investment research.",
    location: "Toronto, Canada",
  },
  {
    date: "2026",
    title: "CodeJam President",
    description: "Became President of McGill CodeJam, leading the team as we reshape the hackathon around AI, innovation, and the future of software engineering.",
    location: "Montreal, Canada",
  },
];

export const favorites: { title: string; items: string[] }[] = [
  {
    title: "Books",
    items: [
      "Atomic Habits — James Clear",
      "Capitalism in America — Alan Greenspan",
      "Outliers — Malcolm Gladwell",
      "Flash Boys — Michael Lewis",
      "Options, Futures, and Other Derivatives — John Hull",
      "Designing Data-Intensive Applications — Martin Kleppmann",
      "Discrete Mathematics and Its Applications — Kenneth H. Rosen",
      "Introduction to the Theory of Computation — Michael Sipser",
      "Absolute Java — Walter Savitch",
      "The Dirt — Nikki Sixx",
      "Oryx and Crake — Margaret Atwood",
    ],
  },
  {
    title: "Websites",
    items: ["IBM Education Series", "ServiceNow Lab Series", "Claude", "OpenAI", "Bloomberg News"],
  },
  {
    title: "Technologies",
    items: ["PyTorch", "Google Colab", "Plotly", "Neovim", "Tailwind CSS"],
  },
];
