import type { Metadata } from "next";
import { Instagram } from "lucide-react";

export const metadata: Metadata = {
  title: "Events — Elizabeth's Gift",
  description:
    "Annual events benefiting Elizabeth's Gift, including our Benefit Dinner and the Townies Open golf tournament.",
  openGraph: {
    title: "Events — Elizabeth's Gift",
    description:
      "Annual events benefiting Elizabeth's Gift, including our Benefit Dinner and the Townies Open golf tournament.",
    images: [{ url: "/icon.png", width: 512, height: 512, alt: "Elizabeth's Gift" }],
  },
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
              Annual Event · Next: April 2027
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-6">
              Elizabeth&apos;s Gift Benefit Dinner
            </h2>
            <p className="text-charcoal/70 text-lg leading-relaxed mb-6">
              Each year, we host an evening to celebrate the mission of
              Elizabeth&apos;s Gift, and we&apos;d love to have you join us! Come
              enjoy all you can eat dinner and drinks, and get ready to bid on
              some exciting silent auction items. Most importantly, you will get
              to hear more about Elizabeth&apos;s Gift, the people we serve, and
              the work we are doing together.
            </p>
            <p className="text-charcoal/70 text-lg leading-relaxed mb-6">
              This event is open to anyone who wants to join us. Whether you have
              been a part of this journey or are just hearing about us for the first
              time, we would love to have you at the table.
            </p>
            <p className="text-charcoal/70 text-lg leading-relaxed mb-8">
              Children are welcome. Ages 0–5 eat free and we have reduced tickets
              available for 5–12 year olds.
            </p>
            <div className="space-y-3 mb-10 text-charcoal/80">
              <p className="text-lg">
                <span className="text-olive font-semibold">When:</span> Annually, every April · Next: April 2027
              </p>
              <p className="text-lg">
                <span className="text-olive font-semibold">Includes:</span> Dinner, drinks, silent auction &amp; more
              </p>
            </div>
            <p className="text-charcoal/60 text-base leading-relaxed">
              Tickets for our 2027 dinner will be available closer to the event.
              {" "}
              <a href="/newsletter" className="text-olive font-semibold hover:underline">
                Sign up for our newsletter
              </a>
              {" "}
              to be the first to know when registration opens.
            </p>
          </div>
        </div>
      </section>

      {/* ── EVENT 2: Townies Open ── */}
      <section className="bg-charcoal text-cream">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20">
          <p className="text-gold font-semibold text-sm uppercase tracking-wide mb-3">
            Annual Event · Next: April 2027
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-cream mb-8">
            Townies Open
          </h2>

          <p className="text-cream/80 text-lg leading-relaxed mb-10">
            The Townies Open is an annual two-day, two-person scramble golf
            tournament held each April at Ted Rhodes Golf Course in Nashville.
            Elizabeth&apos;s Gift is the benefiting nonprofit, and proceeds from
            the tournament directly fund the equipment we provide to those we
            serve.
          </p>

          <div className="space-y-3 text-cream/80 mb-10">
            <p className="text-lg">
              <span className="text-gold font-semibold">When:</span> Annually, every April · Next: April 2027
            </p>
            <p className="text-lg">
              <span className="text-gold font-semibold">Location:</span> Ted Rhodes Golf Course, Nashville, TN
            </p>
            <p className="text-lg">
              <span className="text-gold font-semibold">Format:</span> 36-Hole, 2-Person Scramble
            </p>
          </div>

          <div className="mb-10">
            <p className="font-semibold text-cream mb-3">Registration Typically Includes:</p>
            <ul className="list-disc list-inside space-y-1 text-cream/70 text-lg">
              <li>Two rounds of golf</li>
              <li>Official Unofficial Townies Merch</li>
              <li>Free admission to Saturday night benefit dinner</li>
              <li>Opportunity to hoist the coveted Golden Mailbox</li>
              <li>Other prizes and more surprises</li>
            </ul>
          </div>

          <p className="text-cream/60 text-base leading-relaxed mb-8">
            Registration for the 2027 tournament will open closer to the event.
            {" "}
            <a href="/newsletter" className="text-gold font-semibold hover:underline">
              Sign up for our newsletter
            </a>
            {" "}
            to be the first to know.
          </p>

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
