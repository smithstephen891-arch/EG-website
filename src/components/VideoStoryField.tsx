"use client";

import { useEffect, useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { AlertCircle, Check, Trash2, Upload, Video } from "lucide-react";

export const MAX_VIDEO_SECONDS = 180;
const MAX_VIDEO_BYTES = 500 * 1024 * 1024;
const DURATION_GRACE_SECONDS = 5;

const ACCEPTED_EXTENSIONS = ["mp4", "mov", "webm", "mkv", "m4v", "3gp"] as const;
const ACCEPT_ATTR = "video/mp4,video/quicktime,video/webm,video/x-matroska,video/x-m4v,video/3gpp";

export interface VideoStoryValue {
  url: string;
  seconds: number | null;
  bytes: number;
}

interface VideoStoryFieldProps {
  value: VideoStoryValue | null;
  onChange: (value: VideoStoryValue | null) => void;
  onBusyChange: (busy: boolean) => void;
  disabled?: boolean;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024 * 1024) return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
  return `${Math.round(bytes / 1024 / 1024)} MB`;
}

// Reads duration without trusting the file: if the browser cannot decode it we
// return null and fall back to the size cap rather than blocking the applicant.
function readDuration(file: Blob): Promise<number | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const probe = document.createElement("video");
    let settled = false;
    const finish = (value: number | null) => {
      if (settled) return;
      settled = true;
      URL.revokeObjectURL(url);
      resolve(value);
    };
    probe.preload = "metadata";
    probe.onloadedmetadata = () => {
      const d = probe.duration;
      finish(Number.isFinite(d) && d > 0 ? d : null);
    };
    probe.onerror = () => finish(null);
    setTimeout(() => finish(null), 8000);
    probe.src = url;
  });
}

function extensionFor(file: Blob, fallbackName: string): string {
  const fromName = fallbackName.split(".").pop()?.toLowerCase() ?? "";
  if ((ACCEPTED_EXTENSIONS as readonly string[]).includes(fromName)) return fromName;
  const type = file.type.toLowerCase();
  if (type.includes("quicktime")) return "mov";
  if (type.includes("webm")) return "webm";
  if (type.includes("matroska")) return "mkv";
  if (type.includes("3gpp")) return "3gp";
  return "mp4";
}

function randomId(): string {
  const bytes = new Uint8Array(10);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(36).padStart(2, "0")).join("").slice(0, 20);
}

function pickRecorderMimeType(): string | undefined {
  if (typeof MediaRecorder === "undefined") return undefined;
  const candidates = [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
    "video/mp4",
  ];
  return candidates.find((type) => MediaRecorder.isTypeSupported(type));
}

