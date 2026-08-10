"use client";

import { Check, Copy, Mail, MessageSquare, Share2 } from "lucide-react";
import { buildMailHref, buildSmsHref } from "@/lib/van-share";
import { useShareLink } from "@/lib/use-share-link";

/*
 * The compact share row that sits directly under the hero video card.
 *
 * The full share section is at the bottom of the page, below the entire
 * application form, so only people who scroll past the form ever reach it. The
 * people best placed to help are the opposite: they read the hero, work out the
 * van is not for them, and leave. This catches them at that moment.
 *
 * Deliberately quieter than Apply Now, which is the primary action for anyone
 * this page is actually for: outlined rather than filled, and sized to the video
 * card so it reads as part of that column instead of a third competing CTA.
 */

const miniClass =
  "flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-full px-2 py-2 text-sm font-semibold text-charcoal/70 transition-colors hover:bg-white hover:text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive-dark focus-visible:ring-offset-2";

export default function VanHeroShare() {
  const { url, copied, copyLink, shareOrCopy } = useShareLink();

  return (
    <div className="mx-auto mt-5 w-full max-w-[280px] sm:max-w-[320px]">
      <p className="text-center text-sm text-charcoal/70">
        Not the right fit? Help us find who it is.
      </p>

      <button
        type="button"
        onClick={() => void shareOrCopy()}
        className="mt-3 flex w-full min-h-11 items-center justify-center gap-2 rounded-full border-2 border-olive-dark/40 bg-white px-5 py-3 font-semibold text-olive-dark transition-colors hover:border-olive-dark hover:bg-olive/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive-dark focus-visible:ring-offset-2"
      >
        <Share2 aria-hidden="true" className="h-4 w-4 flex-shrink-0" />
        Share this page
      </button>

      <div className="mt-1.5 flex items-center justify-center gap-1">
        <a href={buildSmsHref(url)} className={miniClass}>
          <MessageSquare aria-hidden="true" className="h-4 w-4 flex-shrink-0" />
          Text
        </a>

        <a href={buildMailHref(url)} className={miniClass}>
          <Mail aria-hidden="true" className="h-4 w-4 flex-shrink-0" />
          Email
        </a>

        <button type="button" onClick={() => void copyLink()} className={miniClass}>
          {copied ? (
            <Check aria-hidden="true" className="h-4 w-4 flex-shrink-0" />
          ) : (
            <Copy aria-hidden="true" className="h-4 w-4 flex-shrink-0" />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <p aria-live="polite" className="sr-only">
        {copied ? "Link copied to clipboard" : ""}
      </p>
    </div>
  );
}
