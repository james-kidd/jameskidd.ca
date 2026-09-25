import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The old site had a /skills page and one page per project. Those URLs are
  // indexed, so they land on the matching section of the home page instead of
  // a 404. Order matters: the specific rule must come before the wildcard.
  async redirects() {
    return [
      { source: "/skills", destination: "/#skills", permanent: true },
      { source: "/projects/manager-dna", destination: "/#try-it-out", permanent: true },
      { source: "/projects/:slug", destination: "/#projects", permanent: true },
    ];
  },
};

export default nextConfig;
