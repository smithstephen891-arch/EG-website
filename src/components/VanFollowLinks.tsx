import { Facebook, Instagram } from "lucide-react";
import {
  FACEBOOK_PROFILE_URL,
  INSTAGRAM_PROFILE_URL,
  TIKTOK_PROFILE_URL,
} from "@/lib/van-share";

/*
 * Follow links for the two accounts the van is being promoted on.
 *
 * Deliberately separate from the share controls they sit beside. Sharing the
 * page and following the account are different asks, and the tiles that used to
 * live in the share row said "Share the TikTok" while actually just opening the
 * post, which promised something they did not do.
 *
 * No client hooks here: these are plain outbound links, so the component stays
 * a server component even though its neighbours are interactive.
 */

// lucide dropped brand marks beyond the handful it still ships, and Instagram
// is one of the survivors while TikTok is not. Hand-rolled to match the 24px
// grid and currentColor of the lucide icon next to it.
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

// Three names have to fit the 280px hero column on the narrowest phones, so the
// padding is tight and the label drops a step at that width. Names are kept
// rather than going icon-only like the footer: the TikTok mark below is
// hand-drawn, and an unfamiliar glyph with no word beside it is unidentifiable.
const linkClass =
  "flex min-h-11 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full px-1.5 py-2 text-xs font-semibold text-charcoal/70 transition-colors hover:bg-white hover:text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive-dark focus-visible:ring-offset-2 sm:gap-2 sm:px-3 sm:text-sm";

export default function VanFollowLinks({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-center text-sm text-charcoal/70">Follow us on:</p>

      <div className="mt-1.5 flex items-center justify-center gap-1">
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
      </div>
    </div>
  );
}
