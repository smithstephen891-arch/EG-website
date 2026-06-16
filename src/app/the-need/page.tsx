import type { Metadata } from "next";
import Link from "next/link";
import NewsletterSection from "@/components/NewsletterSection";

export const metadata: Metadata = {
  title: "The Need — Elizabeth's Gift",
  description:
    "The right equipment isn't a luxury — it's the bridge between isolation and a full life. Why insurance leaves a gap, and how Elizabeth's Gift closes it.",
  openGraph: {
    title: "The Need — Elizabeth's Gift",
    description:
      "The right equipment isn't a luxury — it's the bridge between isolation and a full life. Why insurance leaves a gap, and how Elizabeth's Gift closes it.",
    images: [{ url: "/icon.png", width: 512, height: 512, alt: "Elizabeth's Gift" }],
  },
};

const stats = [
  {
    figure: "5×",
    body: (
      <>
        Adults with disabilities are <strong className="font-semibold text-cream">nearly 5 times more likely to experience frequent mental distress</strong> than adults without disabilities.
      </>
    ),
  },
  {
    figure: "3×",
    body: (
      <>
        They are <strong className="font-semibold text-cream">three times more likely</strong> to have heart disease, stroke, diabetes, or cancer.
      </>
    ),
  },
  {
    figure: "Nearly 1/2",
    body: (
      <>
        Get <strong className="font-semibold text-cream">no aerobic physical activity at all</strong>, driving 50% higher rates of chronic disease.
      </>
    ),
  },
];

const costs = [
  {
    item: "Pediatric Positioning System",
    price: "from ~$400",
    headline: "The support to sit on the floor, eat at the table, and learn alongside peers.",
    body: (
      <>
        Equipment like Tumble Forms floor sitters gives children with complex needs a way to participate in play, therapy, and family life. Routinely denied as a &ldquo;duplicate&rdquo; of a covered wheelchair, even though a wheelchair cannot do this.
      </>
    ),
    source: "Source: Performance Health / Rehabmart (2024). Complete systems vary by size and configuration.",
  },
  {
    item: "Adaptive Bike or Tricycle",
    price: "$1,500 – $7,400",
    headline: "The chance to ride alongside siblings, classmates, and friends.",
    body: (
      <>
        Customized for the rider&apos;s diagnosis, size, and support needs. Consistently classified as recreational or exercise equipment by insurers and denied even when prescribed by a physical therapist for documented therapeutic benefit.
      </>
    ),
    source: "Sources: Adaptive Mall; Rifton (2024 verified pricing).",
  },
  {
    item: "Beach or All-Terrain Wheelchair",
    price: "$2,300 – $6,400+",
    headline: "The means to reach the beach, the trail, the park, alongside everyone else.",
    body: (
      <>
        A standard covered wheelchair cannot navigate sand, grass, or gravel. Medicare is explicit: it <strong className="font-semibold text-charcoal">will not cover a wheelchair needed only outside the home</strong>, leaving families to pay in full for the chairs that actually go where life happens.
      </>
    ),
    source: "Sources: Sand Rider (~$2,300); Lasher Sport all-terrain (~$6,400); wheelchairsinmotion.com.",
  },
  {
    item: "Wheelchair Accessible Van",
    price: "$25,000 – $100,000+",
    headline: "The ability to leave the house together, as a family.",
    body: (
      <>
        For families whose child or loved one uses a wheelchair, a converted van isn&apos;t optional. It&apos;s the only way to travel together. Medicare, Medicaid, and private insurance <strong className="font-semibold text-charcoal">do not cover wheelchair-accessible vehicles</strong> of any kind, new or used.
      </>
    ),
    source: "Sources: Rollx Vans Cost Guide 2026; Southern Bus & Mobility (2026); MobilityWorks dealer listings.",
  },
];

