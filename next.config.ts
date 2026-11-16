import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The accessible van page came down in November 2026 after the van was
      // given away. Its URLs (including the original /van-giveaway) were shared
      // widely on social, so send those visitors to the home page rather than a
      // 404. Temporary on purpose: browsers cache a permanent redirect, which
      // would get in the way if a future campaign ever reuses the path.
      {
        source: "/van-gift/:path*",
        destination: "/",
        permanent: false,
      },
      {
        source: "/van-giveaway/:path*",
        destination: "/",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
