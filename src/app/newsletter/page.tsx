import type { Metadata } from "next";
import NewsletterSection from "@/components/NewsletterSection";

export const metadata: Metadata = {
  title: "Stay Connected — Elizabeth's Gift",
  description: "Sign up to receive updates from Elizabeth's Gift about the people we serve, upcoming events, and ways to get involved.",
};

export default function NewsletterPage() {
  return (
    <>
      <section className="bg-olive/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-charcoal">
              Stay Connected
            </h1>
            <p className="mt-6 text-lg text-charcoal/70 leading-relaxed">
              Sign up to receive updates from Elizabeth&apos;s Gift — stories about
              the people we serve, news about upcoming events, and ways you can
              get involved in our mission to lift up and empower people with
              disabilities.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
          <NewsletterSection source="Newsletter Page" />
        </div>
      </section>
    </>
  );
}
