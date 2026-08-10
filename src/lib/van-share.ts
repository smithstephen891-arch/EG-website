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

/*
 * Profiles, for the follow links rather than the posts. The Instagram handle is
 * the same one the footer, the contact page and this page's structured data
 * already point at; it is repeated here so the van page's social links all come
 * from one import, not because there is a second account.
 */
export const TIKTOK_PROFILE_URL = "https://www.tiktok.com/@elizabethsgift";
export const INSTAGRAM_PROFILE_URL = "https://instagram.com/elizabethsgift";
export const FACEBOOK_PROFILE_URL = "https://facebook.com/elizabethsgift";

export const SHARE_TITLE = "Apply for a Wheelchair Accessible Van";
export const SHARE_BODY =
  "Elizabeth's Gift is giving a wheelchair accessible van to someone who needs it, at no cost. If you know someone whose life this could change, here's the application:";

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
