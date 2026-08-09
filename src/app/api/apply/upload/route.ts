import { ASSISTANCE_VIDEO_PREFIX, createVideoUploadRoute } from "@/lib/video-storage";

export const POST = createVideoUploadRoute(ASSISTANCE_VIDEO_PREFIX, "apply");
