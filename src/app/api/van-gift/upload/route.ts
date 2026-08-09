import { VAN_VIDEO_PREFIX, createVideoUploadRoute } from "@/lib/video-storage";

export const POST = createVideoUploadRoute(VAN_VIDEO_PREFIX, "van-gift");
