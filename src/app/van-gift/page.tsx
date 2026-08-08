import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import NewsletterSection from "@/components/NewsletterSection";
import VanApplicationForm from "@/components/VanApplicationForm";
import VanShareSection from "@/components/VanShareSection";
import { Check, ShieldAlert } from "lucide-react";

// Browser tab and search results. The share card uses shareTitle below, which
// reads as a headline rather than a page name.
const pageTitle = "Apply for a Wheelchair Accessible Van — Elizabeth's Gift";
const pageDescription =
  "We're looking for a family or individual whose life could be changed by this van.";

const shareTitle = "Apply for a Wheelchair Accessible Van";
const shareDescription =
  "We're looking for a family or individual whose life could be changed by this van.";

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
      sameAs: [
        "https://facebook.com/elizabethsgift",
        "https://instagram.com/elizabethsgift",
      ],
    },
    {
      "@type": "SpecialAnnouncement",
      name: "A Wheelchair Accessible Van for Someone Who Needs It",
      text: "Elizabeth's Gift is gifting a 2017 Dodge Grand Caravan with a rear-entry manual wheelchair ramp, at no cost and as-is, to someone in need of accessible transportation.",
      datePosted: "2026-08-07",
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
              This Van Could Change Someone&apos;s Life
            </h1>
            <p className="mt-6 text-lg md:text-xl text-charcoal/70 leading-relaxed">
              We&apos;re giving this wheelchair accessible van to someone who
              needs it, at no cost. If that&apos;s you or someone you care for,
              we&apos;d be honored to hear your story.
            </p>
            <p className="mt-4 text-base md:text-lg text-charcoal/70 leading-relaxed">
              Elizabeth&apos;s Gift is a registered 501(c)(3) nonprofit
              providing mobility equipment to people with disabilities at no
              cost, helping individuals live full lives.{" "}
              <Link
                href="/about"
                className="font-semibold text-olive-dark underline underline-offset-4 hover:text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive-dark focus-visible:ring-offset-2 rounded transition-colors"
              >
                Learn more about us
              </Link>
              .
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

      {/* About the van: lead photo sits beside the spec sheet */}
      <section className="bg-cream">
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
          <p className="text-charcoal/70 leading-relaxed mb-8">
            Tell us about yourself and why you need this vehicle. We review
            every application.
          </p>

          <div className="mb-10 rounded-xl border border-red-700/25 bg-red-700/5 px-6 py-5">
            <p className="flex items-center gap-2 font-semibold text-charcoal">
              <ShieldAlert aria-hidden="true" className="h-5 w-5 flex-shrink-0 text-red-700" />
              Beware of scams
            </p>
            <p className="mt-2 text-sm text-charcoal/80 leading-relaxed">
              Elizabeth&apos;s Gift will{" "}
              <strong className="font-semibold text-charcoal">
                never ask you for money
              </strong>{" "}
              at any point in this process. There is no fee to apply, no fee to
              be selected, and no payment of any kind required to receive the
              vehicle. We will never ask for your bank account, card, or
              payment information.
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
          {/* Video uploads light up once a Vercel Blob store is linked. */}
          <VanApplicationForm
            videoUploadEnabled={Boolean(process.env.BLOB_READ_WRITE_TOKEN)}
          />
        </div>
      </section>

      {/* Share */}
      <section className="bg-olive/10">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <VanShareSection />
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 border-t border-charcoal/10">
          <NewsletterSection source="Accessible Van Page" />
        </div>
      </section>
    </>
  );
}
