"use client";

import { useState } from "react";

interface NewsletterSectionProps {
  source?: string;
  dark?: boolean;
}

export default function NewsletterSection({ source = "Website", dark = false }: NewsletterSectionProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, source }),
      });
      setSubmitted(true);
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const headingClass = dark ? "text-cream" : "text-charcoal";
  const subClass = dark ? "text-cream/70" : "text-charcoal/70";
  const inputClass = "w-full rounded-lg border border-charcoal/20 bg-white px-4 py-3 text-charcoal placeholder:text-charcoal/40 focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none transition";
  const labelClass = `block text-sm font-medium mb-2 ${dark ? "text-cream/80" : "text-charcoal"}`;
  const consentClass = `text-sm leading-snug ${dark ? "text-cream/60" : "text-charcoal/60"}`;

  if (submitted) {
    return (
      <div className={`text-center py-4 ${headingClass}`}>
        <p className="font-serif text-2xl mb-2">You&apos;re on the list!</p>
        <p className={subClass}>We&apos;ll be in touch with updates from Elizabeth&apos;s Gift.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className={`font-serif text-3xl md:text-4xl mb-3 ${headingClass}`}>
        Stay in the Loop
      </h2>
      <p className={`text-lg mb-8 leading-relaxed ${subClass}`}>
        Sign up to receive updates about Elizabeth&apos;s Gift, the people we serve,
        and upcoming events.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label htmlFor="nl-name" className={labelClass}>Name (optional)</label>
          <input
            type="text"
            id="nl-name"
            name="name"
            placeholder="Your name"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="nl-email" className={labelClass}>Email Address *</label>
          <input
            type="email"
            id="nl-email"
            name="email"
            required
            placeholder="you@example.com"
            className={inputClass}
          />
        </div>
        <div className="flex items-start gap-3 pt-1">
          <input
            type="checkbox"
            id="nl-consent"
            name="consent"
            required
            className="mt-0.5 h-4 w-4 rounded border-charcoal/30 accent-olive cursor-pointer flex-shrink-0"
          />
          <label htmlFor="nl-consent" className={`${consentClass} cursor-pointer`}>
            I agree to receive email updates from Elizabeth&apos;s Gift. You can
            unsubscribe at any time.
          </label>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-olive px-8 py-3 font-semibold text-white hover:bg-olive-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
