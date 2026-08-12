import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import NewsletterSection from "@/components/NewsletterSection";
import VanFollowLinks from "@/components/VanFollowLinks";
import VanHeroShare from "@/components/VanHeroShare";
import VanShareSection from "@/components/VanShareSection";
import VanVideoPreview from "@/components/VanVideoPreview";
import { SOCIAL_PROFILE_URLS } from "@/lib/social";
import { ShieldAlert } from "lucide-react";

/*
 * Applications closed on 12 August 2026. The form and the eligibility rules are
 * gone; the van, the photos and the video stay, because this page is still where
 * every link in the wild points and still the best short answer to "what does
 * Elizabeth's Gift actually do".
 */

// Browser tab and search results. The share card uses shareTitle below, which
// reads as a headline rather than a page name.
const pageTitle = "A Wheelchair Accessible Van — Elizabeth's Gift";
const pageDescription =
  "Applications for the wheelchair accessible van are now closed. Thank you to everyone who applied and shared it.";

const shareTitle = "A Wheelchair Accessible Van for Someone Who Needs It";
const shareDescription =
  "Applications are now closed. Follow along with what Elizabeth's Gift does next.";

// 1200×630 social share card generated from the side-profile photo of the van.
const ogImage = "/images/van/og-van-gift.jpg";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: "/van-gift" },
  openGraph: {
    type: "website",
    url: "/van-gift",
    siteName: "Elizabeth's Gift",
    title: shareTitle,
    description: shareDescription,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "A white 2017 Dodge Grand Caravan with a rear-entry wheelchair ramp, being given away by Elizabeth's Gift",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: shareTitle,
    description: shareDescription,
    images: [ogImage],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "NGO",
      "@id": "https://www.elizabethsgift.com/#org",
      name: "Elizabeth's Gift",
      url: "https://www.elizabethsgift.com",
      logo: "https://www.elizabethsgift.com/icon.png",
      taxID: "41-5162363",
      email: "info@elizabethsgift.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "188 Front St. Ste 116-44",
        addressLocality: "Franklin",
        addressRegion: "TN",
        postalCode: "37064",
        addressCountry: "US",
      },
      sameAs: SOCIAL_PROFILE_URLS,
    },
    {
      "@type": "SpecialAnnouncement",
      name: "Applications for the Wheelchair Accessible Van Are Closed",
      text: "Elizabeth's Gift is no longer accepting applications for the 2017 Dodge Grand Caravan with a rear-entry manual wheelchair ramp. The vehicle is still being gifted at no cost to a selected applicant.",
      datePosted: "2026-08-12",
      url: "https://www.elizabethsgift.com/van-gift",
      announcementLocation: { "@id": "https://www.elizabethsgift.com/#org" },
      spatialCoverage: { "@type": "Country", name: "United States" },
      about: {
        "@type": "Car",
        name: "2017 Dodge Grand Caravan (wheelchair accessible)",
        vehicleModelDate: "2017",
        vehicleSeatingCapacity: 4,
        mileageFromOdometer: {
          "@type": "QuantitativeValue",
          value: 56000,
          unitText: "miles",
        },
      },
    },
  ],
};

const vanSpecs = [
  { label: "Make & Model", value: "Dodge Grand Caravan" },
  { label: "Year", value: "2017" },
  { label: "Mileage", value: "56,000 miles" },
  { label: "Wheelchair Access", value: "Rear-entry ramp, manual operation" },
  { label: "Seating", value: "Seats 4" },
  { label: "Estimated Value", value: "$30,000 – $35,000" },
];

const leadImage = {
  src: "/images/van/van-photo-3.jpg",
  alt: "White 2017 Dodge Grand Caravan parked on a shaded drive with its rear wheelchair ramp deployed",
};

const supportingImages = [
  {
    src: "/images/van/van-photo-1.jpg",
    alt: "Front three-quarter view of the white 2017 Dodge Grand Caravan",
  },
  {
    src: "/images/van/van-photo-2.jpg",
    alt: "View up the rear-entry wheelchair ramp into the van's open interior, showing the wheelchair area and tie-downs",
  },
];

