"use client";

import { useEffect, useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import {
  AlertCircle,
  Check,
  Pause,
  Play,
  RotateCcw,
  Square,
  Trash2,
  Upload,
  Video,
} from "lucide-react";

export const MAX_VIDEO_SECONDS = 180;
const MAX_VIDEO_BYTES = 500 * 1024 * 1024;
const DURATION_GRACE_SECONDS = 5;

const ACCEPTED_EXTENSIONS = ["mp4", "mov", "webm", "mkv", "m4v", "3gp"] as const;
const ACCEPT_ATTR =
  "video/mp4,video/quicktime,video/webm,video/x-matroska,video/x-m4v,video/3gpp";

export interface VideoStoryValue {
  url: string;
  seconds: number | null;
  bytes: number;
}

interface VideoStoryFieldProps {
  value: VideoStoryValue | null;
  onChange: (value: VideoStoryValue | null) => void;
  onBusyChange: (busy: boolean) => void;
  // True whenever there is a recording in hand that has not been added to the
  // application or thrown away yet, so the form can refuse to submit and lose it.
  onPendingChange: (pending: boolean) => void;
  disabled?: boolean;
}

type Phase = "idle" | "recording" | "paused" | "review";

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

// MediaRecorder hands back a type like "video/webm;codecs=vp9,opus". The server
// allowlist matches bare MIME types, so the codecs parameter has to go or every
// browser-recorded upload is rejected. Files picked from disk already have
// clean types, which is why only recording hit this.
function normalizeContentType(type: string): string {
  const base = (type || "").split(";")[0].trim().toLowerCase();
  return base.startsWith("video/") ? base : "video/mp4";
}

function extensionFor(file: Blob, fallbackName: string): string {
  const fromName = fallbackName.split(".").pop()?.toLowerCase() ?? "";
  if ((ACCEPTED_EXTENSIONS as readonly string[]).includes(fromName)) return fromName;
  const type = normalizeContentType(file.type);
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

function cameraErrorMessage(err: unknown): string {
  const name = err instanceof Error ? err.name : "";
  switch (name) {
    case "NotAllowedError":
    case "SecurityError":
      return "Your browser blocked camera access. Allow camera and microphone for this site in your browser settings, then try again — or upload a video file instead.";
    case "NotFoundError":
    case "OverconstrainedError":
      return "We couldn't find a camera on this device. You can upload a video file instead.";
    case "NotReadableError":
      return "Your camera seems to be in use by another app. Close it and try again, or upload a video file instead.";
    default:
      return "We couldn't start your camera. You can upload a video file instead.";
  }
}

const secondaryButtonClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border-2 border-charcoal/20 px-6 py-2.5 text-sm font-semibold text-charcoal hover:border-charcoal/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive-dark focus-visible:ring-offset-2 transition-colors disabled:opacity-50";

const primaryButtonClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-olive-dark px-6 py-2.5 text-sm font-semibold text-white hover:bg-olive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive-dark focus-visible:ring-offset-2 transition-colors disabled:opacity-50";

export default function VideoStoryField({
  value,
  onChange,
  onBusyChange,
  onPendingChange,
  disabled,
}: VideoStoryFieldProps) {
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [canRecord, setCanRecord] = useState(false);
  // Object URL of whatever video is currently in hand, used both for the
  // review player before upload and the confirmation player after it.
  const [localUrl, setLocalUrl] = useState<string | null>(null);

  const liveVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recordedBlobRef = useRef<Blob | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedRef = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const localUrlRef = useRef<string | null>(null);

  useEffect(() => {
    setCanRecord(
      typeof navigator !== "undefined" &&
        !!navigator.mediaDevices?.getUserMedia &&
        typeof MediaRecorder !== "undefined" &&
        !!pickRecorderMimeType()
    );
  }, []);

  // Every phase change goes through here so the parent's "unresolved video"
  // flag can never drift out of sync with what is actually on screen.
  function changePhase(next: Phase) {
    setPhase(next);
    onPendingChange(next !== "idle");
  }

  // Keep a ref alongside the state so cleanup can revoke without re-running.
  function swapLocalUrl(next: string | null) {
    if (localUrlRef.current) URL.revokeObjectURL(localUrlRef.current);
    localUrlRef.current = next;
    setLocalUrl(next);
  }

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
      if (localUrlRef.current) URL.revokeObjectURL(localUrlRef.current);
    };
  }, []);

  function startTimer() {
    clearTimer();
    timerRef.current = setInterval(() => {
      elapsedRef.current += 1;
      setElapsed(elapsedRef.current);
      // Called from the interval, not from inside a state updater, so this
      // stays a plain event-driven update.
      if (elapsedRef.current >= MAX_VIDEO_SECONDS) stopRecording();
    }, 1000);
  }

  async function startRecording() {
    setError(null);
    recordedBlobRef.current = null;
    swapLocalUrl(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });
      streamRef.current = stream;
      const mimeType = pickRecorderMimeType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const type = normalizeContentType(recorder.mimeType || "video/webm");
        const blob = new Blob(chunksRef.current, { type });
        chunksRef.current = [];
        stopTracks();
        recordedBlobRef.current = blob;
        swapLocalUrl(URL.createObjectURL(blob));
        changePhase("review");
      };
      recorderRef.current = recorder;
      recorder.start();

      elapsedRef.current = 0;
      setElapsed(0);
      changePhase("recording");
      startTimer();

      // Attach the stream after the phase flips so the preview element is
      // actually rendered and visible when it starts playing.
      requestAnimationFrame(() => {
        if (liveVideoRef.current && streamRef.current) {
          liveVideoRef.current.srcObject = streamRef.current;
          void liveVideoRef.current.play().catch(() => {});
        }
      });
    } catch (err) {
      console.error("Camera access failed:", err);
      stopTracks();
      changePhase("idle");
      setError(cameraErrorMessage(err));
    }
  }

  function pauseRecording() {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.pause();
      clearTimer();
      changePhase("paused");
    }
  }

  function resumeRecording() {
    if (recorderRef.current?.state === "paused") {
      recorderRef.current.resume();
      changePhase("recording");
      startTimer();
    }
  }

  function stopRecording() {
    clearTimer();
    const recorder = recorderRef.current;
    recorderRef.current = null;
    if (recorder && recorder.state !== "inactive") {
      // onstop moves us into the review phase.
      recorder.stop();
    } else {
      stopTracks();
      changePhase("idle");
    }
  }

  function discardRecording() {
    recordedBlobRef.current = null;
    swapLocalUrl(null);
    elapsedRef.current = 0;
    setElapsed(0);
    changePhase("idle");
    setError(null);
  }

  // Not named use* — the hooks lint rule treats that prefix as a React Hook.
  async function acceptRecording() {
    const blob = recordedBlobRef.current;
    if (!blob) return;
    const ext = normalizeContentType(blob.type).includes("mp4") ? "mp4" : "webm";
    await handleBlob(blob, `recording.${ext}`, { keepLocalUrl: true });
  }

  async function handleBlob(
    blob: Blob,
    originalName: string,
    opts: { keepLocalUrl?: boolean } = {}
  ) {
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
        handleUploadUrl: "/api/van-gift/upload",
        contentType: normalizeContentType(blob.type),
        onUploadProgress: ({ percentage }) => setProgress(percentage),
      });
      if (!opts.keepLocalUrl) {
        swapLocalUrl(URL.createObjectURL(blob));
      }
      recordedBlobRef.current = null;
      changePhase("idle");
      // result.url is a private.blob.vercel-storage.com URL; it is not
      // fetchable without a signed token, which the server mints on submit.
      onChange({ url: result.url, seconds, bytes: blob.size });
    } catch (err) {
      console.error("Video upload failed:", err);
      const detail = err instanceof Error ? err.message : "";
      // Don't say "just submit without it" here: an unsent recording blocks
      // submission by design, so point at the button that actually clears it.
      setError(
        `We couldn't upload that video${detail ? ` (${detail})` : ""}. You can try again, or choose “Discard” to submit your application without a video.`
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

  function removeVideo() {
    swapLocalUrl(null);
    recordedBlobRef.current = null;
    elapsedRef.current = 0;
    setElapsed(0);
    changePhase("idle");
    onChange(null);
    setError(null);
  }

  const uploading = progress !== null;
  const remaining = Math.max(MAX_VIDEO_SECONDS - elapsed, 0);
  const isLive = phase === "recording" || phase === "paused";

  return (
    <div
      id="video-story"
      className="scroll-mt-24 rounded-xl border border-charcoal/20 bg-white px-6 py-5"
    >
      <h4 className="font-serif text-lg text-charcoal">
        Tell us your story on video{" "}
        <span className="font-sans text-sm font-normal text-charcoal/50">(Optional)</span>
      </h4>
      <p className="mt-2 text-sm text-charcoal/70 leading-relaxed">
        This is optional, but we encourage it. A short video helps us understand
        your situation in your own words. Please keep it to{" "}
        <strong className="font-semibold text-charcoal">3 minutes or less</strong>. You
        can upload a video you already have, or record one right here — you can
        pause while recording, and watch it back before you send it.
      </p>

      {/* Uploaded and attached */}
      {value && !uploading && !isLive && phase !== "review" && (
        <div className="mt-4">
          <p className="flex items-center gap-2 text-sm font-medium text-olive-dark">
            <Check aria-hidden="true" className="h-4 w-4 flex-shrink-0" />
            Video attached
            {value.seconds !== null && ` (${formatDuration(value.seconds)})`} ·{" "}
            {formatBytes(value.bytes)}
          </p>
          {localUrl && (
            <video
              src={localUrl}
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

      {/* Live camera: recording or paused */}
      {isLive && (
        <div className="mt-4">
          <video
            ref={liveVideoRef}
            muted
            playsInline
            className="w-full max-w-sm rounded-lg border border-charcoal/10 bg-charcoal"
          />
          <p aria-live="polite" className="mt-2 text-sm font-medium text-charcoal">
            {phase === "paused" ? "Paused" : "Recording"} · {formatDuration(elapsed)} ·{" "}
            {formatDuration(remaining)} remaining
          </p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            {phase === "recording" ? (
              <button type="button" onClick={pauseRecording} className={secondaryButtonClass}>
                <Pause aria-hidden="true" className="h-4 w-4" />
                Pause
              </button>
            ) : (
              <button type="button" onClick={resumeRecording} className={secondaryButtonClass}>
                <Play aria-hidden="true" className="h-4 w-4" />
                Resume
              </button>
            )}
            <button
              type="button"
              onClick={stopRecording}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-charcoal px-6 py-2.5 text-sm font-semibold text-cream hover:bg-charcoal-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive-dark focus-visible:ring-offset-2 transition-colors"
            >
              <Square aria-hidden="true" className="h-4 w-4" />
              Finish recording
            </button>
          </div>
        </div>
      )}

      {/* Review before uploading */}
      {phase === "review" && !uploading && (
        <div className="mt-4">
          <p className="text-sm font-medium text-charcoal">
            Here&apos;s your recording ({formatDuration(elapsed)}). Watch it back,
            then send it or record a new one.
          </p>
          {localUrl && (
            <video
              src={localUrl}
              controls
              playsInline
              className="mt-3 w-full max-w-sm rounded-lg border border-charcoal/10"
            />
          )}
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => void acceptRecording()}
              className={primaryButtonClass}
            >
              <Check aria-hidden="true" className="h-4 w-4" />
              Use this video
            </button>
            <button
              type="button"
              onClick={() => void startRecording()}
              className={secondaryButtonClass}
            >
              <RotateCcw aria-hidden="true" className="h-4 w-4" />
              Record again
            </button>
            <button
              type="button"
              onClick={discardRecording}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-charcoal/70 hover:bg-cream-dark hover:text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive-dark focus-visible:ring-offset-2 transition-colors"
            >
              <Trash2 aria-hidden="true" className="h-4 w-4" />
              Discard
            </button>
          </div>
        </div>
      )}

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

      {/* Starting actions */}
      {!value && phase === "idle" && !uploading && (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            disabled={disabled}
            onClick={() => fileInputRef.current?.click()}
            className={secondaryButtonClass}
          >
            <Upload aria-hidden="true" className="h-4 w-4" />
            Upload a video
          </button>
          {canRecord && (
            <button
              type="button"
              disabled={disabled}
              onClick={() => void startRecording()}
              className={secondaryButtonClass}
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
