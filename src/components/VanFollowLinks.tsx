import { Facebook, Instagram, Linkedin } from "lucide-react";
import TikTokIcon from "@/components/TikTokIcon";
import {
  FACEBOOK_PROFILE_URL,
  INSTAGRAM_PROFILE_URL,
  LINKEDIN_PROFILE_URL,
  TIKTOK_PROFILE_URL,
} from "@/lib/social";

/*
 * Follow links for every account we post from.
 *
 * Deliberately separate from the share controls they sit beside. Sharing the
 * page and following the account are different asks, and the tiles that used to
 * live in the share row said "Share the TikTok" while actually just opening the
 * post, which promised something they did not do.
 *
 * No client hooks here: these are plain outbound links, so the component stays
 * a server component even though its neighbours are interactive.
 */

// Four names no longer fit one row of the 280px column this sits in on the van
// page, so the tiles wrap instead of shrinking: `basis-28` is the width at which
// the longest label still reads, and `grow` spreads them across whatever row
// they land on. Two per row in a narrow column, all four in a wide one.
//
// Names are kept rather than going icon-only like the footer: the TikTok mark
// below is hand-drawn, and an unfamiliar glyph with no word beside it is
// unidentifiable.
const linkClass =
  "flex min-h-11 min-w-0 grow basis-28 items-center justify-center gap-1.5 rounded-full px-1.5 py-2 text-xs font-semibold text-charcoal/70 transition-colors hover:bg-white hover:text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive-dark focus-visible:ring-offset-2 sm:gap-2 sm:px-3 sm:text-sm";

export default function VanFollowLinks({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-center text-sm text-charcoal/70">Follow us on:</p>

      <div className="mt-1.5 flex flex-wrap items-center justify-center gap-1">
        <a
          href={INSTAGRAM_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          <Instagram aria-hidden="true" className="h-4 w-4 flex-shrink-0" />
          Instagram
        </a>

        <a
          href={TIKTOK_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          <TikTokIcon className="h-4 w-4 flex-shrink-0" />
          TikTok
        </a>

        <a
          href={FACEBOOK_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          <Facebook aria-hidden="true" className="h-4 w-4 flex-shrink-0" />
          Facebook
        </a>

        <a
          href={LINKEDIN_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          <Linkedin aria-hidden="true" className="h-4 w-4 flex-shrink-0" />
          LinkedIn
        </a>
      </div>
    </div>
  );
}