export default function VanGiveawayPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* Applications closed notice */}
      <section className="bg-olive/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          {/* Fixed track for the video card: an `auto` track sized to a
              `w-full` child collapses to zero width. */}
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
            <div className="max-w-3xl">
              {/* The news, in the one line someone reads before deciding
                  whether to read the rest. The heading below is the thank-you,
                  which is the part worth dwelling on but not the part worth
                  discovering three paragraphs down. */}
              <p className="inline-block rounded-full bg-charcoal/10 px-4 py-1.5 text-sm font-semibold uppercase tracking-wide text-charcoal/70">
                Applications are now closed
              </p>
              <h1 className="mt-5 font-serif text-3xl md:text-4xl lg:text-5xl text-charcoal">
                Thank you for your interest in Elizabeth&apos;s Gift.
              </h1>
              <p className="mt-6 text-lg md:text-xl text-charcoal/70 leading-relaxed">
                We are no longer accepting applications for the wheelchair van.
                Our hope is to have more opportunities to provide more vehicles
                to those in need in the future, but at this time our resources
                are limited.
              </p>
              <p className="mt-4 text-lg md:text-xl text-charcoal/70 leading-relaxed">
                We would be honored to have you follow along with everything
                we&apos;re doing by subscribing to our mailing list and
                following us on social media.
              </p>

              {/* Survives from the old hero. Most of this page's traffic still
                  arrives cold from social, and with the application gone this
                  is the only line that says who is behind the van. */}
              <p className="mt-6 text-base text-charcoal/60 leading-relaxed">
                Elizabeth&apos;s Gift is a registered 501(c)(3) nonprofit
                providing mobility equipment to people with disabilities at no
                cost, helping individuals live full lives.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <a
                  href="#newsletter"
                  className="rounded-full bg-olive-dark px-8 py-3.5 text-center font-semibold text-white hover:bg-olive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive-dark focus-visible:ring-offset-2 transition-colors"
                >
                  Join our mailing list
                </a>
                <Link
                  href="/about"
                  className="rounded-full border-2 border-charcoal/20 px-8 py-3.5 text-center font-semibold text-charcoal hover:border-charcoal/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive-dark focus-visible:ring-offset-2 transition-colors"
                >
                  Learn more about us
                </Link>
              </div>

              <VanFollowLinks className="mt-8 max-w-xl border-t border-charcoal/10 pt-6" />
            </div>

            <div>
              <VanVideoPreview />
              <VanHeroShare />
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter, immediately below the ask rather than at the foot of the
          page: signing up is what the notice above actually requests. */}
      <section id="newsletter" className="bg-cream scroll-mt-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20 md:py-24">
          <NewsletterSection source="Accessible Van Page" />
        </div>
      </section>

      {/* About the van: lead photo sits beside the spec sheet */}
      <section className="bg-olive/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-24">
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-10">
            2017 Dodge Grand Caravan
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
            <div className="relative aspect-[3/2] overflow-hidden rounded-2xl shadow-sm">
              <Image
                src={leadImage.src}
                alt={leadImage.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
            <dl className="rounded-2xl bg-white shadow-sm divide-y divide-charcoal/10 overflow-hidden">
              {vanSpecs.map((spec) => (
                <div
                  key={spec.label}
                  className="flex items-center justify-between gap-6 px-6 py-4 sm:px-8"
                >
                  <dt className="text-sm font-medium uppercase tracking-wide text-charcoal/50">
                    {spec.label}
                  </dt>
                  <dd className="font-semibold text-charcoal text-right">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {supportingImages.map((image) => (
              <div
                key={image.src}
                className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-sm"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scam warning. Outlived the form it used to sit inside: people who have
          already applied are still waiting to hear from us, which is exactly the
          gap someone impersonating us would step into. */}
      <section className="bg-cream">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="rounded-xl border border-red-700/25 bg-red-700/5 px-6 py-5">
            <p className="flex items-center gap-2 font-semibold text-charcoal">
              <ShieldAlert aria-hidden="true" className="h-5 w-5 flex-shrink-0 text-red-700" />
              Beware of scams
            </p>
            <p className="mt-2 text-sm text-charcoal/80 leading-relaxed">
              Elizabeth&apos;s Gift will{" "}
              <strong className="font-semibold text-charcoal">
                never ask you for money
              </strong>{" "}
              at any point in this process. There is no fee to be selected and
              no payment of any kind required to receive the vehicle. We will
              never ask for your bank account, card, or payment information.
            </p>
            <p className="mt-2 text-sm text-charcoal/80 leading-relaxed">
              We only contact applicants from an{" "}
              <strong className="font-semibold text-charcoal">
                @elizabethsgift.com
              </strong>{" "}
              address. If someone claiming to be us asks you for payment,
              it isn&apos;t us — please report it to{" "}
              <a
                href="mailto:info@elizabethsgift.com"
                className="font-semibold text-olive-dark underline underline-offset-2 hover:text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive-dark focus-visible:ring-offset-2 rounded"
              >
                info@elizabethsgift.com
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Share */}
      <section className="bg-olive/10">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <VanShareSection />
        </div>
      </section>
    </>
  );
}
