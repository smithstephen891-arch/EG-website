import Image from "next/image";
import Link from "next/link";
import { Heart, HandHelping, Users } from "lucide-react";
import NewsletterSection from "@/components/NewsletterSection";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-cream relative overflow-hidden min-h-[90vh] flex items-center -mt-20">
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-28 md:py-36 text-center">
          {/* Sentinel for scroll-based header */}
          <div id="hero-sentinel" className="absolute top-0 left-0" />

          {/* Wheelchair sketch as background watermark — spans from title to buttons */}
          <div className="absolute left-0 right-0 pointer-events-none flex justify-center" style={{ top: '36%', bottom: '24%' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/wheelchair-sketch.svg"
              alt=""
              className="h-full w-auto opacity-[0.20]"
              aria-hidden="true"
            />
          </div>

          {/* Content — above wheelchair */}
          <div className="relative z-10">
            {/* EG Logo */}
            <Image
              src="/images/eg-logo.svg"
              alt="Elizabeth's Gift logo"
              width={120}
              height={120}
              className="w-28 md:w-36 h-auto mx-auto mb-8"
            />

            {/* Name — most prominent */}
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-charcoal leading-none tracking-tight">
              Elizabeth&apos;s Gift
            </h1>

            {/* Tagline */}
            <p className="mt-4 md:mt-6 font-serif text-xl md:text-2xl text-charcoal/50 italic">
              Lifting Up and Living Fully
            </p>

            {/* Divider */}
            <div className="mt-8 mx-auto w-16 h-px bg-olive/40" />

            {/* Description */}
            <p className="mt-8 text-lg md:text-xl text-charcoal/70 leading-relaxed max-w-2xl mx-auto">
              We provide medical and adaptive equipment to people with disabilities
              at no cost, helping individuals gain independence, improve their
              health, and live fuller lives.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/apply"
                className="rounded-full bg-olive px-8 py-3.5 text-center font-semibold text-white hover:bg-olive-light transition-colors"
              >
                Apply for Assistance
              </Link>
              <Link
                href="/donate"
                className="rounded-full border-2 border-charcoal/20 px-8 py-3.5 text-center font-semibold text-charcoal hover:border-charcoal/40 transition-colors"
              >
                Donate
              </Link>
              <Link
                href="/about"
                className="rounded-full border-2 border-charcoal/20 px-8 py-3.5 text-center font-semibold text-charcoal hover:border-charcoal/40 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Story Teaser */}
      <section className="bg-olive/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal">
              Her Life Was a Gift to All of Us
            </h2>
            <p className="mt-6 text-lg text-charcoal/70 leading-relaxed">
              Elizabeth lived with Cerebral Palsy — she could not walk or talk —
              but she lived with a joy and vibrancy that touched everyone around
              her. With her infectious laugh and gentle spirit, she reminded us,
              every single day, of what it means to live fully.
            </p>
            <Link
              href="/about"
              className="mt-8 inline-block rounded-full bg-charcoal px-8 py-3 font-semibold text-cream hover:bg-charcoal-light transition-colors"
            >
              Read Our Full Story
            </Link>
          </div>
        </div>
      </section>

      {/* Get Involved */}
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-24">
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal text-center mb-16">
            Get Involved
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-olive/10 rounded-full flex items-center justify-center mb-6">
                <Heart className="text-olive" size={28} />
              </div>
              <h3 className="font-serif text-2xl text-charcoal mb-3">
                Donate
              </h3>
              <p className="text-charcoal/70 leading-relaxed mb-6">
                Your gift provides life-changing mobility and medical equipment
                to individuals who need it most. Every dollar makes a difference.
              </p>
              <Link
                href="/donate"
                className="inline-block rounded-full bg-olive px-6 py-2.5 text-sm font-semibold text-white hover:bg-olive-light transition-colors"
              >
                Make a Donation
              </Link>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-olive/10 rounded-full flex items-center justify-center mb-6">
                <HandHelping className="text-olive" size={28} />
              </div>
              <h3 className="font-serif text-2xl text-charcoal mb-3">
                Apply for Assistance
              </h3>
              <p className="text-charcoal/70 leading-relaxed mb-6">
                Are you or someone you know in need of mobility or medical
                equipment that isn&apos;t covered by insurance? We&apos;re here to help.
              </p>
              <Link
                href="/apply"
                className="inline-block rounded-full bg-olive px-6 py-2.5 text-sm font-semibold text-white hover:bg-olive-light transition-colors"
              >
                Apply Now
              </Link>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-olive/10 rounded-full flex items-center justify-center mb-6">
                <Users className="text-olive" size={28} />
              </div>
              <h3 className="font-serif text-2xl text-charcoal mb-3">
                Volunteer
              </h3>
              <p className="text-charcoal/70 leading-relaxed mb-6">
                Want to support our mission in other ways? We&apos;d love to connect
                and find a way for you to make a difference.
              </p>
              <Link
                href="/contact"
                className="inline-block rounded-full bg-olive px-6 py-2.5 text-sm font-semibold text-white hover:bg-olive-light transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="bg-charcoal text-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-24">
          <p className="text-olive-muted font-semibold text-sm uppercase tracking-wide mb-10">
            Upcoming Events
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Benefit Dinner */}
            <div className="bg-charcoal-light rounded-2xl p-8 flex flex-col">
              <p className="text-olive font-semibold text-sm uppercase tracking-wide mb-3">
                April 25, 2026
              </p>
              <h2 className="font-serif text-2xl text-cream mb-4">
                Elizabeth&apos;s Gift Benefit Dinner
              </h2>
              <p className="text-cream/70 leading-relaxed mb-6 flex-1">
                Join us for an evening of dinner, drinks, and a silent auction
                in celebration of our mission. You&apos;ll get to hear more about
                Elizabeth&apos;s Gift and the people we serve. Open to everyone —
                we&apos;d love to have you at the table.
              </p>
              <div className="text-cream/60 text-sm mb-6 space-y-1">
                <p>📍 Nashville, Tennessee</p>
              </div>
              <a
                href="https://towniesgolf.com/pages/benefit-dinner"
                target="_blank"
                rel="noopener noreferrer"
                className="self-start rounded-full bg-olive px-6 py-2.5 text-sm font-semibold text-white hover:bg-olive-light transition-colors"
              >
                Get Tickets
              </a>
            </div>

            {/* Townies Open */}
            <div className="bg-charcoal-light rounded-2xl p-8 flex flex-col">
              <p className="text-olive font-semibold text-sm uppercase tracking-wide mb-3">
                April 25–26, 2026
              </p>
              <h2 className="font-serif text-2xl text-cream mb-4">
                Townies Open
              </h2>
              <p className="text-cream/70 leading-relaxed mb-6 flex-1">
                Elizabeth&apos;s Gift is the benefiting nonprofit of the Townies
                Open — a two-day, two-person scramble golf tournament open to
                players of all ages and skill levels at Ted Rhodes Golf Course
                in Nashville.
              </p>
              <div className="text-cream/60 text-sm mb-6 space-y-1">
                <p>📍 Ted Rhodes Golf Course, Nashville, Tennessee</p>
                <p>⛳ 36-Hole, 2-Person Scramble</p>
              </div>
              <a
                href="https://towniesgolf.com"
                target="_blank"
                rel="noopener noreferrer"
                className="self-start rounded-full bg-gold px-6 py-2.5 text-sm font-semibold text-charcoal hover:bg-gold/80 transition-colors"
              >
                Register to Play
              </a>
            </div>

          </div>
          <div className="mt-10">
            <Link
              href="/events"
              className="inline-block rounded-full border border-cream/30 px-8 py-3 text-sm font-semibold text-cream/70 hover:text-cream hover:border-cream/60 transition-colors"
            >
              View All Events
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-charcoal">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <NewsletterSection source="Home Page" dark />
        </div>
      </section>

      {/* Memorial */}
      <section className="bg-olive/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <p className="text-center text-charcoal/60 font-serif text-xl italic">
            "And the King will answer them, 'Truly, I say to you, as you did it to one of the least of these my brothers, you did it to me.'"
          </p>
          <p className="text-center text-charcoal/40 font-serif text-base mt-3">
            Matthew 25:40
          </p>
        </div>
      </section>
    </>
  );
}
