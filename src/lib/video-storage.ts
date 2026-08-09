import { NextResponse } from "next/server";
import { issueSignedToken, presignUrl } from "@vercel/blob";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

/**
 * Shared plumbing for applicant story videos, used by both the accessible van
 * application and the general assistance application.
 *
 * Videos go straight from the browser to Vercel Blob and never pass through a
 * function: a 3 minute video is far larger than the serverless request body
 * limit, and far larger than an email attachment. The routes here only mint a
 * scoped upload token, then later a short-lived link for the notification email.
 */

export const MAX_VIDEO_BYTES = 500 * 1024 * 1024; // ~3 min of 1080p phone video

/**
 * Video types only. This is what stops a stored blob from ever being served
 * back as HTML or a script, so a hostile upload cannot become a clickable
 * exploit for whoever opens the notification email.
 */
const ALLOWED_CONTENT_TYPES = [
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "video/x-matroska",
  "video/mpeg",
  "video/3gpp",
  "video/x-m4v",
];

const EXTENSIONS = "mp4|mov|webm|mkv|m4v|3gp";

/** Folder each form stores into, so the two are told apart at a glance. */
export const VAN_VIDEO_PREFIX = "van-applications";
export const ASSISTANCE_VIDEO_PREFIX = "assistance-applications";

/**
 * The client proposes a pathname, so treat it as hostile: no traversal, no
 * slashes, no double extensions, no user-supplied text. Vercel appends a
 * random suffix of its own, so the stored name allows more characters than the
 * one we ask for.
 */
function storedPathnamePattern(prefix: string): RegExp {
  return new RegExp(`^${prefix}/story-[A-Za-z0-9_-]{6,80}\\.(${EXTENSIONS})$`);
}

function requestedPathnamePattern(prefix: string): RegExp {
  return new RegExp(`^${prefix}/story-[a-z0-9]{6,32}\\.(${EXTENSIONS})$`);
}

/**
 * Builds the POST handler that hands the browser a one-shot upload token.
 */
export function createVideoUploadRoute(prefix: string, logLabel: string) {
  const allowed = requestedPathnamePattern(prefix);

  return async function POST(request: Request): Promise<NextResponse> {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { error: "Video upload is not configured." },
        { status: 503 }
      );
    }

    let body: HandleUploadBody;
    try {
      body = (await request.json()) as HandleUploadBody;
    } catch {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    try {
      const result = await handleUpload({
        body,
        request,
        onBeforeGenerateToken: async (pathname) => {
          if (!allowed.test(pathname)) {
            throw new Error("Rejected filename");
          }
          return {
            allowedContentTypes: ALLOWED_CONTENT_TYPES,
            maximumSizeInBytes: MAX_VIDEO_BYTES,
            // Private: a bare blob URL cannot be read without a signed token,
            // so an intercepted URL alone gives nobody the file.
            access: "private",
            // Unguessable stored name, and two applicants can never collide.
            addRandomSuffix: true,
          };
        },
        onUploadCompleted: async () => {
          // Nothing to do; the URL reaches us with the form submission.
        },
      });
      return NextResponse.json(result);
    } catch (error) {
      console.error(`[${logLabel}] Upload token error:`, error);
      return NextResponse.json(
        { error: "Upload could not be started." },
        { status: 400 }
      );
    }
  };
}

/**
 * Validates the blob URL a form submits before we trust it for anything. Stops
 * a crafted request from making us sign and email a link to a pathname we
 * never issued an upload token for, or to somebody else's host entirely.
 */
export function extractVideoPathname(
  raw: unknown,
  prefix: string,
  logLabel: string
): string {
  if (typeof raw !== "string" || raw === "") return "";
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:") return "";
    if (!url.hostname.endsWith(".private.blob.vercel-storage.com")) {
      console.error(`[${logLabel}] Video URL rejected, unexpected host:`, url.hostname);
      return "";
    }
    const pathname = decodeURIComponent(url.pathname).replace(/^\//, "");
    if (!storedPathnamePattern(prefix).test(pathname)) {
      // Loud on purpose: a mismatch here means a real applicant's video is
      // dropped while the page tells them it was attached.
      console.error(`[${logLabel}] Video URL rejected, unexpected path:`, pathname);
      return "";
    }
    return pathname;
  } catch {
    return "";
  }
}

/**
 * Just under Vercel's 7 day maximum: their API measures "now" when the request
 * arrives, a moment after this timestamp is computed, and rejects a validUntil
 * that lands on or past the true boundary. The margin absorbs that gap.
 */
const VIDEO_LINK_TTL_MS = 7 * 24 * 60 * 60 * 1000 - 10 * 60 * 1000;

/**
 * Mints a signed, expiring link for the notification email. Returns "" on
 * failure so a signing problem never costs us the whole application.
 */
export async function mintVideoLink(
  pathname: string,
  logLabel: string
): Promise<string> {
  if (!pathname || !process.env.BLOB_READ_WRITE_TOKEN) return "";
  try {
    const validUntil = Date.now() + VIDEO_LINK_TTL_MS;
    const token = await issueSignedToken({
      pathname,
      operations: ["get"],
      validUntil,
    });
    const { presignedUrl } = await presignUrl(token, {
      operation: "get",
      pathname,
      access: "private",
      validUntil,
    });
    return presignedUrl;
  } catch (error) {
    console.error(`[${logLabel}] Could not sign video URL:`, error);
    return "";
  }
}

/** Formats seconds as m:ss for the notification email. */
export function formatVideoDuration(seconds: number | null): string {
  if (seconds === null) return "";
  return ` (${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")})`;
}
