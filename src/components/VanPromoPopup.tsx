"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Copy,
  Heart,
  Mail,
  MessageSquare,
  Play,
  Share2,
  X,
} from "lucide-react";

// Fired by the newsletter forms once someone has actually subscribed.
export const NEWSLETTER_SUBSCRIBED_EVENT = "eg:newsletter-subscribed";

const SEEN_KEY = "eg_van_promo_seen";
const VISITED_KEY = "eg_van_visited";
const VAN_PATH = "/van-gift";
const SHOW_DELAY_MS = 900;

/*
 * TODO — SOCIAL VIDEO LINKS
 * Paste the real post URLs here once the videos are live. Leaving a value
 * empty simply hides that share option and the play overlay, so the popup
 * still looks finished until then.
 */
const TIKTOK_VIDEO_URL = "";
const INSTAGRAM_REEL_URL = "";

const SHARE_TITLE = "Elizabeth's Gift is giving away a wheelchair accessible van";
const SHARE_BODY =
  "Elizabeth's Gift is giving a wheelchair accessible van to someone who needs it, at no cost. If you know someone who could use it, here's the application:";

function markSeen() {
  try {
    localStorage.setItem(SEEN_KEY, String(Date.now()));
  } catch {
    // Private browsing and blocked storage just mean it may show again.
  }
}

