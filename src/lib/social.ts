/**
 * The organisation's social profiles, in one place.
 *
 * Every follow link on the site reads from here (the footer and the contact
 * page), so adding an account is one edit rather than a hunt through files.
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
