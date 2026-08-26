import type { Metadata } from "next";
import NewsletterSection from "@/components/NewsletterSection";

export const metadata: Metadata = {
  title: "Stay Connected — Elizabeth's Gift",
  description: "Sign up to receive updates from Elizabeth's Gift about the people we serve, upcoming events, and ways to get involved.",
};

export default function NewsletterPage() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <NewsletterSection source="Newsletter Page" />
      </div>
    </section>
  );
}
