import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { site } from "@/content/site";
import tokens from "@/tokens/tokens.json";
import "./globals.css";

// The typefaces are self-hosted at build time. tokens.json's font/sans and
// font/mono point at these two variables.
const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.title}`,
    template: `%s — ${site.name}`,
  },
  description: `${site.tagline}. ${site.name} is a ${site.title} working across ${site.stack.join(", ")}.`,
  openGraph: {
    type: "website",
    siteName: site.name,
    images: [site.ogImage],
  },
  // The OG photo is square, so the small card keeps it uncropped.
  twitter: { card: "summary" },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: tokens["color/surface"].$value.light },
    { media: "(prefers-color-scheme: dark)", color: tokens["color/surface"].$value.dark },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <SiteNav />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
