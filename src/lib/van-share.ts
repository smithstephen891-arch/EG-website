/**
 * Everything the van share prompts need, in one place so the popup and the
 * on-page share section can never drift apart.
 */

export const VAN_PATH = "/van-gift";

/**
 * Always the canonical production URL, never window.location.origin. Deriving
 * it from the current origin would hand people a localhost or Vercel preview
 * link when shared from those environments, and it differed between server
 * and client render, which broke hydration.
 */
export const VAN_SHARE_URL = `https://www.elizabethsgift.com${VAN_PATH}`;

/*
 * Social posts. This is the only place these links need to go; the popup, the
 * on-page share section, and the hero preview all read from here. Leaving a
 * value empty hides that option rather than showing anything broken.
 *
 * Both carry the same clip. The hero preview points at the reel; the popup
 * offers either, so neither post's existing traction is stranded.
 */
export const TIKTOK_VIDEO_URL =
  "https://www.tiktok.com/@elizabethsgift/video/7671851728903359757";
export const INSTAGRAM_REEL_URL = "https://www.instagram.com/reel/Db13sqdsJNP/";

// Profiles moved to lib/social.ts once they were needed off the van page too.

/*
 * Applications closed on 12 August 2026, so neither of these may promise one any
 * more. They still lead with the van because that is what the link previews and
 * what people recognise; what the page now asks for is attention, not an
 * application.
 */
export const SHARE_TITLE = "A Wheelchair Accessible Van for Someone Who Needs It";
export const SHARE_BODY =
  "Elizabeth's Gift is giving a wheelchair accessible van to someone who needs it, at no cost. Applications are now closed, but here's the story:";

export function buildMailHref(url: string): string {
  return `mailto:?subject=${encodeURIComponent(SHARE_TITLE)}&body=${encodeURIComponent(
    `${SHARE_BODY}\n\n${url}`
  )}`;
}

export function buildSmsHref(url: string): string {
  // The "&" after "?" is intentional: iOS needs it before the body parameter.
  return `sms:?&body=${encodeURIComponent(`${SHARE_BODY} ${url}`)}`;
}

export async function nativeShare(url: string): Promise<void> {
  try {
    await navigator.share({ title: SHARE_TITLE, text: SHARE_BODY, url });
  } catch {
    // Cancelled or unsupported; the explicit options remain available.
  }
}

export function canNativeShare(): boolean {
  return typeof navigator !== "undefined" && typeof navigator.share === "function";
}
