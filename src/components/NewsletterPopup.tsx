"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const STORAGE_KEY = "eg_newsletter";
const DISMISS_DAYS = 14;
const SHOW_DELAY_MS = 4000;

export default function NewsletterPopup() {
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const { status, timestamp } = JSON.parse(stored);
        if (status === "subscribed") return;
        if (status === "dismissed") {
          const daysSince = (Date.now() - timestamp) / (1000 * 60 * 60 * 24);
          if (daysSince < DISMISS_DAYS) return;
        }
      }
    } catch {
      // ignore localStorage errors
    }
    const timer = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ status: "dismissed", timestamp: Date.now() }));
    } catch { /* ignore */ }
    setVisible(false);
  }

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
        body: JSON.stringify({ email, name, source: "Popup" }),
      });
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ status: "subscribed", timestamp: Date.now() }));
      } catch { /* ignore */ }
      setSubmitted(true);
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm"
        onClick={dismiss}
      />

      {/* Modal */}
      <div className="relative bg-cream rounded-2xl shadow-2xl max-w-md w-full p-8 z-10">
        <button
          onClick={dismiss}
          aria-label="Close"
          className="absolute top-4 right-4 text-charcoal/40 hover:text-charcoal transition-colors"
        >
          <X size={20} />
        </button>

        {submitted ? (
          <div className="text-center py-6">
            <p className="font-serif text-3xl text-charcoal mb-3">You&apos;re on the list!</p>
            <p className="text-charcoal/70 leading-relaxed">
              Thank you for signing up. We&apos;ll keep you updated on
              Elizabeth&apos;s Gift and the work we&apos;re doing together.
            </p>
            <button
              onClick={() => setVisible(false)}
              className="mt-6 rounded-full bg-olive px-8 py-3 font-semibold text-white hover:bg-olive-light transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h2 className="font-serif text-2xl text-charcoal mb-2">Stay Connected</h2>
            <p className="text-charcoal/70 text-sm leading-relaxed mb-6">
              Sign up to receive updates about Elizabeth&apos;s Gift, the people we
              serve, and upcoming events.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="popup-name" className="block text-sm font-medium text-charcoal mb-1.5">
                  Name (optional)
                </label>
                <input
                  type="text"
                  id="popup-name"
                  name="name"
                  placeholder="Your name"
                  className="w-full rounded-lg border border-charcoal/20 bg-white px-4 py-2.5 text-charcoal placeholder:text-charcoal/40 focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none transition text-sm"
                />
              </div>
              <div>
                <label htmlFor="popup-email" className="block text-sm font-medium text-charcoal mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="popup-email"
                  name="email"
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-charcoal/20 bg-white px-4 py-2.5 text-charcoal placeholder:text-charcoal/40 focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none transition text-sm"
                />
              </div>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="popup-consent"
                  name="consent"
                  required
                  className="mt-0.5 h-4 w-4 rounded border-charcoal/30 accent-olive cursor-pointer flex-shrink-0"
                />
                <label htmlFor="popup-consent" className="text-xs text-charcoal/60 leading-snug cursor-pointer">
                  I agree to receive email updates from Elizabeth&apos;s Gift. You
                  can unsubscribe at any time.
                </label>
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-full bg-olive py-3 font-semibold text-white hover:bg-olive-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {loading ? "Signing up..." : "Sign Me Up"}
                </button>
                <button
                  type="button"
                  onClick={dismiss}
                  className="flex-1 rounded-full border border-charcoal/20 py-3 font-semibold text-charcoal/60 hover:text-charcoal transition-colors text-sm"
                >
                  No Thanks
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
