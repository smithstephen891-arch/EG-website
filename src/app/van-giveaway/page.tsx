import type { Metadata } from "next";
import Image from "next/image";
import NewsletterSection from "@/components/NewsletterSection";
import VanApplicationForm from "@/components/VanApplicationForm";
import { Check } from "lucide-react";

const pageTitle = "Free Wheelchair Accessible Van Giveaway — Elizabeth's Gift";
const pageDescription =
  "Elizabeth's Gift is giving away a free wheelchair accessible van, a 2017 Dodge Grand Caravan with a rear-entry ramp, to someone who needs accessible transportation. Apply today.";

// 1200×630 social share card generated from the side-profile photo of the van.
const ogImage = "/images/van/og-van-giveaway.jpg";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: "/van-giveaway" },
  openGraph: {
    type: "website",
    url: "/van-giveaway",
    siteName: "Elizabeth's Gift",
    title: pageTitle,
    description: pageDescription,
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
    title: pageTitle,
    description: pageDescription,
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
      sameAs: [
        "https://facebook.com/elizabethsgift",
        "https://instagram.com/elizabethsgift",
      ],
    },
    {
      "@type": "SpecialAnnouncement",
      name: "Free Wheelchair Accessible Van Giveaway",
      text: "Elizabeth's Gift is gifting a 2017 Dodge Grand Caravan with a rear-entry manual wheelchair ramp, free and as-is, to someone in need of accessible transportation.",
      datePosted: "2026-08-07",
      url: "https://www.elizabethsgift.com/van-giveaway",
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
];

const galleryImages = [
  {
    src: "/images/van/van-photo-3.jpg",
    alt: "White 2017 Dodge Grand Caravan parked on a shaded drive with its rear wheelchair ramp deployed",
    wide: true,
  },
  {
    src: "/images/van/van-photo-1.jpg",
    alt: "Front three-quarter view of the white 2017 Dodge Grand Caravan",
    wide: false,
  },
  {
    src: "/images/van/van-photo-2.jpg",
    alt: "View up the rear-entry wheelchair ramp into the van's open interior, showing the wheelchair area and tie-downs",
    wide: false,
  },
];

const eligibilityRequirements = [
  "You must be a resident of the United States.",
  "You must be at least 18 years old to apply.",
  "You must have held a valid U.S. driver's license for at least one year prior to submitting this application.",
  "You do not currently own a handicap accessible van.",
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

      {/* Hero */}
      <section className="bg-olive/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-charcoal">
              We&apos;re Giving Away a Wheelchair Accessible Van
            </h1>
            <p className="mt-6 text-lg md:text-xl text-charcoal/70 leading-relaxed">
              Elizabeth&apos;s Gift is gifting this van, completely free, to
              someone who needs accessible transportation. If that&apos;s you
              or someone you care for, we encourage you to apply below.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <a
                href="#apply"
                className="rounded-full bg-olive-dark px-8 py-3.5 text-center font-semibold text-white hover:bg-olive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive-dark focus-visible:ring-offset-2 transition-colors"
              >
                Apply Now
              </a>
              <a
                href="#eligibility"
                className="rounded-full border-2 border-charcoal/20 px-8 py-3.5 text-center font-semibold text-charcoal hover:border-charcoal/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive-dark focus-visible:ring-offset-2 transition-colors"
              >
                Who Can Apply
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About the van */}
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-24">
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-10">
            2017 Dodge Grand Caravan
          </h2>
          <dl className="max-w-2xl rounded-2xl bg-white shadow-sm divide-y divide-charcoal/10 overflow-hidden">
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
      </section>

      {/* Photo gallery */}
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20 md:pb-24">
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-10">
            Photo Gallery
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {galleryImages.map((image) => (
              <div
                key={image.src}
                className={
                  image.wide
                    ? "relative aspect-[3/2] overflow-hidden rounded-2xl shadow-sm sm:col-span-2"
                    : "relative aspect-[3/4] overflow-hidden rounded-2xl shadow-sm"
                }
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes={image.wide ? "100vw" : "(max-width: 640px) 100vw, 50vw"}
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section id="eligibility" className="bg-charcoal text-cream scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-24">
          <h2 className="font-serif text-3xl md:text-4xl text-cream mb-10">
            Who Can Apply
          </h2>
          <ul className="space-y-4 max-w-3xl">
            {eligibilityRequirements.map((requirement) => (
              <li key={requirement} className="flex items-start gap-3">
                <Check aria-hidden="true" className="mt-1 h-5 w-5 flex-shrink-0 text-olive-muted" />
                <span className="text-cream/80 text-lg leading-relaxed">{requirement}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 max-w-3xl rounded-2xl bg-charcoal-light p-6 border-l-4 border-olive">
            <p className="text-cream/80 leading-relaxed">
              Completing this application is{" "}
              <strong className="font-semibold text-cream">not a guarantee</strong>{" "}
              of receiving the vehicle. We review every application and will
              contact selected applicants directly.
            </p>
          </div>
          <a
            href="#apply"
            className="mt-10 inline-block rounded-full bg-gold px-8 py-3.5 font-semibold text-charcoal hover:bg-gold/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal transition-colors"
          >
            Apply Now
          </a>
        </div>
      </section>

      {/* Application form */}
      <section id="apply" className="bg-cream scroll-mt-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20 md:py-24">
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-4">
            Apply for the Van
          </h2>
          <p className="text-charcoal/70 leading-relaxed mb-10">
            Tell us about yourself and why you need this vehicle. We review
            every application.
          </p>
          <VanApplicationForm />
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 border-t border-charcoal/10">
          <NewsletterSection source="Van Giveaway Page" />
        </div>
      </section>
    </>
  );
}