export default function TheNeedPage() {
  return (
    <>
      {/* Hero — The Equipment Gap */}
      <section className="bg-olive/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <p className="text-olive font-semibold text-sm uppercase tracking-wide mb-4">
              Why We&apos;re Here
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-charcoal">
              The Equipment Gap
            </h1>
            <p className="mt-6 font-serif text-xl md:text-2xl text-charcoal/60 italic leading-relaxed">
              For people with disabilities, the right equipment isn&apos;t a
              luxury. It&apos;s what lets someone be there — at the park, at the
              pool, around the table, in community.
            </p>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="bg-cream">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="w-16 h-px bg-olive/40 mb-10" />
          <div className="space-y-6 text-charcoal/80 text-lg leading-relaxed">
            <p>
              Elizabeth lived 45 years with cerebral palsy. She could not walk or
              talk, but she lived with a vibrancy and joy that filled every room,
              due in large part to the equipment and support she had access to.
            </p>
            <p>
              Participation is not a small thing. Being in community with others,
              moving our bodies, getting outside, showing up for the people we
              love. These are the things that make a life feel like a life. When
              someone is locked out of them, the cost isn&apos;t just
              inconvenience. It&apos;s loneliness, declining health, and a slow
              erosion of what it means to belong. The equipment we fund is how we
              help open that door.
            </p>
          </div>
        </div>
      </section>

      {/* The Cost of Being Left Out */}
      <section className="bg-charcoal text-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-24">
          <p className="text-olive-muted font-semibold text-sm uppercase tracking-wide mb-10">
            The Cost of Being Left Out
          </p>

          {/* Feature stat: 2 in 3 */}
          <div className="bg-charcoal-light rounded-2xl p-8 md:p-10 mb-6 border-l-4 border-olive">
            <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
              <p className="font-serif text-6xl md:text-7xl text-cream leading-none whitespace-nowrap">
                2 in 3
              </p>
              <div>
                <p className="text-cream/80 text-lg leading-relaxed">
                  Working-age adults with disabilities{" "}
                  <strong className="font-semibold text-cream">
                    often experience severe loneliness
                  </strong>
                  , regardless of the type of disability. Roughly 40% say they
                  often feel cut off from social contact.
                </p>
                <p className="text-cream/40 text-xs uppercase tracking-wide mt-3">
                  Brown University School of Public Health, Annals of Internal Medicine (2025)
                </p>
              </div>
            </div>
          </div>

          {/* Three stat cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat) => (
              <div key={stat.figure} className="bg-charcoal-light rounded-2xl p-8">
                <p className="font-serif text-5xl text-cream leading-none mb-4">
                  {stat.figure}
                </p>
                <p className="text-cream/70 leading-relaxed">{stat.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Tools That Change This */}
      <section className="bg-olive/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <p className="text-olive font-semibold text-sm uppercase tracking-wide mb-8">
            The Tools That Change This
          </p>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <h2 className="md:col-span-5 font-serif text-3xl md:text-4xl text-charcoal leading-tight">
              Movement. Community. Connection.
            </h2>
            <p className="md:col-span-7 text-charcoal/70 text-lg leading-relaxed">
              Adaptive equipment including bikes, wheelchairs, swings, and
              positioning systems is what makes these possible for people who
              can&apos;t access them otherwise. It&apos;s not a luxury. It&apos;s
              the bridge between isolation and a full life.
            </p>
          </div>
        </div>
      </section>

      {/* Why Insurance Isn't Enough */}
      <section className="bg-cream">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pb-4">
          <p className="text-olive font-semibold text-sm uppercase tracking-wide mb-4">
            Why Insurance Isn&apos;t Enough
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-charcoal leading-tight mb-8">
            The items that unlock participation are rarely covered.
          </h2>
          <div className="space-y-6 text-charcoal/80 text-lg leading-relaxed">
            <p>
              Adaptive equipment is expensive, and families need a lot of it over
              a lifetime. A single piece can cost thousands, and most people who
              need it will need multiple items, replaced as they grow and as
              their needs change. For even a well-insured, upper-middle-class
              family, the math doesn&apos;t work.
            </p>
            <p>
              And here&apos;s why: insurance pays only for the bare essentials.
              U.S. coverage rules are built around one standard:{" "}
              <em className="text-charcoal">medical necessity in the home</em>.
              Medicare states it{" "}
              <strong className="font-semibold text-charcoal">
                will not cover a wheelchair needed only outside the home
              </strong>
              . That single rule means nearly everything that makes community
              life possible — including adaptive recreation, outdoor access, and
              participation — gets classified as a luxury and denied. This is the
              gap we close.
            </p>
          </div>
        </div>
      </section>

      {/* Representative Current Costs */}
      <section className="bg-cream">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-olive font-semibold text-sm uppercase tracking-wide mb-8">
            Representative Current Costs
          </p>
          <div className="space-y-6">
            {costs.map((cost) => (
              <div
                key={cost.item}
                className="grid grid-cols-1 sm:grid-cols-12 overflow-hidden rounded-2xl border border-charcoal/10"
              >
                {/* Price block */}
                <div className="sm:col-span-4 bg-olive text-white p-8 flex flex-col justify-center">
                  <p className="font-serif text-3xl md:text-4xl leading-none">
                    {cost.price}
                  </p>
                  <p className="text-white/70 text-xs uppercase tracking-wide mt-3">
                    {cost.item}
                  </p>
                </div>
                {/* Description */}
                <div className="sm:col-span-8 bg-white p-8">
                  <h3 className="font-serif text-xl text-charcoal mb-3">
                    {cost.headline}
                  </h3>
                  <p className="text-charcoal/70 leading-relaxed mb-4">
                    {cost.body}
                  </p>
                  <p className="text-charcoal/40 text-xs leading-relaxed">
                    {cost.source}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* This Is the Gap We Close — Donate CTA */}
      <section className="bg-charcoal text-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-24">
          <p className="text-olive-muted font-semibold text-sm uppercase tracking-wide mb-6">
            This Is the Gap We Close
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-cream leading-tight mb-6">
            One person.
            <br />
            One piece of equipment at a time.
          </h2>
          <p className="text-cream/70 text-lg leading-relaxed max-w-2xl mb-10">
            Every dollar you give goes directly toward matching people in need
            with the equipment that changes their life. No gift is too small.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/donate"
              className="rounded-full bg-olive px-10 py-3.5 text-center font-semibold text-white hover:bg-olive-light transition-colors"
            >
              Donate Now
            </Link>
            <Link
              href="/apply"
              className="rounded-full border border-cream/30 px-10 py-3.5 text-center font-semibold text-cream/80 hover:text-cream hover:border-cream/60 transition-colors"
            >
              Apply for Assistance
            </Link>
          </div>
        </div>
      </section>

      {/* Sources */}
      <section className="bg-cream">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 border-t border-charcoal/10">
          <h2 className="text-charcoal/60 font-semibold text-sm uppercase tracking-wide mb-4">
            Sources
          </h2>
          <p className="text-charcoal/40 text-xs leading-relaxed">
            Clark MA, Salinger M, et al. &ldquo;Loneliness Among Working-Age
            Adults With Disabilities in the United States.&rdquo; Annals of
            Internal Medicine, 2025 (via Brown University School of Public
            Health). Centers for Disease Control and Prevention, Disability and
            Health: &ldquo;Adults with disabilities are three times more likely
            to have heart disease, stroke, diabetes, or cancer&rdquo; (cdc.gov).
            CDC, Vital Signs: &ldquo;Disability and Physical Activity — United
            States, 2009–2012&rdquo; (MMWR). CDC, &ldquo;Frequent Mental Distress
            Among Adults, by Disability Status&rdquo; (MMWR, 2020). Centers for
            Medicare &amp; Medicaid Services, Medicare Durable Medical Equipment
            Coverage and Power Mobility Device policy (cms.gov). Performance
            Health / Rehabmart, Tumble Forms 2 Deluxe Floor Sitter, from ~$400
            (2024). Adaptive Mall; Rifton adaptive tricycle range $1,500–$7,400
            (2024). Sand Rider Beach Wheelchair (~$2,300); Lasher Sport
            all-terrain (~$6,400) via wheelchairsinmotion.com (2024). Wheelchair
            accessible van pricing: Rollx Vans Cost Guide 2026 (used from
            $25,000, new $45,000–$85,000); Southern Bus &amp; Mobility, &ldquo;How
            Much Are Wheelchair-Accessible Vans?&rdquo; (January 2026, new up to
            $100,000+). Pricing and coverage vary by state, plan,
            medical-necessity review, and configuration.
          </p>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 border-t border-charcoal/10">
          <NewsletterSection source="The Need Page" />
        </div>
      </section>

      {/* Scripture */}
      <section className="bg-olive/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <p className="text-center text-charcoal/60 font-serif text-xl italic">
            &ldquo;Truly, I say to you, as you did it to one of the least of these
            my brothers, you did it to me.&rdquo;
          </p>
          <p className="text-center text-charcoal/40 font-serif text-base mt-3">
            Matthew 25:40
          </p>
        </div>
      </section>
    </>
  );
}
