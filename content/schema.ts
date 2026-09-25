// content/schema.ts
// The shapes every content file must satisfy. `tsc` (and therefore the Vercel
// build) fails when an entry does not fit, which is the point: a typo here is
// caught before it renders as a broken card.

/** An absolute https URL. A bare "#", "mailto:" or a relative path is rejected. */
export type Url = `https://${string}`;

/** A file under public/, referenced from the site root, e.g. "/photos/me.jpg". */
export type PublicPath = `/${string}`;

/** Makes every key optional but requires at least one of them to be present. */
type AtLeastOne<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> & Partial<Omit<T, K>>;
}[keyof T];

// ---------------------------------------------------------------- site ----

export interface Site {
  name: string;
  title: string;
  tagline: string;
  /** Short list shown under the tagline. */
  stack: string[];
  /** Canonical site URL, used for metadata and the sitemap. */
  url: Url;
  /** Preview image for link unfurls (square works best). */
  ogImage: PublicPath;
  resume: PublicPath;
  contact: {
    /** Guidance line for recruiters (no email is shown). */
    recruiters: string;
    /** Email shown for contract inquiries. */
    contract: string;
  };
  socials: {
    github: Url;
    linkedin: Url;
    instagram: Url;
  };
  /**
   * Lines for the hero typing animation. Each line is typed with `old`,
   * `old` is struck out, and the line is retyped with `next`.
   */
  typingLines: { prefix: string; old: string; next: string; suffix?: string }[];
}

// ---------------------------------------------------------- experience ----

export interface Role {
  title: string;
  company: string;
  /** Free text, e.g. "May 2026 — Present". */
  date: string;
  /** One paragraph per entry. */
  summary: string[];
  tags: string[];
  link?: Url;
}

// ------------------------------------------------------------ projects ----

export interface Project {
  title: string;
  /** One or two sentences. */
  description: string;
  tags: string[];
  /**
   * Where the card leads. At least one is required; a project with nothing
   * to click does not type-check.
   */
  links: AtLeastOne<{ github: Url; live: Url; writeup: Url }>;
  /** Optional short note next to the title, e.g. "'23 — first LLM project". */
  note?: string;
  /** Optional thumbnail in public/, e.g. "/photos/project.jpg". */
  image?: PublicPath;
  /**
   * A page to embed as a playable demo in "Try it out" (a Hugging Face Space
   * works well). The project keeps its card; the demo is added on top.
   */
  embed?: Url;
}

// -------------------------------------------------------------- skills ----

export interface Pillar {
  title: string;
  subtitle: string;
  evidence: string[];
}

export interface SkillGroup {
  title: string;
  items: string[];
}

export interface Education {
  school: string;
  degree: string;
  years: string;
  description: string;
  coursework: { code: string; name: string; url: Url }[];
}

// ------------------------------------------------------------ personal ----

export interface Milestone {
  date: string;
  title: string;
  description: string;
  location?: string;
}

export interface Photo {
  src: PublicPath;
  alt: string;
  caption?: string;
}

export interface Country {
  name: string;
  /** ISO 3166-1 alpha-2, e.g. "IT". Cities refer to it. */
  code: string;
  /** Numeric ISO 3166-1 code, the id the world atlas uses to draw the outline. */
  mapId?: string;
}

export interface Region {
  name: string;
  /** Which map filter the region belongs to. */
  continent: "Europe" | "Americas" | "Asia";
  /** Country codes in this region. */
  countries: string[];
}

export interface City {
  name: string;
  /** Country code from `countries`. */
  country: string;
  lat: number;
  lng: number;
  photos: number;
  /** "2023" or "2018–2026". */
  visited: string;
}
