import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Donate — Elizabeth's Gift",
  description:
    "Support Elizabeth's Gift and help provide life-changing mobility and medical equipment to people with disabilities at no cost.",
};

export default function DonatePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-olive/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-charcoal">
              Support Elizabeth&apos;s Gift
            </h1>
            <p className="mt-6 text-lg text-charcoal/70 leading-relaxed">
              Your gift helps provide life-changing mobility and medical
              equipment to people with disabilities — at no cost to them. Every
              dollar brings someone closer to greater independence and a fuller
              life.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="https://givebutter.com/elizabeths-gift"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-olive px-10 py-3.5 font-semibold text-white hover:bg-olive-light transition-colors"
              >
                Donate Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why Your Support Matters */}
      <section className="bg-charcoal text-cream">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="font-serif text-3xl md:text-4xl text-cream mb-8">
            Why Your Support Matters
          </h2>
          <div className="text-cream/80 text-lg leading-relaxed space-y-6">
            <p>
              Elizabeth lived fully and joyfully despite the many challenges her
              disabilities presented, in part because she had access to the
              equipment and support she needed. We started Elizabeth&apos;s Gift
              because we know not everyone is so fortunate.
            </p>
            <p>
              Too many people are waiting for a properly fitting wheelchair,
              shower chairs, track systems, adaptive vehicles, and many, many
              more items that are needed to make life a little easier. With your
              support, you help us close that gap: one person, one piece of
              equipment at a time.
            </p>
            <p className="font-serif text-xl italic text-gold">
              No gift is too small. Every dollar brings us closer to a world
              where all people are lifted up and living fully, regardless of
              income or abilities.
            </p>
          </div>
          <div className="mt-10">
            <a
              href="https://givebutter.com/elizabeths-gift"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-cream text-charcoal px-10 py-3.5 font-semibold hover:bg-cream/90 transition-colors inline-block"
            >
              Donate Now
            </a>
          </div>
        </div>
      </section>

      {/* Mail a Check */}
      <section className="bg-olive/10">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-14 text-center">
          <h2 className="font-serif text-2xl text-charcoal mb-3">
            Prefer to Mail a Check?
          </h2>
          <p className="text-charcoal/70 text-lg mb-5">
            You are also welcome to make a donation by sending a check to:
          </p>
          <address className="not-italic text-charcoal font-medium text-lg leading-relaxed">
            Elizabeth&apos;s Gift<br />
            188 Front St. Ste 116-44<br />
            Franklin, TN 37064
          </address>
        </div>
      </section>
    </>
  );
}
