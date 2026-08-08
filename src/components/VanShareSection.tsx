"use client";

import { useState } from "react";
import { Check, Copy, Mail, MessageSquare, Play, Share2 } from "lucide-react";
import {
  INSTAGRAM_REEL_URL,
  TIKTOK_VIDEO_URL,
  VAN_SHARE_URL,
  buildMailHref,
  buildSmsHref,
  canNativeShare,
  nativeShare,
} from "@/lib/van-share";

// flex-wrap with a shared basis rather than a fixed grid: the number of tiles
// changes once the TikTok and Instagram links are filled in, and this keeps
// every row balanced instead of stranding one tile on its own.
const tileClass =
  "flex min-h-11 flex-1 basis-48 items-center justify-center gap-2.5 rounded-xl border border-charcoal/15 bg-white px-5 py-3.5 text-center font-semibold text-charcoal transition-colors hover:border-charcoal/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive-dark focus-visible:ring-offset-2";

export default function VanShareSection() {
  const [copied, setCopied] = useState(false);
  const shareUrl = VAN_SHARE_URL;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  // Always rendered rather than gated on navigator.share, which is undefined
  // during the server render and would mismatch on hydration. Desktop browsers
  // without a share sheet fall back to copying the link.
  async function shareOrCopy() {
    if (canNativeShare()) {
      await nativeShare(shareUrl);
      return;
    }
    await copyLink();
  }

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

        {TIKTOK_VIDEO_URL && (
          <a
            href={TIKTOK_VIDEO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={tileClass}
          >
            <Play aria-hidden="true" className="h-5 w-5 flex-shrink-0 text-olive-dark" />
            Share the TikTok
          </a>
        )}

        {INSTAGRAM_REEL_URL && (
          <a
            href={INSTAGRAM_REEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={tileClass}
          >
            <Play aria-hidden="true" className="h-5 w-5 flex-shrink-0 text-olive-dark" />
            Share the Reel
          </a>
        )}

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
    </div>
  );
}

function smsOrMail(kind: "sms" | "mail", url: string): string {
  return kind === "sms" ? buildSmsHref(url) : buildMailHref(url);
}