export default function VanPromoPopup() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [view, setView] = useState<"promo" | "share">("promo");
  const [copied, setCopied] = useState(false);
  // Lazy initialisers rather than effects: this component renders nothing
  // until a user action opens it, so touching browser globals here cannot
  // cause a hydration mismatch.
  const [shareUrl] = useState(() =>
    typeof window === "undefined"
      ? `https://www.elizabethsgift.com${VAN_PATH}`
      : `${window.location.origin}${VAN_PATH}`
  );
  const [canNativeShare] = useState(
    () => typeof navigator !== "undefined" && typeof navigator.share === "function"
  );
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<Element | null>(null);

  // Anyone who lands on the van page already knows about it, so remember that
  // and never interrupt them with the promo later. The render guard below
  // also hides it outright while they are on that page.
  useEffect(() => {
    if (pathname !== VAN_PATH) return;
    try {
      localStorage.setItem(VISITED_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
  }, [pathname]);

  useEffect(() => {
    function onSubscribed() {
      // Never on the van page itself, never for someone who has already been
      // there, and never twice.
      if (window.location.pathname === VAN_PATH) return;
      try {
        if (localStorage.getItem(SEEN_KEY)) return;
        if (localStorage.getItem(VISITED_KEY)) return;
      } catch {
        /* ignore */
      }
      window.setTimeout(() => {
        setView("promo");
        setVisible(true);
        markSeen();
      }, SHOW_DELAY_MS);
    }
    window.addEventListener(NEWSLETTER_SUBSCRIBED_EVENT, onSubscribed);
    return () => window.removeEventListener(NEWSLETTER_SUBSCRIBED_EVENT, onSubscribed);
  }, []);

  const close = useCallback(() => {
    setVisible(false);
    setView("promo");
    setCopied(false);
    if (restoreFocusRef.current instanceof HTMLElement) {
      restoreFocusRef.current.focus();
    }
  }, []);

  // Focus management and a simple focus trap while open.
  useEffect(() => {
    if (!visible) return;
    restoreFocusRef.current = document.activeElement;
    closeRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [visible, close]);

  async function handleNativeShare() {
    try {
      await navigator.share({ title: SHARE_TITLE, text: SHARE_BODY, url: shareUrl });
    } catch {
      // Cancelled or unsupported: the explicit options below still work.
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  if (!visible || pathname === VAN_PATH) return null;

  const mailHref = `mailto:?subject=${encodeURIComponent(SHARE_TITLE)}&body=${encodeURIComponent(`${SHARE_BODY}\n\n${shareUrl}`)}`;
  const smsHref = `sms:?&body=${encodeURIComponent(`${SHARE_BODY} ${shareUrl}`)}`;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm"
        onClick={close}
        aria-hidden="true"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="van-promo-heading"
        className="relative z-10 w-full max-w-3xl overflow-hidden rounded-3xl bg-cream shadow-2xl max-h-[92vh] overflow-y-auto"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-3 top-3 z-20 rounded-full bg-charcoal/40 p-2 text-cream backdrop-blur-sm transition-colors hover:bg-charcoal/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream"
        >
          <X aria-hidden="true" size={18} />
        </button>

        <div className="grid md:grid-cols-2">
          {/* Visual */}
          <div className="relative min-h-56 md:min-h-full">
            {/* Two crops on purpose: the landscape shot fills the short, wide
                banner on phones, while a portrait shot suits the tall column
                on desktop, where a landscape crop showed only a door panel. */}
            <Image
              src="/images/van/van-photo-3.jpg"
              alt="White 2017 Dodge Grand Caravan with its rear wheelchair ramp deployed"
              fill
              sizes="100vw"
              className="object-cover md:hidden"
            />
            <Image
              src="/images/van/van-photo-1.jpg"
              alt="Front three-quarter view of the white 2017 Dodge Grand Caravan"
              fill
              sizes="50vw"
              className="hidden object-cover md:block"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/10 to-transparent md:bg-gradient-to-r md:from-transparent md:to-charcoal/20" />

            {(TIKTOK_VIDEO_URL || INSTAGRAM_REEL_URL) && (
              <a
                href={TIKTOK_VIDEO_URL || INSTAGRAM_REEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group absolute inset-0 flex items-center justify-center focus-visible:outline-none"
                aria-label="Watch the video"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-cream/95 shadow-lg transition-transform group-hover:scale-110 group-focus-visible:scale-110">
                  <Play aria-hidden="true" className="ml-1 h-7 w-7 text-charcoal" fill="currentColor" />
                </span>
              </a>
            )}

            <p className="absolute bottom-4 left-5 right-5 font-serif text-lg text-cream drop-shadow md:hidden">
              2017 Dodge Grand Caravan
            </p>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8">
            {view === "promo" ? (
              <>
                <p className="text-sm font-semibold uppercase tracking-wide text-olive-dark">
                  We&apos;re giving away a van!
                </p>
                <h2
                  id="van-promo-heading"
                  className="mt-3 font-serif text-2xl leading-tight text-charcoal sm:text-3xl"
                >
                  Do you know someone who needs this?
                </h2>
                <p className="mt-4 text-charcoal/70 leading-relaxed">
                  We&apos;re gifting a wheelchair accessible van to someone who
                  needs it, at no cost. The hardest part is reaching the person
                  it&apos;s meant for — and that&apos;s where you come in.
                </p>
                <p className="mt-3 font-semibold text-charcoal">
                  Help us spread the word.
                </p>

                <div className="mt-7 space-y-3">
                  <Link
                    href={VAN_PATH}
                    onClick={close}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-olive-dark px-6 py-3.5 font-semibold text-white transition-colors hover:bg-olive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive-dark focus-visible:ring-offset-2"
                  >
                    Apply for the van
                  </Link>
                  <button
                    type="button"
                    onClick={() => setView("share")}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 font-semibold text-charcoal transition-colors hover:bg-gold/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive-dark focus-visible:ring-offset-2"
                  >
                    <Share2 aria-hidden="true" className="h-4 w-4" />
                    Share with someone
                  </button>
                  <Link
                    href="/donate"
                    onClick={close}
                    className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-charcoal/20 px-6 py-3.5 font-semibold text-charcoal transition-colors hover:border-charcoal/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive-dark focus-visible:ring-offset-2"
                  >
                    <Heart aria-hidden="true" className="h-4 w-4" />
                    Donate
                  </Link>
                </div>

                <button
                  type="button"
                  onClick={close}
                  className="mt-4 w-full rounded-lg py-2 text-sm text-charcoal/50 transition-colors hover:text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive-dark"
                >
                  Maybe later
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setView("promo")}
                  className="-ml-2 flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-medium text-charcoal/60 transition-colors hover:text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive-dark"
                >
                  <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                  Back
                </button>

                <h2
                  id="van-promo-heading"
                  className="mt-4 font-serif text-2xl leading-tight text-charcoal sm:text-3xl"
                >
                  Help us spread the word
                </h2>
                <p className="mt-3 text-charcoal/70 leading-relaxed">
                  Send this to anyone who might need a wheelchair accessible
                  vehicle, or share it with your friends.
                </p>

                <div className="mt-6 space-y-2.5">
                  {canNativeShare && (
                    <button
                      type="button"
                      onClick={handleNativeShare}
                      className="flex w-full items-center gap-3 rounded-xl bg-olive-dark px-4 py-3.5 text-left font-semibold text-white transition-colors hover:bg-olive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive-dark focus-visible:ring-offset-2"
                    >
                      <Share2 aria-hidden="true" className="h-5 w-5 flex-shrink-0" />
                      Share…
                    </button>
                  )}

                  <a
                    href={smsHref}
                    className="flex w-full items-center gap-3 rounded-xl border border-charcoal/15 bg-white px-4 py-3.5 text-left font-medium text-charcoal transition-colors hover:border-charcoal/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive-dark focus-visible:ring-offset-2"
                  >
                    <MessageSquare aria-hidden="true" className="h-5 w-5 flex-shrink-0 text-olive-dark" />
                    Text the link
                  </a>

                  <a
                    href={mailHref}
                    className="flex w-full items-center gap-3 rounded-xl border border-charcoal/15 bg-white px-4 py-3.5 text-left font-medium text-charcoal transition-colors hover:border-charcoal/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive-dark focus-visible:ring-offset-2"
                  >
                    <Mail aria-hidden="true" className="h-5 w-5 flex-shrink-0 text-olive-dark" />
                    Email the link
                  </a>

                  {TIKTOK_VIDEO_URL && (
                    <a
                      href={TIKTOK_VIDEO_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center gap-3 rounded-xl border border-charcoal/15 bg-white px-4 py-3.5 text-left font-medium text-charcoal transition-colors hover:border-charcoal/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive-dark focus-visible:ring-offset-2"
                    >
                      <Play aria-hidden="true" className="h-5 w-5 flex-shrink-0 text-olive-dark" />
                      Share the TikTok video
                    </a>
                  )}

                  {INSTAGRAM_REEL_URL && (
                    <a
                      href={INSTAGRAM_REEL_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center gap-3 rounded-xl border border-charcoal/15 bg-white px-4 py-3.5 text-left font-medium text-charcoal transition-colors hover:border-charcoal/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive-dark focus-visible:ring-offset-2"
                    >
                      <Play aria-hidden="true" className="h-5 w-5 flex-shrink-0 text-olive-dark" />
                      Share the Instagram reel
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={copyLink}
                    className="flex w-full items-center gap-3 rounded-xl border border-charcoal/15 bg-white px-4 py-3.5 text-left font-medium text-charcoal transition-colors hover:border-charcoal/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive-dark focus-visible:ring-offset-2"
                  >
                    {copied ? (
                      <Check aria-hidden="true" className="h-5 w-5 flex-shrink-0 text-olive-dark" />
                    ) : (
                      <Copy aria-hidden="true" className="h-5 w-5 flex-shrink-0 text-olive-dark" />
                    )}
                    {copied ? "Link copied" : "Copy the link"}
                  </button>
                  <p aria-live="polite" className="sr-only">
                    {copied ? "Link copied to clipboard" : ""}
                  </p>
                </div>

                <p className="mt-5 break-all rounded-lg bg-charcoal/5 px-3 py-2 text-xs text-charcoal/50">
                  {shareUrl}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
