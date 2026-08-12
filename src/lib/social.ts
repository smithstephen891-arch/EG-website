/**
 * The organisation's social profiles, in one place.
 *
 * Every follow link on the site reads from here — the footer, the contact page,
 * the van page's follow row, and the `sameAs` list in its structured data — so
 * adding an account is one edit rather than a hunt through four files.
 *
 * Links to individual posts live in van-share.ts instead: those belong to a
 * campaign, these belong to the organisation.
 */

export const INSTAGRAM_PROFILE_URL = "https://instagram.com/elizabethsgift";
export const TIKTOK_PROFILE_URL = "https://www.tiktok.com/@elizabethsgift";
// The id form rather than the /people/Elizabeths-Gift/<id>/ one it redirects
// to: that path embeds the display name and breaks if the page is ever renamed.
export const FACEBOOK_PROFILE_URL =
  "https://www.facebook.com/profile.php?id=61575360463395";
export const LINKEDIN_PROFILE_URL =
  "https://www.linkedin.com/company/elizabeths-gift";

/**
 * The order accounts appear in wherever all of them are listed, and the
 * `sameAs` list for structured data.
 */
export const SOCIAL_PROFILE_URLS = [
  INSTAGRAM_PROFILE_URL,
  TIKTOK_PROFILE_URL,
  FACEBOOK_PROFILE_URL,
  LINKEDIN_PROFILE_URL,
];
