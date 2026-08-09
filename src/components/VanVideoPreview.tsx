"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { TIKTOK_VIDEO_URL } from "@/lib/van-share";

/*
 * A cross-fading preview card that links out to the TikTok post.
 *
 * Only the first frame is an actual frame of the video: it is the cover image
 * TikTok publishes for the post. The rest are the van photos, because TikTok
 * exposes no other frames. If real stills are ever exported from the video,
 * drop them in here and the animation improves with no other changes.
 */
const FRAMES = [
  {
    src: "/images/van/tiktok-cover.jpg",
    alt: "Elizabeth's Gift founder speaking to camera inside the van about giving it away",
  },
  {
    src: "/images/van/van-photo-2.jpg",
    alt: "The van's rear-entry wheelchair ramp lowered to the ground",
  },
  {
    src: "/images/van/van-photo-1.jpg",
    alt: "Front three-quarter view of the white 2017 Dodge Grand Caravan",
  },
];

const FRAME_MS = 2600;

export default function VanVideoPreview() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Honour reduced motion by simply never advancing: the cover frame stays,
    // which matters for an audience that includes people with vestibular and
    // attention-related conditions.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % FRAMES.length),
      FRAME_MS
    );
    return () => window.clearInterval(id);
  }, []);

  return (
    <a
      href={TIKTOK_VIDEO_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Watch our video about the van on TikTok"
      className="group relative mx-auto block w-full max-w-[280px] overflow-hidden rounded-3xl bg-charcoal shadow-xl ring-1 ring-charcoal/10 transition-transform duration-300 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive-dark focus-visible:ring-offset-4 sm:max-w-[320px]"
    >
      <div className="relative aspect-[9/16]">
        {/* The fade lives on a wrapper rather than the Image: next/image sets
            its own inline styles, and all three frames load eagerly because a
            lazy frame never fetches while transparent, leaving nothing to
            cross-fade to. */}
        {FRAMES.map((frame, i) => (
          <div
            key={frame.src}
            aria-hidden={i === 0 ? undefined : true}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={frame.src}
              alt={i === 0 ? frame.alt : ""}
              fill
              sizes="(max-width: 1024px) 280px, 320px"
              priority
              className="object-cover"
            />
          </div>
        ))}

        {/* Keeps the label and play button legible over any frame */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-charcoal/30" />

        <span className="absolute left-4 top-4 rounded-full bg-charcoal/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cream backdrop-blur-sm">
          TikTok
        </span>

        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-cream/95 shadow-lg transition-transform duration-300 group-hover:scale-110 group-focus-visible:scale-110">
            <Play aria-hidden="true" className="ml-1 h-7 w-7 text-charcoal" fill="currentColor" />
          </span>
        </span>

        <span className="absolute bottom-4 left-4 right-4 text-center text-sm font-semibold text-cream drop-shadow">
          Watch our video
        </span>
      </div>

      {/* Progress pips double as a hint that this is a short clip */}
      <span className="absolute bottom-1.5 left-1/2 flex -translate-x-1/2 gap-1.5">
        {FRAMES.map((frame, i) => (
          <span
            key={frame.src}
            className={`h-1 rounded-full transition-all duration-500 ${
              i === index ? "w-5 bg-cream" : "w-1.5 bg-cream/40"
            }`}
          />
        ))}
      </span>
    </a>
  );
}
