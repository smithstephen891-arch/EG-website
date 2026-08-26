import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The van page originally shipped at /van-giveaway and was shared on
      // social under that URL. Keep those posts working after the rename.
      {
        source: "/van-giveaway",
        destination: "/van-gift",
        permanent: true,
      },
      // Older submissions from a cached page could still post to the old API
      // path. 308 preserves the POST method and body.
      {
        source: "/api/van-giveaway/:path*",
        destination: "/api/van-gift/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
