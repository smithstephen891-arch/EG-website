"use client";

import { Check, Copy, Mail, MessageSquare, Share2 } from "lucide-react";
import { buildMailHref, buildSmsHref } from "@/lib/van-share";
import { useShareLink } from "@/lib/use-share-link";
import VanFollowLinks from "@/components/VanFollowLinks";

// flex-wrap with a shared basis rather than a fixed grid, so the three tiles
// stay balanced at every width instead of stranding one on its own row.
const tileClass =
  "flex min-h-11 flex-1 basis-48 items-center justify-center gap-2.5 rounded-xl border border-charcoal/15 bg-white px-5 py-3.5 text-center font-semibold text-charcoal transition-colors hover:border-charcoal/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive-dark focus-visible:ring-offset-2";

export default function VanShareSection() {
  const { url: shareUrl, copied, copyLink, shareOrCopy } = useShareLink();

  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm md:p-10">
      <h2 className="font-serif text-2xl md:text-3xl text-charcoal">
        Know someone who needs this?
      </h2>
      <p className="mt-3 text-charcoal/70 leading-relaxed">
        The hardest part of giving this van away is reaching the person
        it&apos;s meant for. If this isn&apos;t the right fit for you, please
        pass it along to someone it could change everything for.
      </p>

      <button
        type="button"
        onClick={() => void shareOrCopy()}
        className="mt-7 flex w-full min-h-11 items-center justify-center gap-2.5 rounded-xl bg-olive-dark px-5 py-4 text-lg font-semibold text-white transition-colors hover:bg-olive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive-dark focus-visible:ring-offset-2"
      >
        <Share2 aria-hidden="true" className="h-5 w-5 flex-shrink-0" />
        Share this page
      </button>

      <div className="mt-3 flex flex-wrap gap-3">
        <a href={smsOrMail("sms", shareUrl)} className={tileClass}>
          <MessageSquare aria-hidden="true" className="h-5 w-5 flex-shrink-0 text-olive-dark" />
          Text the link
        </a>

        <a href={smsOrMail("mail", shareUrl)} className={tileClass}>
          <Mail aria-hidden="true" className="h-5 w-5 flex-shrink-0 text-olive-dark" />
          Email the link
        </a>

        <button type="button" onClick={copyLink} className={tileClass}>
          {copied ? (
            <Check aria-hidden="true" className="h-5 w-5 flex-shrink-0 text-olive-dark" />
          ) : (
            <Copy aria-hidden="true" className="h-5 w-5 flex-shrink-0 text-olive-dark" />
          )}
          {copied ? "Link copied" : "Copy the link"}
        </button>
      </div>

      <p aria-live="polite" className="sr-only">
        {copied ? "Link copied to clipboard" : ""}
      </p>

      <VanFollowLinks className="mt-7 border-t border-charcoal/10 pt-6" />
    </div>
  );
}

function smsOrMail(kind: "sms" | "mail", url: string): string {
  return kind === "sms" ? buildSmsHref(url) : buildMailHref(url);
}
