import type { NextConfig } from "next";

// towniesgolf.com (the Townies Open landing site) is served from this same
// project. Next strips the port and lowercases the hostname, then anchors
// this value as ^…$, so it matches exactly the apex and www hosts.
const TOWNIES_HOST = { type: "host", value: "(www\\.)?towniesgolf\\.com" } as const;

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      // beforeFiles is load-bearing: "/" is an existing page file (the EG
      // home), and filesystem routes are checked before plain rewrites, so an
      // array-form rewrite here would never fire.
      beforeFiles: [
        {
          source: "/",
          destination: "/townies",
          has: [TOWNIES_HOST],
        },
      ],
    };
  },
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
      // On towniesgolf.com the landing page is the whole site: every other
      // path goes back to "/". The exclusions are the page's own plumbing —
      // the interest API, Next's assets, the images and icons it references,
      // and crawler probe files. "/" itself can't match (".+" needs at least
      // one character), and redirects run before rewrites, so /townies 307s
      // to the canonical "/", which the rewrite above then serves. 307 rather
      // than 308 while the site is young, so a restructure never fights a
      // forever-cached redirect.
      {
        source:
          "/:path((?!api/|_next/|images/|icon|apple-icon|favicon|robots|sitemap|\\.well-known).+)",
        has: [TOWNIES_HOST],
        destination: "/",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
