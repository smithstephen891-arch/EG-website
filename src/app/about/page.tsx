import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — Elizabeth's Gift",
  description:
    "Learn about Elizabeth's Gift, our mission, and the story that inspired us to provide mobility and medical equipment to those in need.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-olive/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-charcoal">
              About Elizabeth&apos;s Gift
            </h1>
            <p className="mt-6 text-lg text-charcoal/70 leading-relaxed">
              Some people change the world simply by being in it. Elizabeth was
              one of those people.
            </p>
          </div>
        </div>
      </section>

      {/* Family Photo */}
      <section className="bg-cream">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-20">
          <div className="overflow-hidden rounded-2xl">
            <Image
              src="/images/family-elizabeth.jpg"
              alt="The family with Elizabeth"
              width={2048}
              height={1182}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      </section>

      {/* Elizabeth's Story */}
      <section className="bg-cream">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-8">
            Elizabeth&apos;s Story
          </h2>
          <div className="prose prose-lg text-charcoal/80 leading-relaxed space-y-6">
            <p>
              Born with Cerebral Palsy, Elizabeth could not walk or talk, but
              those who knew her will tell you she spoke volumes. For 45 years,
              she lived with a vibrancy and joy that filled every room she
              entered, and she left a lasting mark on the hearts of everyone
              fortunate enough to be in her life. She was deeply loved, and she
              is deeply missed.
            </p>
            <p>
              Elizabeth&apos;s Gift was founded in her memory, by her family, who
              know firsthand what it means to navigate life with a disability —
              and how profoundly the right equipment can change everything. A
              well-fitted wheelchair. An adaptive device. The tools that make
              daily life not just manageable, but meaningful. These things matter
              enormously. And far too often, they go uncovered by insurance,
              leaving families and individuals to accept the bare minimum.
            </p>
            <p>That&apos;s why Elizabeth&apos;s Gift was created.</p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-charcoal text-cream">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="font-serif text-3xl md:text-4xl text-cream mb-8">
            Our Mission
          </h2>
          <div className="space-y-6 text-cream/80 text-lg leading-relaxed">
            <p>
              We are a nonprofit organization dedicated to providing mobility
              and medical equipment to those in need. We believe that access to
              the tools that support a full and dignified life should never be
              determined by income. We believe every person, regardless of
              ability or financial means, deserves to be lifted up and to live
              fully.
            </p>
            <p>
              Elizabeth showed us what it looks like to live joyfully in the face
              of challenge. Our mission is to help others do the same.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-olive/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="font-serif text-3xl text-charcoal mb-4">
            Ready to Apply?
          </h2>
          <p className="text-charcoal/70 text-lg mb-8 max-w-xl mx-auto">
            If you or someone you know is in need of mobility or medical
            equipment, we invite you to fill out an application. We are honored
            to help.
          </p>
          <Link
            href="/apply"
            className="inline-block rounded-full bg-olive px-8 py-3.5 font-semibold text-white hover:bg-olive-light transition-colors"
          >
            Apply for Assistance
          </Link>
        </div>
      </section>
    </>
  );
}
