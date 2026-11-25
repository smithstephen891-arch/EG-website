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
      // The van story fundraising email (November 2026) links here rather than
      // straight to YouTube. Gmail adds its own video preview card, which looks
      // like an attachment, to any email that contains a YouTube address. It
      // cannot see through a redirect on our own domain. Do not remove this:
      // the email keeps pointing here for as long as people open it.
      {
        source: "/van-video",
        destination: "https://www.youtube.com/watch?v=b5gXOm1OnRg",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