export default function VideoStoryField({
  value,
  onChange,
  onBusyChange,
  disabled,
}: VideoStoryFieldProps) {
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [canRecord, setCanRecord] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const liveVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCanRecord(
      typeof navigator !== "undefined" &&
        !!navigator.mediaDevices?.getUserMedia &&
        typeof MediaRecorder !== "undefined" &&
        !!pickRecorderMimeType()
    );
  }, []);

  const stopTracks = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (liveVideoRef.current) liveVideoRef.current.srcObject = null;
  };

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      stopTracks();
      clearTimer();
    };
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  async function handleBlob(blob: Blob, originalName: string) {
    setError(null);

    if (blob.size > MAX_VIDEO_BYTES) {
      setError(
        `That video is ${formatBytes(blob.size)}. Please keep it under ${formatBytes(MAX_VIDEO_BYTES)} — recording at a lower quality usually does it.`
      );
      return;
    }

    const seconds = await readDuration(blob);
    if (seconds !== null && seconds > MAX_VIDEO_SECONDS + DURATION_GRACE_SECONDS) {
      setError(
        `That video is ${formatDuration(seconds)} long. Please keep it to 3 minutes or less.`
      );
      return;
    }

    const pathname = `van-applications/story-${randomId()}.${extensionFor(blob, originalName)}`;

    onBusyChange(true);
    setProgress(0);
    try {
      const result = await upload(pathname, blob, {
        access: "private",
        handleUploadUrl: "/api/van-giveaway/upload",
        contentType: blob.type || "video/mp4",
        onUploadProgress: ({ percentage }) => setProgress(percentage),
      });
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(blob));
      // result.url is a private.blob.vercel-storage.com URL; it is not
      // fetchable without a signed token, which the server mints on submit.
      onChange({ url: result.url, seconds, bytes: blob.size });
    } catch (err) {
      console.error("Video upload failed:", err);
      setError(
        "We couldn't upload that video. You can try again, or submit your application without it — a video is optional."
      );
      onChange(null);
    } finally {
      setProgress(null);
      onBusyChange(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      setError("Please choose a video file.");
      return;
    }
    void handleBlob(file, file.name);
  }

  async function startRecording() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });
      streamRef.current = stream;
      if (liveVideoRef.current) {
        liveVideoRef.current.srcObject = stream;
        await liveVideoRef.current.play().catch(() => {});
      }
      const mimeType = pickRecorderMimeType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const type = recorder.mimeType || "video/webm";
        const blob = new Blob(chunksRef.current, { type });
        chunksRef.current = [];
        stopTracks();
        void handleBlob(blob, `recording.${type.includes("mp4") ? "mp4" : "webm"}`);
      };
      recorderRef.current = recorder;
      recorder.start();
      setRecording(true);
      setElapsed(0);
      timerRef.current = setInterval(() => {
        setElapsed((prev) => {
          const next = prev + 1;
          if (next >= MAX_VIDEO_SECONDS) stopRecording();
          return next;
        });
      }, 1000);
    } catch (err) {
      console.error("Camera access failed:", err);
      stopTracks();
      setError(
        "We couldn't access your camera. Check your browser's camera permission, or upload a video file instead."
      );
    }
  }

  function stopRecording() {
    clearTimer();
    setRecording(false);
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
    recorderRef.current = null;
  }

  function removeVideo() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    onChange(null);
    setError(null);
  }

  const uploading = progress !== null;
  const remaining = MAX_VIDEO_SECONDS - elapsed;

  return (
    <div className="rounded-xl border border-charcoal/20 bg-white px-6 py-5">
      <h4 className="font-serif text-lg text-charcoal">
        Tell us your story on video{" "}
        <span className="font-sans text-sm font-normal text-charcoal/50">(Optional)</span>
      </h4>
      <p className="mt-2 text-sm text-charcoal/70 leading-relaxed">
        This is optional, but we encourage it. A short video helps us understand
        your situation in your own words. Please keep it to{" "}
        <strong className="font-semibold text-charcoal">3 minutes or less</strong>. You can
        upload a video you already have, or record one right here.
      </p>

      {/* Uploaded state */}
      {value && !uploading && (
        <div className="mt-4">
          <p className="flex items-center gap-2 text-sm font-medium text-olive-dark">
            <Check aria-hidden="true" className="h-4 w-4 flex-shrink-0" />
            Video attached
            {value.seconds !== null && ` (${formatDuration(value.seconds)})`} ·{" "}
            {formatBytes(value.bytes)}
          </p>
          {previewUrl && (
            <video
              src={previewUrl}
              controls
              playsInline
              className="mt-3 w-full max-w-sm rounded-lg border border-charcoal/10"
            />
          )}
          <button
            type="button"
            onClick={removeVideo}
            className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-charcoal/70 hover:bg-cream-dark hover:text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive-dark focus-visible:ring-offset-2 transition-colors"
          >
            <Trash2 aria-hidden="true" className="h-4 w-4" />
            Remove video
          </button>
        </div>
      )}

      {/* Live recording preview */}
      <div className={recording ? "mt-4" : "hidden"}>
        <video
          ref={liveVideoRef}
          muted
          playsInline
          className="w-full max-w-sm rounded-lg border border-charcoal/10 bg-charcoal"
        />
        <p aria-live="polite" className="mt-2 text-sm font-medium text-charcoal">
          Recording… {formatDuration(elapsed)} · {formatDuration(Math.max(remaining, 0))}{" "}
          remaining
        </p>
        <button
          type="button"
          onClick={stopRecording}
          className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full bg-charcoal px-6 py-2.5 text-sm font-semibold text-cream hover:bg-charcoal-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive-dark focus-visible:ring-offset-2 transition-colors"
        >
          Stop recording
        </button>
      </div>

      {/* Upload progress */}
      {uploading && (
        <div className="mt-4" aria-live="polite">
          <p className="text-sm font-medium text-charcoal">
            Uploading your video… {Math.round(progress)}%
          </p>
          <div className="mt-2 h-2 w-full max-w-sm overflow-hidden rounded-full bg-charcoal/10">
            <div
              className="h-full bg-olive-dark transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-charcoal/60">
            Please keep this page open until it finishes.
          </p>
        </div>
      )}

      {/* Actions */}
      {!value && !recording && !uploading && (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            disabled={disabled}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border-2 border-charcoal/20 px-6 py-2.5 text-sm font-semibold text-charcoal hover:border-charcoal/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive-dark focus-visible:ring-offset-2 transition-colors disabled:opacity-50"
          >
            <Upload aria-hidden="true" className="h-4 w-4" />
            Upload a video
          </button>
          {canRecord && (
            <button
              type="button"
              disabled={disabled}
              onClick={startRecording}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border-2 border-charcoal/20 px-6 py-2.5 text-sm font-semibold text-charcoal hover:border-charcoal/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive-dark focus-visible:ring-offset-2 transition-colors disabled:opacity-50"
            >
              <Video aria-hidden="true" className="h-4 w-4" />
              Record with your camera
            </button>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPT_ATTR}
        onChange={handleFileChange}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      />

      {error && (
        <p
          role="alert"
          className="mt-3 flex items-start gap-1.5 text-sm font-medium text-red-700"
        >
          <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
