"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { INSTAGRAM_REEL_URL } from "@/lib/van-share";

/*
 * A cross-fading preview card that links out to the Instagram reel.
 *
 * All three are real frames of the reel, pulled from the source video at 6s,
 * 16s and 34s. They are the three exterior shots: the rest of the clip is one
 * static talking-head take whose burned-in captions land mid-sentence, which
 * reads as broken text on a still. Frames are 320x568 because that is the
 * resolution of the source video, so they are soft on a 2x display; a
 * higher-resolution export dropped in at the same names is the only fix.
 */
const FRAMES = [
  {
    src: "/images/van/reel-frame-1.jpg",
    alt: "The van with its rear hatch open and the wheelchair ramp lowered to the ground",
  },
  {
    src: "/images/van/reel-frame-2.jpg",
    alt: "Front three-quarter view of the white 2017 Dodge Grand Caravan",
  },
  {
    src: "/images/van/reel-frame-3.jpg",
    alt: "The van seen from behind on a tree-lined drive with its ramp extended",
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
      href={INSTAGRAM_REEL_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Watch our video about the van on Instagram"
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
          Instagram
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
