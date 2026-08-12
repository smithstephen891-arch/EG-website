"use client";

import { NEWSLETTER_OPEN_EVENT } from "./NewsletterPopup";

/*
 * Opens the newsletter modal that is already mounted in the layout, rather than
 * scrolling to a signup form further down the page.
 *
 * Styling is left to the caller: this button stands in for whatever CTA the page
 * would otherwise have used, so it should not carry an opinion about how that
 * CTA looks.
 */
export default function NewsletterButton({
  source,
  className = "",
  children,
}: {
  /** What a signup from this button is attributed to. */
  source?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() =>
        window.dispatchEvent(
          new CustomEvent(NEWSLETTER_OPEN_EVENT, { detail: { source } })
        )
      }
      className={className}
    >
      {children}
    </button>
  );
}
