import type { Metadata } from "next";
import Image from "next/image";
import { Instagram } from "lucide-react";

export const metadata: Metadata = {
  title: "Events — Elizabeth's Gift",
  description:
    "Upcoming events benefiting Elizabeth's Gift, including the April 25 Benefit Dinner and the Townies Open golf tournament.",
};

export default function EventsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-charcoal text-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <p className="text-olive-muted font-semibold text-sm uppercase tracking-wide mb-4">
            Events
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-cream">
            Upcoming Events
          </h1>
        </div>
      </section>

      {/* ── EVENT 1: Benefit Dinner ── */}
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <p className="text-olive font-semibold text-sm uppercase tracking-wide mb-3">
              April 25, 2026
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-6">
              Elizabeth&apos;s Gift Benefit Dinner
            </h2>
            <p className="text-charcoal/70 text-lg leading-relaxed mb-6">
              We are hosting an evening to celebrate the mission of
              Elizabeth&apos;s Gift — and everyone is invited. Come enjoy a
              wonderful dinner and drinks, take part in a silent auction, and
              experience some other fun surprises. Most importantly, you will
              get to hear more about Elizabeth&apos;s Gift, the people we serve,
              and the work we are doing together.
            </p>
            <p className="text-charcoal/70 text-lg leading-relaxed mb-8">
              This event is open to anyone who wants to join us. Whether you
              are a longtime supporter or are just hearing about us for the
              first time, we would love to have you at the table.
            </p>
            <div className="space-y-3 mb-10 text-charcoal/80">
              <p className="text-lg">
                <span className="text-olive font-semibold">Date:</span> Saturday, April 25, 2026
              </p>
              <p className="text-lg">
                <span className="text-olive font-semibold">Includes:</span> Dinner, drinks, silent auction &amp; more
              </p>
            </div>
            <a
              href="https://towniesgolf.com/pages/benefit-dinner"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full bg-olive px-8 py-3.5 font-semibold text-white hover:bg-olive-light transition-colors"
            >
              Get Your Tickets
            </a>
          </div>
        </div>
      </section>

      {/* ── EVENT 2: Townies Open ── */}
      <section className="bg-charcoal text-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <p className="text-gold font-semibold text-sm uppercase tracking-wide mb-3">
            April 25–26, 2026
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-cream mb-12">
            Townies Open
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            {/* Left: Details */}
            <div className="space-y-10">
              <div className="space-y-3 text-cream/80">
                <p className="text-lg">
                  <span className="text-gold font-semibold">Date:</span> April 25–26, 2026
                </p>
                <p className="text-lg">
                  <span className="text-gold font-semibold">Location:</span> Ted Rhodes Golf Course, Nashville, TN
                </p>
                <p className="text-lg">
                  <span className="text-gold font-semibold">Format:</span> 36-Hole, 2-Person Scramble
                </p>
              </div>

              <div>
                <p className="font-semibold text-cream mb-3">Registration Includes:</p>
                <ul className="list-disc list-inside space-y-1 text-cream/70 text-lg">
                  <li>Two rounds of golf</li>
                  <li>Official Unofficial Townies Merch</li>
                  <li>Free admission to Saturday night benefit dinner</li>
                  <li>Opportunity to hoist the coveted Golden Mailbox</li>
                  <li>Other prizes and more surprises</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://towniesgolf.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-full bg-olive px-8 py-3.5 font-semibold text-white hover:bg-olive-light transition-colors text-center"
                >
                  Register to Play
                </a>
                <a
                  href="https://towniesgolf.com/pages/additional-sponsorships"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-full border-2 border-cream/20 px-8 py-3.5 font-semibold text-cream hover:border-cream/40 transition-colors text-center"
                >
                  View Sponsorships
                </a>
              </div>

              <a
                href="https://instagram.com/towniesgolf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-cream/50 hover:text-cream transition-colors w-fit"
              >
                <Instagram size={18} />
                <span className="text-sm font-medium">@towniesgolf</span>
              </a>
            </div>

            {/* Right: Image */}
            <div className="flex justify-center">
              <Image
                src="/images/townies/2026-registration.png"
                alt="Townies Open - 2026 Registration"
                width={400}
                height={500}
                className="rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About the Townies */}
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h2 className="font-serif text-3xl text-charcoal mb-6">
                Who Are the Townies?
              </h2>
              <p className="text-charcoal/70 text-lg leading-relaxed">
                The Townies were born out of a love for golf and a love for
                Nashville. Their mission is simple: bring people together — from
                all across the country — to enjoy a beautiful game in a beautiful
                city, with friends new and old. The Townies believe in golf for
                the betterment of the individual, and golf for the flourishing of
                the community.
              </p>
            </div>
            <div>
              <h2 className="font-serif text-3xl text-charcoal mb-6">
                What Is the Townies Open?
              </h2>
              <p className="text-charcoal/70 text-lg leading-relaxed">
                The Townies Open is a two-day, two-person scramble tournament
                open to golfers of all ages and skill levels. Whether you&apos;re a
                seasoned player or just picking up the game, you&apos;re welcome at
                the tee. The winner is awarded the coveted Golden Mailbox.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership */}
      <section className="bg-olive/10">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="font-serif text-3xl text-charcoal mb-6">
            Partnering with Elizabeth&apos;s Gift
          </h2>
          <p className="text-charcoal/70 text-lg leading-relaxed">
            A core Townies tenet is playing a role in making Nashville the best
            it can be — for all people. That&apos;s why they&apos;ve partnered with
            Elizabeth&apos;s Gift, supporting our mission to provide free assistive
            and medical equipment to individuals with disabilities who need it
            most.
          </p>
        </div>
      </section>

    </>
  );
}
