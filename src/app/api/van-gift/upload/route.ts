import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

// Applicant story videos are uploaded straight from the browser to Vercel Blob.
// They never pass through this function: a 3 minute video is far larger than
// the serverless request body limit. This route only mints a scoped, one-shot
// upload token after validating what the client says it is about to send.

const MAX_BYTES = 500 * 1024 * 1024; // 500 MB, roughly 3 min of 1080p phone video

// Only video types. This is what stops a blob URL from ever being served back
// as HTML or a script, so a hostile upload cannot become a clickable exploit.
const ALLOWED_CONTENT_TYPES = [
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "video/x-matroska",
  "video/mpeg",
  "video/3gpp",
  "video/x-m4v",
];

// The client proposes a pathname, so treat it as hostile. Anything outside this
// exact shape is rejected: no traversal, no double extensions, no user text.
const SAFE_PATHNAME = /^van-applications\/story-[a-z0-9]{6,32}\.(mp4|mov|webm|mkv|m4v|3gp)$/;

export async function POST(request: Request): Promise<NextResponse> {
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
        if (!SAFE_PATHNAME.test(pathname)) {
          throw new Error("Rejected filename");
        }
        return {
          allowedContentTypes: ALLOWED_CONTENT_TYPES,
          maximumSizeInBytes: MAX_BYTES,
          // Private: a bare blob URL cannot be read without a signed token.
          // We mint a time-limited signed link server-side when the
          // application is submitted, rather than relying on an unguessable
          // public URL.
          access: "private",
          // Random suffix means the stored name is never guessable and two
          // applicants can never overwrite each other.
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {
        // Nothing to do. The URL reaches us with the application submission.
      },
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("[van-gift] Upload token error:", error);
    return NextResponse.json(
      { error: "Upload could not be started." },
      { status: 400 }
    );
  }
}
